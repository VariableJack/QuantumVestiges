#!/usr/bin/env node

import { App } from 'aws-cdk-lib'
import { APIGatewayStack } from './apiGateway'
import { DynamoDbStack } from './dynamodb'
import { LambdaStack } from './lambda'
import { IamStack } from './iam'
import { CloudWatchStack } from './cloudWatchStack'

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
    const dynamoDbStack = new DynamoDbStack(app, `DynamoDbStack-${stage}`, deploymentEnvironment)

    const { lambdaExecutionRole } = iamStack
    const lambdaStack = new LambdaStack(app, `LambdaStack-${stage}`, {
        ...deploymentEnvironment,
        lambdaExecutionRole,
    })
    lambdaStack.addDependency(
        iamStack,
        'All Lambda functions depend on an associated Lambda IAM role existing',
    )
    lambdaStack.addDependency(
        dynamoDbStack,
        'Some Lambda functions depend on DynamoDB tables existing',
    )

    const apiGatewayStack = new APIGatewayStack(
        app,
        `APIGatewayStack-${stage}`,
        deploymentEnvironment,
    )
    apiGatewayStack.addDependency(
        lambdaStack,
        'API Gateway definitions depend on Lambda functions existing',
    )

    const cloudWatchStack = new CloudWatchStack(
        app,
        `CloudWatchStack-${stage}`,
        deploymentEnvironment,
    )
    cloudWatchStack.addDependency(
        lambdaStack,
        'Alarming on Lambda functions depends on said functions existing',
    )
    cloudWatchStack.addDependency(
        dynamoDbStack,
        'Alarming on DynamoDB tables depends on said tables  existing',
    )
})
