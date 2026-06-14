import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Vpc, IpAddresses, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { SERVICE_PREFIX } from './shared/constants'

interface VpcProps extends StackProps {
    stage: string
}
export class VpcStack extends Stack {
    public readonly vpc: Vpc
    constructor(scope: App, id: string, props: VpcProps) {
        super(scope, id, props)
        const { stage } = props
        this.vpc = new Vpc(this, `vpc-${stage}`, {
            ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: `${SERVICE_PREFIX}VPCPublicSubnet`,
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    name: `${SERVICE_PREFIX}VPCPrivateSubnet`,
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                },
                {
                    name: `${SERVICE_PREFIX}VPCIsolatedSubnet`,
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
            ],
            natGateways: 1,
        })
    }
}
