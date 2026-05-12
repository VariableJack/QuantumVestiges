import { App, Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Role } from 'aws-cdk-lib/aws-iam'
import { Connections, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2'
import {
    Cluster,
    ContainerImage,
    CpuArchitecture,
    FargateTaskDefinition,
    FargateService,
    OperatingSystemFamily,
    Protocol,
} from 'aws-cdk-lib/aws-ecs'

import { join } from 'path'

interface EcsProps extends StackProps {
    stage: string
    ecsExecutionRole: Role
    vpc: Vpc
}
export class EcsStack extends Stack {
    public readonly ecsConnections: Connections
    constructor(scope: App, id: string, props: EcsProps) {
        super(scope, id, props)
        const { stage, ecsExecutionRole, vpc } = props
        const cluster = new Cluster(this, `GamerParadiseECS-${stage}`, {
            vpc,
        })
        const taskDefinition = new FargateTaskDefinition(
            this,
            `GamerParadiseECS-${stage}-TaskDefinition`,
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
        const taskContainer = taskDefinition.addContainer(`GamerParadiseECS-${stage}`, {
            image: ContainerImage.fromAsset(join(__dirname, '../../backend')),
        })
        taskContainer.addPortMappings({
            containerPort: 80,
            protocol: Protocol.TCP,
        })
        taskContainer.addPortMappings({
            containerPort: 443,
            protocol: Protocol.TCP,
        })
        const service = new FargateService(this, 'FargateService', {
            cluster,
            taskDefinition,
            vpcSubnets: {
                // subnetType: SubnetType.PRIVATE_WITH_EGRESS,
				subnetType: SubnetType.PUBLIC,
            },
            healthCheckGracePeriod: Duration.seconds(120),
			minHealthyPercent: 100,
        })
        this.ecsConnections = service.connections
    }
}
