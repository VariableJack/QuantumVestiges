import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log(`GetBugReports - Received event (${JSON.stringify(event)})`)
    const { bugReportId } = event.queryStringParameters
    const stage = process.env.stage

    const command = new ScanCommand({
        TableName: `bugReports-${stage}`,
        ...(bugReportId ? {
            FilterExpression: 'bug_report_id = :bugReportId',
            ExpressionAttributeValues: {
                ':bugReportId': parseInt(bugReportId),
            }
        } : {}
    });
    const results = await docClient.send(command)
    console.log(`GetBugReports - Finished processing, returning results ${JSON.stringify(results)}`)
    return {
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify(results.Items)
    }
};
