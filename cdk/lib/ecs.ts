import { App, Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Role } from 'aws-cdk-lib/aws-iam'
import { Connections, SubnetType, Vpc, Port } from 'aws-cdk-lib/aws-ec2'
import {
    Cluster,
    ContainerImage,
    CpuArchitecture,
    FargateTaskDefinition,
    FargateService,
    OperatingSystemFamily,
    Protocol,
} from 'aws-cdk-lib/aws-ecs'
import { NamespaceType } from 'aws-cdk-lib/aws-servicediscovery'
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns'

import { LogDrivers } from 'aws-cdk-lib/aws-ecs'
import { LogGroup } from 'aws-cdk-lib/aws-logs'

import { join } from 'path'

interface EcsProps extends StackProps {
    stage: string
    backendLogGroup: LogGroup
    frontendLogGroup: LogGroup
    ecsExecutionRole: Role
    vpc: Vpc
}
export class EcsStack extends Stack {
    public readonly ecsConnections: Connections
    constructor(scope: App, id: string, props: EcsProps) {
        super(scope, id, props)
        const { stage, backendLogGroup, frontendLogGroup, ecsExecutionRole, vpc } = props
        // Common infra
        const namespaceName = `GamerParadise-${stage}`
        const cluster = new Cluster(this, `GamerParadiseECS-${stage}`, {
            vpc,
            defaultCloudMapNamespace: {
                name: namespaceName,
                type: NamespaceType.HTTP,
            },
        })
        // Backend task
        const backendTaskDefinition = new FargateTaskDefinition(
            this,
            `GamerParadiseECS-backend-${stage}-TaskDefinition`,
            {
                runtimePlatform: {
                    operatingSystemFamily: OperatingSystemFamily.LINUX,
                    cpuArchitecture: CpuArchitecture.X86_64,
                },
                cpu: 256,
                memoryLimitMiB: 512,
                executionRole: ecsExecutionRole,
            },
        )
        const backendTaskContainer = backendTaskDefinition.addContainer(
            `GamerParadiseECS-${stage}`,
            {
                image: ContainerImage.fromAsset(join(__dirname, '../../backend'), {
                    buildArgs: { stage },
                }),
                containerName: `GamerParadiseContainer-backend-${stage}`,
                logging: LogDrivers.awsLogs({
                    logGroup: backendLogGroup,
                    streamPrefix: 'GamerParadise-Backend',
                }),
            },
        )
        backendTaskContainer.addPortMappings({
            name: `gamer-paradise-backend-${stage}`,
            containerPort: 80,
            protocol: Protocol.TCP,
        })
        const backendService = new FargateService(
            this,
            `GamerParadise-backend-${stage}-FargateService`,
            {
                cluster,
                taskDefinition: backendTaskDefinition,
                vpcSubnets: {
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                },
                healthCheckGracePeriod: Duration.seconds(120),
                minHealthyPercent: 100,
                serviceConnectConfiguration: {
                    namespace: cluster.defaultCloudMapNamespace?.namespaceArn,
                    services: [
                        {
                            portMappingName: `gamer-paradise-backend-${stage}`,
                            discoveryName: `gamer-paradise-backend-${stage}`,
                            port: 80,
                        },
                    ],
                },
            },
        )
        this.ecsConnections = backendService.connections
        // Frontend task
        const frontendService = new ApplicationLoadBalancedFargateService(
            this,
            `GamerParadise-frontend-${stage}-FargateService`,
            {
                cluster,
                cpu: 512,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: ContainerImage.fromAsset(join(__dirname, '../../frontend'), {
                        buildArgs: { stage },
                    }),
                    containerPort: 80,
                    logDriver: LogDrivers.awsLogs({
                        logGroup: frontendLogGroup,
                        streamPrefix: 'GamerParadise-Frontend',
                    }),
                },
                taskSubnets: {
                    subnetType: SubnetType.PUBLIC,
                },
                healthCheckGracePeriod: Duration.seconds(120),
                minHealthyPercent: 100,
                desiredCount: 1,
                // domainName: `${stage}.gamerparadise.com`,
                publicLoadBalancer: true,
                assignPublicIp: true,
            },
        )
        frontendService.targetGroup.configureHealthCheck({
            port: '80',
            path: '/',
        })
        frontendService.service.enableServiceConnect({
            namespace: cluster.defaultCloudMapNamespace?.namespaceArn,
        })

        backendService.connections.allowFrom(
            frontendService.service,
            Port.tcp(80),
            'Allow frontend traffic',
        )
    }
}
