import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Role, ServicePrincipal, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'

interface IamProps extends StackProps {
    stage: string
    env: {
        account: string
        region: string
    }
}
export class IamStack extends Stack {
    public readonly lambdaExecutionRole: Role

    constructor(scope: App, id: string, props: IamProps) {
        super(scope, id, props)
        const { stage } = props

        this.lambdaExecutionRole = new Role(this, `LambdaExecutionRole-${stage}`, {
            roleName: `LambdaExecutionRole-${stage}`,
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        })
        this.lambdaExecutionRole.attachInlinePolicy(
            new Policy(this, 'lambda-policy', {
                statements: [
                    new PolicyStatement({
                        actions: [
                            'dynamodb:Scan',
                            'dynamodb:GetItem',
                            'dynamodb:PutItem',
                            's3:ListBucket',
                            's3:GetObject',
                            's3:PutObject',
                        ],
                        resources: ['*'],
                    }),
                ],
            }),
        )
    }
}
