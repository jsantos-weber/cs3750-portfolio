import {React, useState, useEffect } from 'react';
import io from "socket.io-client";
import axios from "axios";
import MessageComponent from './MessageComponent';

const socket = io("http://localhost:5000");

export default function Gamelobby()
{
    const[lobbyRooms, setLobbyRooms] = useState([]);
    const [activeGame, setActiveGame] = useState(false);
    const[gameStarted, setGameStarted] = useState(false);

    socket.on('lobby-rooms', (lobbyArrays) => {setLobbyRooms(lobbyArrays);}); //Action listener fo lobby-rooms
    socket.on('start-game', () => {console.log("user has received startgame event"); setActiveGame(true)}); //when server, allows to start game

    const handleCreateGameBtn = () => {socket.emit('add-game'); };//Notify backend to create game

    const handleJoinRoomBtn = ({i}) =>
    {
        socket.emit("join-game", i);
    } //Send to backend that player has chosen to join a game, i = index of game.

    const handleStartGameBtn = () => //Do this for users upon pressing 'start-game' button
    {
        setGameStarted(true);
        socket.emit('begin-game',socket.id);
    }

    const renderButtons = () => //displays all buttons.
    {
        const buttons = [];
        let showStartbtn = false; // Show start btn if user is in lobby and has 2 players
        for (let i = 0; i < lobbyRooms.length; i++) 
        {
            if(lobbyRooms[i].player1 === socket.id || lobbyRooms[i].player2 === socket.id) { showStartbtn = true;} //only allows players with correct socket.id's to see 'start-game' button
            buttons.push(<div><button key={i} onClick={ () => handleJoinRoomBtn({i})}> + Join Lobby Room {i + 1} </button> {lobbyRooms[i].playerCount}/2 Players</div>);
        }
        return buttons;
    };

    //Display for game lobbies
    function showGameLobbies()
    {
        return (
            <div>
            <h3>Total Game Lobbies: {lobbyRooms.length}</h3>
            <button onClick={handleCreateGameBtn}>+ Create Lobby</button>
                {<div>{renderButtons()}</div>}
            </div>
        );
    }

    //Display for start game
    function showGame()
    {
        if(gameStarted === true)
            return (<MessageComponent></MessageComponent>);
        else
            return(<button onClick={()=>handleStartGameBtn}>Start Game</button>);
    }

    return activeGame ? showGame() : showGameLobbies();
}

