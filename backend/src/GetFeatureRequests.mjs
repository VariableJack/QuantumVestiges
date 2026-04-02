import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetFeatureRequests - Received event (${JSON.stringify(event)})`)
    const { featureRequestId } = event
    const stage = process.env.stage

    const command = new ScanCommand({
        TableName: `featureRequests-${stage}`,
        ...(featureRequestId ? {
            FilterExpression: 'feature_request_id = :featureRequestId',
            ExpressionAttributeValues: {
                ':featureRequestId': parseInt(featureRequestId),
            }
        } : {}
    });
    const results = await docClient.send(command)
    console.log('GetFeatureRequests - Finished processing')
    return results.Items
};