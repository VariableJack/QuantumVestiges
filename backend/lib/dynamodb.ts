import { App, Stack, StackProps } from 'aws-cdk-lib'
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb'

import { TABLES } from './shared/constants'

interface DynamoDbProps extends StackProps {
    stage: string
    env: {
        account: string
        region: string
    }
}
export class DynamoDbStack extends Stack {
    constructor(scope: App, id: string, props: DynamoDbProps) {
        super(scope, id, props)
        const { stage } = props
        const tables: TableV2[] = []
        TABLES.forEach(tableDef => {
            const table = new TableV2(this, `${tableDef.tableName}-${stage}`, {
                ...tableDef,
                tableName: `${tableDef.tableName}-${stage}`,
                deletionProtection: true,
                contributorInsights: true,
                pointInTimeRecovery: true,
            })
            tables.push(table)
        })
    }
}
