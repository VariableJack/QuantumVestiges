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
    {
        name: 'GetBugReports',
        methodType: 'GET',
        apiPath: 'bug-report',
        requestParameters: {
            bugReportId: {
                type: JsonSchemaType.NUMBER
            }
        },
    },
    {
        name: 'GetSupportRequests',
        methodType: 'GET',
        apiPath: 'support-request',
        requestParameters: {
            supportRequestId: {
                type: JsonSchemaType.NUMBER
            }
        },
    },
    {
        name: 'GetGameRequests',
        methodType: 'GET',
        apiPath: 'game-request',
        requestParameters: {
            gameRequestId: {
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
	{
		tableName: 'featureRequests',
		partitionKey: { name: 'feature_id', type: AttributeType.NUMBER },
	},
	{
		tableName: 'supportRequests',
		partitionKey: { name: 'support_id', type: AttributeType.NUMBER },
	},
	{
		tableName: 'bugReports',
		partitionKey: { name: 'bug_report_id', type: AttributeType.NUMBER },
	},
	{
		tableName: 'gameRequests',
		partitionKey: { name: 'game_request_id', type: AttributeType.NUMBER },
	},
]

export { LAMBDA_FUNCTIONS, TABLES }
