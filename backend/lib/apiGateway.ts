import { App, Stack, StackProps } from 'aws-cdk-lib'

import { LAMBDA_FUNCTIONS } from './shared/constants'

interface APIGatewayProps extends StackProps {
    stage: string
}
export class APIGatewayStack extends Stack {
    constructor(scope: App, id: string, props: APIGatewayProps) {
        super(scope, id, props)
        const { stage } = props

        LAMBDA_FUNCTIONS.forEach(lambdaFunction => {})
    }
}
