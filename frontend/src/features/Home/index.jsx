import React from 'react';

import '../../styles/App.css';
import { hostname, port } from '../../shared/constants';

const Home = () => {
    return (<div>
        <h1>Welcome to Gamer's Paradise!</h1>
        <h2>What is this?</h2>
        <ul>
            <li>Gamer's Paradise aims to provide a single portal to all your favorite genres of games, such as the following</li>
            <ul>
                <li>A Trading Card Game (TCG)</li>
                <li>Various styles of Role Playing Games (RPGs), single player and multiplayer, all of which are open-world</li>
                <li>If you have any suggestions for new features for the games we provide, feel free to <a href={`${hostname}:${port}/game-request`}>request it at this link!</a></li>
                <li>More to come! If you have any suggestions for game ideas that are missing, feel free to <a href={`${hostname}:${port}/game-request`}>request one at this link!</a></li>
            </ul>
            <li>We also provide a safe place to chat with other players to allow a sense of community to foster!</li>
        </ul>
        <h2>By using this website, you must follow these outlined rules. Any offenses are subject to punishments as explicitly stated by the rules. Appeals may be allowed depending on the relevant offense.</h2>
        <ol>
            <li>In order to provide a safe community, no hate spech of <b><i>any</i></b> kind is allowed on any chat forum, private or public.</li>
            <ul>
                <li>The first offense will result in a 30-day ban</li>
                <li>The second offense will result in a 1-year ban, regardless of time since the first offense</li>
                <li>The third offense will result in a permanent ban, regardless of time since the first offense</li>
            </ul>
            <li><b><i>Any</i></b> threats of violence, physical, emotional or otherwise, are never allowed and will result in an <b><i>immediate permanent ban without appeal</i></b>.</li>
            <li>Similary, <b><i>any</i></b> action deemed as harassment or if anyone reports to feel unsafe or uncomfortable with your action or words, will result in an <b><i>immediate permanent ban</i></b>.</li>
            <ul>
                <li>This may be appealed conditionally and the ban lifted, depending on exactly what was done or said.</li>
                <li>If you say or perform another action that made someone feel unsafe and any reports have been confirmed to be accurate, the ban <b>will be re-applied without appeal</b></li>
            </ul>
        </ol>
        
    </div>);
}

export default Home;