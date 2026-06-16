import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Role, ServicePrincipal, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'

interface IamProps extends StackProps {
    stage: string
}
export class IamStack extends Stack {
    public readonly ecsExecutionRole: Role

    constructor(scope: App, id: string, props: IamProps) {
        super(scope, id, props)
        const { stage } = props

        this.ecsExecutionRole = new Role(this, `EcsServiceRole-${stage}`, {
            roleName: `EcsServiceRole-${stage}`,
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        })
        this.ecsExecutionRole.attachInlinePolicy(
            new Policy(this, 'ecs-policy', {
                statements: [
                    new PolicyStatement({
                        actions: [
                            'cognito-idp:GetUser',
                            's3:ListBucket',
                            's3:GetObject',
                            's3:PutObject',
                            'logs:CreateLogStream',
                            'logs:PutLogEvents',
                            'servicediscovery:GetNamespace',
                            'ecr:GetAuthorizationToken',
                            'secretsmanager:GetSecretValue',
                            'cognito-idp:AdminListGroupsForUser',
                        ],
                        resources: ['*'],
                    }),
                ],
            }),
        )
    }
}
