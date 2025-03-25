import { App, Stack } from 'aws-cdk-lib'

import {
    Props
} from './shared/props'
export class APIGatewayStack extends Stack {
	constructor(scope: App, id: string, props: Props) {
		super(scope, id, props);
		const { stage } = props
	}
}

// module.exports = { APIGatewayStack }