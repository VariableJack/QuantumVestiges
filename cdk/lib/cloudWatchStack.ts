import { App, Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Alarm, Metric, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch'
import { LogGroup } from 'aws-cdk-lib/aws-logs'

interface CloudWatchProps extends StackProps {
    stage: string
}
export class CloudWatchStack extends Stack {
    constructor(scope: App, id: string, props: CloudWatchProps) {
        super(scope, id, props)
        const { stage } = props

        const failureAlarms: Alarm[] = []
        const latencyAlarms: Alarm[] = []
    }
}
