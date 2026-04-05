import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetPurchasedGames - Received event (${JSON.stringify(event)})`)
    console.log('GetPurchasedGames - Finished processing')
    return results.Items
};