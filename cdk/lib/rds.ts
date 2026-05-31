import { App, Stack, StackProps } from 'aws-cdk-lib'
import {
    BastionHostLinux,
    Connections,
    SubnetType,
    InstanceType,
    InstanceClass,
    InstanceSize,
    Vpc,
} from 'aws-cdk-lib/aws-ec2'
import {
    Credentials,
    DatabaseInstance,
    DatabaseInstanceEngine,
    MysqlEngineVersion,
    StorageType,
} from 'aws-cdk-lib/aws-rds'

import { TABLES } from './shared/constants'

interface RdsProps extends StackProps {
    stage: string
    vpc: Vpc
    ecsConnections: Connections
}
export class RdsStack extends Stack {
    constructor(scope: App, id: string, props: RdsProps) {
        super(scope, id, props)
        const { stage, vpc, ecsConnections } = props

        const bastion = new BastionHostLinux(this, `BastionHost-${stage}`, {
            vpc,
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
            subnetSelection: { subnetType: SubnetType.PUBLIC },
        })
        const rdsInstance = new DatabaseInstance(this, `GamerParadiseRDSInstance-${stage}`, {
            engine: DatabaseInstanceEngine.mysql({
                version: MysqlEngineVersion.VER_8_4_8,
            }),
            instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
            allocatedStorage: 20,
            storageType: StorageType.GP3,
            vpc,
            vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
            credentials: Credentials.fromGeneratedSecret('admin'),
            instanceIdentifier: `gamerparadise-${stage}`,
        })
        //const tables: TableV2[] = []
        //TABLES.forEach(tableDef => {
        //    const table = new TableV2(this, `${tableDef.tableName}-${stage}`, {
        //        ...tableDef,
        //        tableName: `${tableDef.tableName}-${stage}`,
        //        deletionProtection: true,
        //        contributorInsights: true,
        //        pointInTimeRecovery: true,
        //    })
        //    tables.push(table)
        //})
        rdsInstance.connections.allowDefaultPortFrom(ecsConnections)
        rdsInstance.connections.allowDefaultPortFrom(bastion)
    }
}
