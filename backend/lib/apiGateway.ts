import { App, Stack, StackProps } from 'aws-cdk-lib'
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { Function } from 'aws-cdk-lib/aws-lambda'
import {
    Deployment,
    RestApi,
    Stage,
    LambdaIntegration,
    JsonSchemaVersion,
    JsonSchemaType,
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
                allowOrigins: ['http://localhost:3000'],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowCredentials: true,
            },
            deployOptions: {
                stageName: stage
            },
        })

        const emptyResponseModel = api.addModel('EmptyResponseModel', {
          contentType: 'application/json',
          modelName: 'EmptyResponseModel',
          schema: {
            schema: JsonSchemaVersion.DRAFT4,
            title: 'Empty Schema',
            type: JsonSchemaType.OBJECT,
          }
        });

        const pathUrlResources = new Map()
        LAMBDA_FUNCTIONS.forEach((lambda) => {
            const { name, methodType, apiPath, requestParameters } = lambda
            const lambdaFunction = Function.fromFunctionArn(
                this,
                `APIG-${name}-${stage}`,
                `arn:aws:lambda:${region}:${account}:function:${name}-${stage}`,
            )
            lambdaFunction.addPermission(`APIGatewayInvocation-${methodType}-${name}-${stage}`, {
                principal: new ServicePrincipal('apigateway.amazonaws.com'),
                action: 'lambda:InvokeFunction',
                sourceArn: `arn:aws:execute-api:${region}:${account}:\${GamerParadiseServer-${stage}}/${stage}/${methodType}/${name}-${stage}`
            })
            let resource = pathUrlResources.get(apiPath)
            if (resource === undefined) {
                resource = api.root.addResource(apiPath)
                pathUrlResources.set(apiPath, resource)
            }
            resource.addMethod(
                methodType,
                new LambdaIntegration(lambdaFunction, {
                    proxy: false,
                    integrationResponses: [
                        {
                            statusCode: '200',
                            responseParameters: {
                                'method.response.header.Access-Control-Allow-Origin': '\'*\'',
                            },
                            responseTemplates: {
                                'application/json': '',
                            },
                        },
                    ],
                }),
                {
                    ...requestParameters,
                    methodResponses: [
                        {
                            statusCode: '200',
                            responseParameters: {
                                'method.response.header.Access-Control-Allow-Origin': true,
                            },
                            responseModels: {
                                'application/json': emptyResponseModel,
                            },
                        },
                    ],
                },
            )
        }
    }
}
