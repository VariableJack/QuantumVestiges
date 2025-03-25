import { Stack } from 'aws-cdk-lib'
import { iam } from 'aws-cdk-lib/aws_iam'

class IamStack extends Stack {
	public readonly lambdaExecutionRole
	
	constructor(scope, id, props) {
		super(scope, id, props);
		const { stage } = props

		lambdaExecutionRole = new iam.Role(this, `LambdaExecutionRole-${stage}`, {
			assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
		})
		lambdaExecutionRole.attachInlinePolicy(new iam.Policy(this, 'userpool-policy', {
			statements: [new iam.PolicyStatement({
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

module.exports = { IamStack }