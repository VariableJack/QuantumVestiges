import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetSupportRequests - Received event (${JSON.stringify(event)})`)
    const { supportRequestId, accessToken } = event.queryStringParameters
    const stage = process.env.stage

     let user = undefined
    try {
        user = await client.send(new GetUserCommand({
            AccessToken: accessToken
        }))
    } catch (e) {
        if (typeof(e) === 'NotAuthorizedException')
            return {
                statusCode 401,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Please log in again' })
            }
        else
            return {
                statusCode 400,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Failed to validate user' })
            }
    }
    const command = new ScanCommand({
        TableName: `supportRequests-${stage}`,
        ...(supportRequestId ? {
                FilterExpression: 'support_request_id = :supportRequestId',
                ExpressionAttributeValues: {
                    ':supportRequestId': parseInt(supportRequestId),
            }
        } : {
            FilterExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username': user.Username
            }
        }
    );
    const results = await docClient.send(command)
    let resultsToReturn = results.Items.map((item) => ({
        id: item.support_request_id,
        title: item.support_request_title,
    }))
    if (supportRequestId) {
        if (!results.Items.length) {
            return {
                statusCode 404,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Support request does not exist at that ID'
                })
            }
        } else {
            if (user['cognito:groups'].find((group) => group === 'admin') ||
                results.Items[0].username === user.Username) {
                console.log(`User (${user.Username}) is authorized to view the requested Support Request. Returning ${JSON.stringify(results.Items)}`)
            resultsToReturn = results.Items
            }
        }
    }
    console.log(`GetSupportRequests - Finished processing, returning results ${JSON.stringify(resultsToReturn)}`)
    return {
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify(resultsToReturn)
    }
};
