import {React, useState, useEffect } from 'react';
import io from "socket.io-client";
import axios from 'axios';
import DeckPage from '../Pages/Deck';

const socket = io("http://localhost:5000");

export default function Gamelobby()
{
<<<<<<< Updated upstream
    const[countdown, setCountdown] = useState(3);
    const[lobbyRooms, setLobbyRooms] = useState([]);
    const[displayIndex, setDisplayIndex] = useState(0);
    const[playersReady, setPlayersReady] = useState(0);
    const[roomIndex, setRoomIndex] = useState(-1);
    const[disableReadyBtn, setDisableReadyBtn] = useState(false);
    const[player1Cards, setPlayer1Cards] = ([]);
    const [player2Cards, setPlayer2Cards] = ([]);

=======
  const[countdown, setCountdown] = useState(3);
  const[lobbyRooms, setLobbyRooms] = useState([]);
  const[displayIndex, setDisplayIndex] = useState(0);
  const[playersReady, setPlayersReady] = useState(0);
  const[roomIndex, setRoomIndex] = useState(-1);
  const[disableReadyBtn, setDisableReadyBtn] = useState(false);
  const[dealtHand,setDealtHand] = useState([]);
  
>>>>>>> Stashed changes
    socket.on('lobby-rooms', (lobbyArrays) => {setLobbyRooms(lobbyArrays);}); //Action listener for lobby-room count
    socket.on('Show-readyBtn', () => {setDisplayIndex(2)}); //Action listener to show ready-up button
    socket.on('is-ready', () => { setPlayersReady(playersReady+1); if(playersReady+1 === 2)
    {
      socket.emit('game-started',roomIndex);
      setDisplayIndex(3);
    }}); //Action listeners for when either player readys up

    //on dealt hand set dealt hand to display
    socket.on('dealthand', (playerHand) => {setDealtHand(playerHand); console.log("playerhand: " + playerHand[0]);});

    socket.on('player-disconnected', () => 
    {
      setDisplayIndex(0);
      setPlayersReady(0);
      setRoomIndex(-1);
      setDisableReadyBtn(false);
    });

    socket.on('')
    

    const handleCreateGameBtn = () => { socket.emit('add-game'); } //Notify backend to create game

    const handleJoinRoomBtn = ({i}) => {socket.emit("join-room", i); setRoomIndex(i); setDisplayIndex(1);} //Send to backend that player has chosen to join a game, i = index of game.

    const handleReadyUp = () => { socket.emit("ready-up", roomIndex); setDisableReadyBtn(true);}//Do this for users upon pressing 'Ready Up' button

    const renderButtons = () => //displays all buttons.
    {
        const buttons = [];
        for (let i = 0; i < lobbyRooms.length; i++) 
            buttons.push(<div><button key={i} onClick={ () => handleJoinRoomBtn({i})}> + Join Lobby Room {i + 1} </button> {lobbyRooms[i].playerCount}/2 Players</div>);
        
        return buttons;
    };

    useEffect(() => {
        let interval;
    
        if (displayIndex === 3 && countdown > 0) {
          interval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }, 1000);
        }
    
        return () => clearInterval(interval);
      }, [displayIndex, countdown]);
    
      useEffect(() => {
        if (countdown === 0 && displayIndex === 3) {
          // The countdown has finished, do something when the game starts
          // For example, start the game or navigate to the game screen
          console.log("Game Started!");
          socket.emit('game-to-start', roomIndex);
         socket.on("game-started", (player1Piles, player2Piles) => {
          console.log(player1Piles)
           //setPlayer1Cards(player1Piles);
           console.log(player1Cards);
           //setPlayer2Cards(player2Piles);
         });
          // Add your code to start the game here
        }
      }, [countdown, displayIndex]);

    //Function that determines what is displayed to players
    function showDisplay()
    {
        console.log("lobbyroom1: " +  lobbyRooms[roomIndex]);
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
<<<<<<< Updated upstream
        if (displayIndex === 3) {
            return (
              <div>
                <h1>
                  {countdown === 0
                    ? "Start"
                    : countdown}
                </h1>
                {/* Add additional UI components for the game here */}
              </div>
            );
          }
    }
=======
        if (displayIndex === 3) 
        {
          return <> returned nothing </>;
        //   return (<div>{Array.isArray(piles.player1Piles) && piles.player1Piles.length > 0 ? (
          
        //     piles.player1Piles.map((pile, pileIndex) => (
        //     <div key={pileIndex}>
        //       Pile {pileIndex + 1}:{" "}
        //       {Array.isArray(pile) ? (
        //         pile.map((card, cardIndex) => (
        //           <span key={cardIndex}>
        //             {card.rank} of {card.suit} |{" "}
        //           </span>
        //         ))
        //       ) : (
        //         <span>Invalid pile data</span>
        //       )}
        //     </div>
        //   ))
        // ) : (
        //   <div>No piles available for Player 1</div>
        // )};</div>);
        }
        //4 = If display lobby is ready to display cards display correct deck to correct player
      }
>>>>>>> Stashed changes
    return showDisplay();
}

