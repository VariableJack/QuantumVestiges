import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const { franchiseId } = event
    const stage = process.env.stage

    const command = new ScanCommand({
        TableName: `games-${stage}`,
    });
	const results = await docClient.send(command)
    return results.Items
};