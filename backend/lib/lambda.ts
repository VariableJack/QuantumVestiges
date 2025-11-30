import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Role } from 'aws-cdk-lib/aws-iam'
import { CodeSigningConfig, Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda'
import { SigningProfile, Platform } from 'aws-cdk-lib/aws-signer'

import { LAMBDA_FUNCTIONS } from './shared/constants'

interface LambdaProps extends StackProps {
    stage: string
    env: {
        account: string
        region: string
    }
    lambdaExecutionRole: Role
}
export class LambdaStack extends Stack {
    constructor(scope: App, id: string, props: LambdaProps) {
        super(scope, id, props)
        const signingProfile = new SigningProfile(this, 'SigningProfile', {
            platform: Platform.AWS_LAMBDA_SHA384_ECDSA,
        })

        const codeSigningConfig = new CodeSigningConfig(this, 'CodeSigningConfig', {
            signingProfiles: [signingProfile],
        })

        const { stage, lambdaExecutionRole } = props
        LAMBDA_FUNCTIONS.forEach(lambdaFunction => {
            const newFunction = new Function(this, `${lambdaFunction.name}-${stage}`, {
                codeSigningConfig,
                runtime: Runtime.NODEJS_18_X,
                handler: `${lambdaFunction.name}.handler`,
                code: Code.fromAsset(`src/${lambdaFunction.method}`),
                environment: { stage },
                role: lambdaExecutionRole,
            })
        })
    }
}
