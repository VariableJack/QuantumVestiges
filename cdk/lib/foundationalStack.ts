import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'

import { SERVICE_PREFIX } from './shared/constants'

interface FoundationalProps extends StackProps {
    stage: string
}
export class FoundationalStack extends Stack {
    public readonly backendLogGroup: LogGroup
    public readonly frontendLogGroup: LogGroup
    constructor(scope: App, id: string, props: FoundationalProps) {
        super(scope, id, props)
        const { stage } = props
        this.backendLogGroup = new LogGroup(this, `BackendLogGroup-${stage}`, {
            logGroupName: `/ecs/${SERVICE_PREFIX}-backend-${stage}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.THREE_MONTHS,
        })
        this.frontendLogGroup = new LogGroup(this, `FrontendLogGroup-${stage}`, {
            logGroupName: `/ecs/${SERVICE_PREFIX}-frontend-${stage}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.THREE_MONTHS,
        })
    }
}
