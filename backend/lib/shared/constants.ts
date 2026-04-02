import { AttributeType } from 'aws-cdk-lib/aws-dynamodb'
import { JsonSchemaType } from 'aws-cdk-lib/aws-apigateway'
import { LambdaFunctionType, DynamoDbType } from './interfaces'

const LAMBDA_FUNCTIONS: LambdaFunctionType[] = [
    {
        name: 'GetFranchises',
        methodType: 'GET',
        apiPath: 'franchises',
    },
    {
        name: 'GetGames',
        methodType: 'GET',
        apiPath: 'games',
        requestParameters: {
            franchiseId: {
                type: JsonSchemaType.NUMBER
            }
        },
        methodRequestParameters: {
            'method.request.querystring.franchiseId': true,
        },
        integrationRequestParameters: {
            'integration.request.querystring.franchiseId': 'method.request.querystring.franchiseId',
        },
    },
    {
        name: 'GetFeatureRequests',
        methodType: 'GET',
        apiPath: 'feature-request',
        requestParameters: {
            featureRequestId: {
                type: JsonSchemaType.NUMBER
            }
        },
    },
]

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
