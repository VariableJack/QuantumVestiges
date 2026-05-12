import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const transformOutput = (items) => {
    return items.map((item) => ({
        discussionThreadId: item.discussion_thread_id,
        title: item.title,
        subject: item.subject,
        description: item.description,
        author: item.author,
    }))
}

export const handler = async (event) => {
    console.log(`GetDiscussionThreads - Received event (${JSON.stringify(event)})`)
    const { discussionThreadId } = event.queryStringParameters
    const stage = process.env.stage

    const command = new ScanCommand({
        TableName: `discussionThreads-${stage}`,
        ...(discussionThreadId ? {
            FilterExpression: 'discussion_thread_id = :discussionThreadId',
            ExpressionAttributeValues: {
                ':discussionThreadId': parseInt(discussionThreadId),
            }
        } : {}
    });
    const getBugReportResults = await docClient.send(command)
	const results = transformOutput(getBugReportResults.Items)
    console.log(`GetDiscussionThreads - Finished processing, returning results ${JSON.stringify(results)}`)
    return {
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify(results)
    }
};
