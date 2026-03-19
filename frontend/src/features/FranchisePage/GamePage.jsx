import React from 'react';

import { useLocation } from 'react-router-dom';

import '../../styles/App.css';

const Game = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const franchiseId = params.get('franchiseId');
    const gameId = params.get('gameId');
    return (<div>{franchiseId} - {gameId}</div>)
}
export default Game