#!/usr/bin/env node

import { App } from 'aws-cdk-lib'
import { APIGatewayStack } from './apiGateway'
import { DynamoDbStack } from './dynamodb'
import { LambdaStack } from './lambda'
import { IamStack } from './iam'

const deploymentEnvironments: {
    stage: string
    env: {
        account: string
        region: string
    }
}[] = [
    { stage: 'devo', env: { account: 'devo-account-id', region: 'devo-region' } },
    { stage: 'pre-prod', env: { account: 'pre-prod-account-id', region: 'pre-prod-region' } },
    { stage: 'prod', env: { account: 'prod-account-id', region: 'prod-region' } },
]

const app = new App()
deploymentEnvironments.forEach(deploymentEnvironment => {
    const { stage }: { stage: string } = deploymentEnvironment
    const iamStack = new IamStack(app, `IamStack-${stage}`, deploymentEnvironment)

    const lambdaExecutionRole = iamStack.lambdaExecutionRole
    const lambdaStack = new LambdaStack(app, `LambdaStack-${stage}`, {
        ...deploymentEnvironment,
        lambdaExecutionRole,
    })

    const apiGatewayStack = new APIGatewayStack(
        app,
        `APIGatewayStack-${stage}`,
        deploymentEnvironment,
    )
    const dynamoDbStack = new DynamoDbStack(app, `DynamoDbStack-${stage}`, deploymentEnvironment)
})
