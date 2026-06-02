import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

import { useLocation } from 'react-router-dom'

import { useUpdateCartMutation, useLazyGetGameByIdQuery } from '../../redux/api/mediaEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../redux/api/globalSlice'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'

import '../../styles/App.css'

const Game = () => {
    const { cart, purchasedGames } = useSelector(state => state.userReducer)
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const franchiseId = params.get('franchiseId')
    const gameId = params.get('gameId')

    const [triggerGetGame, { isLoading, isError: getGameIsError, error: getGameError }] =
        useLazyGetGameByIdQuery()
    const [
        updateCart,
        {
            isLoading: isUpdating,
            isError: updateCartIsError,
            error: updateCartError,
            isSuccess: updateCartIsSuccess,
        },
    ] = useUpdateCartMutation()
    const [game, setGame] = useState({
        gameId: -1,
        gameName: '',
        franchiseId: -1,
        franchiseName: '',
    })
    const getGame = async () => {
        const response = await triggerGetGame({ game: gameId }).unwrap()
        setGame(response)
    }
    const isPresentInCart = cart.find(cartItem => cartItem.gameId === game.gameId)
    useEffect(() => {
        if (!franchiseId || !gameId) {
            window.location.href('/not-found')
        } else {
            getGame()
        }
    }, [])

    useEffect(() => {
        if (getGameIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to fetch game',
                    description: get(getGameError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: `gameFetchError-${game.gameId}`,
                }),
            )
        }
    }, [getGameIsError])

    useEffect(() => {
        const messageId = `gameFetchInfo-${game.gameId}`
        if (isLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Fetching game',
                    description: 'Please wait while the system retrieves this game',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [isLoading])

    useEffect(() => {
        const messageId = `updateCartInfo-${(isPresentInCart && 'remove') || 'add'}-${game.gameId}`
        if (isUpdating) {
            dispatch(
                addInfoMessage({
                    title: (isPresentInCart && 'Removing item from cart') || 'Adding item to cart',
                    description:
                        (isPresentInCart &&
                            'Please wait as the system removes the item from your cart') ||
                        'Please wait as the system addes the item to your cart',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [isUpdating])

    useEffect(() => {
        if (updateCartIsError) {
            dispatch(
                addErrorMessage({
                    title: `Failed to ${(isPresentInCart && 'remove item from') || 'add item to'} your cart`,
                    description: get(updateCartError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: `updateCartError-${(isPresentInCart && 'remove') || 'add'}-${game.gameId}`,
                }),
            )
        }
    }, [updateCartIsError])

    useEffect(() => {
        if (updateCartIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: (isPresentInCart && 'Removed item from cart') || 'Added item to cart',
                    description: `The system has successfully ${(isPresentInCart && 'removed the item from') || 'added the item to'} your cart`,
                    id: `updateCartSuccess-${(isPresentInCart && 'remove') || 'add'}-${game.gameId}`,
                }),
            )
        }
    }, [updateCartIsSuccess])

    const onDownloadClick = () => {
        const appProtocol = 'myapp://open' // Your custom protocol
        const fallbackUrl = '/download'

        let timeoutId

        // Try to open the app
        window.location.href = appProtocol

        // If the app isn't installed, redirect to download after delay
        timeoutId = setTimeout(() => {
            window.location.href = fallbackUrl
        }, 1500) // 1.5s delay is usually enough

        // Cleanup timeout if user leaves page
        return () => clearTimeout(timeoutId)
    }

    return (
        <div>
            {game.franchiseName} - {game.gameName}
            {(isPresentInCart && (
                <div>
                    <br />
                    {(!isUpdating && (
                        <button
                            onClick={() => {
                                updateCart({ action: 'remove', gameId: game.gameId })
                            }}
                        >
                            Remove from Cart
                        </button>
                    )) || <b>Removing from cart...</b>}
                </div>
            )) ||
                (!purchasedGames.find(purchasedGame => purchasedGame.gameId === game.gameId) && (
                    <div>
                        <br />
                        {(!isUpdating && (
                            <button
                                onClick={() => {
                                    updateCart({ action: 'add', gameId: game.gameId })
                                }}
                            >
                                Add to Cart
                            </button>
                        )) || <b>Adding to cart...</b>}
                    </div>
                )) || (
                    <div>
                        <br />
                        <button onClick={onDownloadClick}>Download the game</button>
                    </div>
                )}
        </div>
    )
}
export default Game
