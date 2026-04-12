import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import '../../styles/App.css'

import { useGetFranchisesQuery, useLazyGetGamesQuery } from '../../redux/api/mediaEndpoints'

const Franchise = () => {
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const franchiseId = parseInt(params.get('franchiseId'))
    const { franchises } = useSelector(state => state.globalReducer)
    const [franchise, setFranchise] = useState({ franchiseId: -1, franchise_name: 'Loading...' })

    useEffect(() => {
        if (!franchiseId) {
            window.location.href('/not-found')
        }
    }, [])

    useEffect(() => {
        if (franchises.length) {
            setFranchise(franchises.find(franchise => franchise.franchiseId === franchiseId))
        }
    }, [franchises])

    const [triggerGetGames, { isLoading }] = useLazyGetGamesQuery()

    const [games, setGames] = useState([])
    const getGames = async () => {
        const response = await triggerGetGames({ franchise: franchiseId }).unwrap()
        setGames([...response])
    }
    useEffect(() => {
        getGames()
    }, [])
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
                            <a
                                href={`/game?franchiseId=${franchise.franchiseId}&gameId=${game.gameId}`}
                            >
                                {game.gameName}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Franchise
