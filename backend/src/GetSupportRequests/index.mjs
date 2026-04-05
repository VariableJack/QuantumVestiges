import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetSupportRequests - Received event (${JSON.stringify(event)})`)
    const { supportRequestId } = event
    const stage = process.env.stage

    // TODO: filter by requester, as they should only see their own support requests
    const command = new ScanCommand({
        TableName: `supportRequests-${stage}`,
        ...(featureRequestId ? {
            FilterExpression: 'support_request_id = :supportRequestId',
            ExpressionAttributeValues: {
                ':supportRequestId': parseInt(supportRequestId),
            }
        } : {}
    });
    const results = await docClient.send(command)
    console.log('GetSupportRequests - Finished processing')
    return results.Items
};