import { App, Stack } from 'aws-cdk-lib'
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb'

import {
    TABLES
} from './shared/constants'

import {
    Props
} from './shared/props'
export class DynamoDbStack extends Stack {
    constructor(scope: App, id: string, props: Props) {
    super(scope, id, props);
    const { stage } = props

    TABLES.forEach((tableDef) => {
      const table = new TableV2(this, `${tableDef.tableName}-${stage}`, {
          ...tableDef,
          deletionProtection: true,
          contributorInsights: true,
          pointInTimeRecovery: true,
        });
    })

  }
}