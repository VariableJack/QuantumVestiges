import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib'
import { Bucket, BucketEncryption, BlockPublicAccess, HttpMethods } from 'aws-cdk-lib/aws-s3'
import { Effect, PolicyStatement, AnyPrincipal } from 'aws-cdk-lib/aws-iam'
import { DOMAIN_NAME, SERVICE_PREFIX, SUBDOMAINS_BY_STAGE } from './shared/constants'
interface S3Props extends StackProps {
    stage: string
}
export class S3Stack extends Stack {
    public readonly gamesS3Bucket: Bucket
    constructor(scope: App, id: string, props: S3Props) {
        super(scope, id, props)
        const { stage } = props
        const allowedOrigins: string[] = []
        SUBDOMAINS_BY_STAGE[stage].forEach(subdomain => {
            allowedOrigins.push(`https://${subdomain}${DOMAIN_NAME}`)
        })
        if (stage === 'devo') {
            allowedOrigins.push('https://localhost:3000')
        }
        this.gamesS3Bucket = new Bucket(this, `Games-${stage}`, {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: `games-${stage}`,
            cors: [
                {
                    allowedMethods: [HttpMethods.GET, HttpMethods.PUT],
                    allowedOrigins,
                    allowedHeaders: ['*'],
                    exposedHeaders: ['ETag'],
                },
            ],
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
        })
        const assetsBucket = new Bucket(this, `${SERVICE_PREFIX}-assets-${stage}`, {
            blockPublicAccess: new BlockPublicAccess({
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            }),
            bucketName: `${SERVICE_PREFIX.toLowerCase()}-assets-${stage}`,
            cors: [
                {
                    allowedMethods: [HttpMethods.GET],
                    allowedOrigins,
                    allowedHeaders: ['*'],
                    exposedHeaders: ['ETag'],
                },
            ],
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
        })
        assetsBucket.addToResourcePolicy(
            new PolicyStatement({
                sid: 'PublicReadGetObject',
                effect: Effect.ALLOW,
                principals: [new AnyPrincipal()],
                actions: ['s3:GetObject'],
                resources: [assetsBucket.arnForObjects('*')],
            }),
        )
    }
}
