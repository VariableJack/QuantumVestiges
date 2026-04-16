import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const authClient = new CognitoIdentityProviderClient({ region: "us-west-1" });

const transformOutput = (items) => {
    return items.map((item) => ({
        franchiseId: item.franchise_id,
        franchiseName: item.franchise_name,
        gameId: item.game_id,
        gameName: item.game_name,
    }))
}

export const handler = async (event) => {
    console.log(`GetPurchasedGames - Received event (${JSON.stringify(event)})`)
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
    const getPurchasedGamesCommand = new ScanCommand({
        TableName: `purchasedGames-${stage}`,
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': user.Username
        }
    });
    const getPurchasedGamesResults = await docClient.send(getPurchasedGamesCommand)
    const results = transformOutput(getPurchasedGamesResults.Items)
    console.log(`GetPurchasedGames - Finished processing, returning results ${JSON.stringify(results)}`)
    return {
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify(results)
    }
};
