import { AttributeType } from 'aws-cdk-lib/aws-dynamodb'
import { LambdaFunctionType, DynamoDbType } from './interfaces'

const LAMBDA_FUNCTIONS: LambdaFunctionType[] = [{ name: 'GetFranchises' }, { name: 'GetGames' }]

const TABLES: DynamoDbType[] = [
    {
        tableName: 'franchises',
        partitionKey: { name: 'franchise_id', type: AttributeType.NUMBER },
    },
    {
        tableName: 'games',
        partitionKey: { name: 'franchise_id', type: AttributeType.NUMBER },
        sortKey: { name: 'game_id', type: AttributeType.NUMBER },
    },
]

export { LAMBDA_FUNCTIONS, TABLES }
