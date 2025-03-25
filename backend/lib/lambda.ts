import { Stack } from 'aws-cdk-lib'
import { lambda } from 'aws-cdk-lib/aws-lambda'
import { signer } from 'aws-cdk-lib/aws-signer'

import {
	LAMBDA_FUNCTIONS
} from './shared/constants'

class LambdaStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);
		const signingProfile = new signer.SigningProfile(this, 'SigningProfile', {
			platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
		});

		const codeSigningConfig = new lambda.CodeSigningConfig(this, 'CodeSigningConfig', {
			signingProfiles: [signingProfile],
		});

		const { stage, lambdaExecutionRole } = props
		LAMBDA_FUNCTIONS.forEach((lambdaFunction) => {
			const newFunction = new lambda.Function(this, ``, {
				codeSigningConfig,
				runtime: lambda.Runtime.NODEJS_18_X,
				handler: `${lambdaFunction.name}.handler`,
				code: lambda.Code.fromAsset(`src/${lambdaFunction.method}`),
				environment: { stage },
				role: lambdaExecutionRole
			})
		})
	}
}

module.exports = { LambdaStack }