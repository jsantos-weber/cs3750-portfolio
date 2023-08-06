import {React, useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Gamelobby()
{
    const[lobbyRooms, setLobbyRooms] = useState([]);
    const[displayIndex, setDisplayIndex] = useState(0);
    const[playersReady, setPlayersReady] = useState(0);
    const[roomIndex, setRoomIndex] = useState(-1);
    const[disableReadyBtn, setDisableReadyBtn] = useState(false);

    socket.on('lobby-rooms', (lobbyArrays) => {setLobbyRooms(lobbyArrays);}); //Action listener for lobby-room count
    socket.on('Show-readyBtn', () => {setDisplayIndex(2)}); //Action listener to show ready-up button
    socket.on('is-ready', () => { setPlayersReady(playersReady+1); if(playersReady+1 === 2){setDisplayIndex(3)} }); //Action listeners for when either player readys up

    const handleCreateGameBtn = () => { socket.emit('add-game'); } //Notify backend to create game

    const handleJoinRoomBtn = ({i}) => {socket.emit("join-room", i); setRoomIndex(i); setDisplayIndex(1);} //Send to backend that player has chosen to join a game, i = index of game.

    const handleReadyUp = () => { socket.emit("ready-up", roomIndex); setDisableReadyBtn(true);}//Do this for users upon pressing 'Ready Up' button

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

    //Function that determines what is displayed to players
    function showDisplay()
    {
        //0 = show game lobbies
        if(displayIndex === 0) 
        { 
            return (
            <div>
                <h3>Total Game Lobbies: {lobbyRooms.length}</h3>
                <button onClick={handleCreateGameBtn}>+ Create Lobby</button>
                <div>{renderButtons()}</div>
            </div>);
        }
        //1 = Waiting for opponent. Display for waiting
        else if(displayIndex === 1) 
            return(<div><h4>You have Joined Game Lobby : {roomIndex + 1}</h4><h5>Please wait for an opponent to join..</h5></div>);
        //2 = In game-lobby waiting for players to ready up
        else if(displayIndex === 2)
            return(<><div><button disabled={disableReadyBtn} onClick={handleReadyUp}>{disableReadyBtn ? "Waiting For Opponent" : "Ready Up"}</button>{playersReady}/2 Players ready</div></>);
        //3 = Game has Started
        else if(displayIndex == 3)
            return <><h2>GAME HAS BEGUN! Add Game Component Here Timer should execute now or something....</h2></>;
    }
    return showDisplay();
}

