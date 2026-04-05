import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetGames - Received event (${JSON.stringify(event)})`)
    const { franchiseId } = event
    if (!franchiseId) {
        return { status: 400, message: 'franchise_id is required' }
    }
    console.log(`Processing franchiseId = ${franchiseId}`)
    const stage = process.env.stage

    const command = new ScanCommand({
        TableName: `games-${stage}`,
        FilterExpression: 'franchise_id = :franchiseId',
        ExpressionAttributeValues: {
            ':franchiseId': parseInt(franchiseId),
        }
    });
    const results = await docClient.send(command)
    console.log(`GetGames - Finished processing, returning results ${JSON.stringify(results)}`)
    return results.Items
};