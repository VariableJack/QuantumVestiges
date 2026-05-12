import { AttributeType } from 'aws-cdk-lib/aws-dynamodb'
import { JsonSchemaType, JsonSchema } from 'aws-cdk-lib/aws-apigateway'
interface LambdaFunctionType {
    name: string
    methodType: string
    apiPath: string
    requestParameters?: {
        [string]: JsonSchema
    }
    methodRequestParameters?: {
        [string]: boolean
    }
    methodResponse?: {
        [string]: {
            type: JsonSchemaType
        }
    }
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
