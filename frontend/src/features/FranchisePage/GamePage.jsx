import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import { useUpdateCartMutation, useLazyGetGameByIdQuery } from '../../redux/api/mediaEndpoints'

import '../../styles/App.css'

const Game = () => {
    const { cart, purchasedGames } = useSelector(state => state.userReducer)
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const franchiseId = params.get('franchiseId')
    const gameId = params.get('gameId')

    const [triggerGetGame, { isLoading }] = useLazyGetGameByIdQuery()
    const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation()

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
    useEffect(() => {
        if (!franchiseId || !gameId) {
            window.location.href('/not-found')
        } else {
            getGame()
        }
    }, [])
    return (
        <div>
            {game.franchiseName} - {game.gameName}
            {(cart.find(cartItem => cartItem.gameId === game.gameId) && (
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
                        <button disabled>You already own this game</button>
                    </div>
                )}
        </div>
    )
}
export default Game
