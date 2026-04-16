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
        },
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
        },
    },
    // Post APIs
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
    //},
    {
        name: 'CheckoutCart',
        methodType: 'POST',
        apiPath: 'checkout-cart',
        methodResponse: {
            message: {
                type: JsonSchemaType.STRING,
            },
        },
    },
    {
        name: 'UpdateCart',
        methodType: 'POST',
        apiPath: 'update-cart',
        requestParameters: {
            gameId: {
                type: JsonSchemaType.NUMBER,
            },
            action: {
                type: JsonSchemaType.STRING,
            },
        },
        methodRequestParameters: {
            gameId: true,
            action: true,
        },
        methodResponse: {
            message: {
                type: JsonSchemaType.STRING,
            },
        },
    },
    //{
    //    name: 'PostComment',
    //    methodType: 'POST',
    //    apiPath: 'post-comment',
    //    requestParameters: {
    //        requestId: {
    //            type: JsonSchemaType.NUMBER,
    //        },
    //        requestType: {
    //            type: JsonSchemaType.STRING,
    //        },
    //        message: {
    //            type: JsonSchemaType.STRING,
    //        },
    //        imageLinks: {
    //            type: JsonSchemaType.ARRAY,
    //            items: { type: JsonSchemaType.STRING },
    //            minItems: 1,
    //        },
    //    },
    //    methodRequestParameters: {
    //        requestId: true,
    //        requestType: true,
    //        message: true,
    //        imageLinks: false,
    //    },
    //},
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
        tableName: 'supportRequests',
        partitionKey: { name: 'support_id', type: AttributeType.NUMBER },
    },
    {
        tableName: 'bugReports',
        partitionKey: { name: 'bug_report_id', type: AttributeType.NUMBER },
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
