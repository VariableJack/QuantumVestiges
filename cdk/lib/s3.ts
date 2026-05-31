import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib'
import { Bucket, BucketEncryption, BlockPublicAccess, HttpMethods } from 'aws-cdk-lib/aws-s3'

interface S3Props extends StackProps {
    stage: string
}
export class S3Stack extends Stack {
    public readonly gamesS3Bucket: Bucket
    constructor(scope: App, id: string, props: S3Props) {
        super(scope, id, props)
        const { stage } = props
        this.gamesS3Bucket = new Bucket(this, `Games-${stage}`, {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: `games-${stage}`,
            cors: [
                {
                    allowedMethods: [HttpMethods.GET, HttpMethods.PUT],
                    allowedOrigins: ['www.gamerparadise.com'],
                },
            ],
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            versioned: true,
        })
    }
}
