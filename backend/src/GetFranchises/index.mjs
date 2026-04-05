import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetFranchises - Received event (${JSON.stringify(event)})`)
    const stage = process.env.stage

    const command = new ScanCommand({
        TableName: `franchises-${stage}`,
    });
    const results = await docClient.send(command)
    console.log('GetFranchises - Finished processing')
    return results.Items
};