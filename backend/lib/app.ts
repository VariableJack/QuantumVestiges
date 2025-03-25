import { App } from 'aws-cdk-lib'

import LambdaStack from './lambda'
import APIGatewayStack from 'apiGateway'
import DynamoDbStack from './dynamodb'
import IamStack from './iam'

const deploymentEnvironments = [
{ stage: 'devo' },
{ stage: 'pre-prod' },
{ state: 'prod' }
]

const app = new App()
deploymentEnvironments.forEach((deploymentEnvironment) => {
	const { stage } = deploymentEnvironment
	const dynamoDbStack = new DynamoDbStack(app, `DynamoDbStack-${stage}`, { stage })
	const iamStack = new IamStack(app, `IamStack-${stage}`, { stage })
	
	const lambdaExecutionRole = iamStack.lambdaExecutionRole
	const lambdaStack = new LambdaStack(app, `LambdaStack-${stage}`, { stage, lambdaExecutionRole })
	
	const APIGatewayStack = new APIGatewayStack(app, `APIGatewayStack-${stage}`, { stage })
})
