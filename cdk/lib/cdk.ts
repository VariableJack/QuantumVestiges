#!/usr/bin/env node

import { App } from 'aws-cdk-lib'
import { CommonNetworkingStack } from './commonNetworkingStack'
import { CognitoStack } from './cognito'
import { FoundationalStack } from './foundationalStack'
import { IamStack } from './iam'
import { S3Stack } from './s3'
import { VpcStack } from './vpc'
import { EcsStack } from './ecs'
import { RdsStack } from './rds'
import { CloudWatchStack } from './cloudWatchStack'
const deploymentEnvironments: {
    stage: string
    env: {
        account: string
        region: string
    }
}[] = [
    { stage: 'devo', env: { account: 'devo-account-id', region: 'devo-region' } },
    { stage: 'pre-prod', env: { account: 'pre-prod-account-id', region: 'pre-prod-region' } },
    { stage: 'prod', env: { account: 'prod-account-id', region: 'prod-region' } },
]

const app = new App()
deploymentEnvironments.forEach(deploymentEnvironment => {
    const { stage }: { stage: string } = deploymentEnvironment
    const commonNetworkingStack = new CommonNetworkingStack(
        app,
        `CommonNetworkingStack-${stage}`,
        deploymentEnvironment,
    )
    const cognitoStack = new CognitoStack(app, `CognitoStack-${stage}`, deploymentEnvironment)
    const s3Stack = new S3Stack(app, `S3Stack-${stage}`, deploymentEnvironment)
    const iamStack = new IamStack(app, `IamStack-${stage}`, deploymentEnvironment)
    const vpcStack = new VpcStack(app, `VpcStack-${stage}`, deploymentEnvironment)
    const foundationalStack = new FoundationalStack(
        app,
        `FoundationalStack-${stage}`,
        deploymentEnvironment,
    )

    const { ecsExecutionRole } = iamStack
    const { backendLogGroup, frontendLogGroup } = foundationalStack
    const { vpc } = vpcStack
    const { hostedZone, certificate } = commonNetworkingStack
    const ecsStack = new EcsStack(app, `EcsStack-${stage}`, {
        ...deploymentEnvironment,
        ecsExecutionRole,
        backendLogGroup,
        frontendLogGroup,
        hostedZone,
        certificate,
        vpc,
    })
    ecsStack.addDependency(iamStack)
    ecsStack.addDependency(vpcStack)
    ecsStack.addDependency(commonNetworkingStack)
    ecsStack.addDependency(cognitoStack)
    const { ecsConnections } = ecsStack
    const rdsStack = new RdsStack(app, `RdsStack-${stage}`, {
        ...deploymentEnvironment,
        vpc,
        ecsConnections,
    })
    rdsStack.addDependency(vpcStack)
    rdsStack.addDependency(ecsStack)

    const cloudWatchStack = new CloudWatchStack(
        app,
        `CloudWatchStack-${stage}`,
        deploymentEnvironment,
    )
    cloudWatchStack.addDependency(ecsStack)
})
