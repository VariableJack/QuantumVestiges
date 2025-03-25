import { App, Stack } from 'aws-cdk-lib'
import { Role } from 'aws-cdk-lib/aws-iam'
import {
    CodeSigningConfig,
	Function,
	Runtime,
	Code,
} from 'aws-cdk-lib/aws-lambda'
import { SigningProfile, Platform } from 'aws-cdk-lib/aws-signer'

import {
	LAMBDA_FUNCTIONS
} from './shared/constants'

import {
    Props
} from './shared/props'
interface LambdaProps extends Props {
    lambdaExecutionRole: Role
}
export class LambdaStack extends Stack {
	constructor(scope: App, id: string, props: LambdaProps) {
		super(scope, id, props);
		const signingProfile = new SigningProfile(this, 'SigningProfile', {
			platform: Platform.AWS_LAMBDA_SHA384_ECDSA,
		});

		const codeSigningConfig = new CodeSigningConfig(this, 'CodeSigningConfig', {
			signingProfiles: [signingProfile],
		});

		const { stage, lambdaExecutionRole } = props
		LAMBDA_FUNCTIONS.forEach((lambdaFunction) => {
			const newFunction = new Function(this, ``, {
				codeSigningConfig,
				runtime: Runtime.NODEJS_18_X,
				handler: `${lambdaFunction.name}.handler`,
				code: Code.fromAsset(`src/${lambdaFunction.method}`),
				environment: { stage },
				role: lambdaExecutionRole
			})
		})
	}
}

// module.exports = { LambdaStack }