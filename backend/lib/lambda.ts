import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Role } from 'aws-cdk-lib/aws-iam'
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda'

import { LAMBDA_FUNCTIONS } from './shared/constants'

interface LambdaProps extends StackProps {
    stage: string
    lambdaExecutionRole: Role
}
export class LambdaStack extends Stack {
    constructor(scope: App, id: string, props: LambdaProps) {
        super(scope, id, props)

        const { stage, lambdaExecutionRole } = props
        LAMBDA_FUNCTIONS.forEach(lambdaFunction => {
            const newFunction = new Function(this, `${lambdaFunction.name}-${stage}`, {
                runtime: Runtime.NODEJS_18_X,
                functionName: `${lambdaFunction.name}-${stage}`,
                handler: `${lambdaFunction.name}.handler`,
                code: Code.fromAsset(`src/${lambdaFunction.method}`),
                environment: { stage },
                role: lambdaExecutionRole,
            })
        })
    }
}
