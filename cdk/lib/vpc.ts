import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Vpc, IpAddresses, SubnetType } from 'aws-cdk-lib/aws-ec2'

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
            maxAzs: 1,
            subnetConfiguration: [
                {
                    name: 'GamerParadiseVPCPublicSubnet',
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    name: 'GamerParadiseVPCPrivateSubnet',
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                },
                {
                    name: 'GamerParadiseVPCIsolatedSubnet',
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
            ],
            natGateways: 1,
        })
    }
}
