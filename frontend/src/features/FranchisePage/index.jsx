import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';

import '../../styles/App.css';

import {
    useLazyGetGamesInFranchiseQuery
} from '../../redux/api/mediaEndpoints'

const Franchise = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const franchiseId = parseInt(params.get("franchiseId"));
    const { franchises } = useSelector((state) => state.globalReducer)
    const [franchise, setFranchise] = useState({franchise_id: -1, franchise_name: 'Loading...'})
    useEffect(() => {
        if (franchises.length) {
            setFranchise(franchises.find((franchise) => franchise.franchise_id === franchiseId))
        }
    }, [franchises])
    
    const [triggerGetGames] = useLazyGetGamesInFranchiseQuery()
    
    const [games, setGames] = useState([])
    const getGames = async() => {
        const response = await triggerGetGames({franchise: franchiseId}).unwrap()
        setGames([...response])
    }
    useEffect(() => {
        getGames()
    }, [])
    return (
        <div>{franchise.franchise_name}
        <br />
        <b>Games:</b>
            {games.map((game) => {
                console.debug(game)
                return (<div>Game {game.game_id}
                    <a href={`/game?game-id=${game.game_id}`}>{game.name}</a>
                </div>)
            })}
        </div>
    )
}
export default Franchise