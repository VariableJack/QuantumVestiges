import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib'
import {
    AccountRecovery,
    FeaturePlan,
    OAuthScope,
    UserPool,
    UserPoolClient,
    UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito'

import { DOMAIN_NAME, SERVICE_PREFIX, SUBDOMAINS_BY_STAGE } from './shared/constants'
interface CognitoProps extends StackProps {
    stage: string
}
export class CognitoStack extends Stack {
    constructor(scope: App, id: string, props: CognitoProps) {
        super(scope, id, props)
        const { stage } = props
        const userPool = new UserPool(this, `${SERVICE_PREFIX}-UserPool-${stage}`, {
            userPoolName: `${SERVICE_PREFIX}-UserPool-${stage}`,
            selfSignUpEnabled: true,
            signInAliases: { email: true, username: true },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: false,
                },
            },
            autoVerify: { email: true },
            featurePlan: FeaturePlan.ESSENTIALS,
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: true,
            },
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            removalPolicy: RemovalPolicy.DESTROY,
        })
        userPool.addDomain(`${SERVICE_PREFIX}.toLowerCase()-cognitodomain-${stage}`, {
            cognitoDomain: {
                domainPrefix: `${SUBDOMAINS_BY_STAGE[stage].slice(-1)[0].replace('.', '-')}${SERVICE_PREFIX.toLowerCase()}`,
            },
        })
        // Create a User Pool Client (for apps to connect)
        const callbackUrls = SUBDOMAINS_BY_STAGE[stage].map(
            subdomain => `https://${subdomain}${DOMAIN_NAME}`,
        )
        if (stage === 'devo') callbackUrls.push('https://localhost:3000')
        const userPoolClient = new UserPoolClient(
            this,
            `${SERVICE_PREFIX}-UserPoolClient-${stage}`,
            {
                userPool,
                authFlows: {
                    userPassword: true,
                    userSrp: true,
                },
                generateSecret: false,
                supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
                oAuth: {
                    flows: {
                        authorizationCodeGrant: true,
                    },
                    scopes: [
                        OAuthScope.EMAIL,
                        OAuthScope.OPENID,
                        OAuthScope.PROFILE,
                        OAuthScope.COGNITO_ADMIN,
                    ],
                    callbackUrls: callbackUrls,
                },
            },
        )
    }
}
