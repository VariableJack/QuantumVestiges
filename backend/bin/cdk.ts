#!/usr/bin/env node

import { App } from 'aws-cdk-lib'
import { APIGatewayStack } from '../lib/apiGateway'
import { DynamoDbStack } from '../lib/dynamodb'
import { LambdaStack } from '../lib/lambda'
import { IamStack } from '../lib/iam'

const deploymentEnvironments: { stage: string }[] = [
  { stage: 'devo' },
  { stage: 'pre-prod' },
  { stage: 'prod' }
]

const app = new App();
deploymentEnvironments.forEach((deploymentEnvironment) => {
	const { stage }: { stage: string } = deploymentEnvironment
	const iamStack = new IamStack(app, `IamStack-${stage}`, { stage })
	
	const lambdaExecutionRole = iamStack.lambdaExecutionRole
	const lambdaStack = new LambdaStack(app, `LambdaStack-${stage}`, { stage, lambdaExecutionRole })
	
	const apiGatewayStack = new APIGatewayStack(app, `APIGatewayStack-${stage}`, { stage })
	const dynamoDbStack = new DynamoDbStack(app, `DynamoDbStack-${stage}`, { stage })
})