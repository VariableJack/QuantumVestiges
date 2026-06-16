import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { get } from 'lodash'

import { useLazyGetGamesQuery } from '../../redux/api/mediaEndpoints'
import { addInfoMessage, removeInfoMessage, addErrorMessage } from '../../redux/api/globalSlice'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'

import '../../styles/App.css'

const Franchise = () => {
    const dispatch = useDispatch()
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const franchiseId = parseInt(params.get('franchiseId'))
    const { franchises } = useSelector(state => state.globalReducer)
    const [franchise, setFranchise] = useState({ franchiseId: -1, franchiseName: 'Loading...' })

    useEffect(() => {
        if (!franchiseId) {
            window.location.href('/not-found')
        }
    }, [])

    const [triggerGetGames, { isLoading, isError, error }] = useLazyGetGamesQuery()

    const [games, setGames] = useState([])
    const getGames = async () => {
        try {
            const response = await triggerGetGames({ franchise: franchiseId }).unwrap()
            setGames([...response])
        } catch (e) {}
    }
    useEffect(() => {
        if (franchises.length) {
            setFranchise(franchises.find(franchise => franchise.franchiseId === franchiseId))
            getGames()
        }
    }, [franchises])
    useEffect(() => {
        const messageId = `gamesFetchError-${franchiseId}`
        if (isError) {
            dispatch(
                addErrorMessage({
                    title: `Failed to fetch games for ${franchise.franchiseName}`,
                    description: get(error, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: messageId,
                }),
            )
        }
    }, [isError])

    useEffect(() => {
        const messageId = `gamesFetchInfo-${franchiseId}`
        if (isLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Fetching games...',
                    description: `Please wait while the system retrieves the games for ${franchise.franchiseName}`,
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [isLoading])
    return (
        <div>
            {franchise.franchiseName}
            <br />
            {(isLoading && <h2>Loading...</h2>) || <></>}
            {games && (
                <div>
                    <b>Games:</b>
                    {games.map(game => (
                        <div>
                            Game {game.game_id}&nbsp;
                            <a href={`/game?&gameId=${game.gameId}`}>{game.gameName}</a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Franchise
