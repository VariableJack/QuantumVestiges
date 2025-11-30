import { AttributeType } from 'aws-cdk-lib/aws-dynamodb'
interface LambdaFunctionType {
    name: string
    method: string
}
interface KeyType {
    name: string
    type: AttributeType
}
interface LocalSecondaryIndexType {
    indexName: string
    sortKey: KeyType
}
interface DynamoDbType {
    tableName: string
    partitionKey: KeyType
    sortKey?: KeyType
    localSecondaryIndexes?: LocalSecondaryIndexType[]
}

export { LambdaFunctionType, DynamoDbType }
