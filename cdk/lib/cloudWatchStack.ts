import { App, Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Alarm, Metric, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch'
import { LogGroup } from 'aws-cdk-lib/aws-logs'
import { LAMBDA_FUNCTIONS, TABLES } from './shared/constants'

interface CloudWatchProps extends StackProps {
    stage: string
}
export class CloudWatchStack extends Stack {
    constructor(scope: App, id: string, props: CloudWatchProps) {
        super(scope, id, props)
        const { stage } = props

        const failureAlarms: Alarm[] = []
        const latencyAlarms: Alarm[] = []
        // Lambda alarms
        LAMBDA_FUNCTIONS.forEach(lambda => {
            const { name } = lambda
            const logGroup = new LogGroup(this, `${name}-${stage}`, {
                logGroupName: `/aws/lambda/${name}-${stage}`,
            })
            /*
            const latencyMetric = new Metric({
                namespace: 'AWS/Lambda',
                metricName: 'Duration',
                statistic: 'Average',
                period: Duration.minutes(5),
                dimensionsMap: { functionName: `${name}-${stage}` },
            })
            latencyAlarms.push(
                new Alarm(this, `Lambda-${name}-${stage}-LatencyAlarm`, {
                    metric: latencyMetric,
                    threshold: 5000,
                    evaluationPeriods: 2,
                    datapointsToAlarm: 2,
                    alarmName: `Lambda-${name}-${stage}-LatencyAlarm`,
                    treatMissingData: TreatMissingData.NOT_BREACHING,
                }),
            )

            const failureMetric = new Metric({
                namespace: 'AWS/Lambda',
                metricName: 'Errors',
                statistic: 'Sum',
                period: Duration.minutes(1),
                dimensionsMap: { functionName: `${name}-${stage}` },
            })
            failureAlarms.push(
                new Alarm(this, `Lambda-${name}-${stage}-FailureAlarm`, {
                    metric: failureMetric,
                    threshold: 0,
                    evaluationPeriods: 1,
                    datapointsToAlarm: 1,
                    alarmName: `Lambda-${name}-${stage}-FailureAlarm`,
                    treatMissingData: TreatMissingData.NOT_BREACHING,
                }),
            )
            /* */
        })
        // DynamoDB alarms
        /*
        TABLES.forEach(table => {
            const { tableName } = table
            const scanLatencyMetric = new Metric({
                namespace: 'AWS/DynamoDB',
                metricName: 'SuccessfulRequestLatency',
                statistic: 'Average',
                period: Duration.minutes(5),
                dimensionsMap: { TableName: `${tableName}-${stage}`, Operation: 'Scan' },
            })
            latencyAlarms.push(
                new Alarm(this, `DynamoDB-${tableName}-${stage}-LatencyAlarm`, {
                    metric: scanLatencyMetric,
                    threshold: 50,
                    evaluationPeriods: 2,
                    datapointsToAlarm: 2,
                    alarmName: `DynamoDB-${tableName}-${stage}-LatencyAlarm`,
                    treatMissingData: TreatMissingData.NOT_BREACHING,
                }),
            )

            const putLatencyMetric = new Metric({
                namespace: 'AWS/DynamoDB',
                metricName: 'SuccessfulRequestLatency',
                statistic: 'Average',
                period: Duration.minutes(5),
                dimensionsMap: { TableName: `${tableName}-${stage}`, Operation: 'PutItem' },
            })
            latencyAlarms.push(
                new Alarm(this, `DynamoDB-${tableName}-${stage}-FailureAlarm`, {
                    metric: putLatencyMetric,
                    threshold: 50,
                    evaluationPeriods: 2,
                    datapointsToAlarm: 2,
                    alarmName: `DynamoDB-${tableName}-${stage}-FailureAlarm`,
                    treatMissingData: TreatMissingData.NOT_BREACHING,
                }),
            )
        })
        /* */
    }
}
