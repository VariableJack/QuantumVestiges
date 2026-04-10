import { AttributeType } from 'aws-cdk-lib/aws-dynamodb'
import { JsonSchemaType } from 'aws-cdk-lib/aws-apigateway'
import { LambdaFunctionType, DynamoDbType } from './interfaces'

const LAMBDA_FUNCTIONS: LambdaFunctionType[] = [
    // Get APIs
    {
        name: 'GetFranchises',
        methodType: 'GET',
        apiPath: 'franchises',
        methodRequestParameters: {
            'method.request.querystring.franchiseId': false,
        },
        integrationRequestParameters: {
            'integration.request.querystring.franchiseId': 'method.request.querystring.franchiseId',
        },
        methodResponse: {
            franchiseId: {
                type: JsonSchemaType.NUMBER,
            },
            franchiseName: {
                type: JsonSchemaType.STRING,
            },
        },
    },
    {
        name: 'GetGames',
        methodType: 'GET',
        apiPath: 'games',
        requestParameters: {
            franchiseId: {
                type: JsonSchemaType.NUMBER,
            },
            gameId: {
                type: JsonSchemaType.NUMBER,
            },
        },
        methodRequestParameters: {
            'method.request.querystring.franchiseId': true,
            'method.request.querystring.gameId': false,
        },
        integrationRequestParameters: {
            'integration.request.querystring.franchiseId': 'method.request.querystring.franchiseId',
            'integration.request.querystring.gameId': 'method.request.querystring.gameId',
        },
        methodResponse: {
            gameId: {
                type: JsonSchemaType.NUMBER,
            },
            gameName: {
                type: JsonSchemaType.STRING,
            },
            franchiseId: {
                type: JsonSchemaType.NUMBER,
            },
            franchiseName: {
                type: JsonSchemaType.STRING,
            },
        },
    },
    {
        name: 'GetFeatureRequests',
        methodType: 'GET',
        apiPath: 'feature-request',
        requestParameters: {
            featureRequestId: {
                type: JsonSchemaType.NUMBER,
            },
        },
        methodRequestParameters: {
            'method.request.querystring.featureRequestId': false,
        },
        integrationRequestParameters: {
            'integration.request.querystring.featureRequestId':
                'method.request.querystring.featureRequestId',
        },
        methodResponse: {
            featureRequestId: {
                type: JsonSchemaType.NUMBER,
            },
            title: {
                type: JsonSchemaType.NUMBER,
            },
            gameName: {
                type: JsonSchemaType.STRING,
            },
        },
    },
    {
        name: 'GetBugReports',
        methodType: 'GET',
        apiPath: 'bug-report',
        requestParameters: {
            bugReportId: {
                type: JsonSchemaType.NUMBER,
            },
        },
        methodRequestParameters: {
            'method.request.querystring.bugReportId': false,
        },
        integrationRequestParameters: {
            'integration.request.querystring.bugReportId': 'method.request.querystring.bugReportId',
        },
    },
    {
        name: 'GetSupportRequests',
        methodType: 'GET',
        apiPath: 'support-request',
        requestParameters: {
            supportRequestId: {
                type: JsonSchemaType.NUMBER,
            },
            requester: {
                type: JsonSchemaType.STRING,
            },
        },
        methodRequestParameters: {
            'method.request.querystring.supportRequestId': false,
        },
        integrationRequestParameters: {
            'integration.request.querystring.supportRequestId':
                'method.request.querystring.supportRequestId',
        },
    },
    {
        name: 'GetGameRequests',
        methodType: 'GET',
        apiPath: 'game-request',
        requestParameters: {
            gameRequestId: {
                type: JsonSchemaType.NUMBER,
            },
        },
        methodRequestParameters: {
            'method.request.querystring.gameRequestId': false,
        },
        integrationRequestParameters: {
            'integration.request.querystring.gameRequestId':
                'method.request.querystring.gameRequestId',
        },
    },
    {
        name: 'GetPurchasedGames',
        methodType: 'GET',
        apiPath: 'purchase-games',
        methodResponse: {
            franchiseId: {
                type: JsonSchemaType.NUMBER,
            },
            franchiseName: {
                type: JsonSchemaType.STRING,
            },
            gameId: {
                type: JsonSchemaType.NUMBER,
            },
            gameName: {
                type: JsonSchemaType.STRING,
            },
        }
    },
    {
        name: 'GetCart',
        methodType: 'GET',
        apiPath: 'cart',
        methodResponse: {
            franchiseId: {
                type: JsonSchemaType.NUMBER,
            },
            franchiseName: {
                type: JsonSchemaType.STRING,
            },
            gameId: {
                type: JsonSchemaType.NUMBER,
            },
            gameName: {
                type: JsonSchemaType.STRING,
            },
        }
    },
    // Post APIs
    //{
    //    name: 'SubmitFeatureRequest',
    //    methodType: 'POST',
    //    apiPath: 'feature-request',
    //    requestParameters: {
    //        featureRequestId: {
    //            type: JsonSchemaType.NUMBER
    //        },
    //        requester: {
    //            type: JsonSchemaType.STRING
    //        },
    //        title: {
    //            type: JsonSchemaType.STRING
    //        },
    //        description: {
    //            type: JsonSchemaType.STRING
    //        },
    //    },
    //    methodRequestParameters: {
    //        'method.request.querystring.featureRequestId': true,
    //        'method.request.querystring.requester': true,
    //        'method.request.querystring.title': true,
    //        'method.request.querystring.description': true,
    //    },
    //    integrationRequestParameters: {
    //        'integration.request.querystring.featureRequestId': 'method.request.querystring.featureRequestId',
    //        'integration.request.querystring.requester': 'method.request.querystring.requester',
    //        'integration.request.querystring.title': 'method.request.querystring.title',
    //        'integration.request.querystring.description': 'method.request.querystring.description',
    //    },
    //},
    //{
    //    name: 'SubmitBugReport',
    //    methodType: 'POST',
    //    apiPath: 'bug-report',
    //    requestParameters: {
    //        bugReportId: {
    //            type: JsonSchemaType.NUMBER
    //        }
    //    },
    //    methodRequestParameters: {
    //        'method.request.querystring.featureRequestId': true,
    //    },
    //    integrationRequestParameters: {
    //        'integration.request.querystring.featureRequestId': 'method.request.querystring.featureRequestId',
    //    },
    //},
    //{
    //    name: 'SubmitSupportRequest',
    //    methodType: 'POST',
    //    apiPath: 'support-request',
    //    requestParameters: {
    //        supportRequestId: {
    //            type: JsonSchemaType.NUMBER
    //        }
    //        requester: {
    //            type: JsonSchemaType.STRING
    //        }
    //    },
    //    methodRequestParameters: {
    //        'method.request.querystring.supportRequestId': true,
    //        'method.request.querystring.requester': true,
    //    },
    //    integrationRequestParameters: {
    //        'integration.request.querystring.supportRequestId': 'method.request.querystring.supportRequestId',
    //        'integration.request.querystring.requester': 'method.request.querystring.requester',
    //    },
    //},
    //{
    //    name: 'SubmitGameRequest',
    //    methodType: 'POST',
    //    apiPath: 'game-request',
    //    requestParameters: {
    //        gameRequestId: {
    //            type: JsonSchemaType.NUMBER
    //        }
    //    },
    //    methodRequestParameters: {
    //        'method.request.querystring.featureRequestId': true,
    //    },
    //    integrationRequestParameters: {
    //        'integration.request.querystring.featureRequestId': 'method.request.querystring.featureRequestId',
    //    },
    //},
    {
        name: 'CheckoutCart',
        methodType: 'POST',
        apiPath: 'checkout-cart',
    },
    {
        name: 'UpdateCart',
        methodType: 'POST',
        apiPath: 'update-cart',
        requestParameters: {
            action: {
                type: JsonSchemaType.STRING
            },
            gameId: {
                type: JsonSchemaType.NUMBER
            },
        },
        //methodRequestParameters: {
        //    'method.request.body.action': true,
        //    'method.request.body.accessToken': true,
        //    'method.request.body.gameId': true,
        //},
        //integrationRequestParameters: {
        //    'integration.request.body.action': 'method.request.body.action',
        //    'integration.request.body.accessToken': 'method.request.body.accessToken',
        //    'integration.request.body.gameId': 'method.request.body.gameId',
        //},
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
    {
        tableName: 'purchasedGames',
        partitionKey: { name: 'username', type: AttributeType.STRING },
    },
    {
        tableName: 'carts',
        partitionKey: { name: 'username', type: AttributeType.STRING },
    },
]

export { LAMBDA_FUNCTIONS, TABLES }
