import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const authClient = new CognitoIdentityProviderClient({ region: "us-west-1" });

export const handler = async (event) => {
    console.log(`UpdateCart - Received event (${JSON.stringify(event)})`)
    const { action, gameId } = JSON.parse(event.body)
    const accessToken = event.headers.Authorization
    const stage = process.env.stage

    let user = undefined
    try {
        user = await authClient.send(new GetUserCommand({
            AccessToken: accessToken
        }))
    } catch (e) {
        console.log(e)
        if (typeof(e) === 'NotAuthorizedException')
            return {
                statusCode: 401,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Please log in again' })
            }
        else
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Failed to validate user' })
            }
    }
    let cartTransactItem = {}
    switch (action) {
        case 'add':
            const getGameDetailsCommand = new ScanCommand({
                TableName: `games-${stage}`,
                FilterExpression: 'game_id = :gameId',
                ExpressionAttributeValues: {
                    ':gameId': gameId,
                }
            });
            let gameDetailsResults = undefined
            try {
                gameDetailsResults = await docClient.send(getGameDetailsCommand)
            } catch (e) {
                if (typeof e === 'ResourceNotFoundException'){
                    return {
                        statusCode: 400,
                        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: 'No game found at the game ID'
                        })
                    }
                }
            }
            const gameDetails = gameDetailsResults.Items
            if (gameDetails.length != 1) {
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Game ID is not associated with exactly one game.'
                    })
                }
            }
            const gameToBuy = gameDetails[0]
            console.log(`Adding ${JSON.stringify(gameToBuy)} to ${user.Username} cart`)
            const getAssociatedFranchiseCommand = new ScanCommand({
                TableName: `franchises-${stage}`,
                FilterExpression: 'franchise_id = :franchiseId',
                ExpressionAttributeValues: {
                    ':franchiseId': gameToBuy.franchise_id,
                }
            });
            const associatedFranchiseResults = await docClient.send(getAssociatedFranchiseCommand)
            const associatedFranchise = associatedFranchiseResults.Items[0]
            console.log(`Found associated franchise ${JSON.stringify(associatedFranchise)}`)

            cartTransactItem = {
                Put: {
                    TableName: `carts-${stage}`,
                    Item: {
                        username: user.Username,
                        game_id: gameToBuy.game_id,
                        game_name: gameToBuy.game_name,
                        franchise_id: associatedFranchise.franchise_id,
                        franchise_name: associatedFranchise.franchise_name,
                    }
                }
            }
            try {
                await docClient.send(new TransactWriteCommand({
                    TransactItems: [cartTransactItem]
                }))
            } catch (e) {
                console.log(e)
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Failed to add the game to your cart. Please try again. If this error persists, please cut us a support ticket'
                    })
                }
            }
            break
        case 'remove':
            const getAssociatedGameCommand = new ScanCommand({
                TableName: `carts-${stage}`,
                FilterExpression: 'game_id = :gameId AND username = :username',
                ExpressionAttributeValues: {
                    ':gameId': gameId,
                    ':username': user.Username
                }
            });
            const associatedGameResults = await docClient.send(getAssociatedGameCommand)
            const associatedGame = associatedGameResults.Items
            if (associatedGame.length < 1) {
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Game is not in your cart and thus cannot be removed'
                    })
                }
            }

            cartTransactItem = {
                Delete: {
                    TableName: `carts-${stage}`,
                    Key: {
                        'username': user.Username,
                    },
                    ConditionExpression: 'game_id = :gameId',
                    ExpressionAttributeValues: {
                        ':gameId': gameId
                    }
                }
            }
            try {
                await docClient.send(new TransactWriteCommand({
                    TransactItems: [cartTransactItem]
                }))
            } catch (e) {
                console.log(e)
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Failed to remove the game from your cart. Please try again. If this error persists, please cut us a support ticket'
                    })
                }
            }
            break
        default:
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                        message: 'Cannot perform that action'
                    })
            }
    }
    console.log(`UpdateCart - Finished processing`)
    return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'Successfully updated cart'
        })
    }
};
