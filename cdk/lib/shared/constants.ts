import { AttributeType } from 'aws-cdk-lib/aws-dynamodb'
import { JsonSchemaType } from 'aws-cdk-lib/aws-apigateway'
import { LambdaFunctionType, DynamoDbType } from './interfaces'

const SERVICE_PREFIX = 'QuantumVestiges'
const DOMAIN_NAME = `${SERVICE_PREFIX.toLowerCase()}.com`
const SUBDOMAINS_BY_STAGE: { [key: string]: string[] } = {
    devo: ['devo.'],
    'pre-prod': ['pre-prod.'],
    prod: ['prod.', 'www.', ''],
}

export { DOMAIN_NAME, SERVICE_PREFIX, SUBDOMAINS_BY_STAGE }
