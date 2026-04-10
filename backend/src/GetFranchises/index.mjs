import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const transformOutput = (items) => {
    return items.map((item) => ({
        franchiseId: item.franchise_id,
        franchiseName: item.franchise_name,
    }))
}

export const handler = async event => {
    console.log(`GetFranchises - Received event (${JSON.stringify(event)})`)
    let franchiseId = 0
    if (event.queryStringParameters)
        franchiseId = event.queryStringParameters
    const stage = process.env.stage

    const getFranchisesCommand = new ScanCommand({
        TableName: `franchises-${stage}`,
        ...(franchiseId ? {
            FilterExpression: 'franchise_id = :franchiseId',
            ExpressionAttributeValues: {
                ':franchiseId': parseInt(franchiseId),
            }
        } : {})
    })
    const getFranchisesResults = await docClient.send(getFranchisesCommand)
    const results = transformOutput(getFranchisesResults.Items)
    console.log(`GetFranchises - Finished processing, returning results ${JSON.stringify(results)}`)
    return {
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
    }
}
