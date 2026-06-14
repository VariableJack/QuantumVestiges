import { App, Stack, StackProps } from 'aws-cdk-lib'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53'
import { DOMAIN_NAME, SERVICE_PREFIX } from './shared/constants'

interface CommonNetworkingStackProps extends StackProps {
    stage: string
}
export class CommonNetworkingStack extends Stack {
    public readonly certificate: Certificate
    public readonly hostedZone: IHostedZone

    constructor(scope: App, id: string, props: CommonNetworkingStackProps) {
        super(scope, id, props)
        const { stage } = props
        this.hostedZone = HostedZone.fromLookup(this, `${SERVICE_PREFIX}Zone-${stage}`, {
            domainName: DOMAIN_NAME,
        })
        this.certificate = new Certificate(this, `${SERVICE_PREFIX}-SSLCertificate-${stage}`, {
            domainName: DOMAIN_NAME,
            subjectAlternativeNames: [`*.${DOMAIN_NAME}`],
            validation: CertificateValidation.fromDns(this.hostedZone),
        })
    }
}
