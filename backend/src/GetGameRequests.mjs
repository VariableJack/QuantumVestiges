import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetGameRequests - Received event (${JSON.stringify(event)})`)
    const { gameRequestId } = event
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
    console.log('GetGameRequests - Finished processing')
    return results.Items
};