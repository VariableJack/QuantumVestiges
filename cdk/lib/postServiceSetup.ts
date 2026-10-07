import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Connections } from 'aws-cdk-lib/aws-ec2'

interface PostServiceSetupProps extends StackProps {
    stage: string
    rdsConnections: Connections
    ecsConnections: Connections
}
export class PostServiceSetupStack extends Stack {
    constructor(scope: App, id: string, props: PostServiceSetupProps) {
        const { rdsConnections, ecsConnections } = props
        super(scope, id, props)
        rdsConnections.allowDefaultPortFrom(ecsConnections)
    }
}
