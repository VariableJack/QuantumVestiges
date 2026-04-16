import { App, Stack, StackProps } from 'aws-cdk-lib'
import { RemovalPolicy } from 'aws-cdk-lib/core'
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { Function } from 'aws-cdk-lib/aws-lambda'
import {
    Deployment,
    RestApi,
    Stage,
    LambdaIntegration,
    JsonSchemaVersion,
    JsonSchemaType,
    Model,
} from 'aws-cdk-lib/aws-apigateway'

import { LAMBDA_FUNCTIONS } from './shared/constants'

interface APIGatewayProps extends StackProps {
    stage: string
}
export class APIGatewayStack extends Stack {
    constructor(scope: App, id: string, props: APIGatewayProps) {
        super(scope, id, props)
        const { stage } = props
        const { account, region } = Stack.of(this)
        const api = new RestApi(this, `GamerParadiseServer-${stage}`, {
            restApiName: `GamerParadiseServer-${stage}`,
            defaultCorsPreflightOptions: {
                allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
                allowOrigins: ['http://localhost:3000', 'https://localhost:3000'],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowCredentials: true,
            },
            deployOptions: {
                stageName: stage,
            },
            cloudWatchRole: true,
            cloudWatchRoleRemovalPolicy: RemovalPolicy.DESTROY,
        })
        const requestValidator = api.addRequestValidator('GamerParadiseServer-RequestValidator', {
            validateRequestBody: true,
            validateRequestParameters: true,
        })

        const pathUrlResources = new Map()
        const errorModel = api.addModel('ErrorModel', {
            contentType: 'application/json',
            schema: {
                schema: JsonSchemaVersion.DRAFT4,
                title: 'ErrorSchema',
                type: JsonSchemaType.OBJECT,
                properties: {
                    message: {
                        type: JsonSchemaType.STRING,
                    },
                },
            },
        })
        const responseHeaders = {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Content-Type': true,
        }
        LAMBDA_FUNCTIONS.forEach(lambda => {
            const {
                name,
                methodType,
                apiPath,
                requestParameters,
                methodRequestParameters,
                methodResponse,
            } = lambda
            const successModel = api.addModel(`${name}-${stage}-ResponseModel`, {
                contentType: 'application/json',
                modelName: `${name}${stage}SuccessResponse`,
                schema: {
                    schema: JsonSchemaVersion.DRAFT4,
                    title: `${name}-${stage}-Schema`,
                    type: JsonSchemaType.OBJECT,
                    properties: methodResponse,
                },
            })
            let inputModel: Model | undefined = undefined
            if (methodType === 'POST' && requestParameters) {
                inputModel = api.addModel(`${name}-${stage}-RequestModel`, {
                    contentType: 'application/json',
                    modelName: `${name}${stage}RequestInput`,
                    schema: {
                        type: JsonSchemaType.OBJECT,
                        properties: requestParameters,
                    },
                })
            }

            const lambdaFunction = Function.fromFunctionArn(
                this,
                `APIG-${name}-${stage}`,
                `arn:aws:lambda:${region}:${account}:function:${name}-${stage}`,
            )
            lambdaFunction.addPermission(`APIGatewayInvocation-${methodType}-${name}-${stage}`, {
                principal: new ServicePrincipal('apigateway.amazonaws.com'),
                action: 'lambda:InvokeFunction',
                sourceArn: `arn:aws:execute-api:${region}:${account}:\${GamerParadiseServer-${stage}}/${stage}/${methodType}/${name}-${stage}`,
            })
            let resource = pathUrlResources.get(apiPath)
            if (resource === undefined) {
                resource = api.root.addResource(apiPath)
                pathUrlResources.set(apiPath, resource)
            }
            const intOpts = {
                proxy: true,
                integrationResponses: [
                    {
                        statusCode: '200',
                        responseParameters: {
                            'method.response.header.Access-Control-Allow-Origin': "'*'",
                        },
                    },
                ],
            }
            const methodOpts = {
                requestValidator,
                ...(inputModel
                    ? {
                          requestModels: {
                              'application/json': inputModel,
                          },
                      }
                    : {
                          requestParameters: methodRequestParameters,
                      }),
                methodResponses: [
                    {
                        statusCode: '200',
                        responseParameters: {
                            ...responseHeaders,
                        },
                        responseModels: {
                            'application/json': successModel,
                        },
                    },
                    {
                        statusCode: '400',
                        responseParameters: {
                            ...responseHeaders,
                        },
                        responseModels: {
                            'application/json': errorModel,
                        },
                    },
                    {
                        statusCode: '401',
                        responseParameters: {
                            ...responseHeaders,
                        },
                        responseModels: {
                            'application/json': errorModel,
                        },
                    },
                    {
                        statusCode: '403',
                        responseParameters: {
                            ...responseHeaders,
                        },
                        responseModels: {
                            'application/json': errorModel,
                        },
                    },
                    {
                        statusCode: '404',
                        responseParameters: {
                            ...responseHeaders,
                        },
                        responseModels: {
                            'application/json': errorModel,
                        },
                    },
                ],
            }
            resource.addMethod(
                methodType,
                new LambdaIntegration(lambdaFunction, intOpts),
                methodOpts,
            )
        })
    }
}
