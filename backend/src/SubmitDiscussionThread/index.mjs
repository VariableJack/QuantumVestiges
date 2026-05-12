import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const authClient = new CognitoIdentityProviderClient({ region: "us-west-1" });

const transformOutput = (input, username) => {
    return items.map((item) => ({
		title: item.title,
        subject: item.subject,
        description: item.description,
        author: username,
        create_time: item.game_name,
    }))
}

export const handler = async (event) => {
    console.log(`GetCart - Received event (${JSON.stringify(event)})`)
    const accessToken = event.headers.Authorization
    const stage = process.env.stage
    if (!accessToken) {
        return {
            statusCode: 401,
            headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Please log in.' })
        }
    }

    let user = undefined
    try {
        user = await authClient.send(new GetUserCommand({
            AccessToken: accessToken
        }))
    } catch (e) {
        console.log(e)
        if (typeof(e) === 'NotAuthorizedException')
            return {
                statusCode: 401,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Please log in again' })
            }
        else
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Failed to validate user' })
            }
    }
    const getHighestId = new ScanCommand({
        TableName: `carts-${stage}`,
    });
    const getCartResults = await docClient.send(getCartCommand)
    const results = transformOutput(getCartResults.Items)
    console.log(`GetCart - Finished processing, returning results ${JSON.stringify(results)}`)
    return {
		statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Successfully created new discussion thread')
    }
};
