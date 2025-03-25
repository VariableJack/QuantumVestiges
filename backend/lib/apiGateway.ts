import { Stack } from 'aws-cdk-lib'

class APIGatewayStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);
		const { stage } = props
	}
}

module.exports = { APIGatewayStack }