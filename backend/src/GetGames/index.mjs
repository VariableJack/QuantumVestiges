import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const transformOutput = (items, franchise) => {
    return items.map((item) => ({
        franchiseId: franchise.franchise_id,
        franchiseName: franchise.franchise_name,
        gameId: item.game_id,
        gameName: item.game_name,
    }))
}

export const handler = async event => {
    console.log(`GetGames - Received event (${JSON.stringify(event)})`)
    const { franchiseId, gameId } = event.queryStringParameters
    const stage = process.env.stage
    console.log(`Processing franchiseId = ${franchiseId}`)
    if (gameId)
        console.log(`Processing gameId = ${gameId}`)

    const getFranchiseCommand = new ScanCommand({
        TableName: `franchises-${stage}`,
        FilterExpression: 'franchise_id = :franchiseId',
        ExpressionAttributeValues: {
            ':franchiseId': parseInt(franchiseId),
        }
    })
    const getFranchiseResults = await docClient.send(getFranchiseCommand)

    const getGameCommand = new ScanCommand({
        TableName: `games-${stage}`,
        FilterExpression: `franchise_id = :franchiseId ${gameId ? 'AND game_id = :gameId' : ''}`,
        ExpressionAttributeValues: {
            ':franchiseId': parseInt(franchiseId),
            ...(gameId ? { ':gameId': parseInt(gameId) } : {})
        },
    })
    const getGameResults = await docClient.send(getGameCommand)
    const results = transformOutput(getGameResults.Items, getFranchiseResults.Items[0])
    console.log(`GetGames - Finished processing, returning results ${JSON.stringify(results)}`)
    return {
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
    }
}
