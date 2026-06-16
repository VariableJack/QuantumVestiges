import { App, Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Role } from 'aws-cdk-lib/aws-iam'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import { Connections, SubnetType, Vpc, Port } from 'aws-cdk-lib/aws-ec2'
import {
    Cluster,
    ContainerImage,
    CpuArchitecture,
    FargateTaskDefinition,
    FargateService,
    OperatingSystemFamily,
    Protocol,
    LogDrivers,
} from 'aws-cdk-lib/aws-ecs'
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns'
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { LogGroup } from 'aws-cdk-lib/aws-logs'
import { NamespaceType } from 'aws-cdk-lib/aws-servicediscovery'

import { ARecord, HostedZone, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets'
import { DOMAIN_NAME, SERVICE_PREFIX, SUBDOMAINS_BY_STAGE } from './shared/constants'

import { join } from 'path'

interface EcsProps extends StackProps {
    stage: string
    backendLogGroup: LogGroup
    frontendLogGroup: LogGroup
    ecsExecutionRole: Role
    hostedZone: IHostedZone
    certificate: Certificate
    vpc: Vpc
}
export class EcsStack extends Stack {
    public readonly ecsConnections: Connections
    constructor(scope: App, id: string, props: EcsProps) {
        super(scope, id, props)
        const {
            stage,
            backendLogGroup,
            frontendLogGroup,
            ecsExecutionRole,
            hostedZone,
            certificate,
            vpc,
        } = props
        // Common infra
        const namespaceName = `${SERVICE_PREFIX}-${stage}`
        const cluster = new Cluster(this, `${SERVICE_PREFIX}ECS-${stage}`, {
            vpc,
            defaultCloudMapNamespace: {
                name: namespaceName,
                type: NamespaceType.HTTP,
            },
        })
        // Backend task
        const backendTaskDefinition = new FargateTaskDefinition(
            this,
            `${SERVICE_PREFIX}ECS-backend-${stage}-TaskDefinition`,
            {
                runtimePlatform: {
                    operatingSystemFamily: OperatingSystemFamily.LINUX,
                    cpuArchitecture: CpuArchitecture.X86_64,
                },
                cpu: 256,
                memoryLimitMiB: 512,
                executionRole: ecsExecutionRole,
                taskRole: ecsExecutionRole,
            },
        )
        const backendTaskContainer = backendTaskDefinition.addContainer(
            `${SERVICE_PREFIX}ECS-${stage}`,
            {
                image: ContainerImage.fromAsset(join(__dirname, '../../backend'), {
                    buildArgs: { stage },
                }),
                containerName: `${SERVICE_PREFIX}Container-backend-${stage}`,
                logging: LogDrivers.awsLogs({
                    logGroup: backendLogGroup,
                    streamPrefix: `${SERVICE_PREFIX}-Backend`,
                }),
            },
        )
        backendTaskContainer.addPortMappings({
            name: `${SERVICE_PREFIX.toLowerCase()}-backend-${stage}`,
            containerPort: 80,
            protocol: Protocol.TCP,
        })
        const backendService = new FargateService(
            this,
            `${SERVICE_PREFIX}-backend-${stage}-FargateService`,
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
                            portMappingName: `${SERVICE_PREFIX.toLowerCase()}-backend-${stage}`,
                            discoveryName: `${SERVICE_PREFIX.toLowerCase()}-backend-${stage}`,
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
            `${SERVICE_PREFIX}-frontend-${stage}-FargateService`,
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
                        streamPrefix: `${SERVICE_PREFIX}-Frontend`,
                    }),
                    executionRole: ecsExecutionRole,
                },
                taskSubnets: {
                    subnetType: SubnetType.PUBLIC,
                },
                healthCheckGracePeriod: Duration.seconds(120),
                minHealthyPercent: 100,
                desiredCount: 1,
                assignPublicIp: true,
                certificate,
                redirectHTTP: true,
                publicLoadBalancer: true,
            },
        )
        frontendService.targetGroup.configureHealthCheck({
            port: '80',
            path: '/',
        })
        frontendService.service.enableServiceConnect({
            namespace: cluster.defaultCloudMapNamespace?.namespaceArn,
        })
        // Connection set up
        backendService.connections.allowFrom(
            frontendService.service,
            Port.tcp(80),
            'Allow frontend traffic',
        )
        const subdomains: string[] = SUBDOMAINS_BY_STAGE[stage]
        subdomains.forEach(subdomain => {
            const fqdn = `${subdomain}${DOMAIN_NAME}`
            new ARecord(this, fqdn, {
                zone: hostedZone,
                recordName: fqdn,
                target: RecordTarget.fromAlias(
                    new LoadBalancerTarget(frontendService.loadBalancer),
                ),
            })
        })
    }
}
