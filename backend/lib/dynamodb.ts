import { Stack } from 'aws-cdk-lib'
import { dynamodb } from 'aws-cdk-lib/aws_dynamodb'

class DynamoDbStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
	const { stage } = props

	const tables = []

    tables.forEach((tableDef) => {
	  const table = new dynamodb.TableV2(this, `${tableDef.tableName}-${stage}`, {
		  ...tableDef,
		  deletionProtection: true,
		  contributorInsights: true,
		  pointInTimeRecovery: true,
		});
	})

  }
}

module.exports = { DynamoDbStack }