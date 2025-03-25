import { App, Stack } from 'aws-cdk-lib'
import { Role, ServicePrincipal, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'

import {
    Props
} from './shared/props'
export class IamStack extends Stack {
	public readonly lambdaExecutionRole: Role
	
	constructor(scope: App, id: string, props: Props) {
		super(scope, id, props);
		const { stage } = props

		this.lambdaExecutionRole = new Role(this, `LambdaExecutionRole-${stage}`, {
			assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
		})
		this.lambdaExecutionRole.attachInlinePolicy(new Policy(this, 'userpool-policy', {
			statements: [new PolicyStatement({
				actions: [
					'dynamodb:Scan',
					'dynamodb:GetItem',
					'dynamodb:PutItem',
					's3:ListBucket',
					's3:GetObject',
					's3:PutObject',
				],
				resources: ['aws:arn:*:lambda'],
			})],
		}))
		
	}
}

// module.exports = { IamStack }