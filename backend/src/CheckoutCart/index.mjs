import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const authClient = new CognitoIdentityProviderClient({ region: "us-west-1" });

export const handler = async (event) => {
    console.log(`CheckoutCart - Received event (${JSON.stringify(event)})`)
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
                statusCode 401,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Please log in again' })
            }
        else
            return {
                statusCode 400,
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Failed to validate user' })
            }
    }
    console.log(`Begin process to checkout the cart belonging to ${user.Username}`)
    const getCartCommand = new ScanCommand({
        TableName: `carts-${stage}`,
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': user.Username,
        }
    });
    const cartResults = await docClient.send(getCartCommand)
    const cart = cartResults.Items
    if (!cart.length) {
        return {
        statusCode 400,
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Cannot check out an empty cart' })
    }
    }
    console.log(`CheckoutCart - Found the associated cart ${JSON.stringify(cart)}`)

    const getPurchasedGameCommand = new ScanCommand({
        TableName: `purchasedGames-${stage}`,
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': user.Username,
        }
    });
    const purchasedGameResults = await docClient.send(getPurchasedGameCommand)
    const purchasedGames = purchasedGameResults.Items

    const duplicatePurchases = cart.filter((gameToBuy) => purchasedGames.find((game) => game.gameId === gameToBuy.gameId))
    if (duplicatePurchases.length) {
        return {
            statusCode 400,
            headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Purhcasing the same item twice is not currently supported. Gifting a copy is also not currently supported.' })
        }
    }
    const purchaseTransactItems = cart.map((gameToBuy) => ({
        Put: {
            TableName: `purchasedGames-${stage}`,
            Item: {
                username: user.Username,
                game_id: gameToBuy.game_id,
                game_name: gameToBuy.game_name,
                franchise_id: gameToBuy.franchise_id,
                franchise_name: gameToBuy.franchise_name,
            }
        }
    }))
    const cartTransactItems = cart.map((gameToBuy) => ({
        Delete: {
            TableName: `carts-${stage}`,
            Key: {
                'username': user.Username,
            },
            ConditionExpression: 'game_id = :gameId',
            ExpressionAttributeValues: {
                ':gameId': gameToBuy.game_id
            }
        }
    }))
    try {
        await docClient.send(new TransactWriteCommand({
            TransactItems: [
                ...purchaseTransactItems,
                ...cartTransactItems
            ]
        }))
    } catch {
        console.log(e)
        return {
            statusCode 400,
            headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Failed to purchase the items in the cart. Your account has not been charged. Please try again. If this error persists, please cut us a support ticket' })
        }
    }
    console.log(`CheckoutCart - Successfully checked out the cart`)
    return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': 'https://localhost:3000', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `All ${cart.length} items have been successfully purchased` })
    }
};
