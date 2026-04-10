import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetGameRequests - Received event (${JSON.stringify(event)})`)
    const { gameRequestId } = event.queryStringParameters
    const stage = process.env.stage

    const command = new ScanCommand({
        TableName: `gameRequests-${stage}`,
        ...(featureRequestId ? {
            FilterExpression: 'game_request_id = :gameRequestId',
            ExpressionAttributeValues: {
                ':gameRequestId': parseInt(gameRequestId),
            }
        } : {}
    });
    const results = await docClient.send(command)
    console.log(`GetGameRequests - Finished processing, returning results ${JSON.stringify(results)}`)
    return {
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify(results.Items)
    }
};
