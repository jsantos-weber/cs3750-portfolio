import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
import http from 'http'
import { Server as socketIOServer } from 'socket.io';


const app = express();
app.use(express.json());
app.use(cors(
  {
    origin: "http://localhost:3000", //telling our server which url/server is gonna be makiing calls to our socket.io server
    credentials: true 
  }));

const PORT = process.env.PORT || 4000;
const PORT2 = process.env.PORT || 5000;

const server = http.createServer(app); 
const io = new socketIOServer(server, 
{ cors: { origin: "http://localhost:3000", credentials: true },});

const emotes = 
[
  { id: 1, name: 'Happy', emoji: '😄' },
  { id: 2, name: 'Sad', emoji: '😢' },
  { id: 3, name: 'Fireworks', emoji: '🎆' },
  { id: 4, name: 'Slot Machine', emoji: '🎰' },
  { id: 5, name: 'Joker', emoji: '🃏' },
  { id: 6, name: 'Pointing Up', emoji: '☝️' },
  { id: 7, name: 'Skull', emoji: '💀' },
  { id: 8, name: 'Nerd', emoji: '🤓' },
  { id: 9, name: 'Eyes', emoji: '👀' },
];

let users = [];
let lobbyRooms = [];

io.on('connection', (socket) => 
{
  
  socket.on('emote', (emoteId) => {
    
    const emote = emotes.find((e) => e.id === emoteId);
    if (emote) {
      console.log(emote);
      io.emit('emote', emote); // Broadcast the emote to all connected clients
    }
  });

  socket.emit('message', "Welcome to the chat room!");

  socket.on("joinRoom", (roomID) => 
  {
    // Join the new room
    socket.join(roomID);
    socket.roomID = roomID;

    // Notify the user that they've joined the room
    socket.emit("message", `You have joined room ${roomID}`);

    // Broadcast to others in the room that a new user has joined
    socket.to(roomID).emit("message", "A new user has joined the room");

    // Save the user in the users array
    users.push({ socketId: socket.id, roomID });
  });

  /****** Game Lobby Sockets *******/
    io.emit('lobby-rooms',lobbyRooms);

    //When player joins a room event (selects a button)
    socket.on('join-room', (roomIndex) => 
    {
      //If player has alredy joined room, log player has already joined and do nothing else.
      if(socket.id === lobbyRooms[roomIndex].player1 || socket.id === lobbyRooms[roomIndex].player2) {console.log(socket.id+" has already joined");}
      else if(lobbyRooms[roomIndex].playerCount <= 0) //if player joining is first to join room
      {
        lobbyRooms[roomIndex].playerCount++;  //increment player count
        lobbyRooms[roomIndex].player1 = socket.id; //set socketid as player 1.
      }
      else if(lobbyRooms[roomIndex].playerCount < 2) //If joining player is 2nd player (lobby is now full) Initiate game upon 2nd player joining
      {
        lobbyRooms[roomIndex].playerCount++;  //increment player count
        lobbyRooms[roomIndex].player2 = socket.id; //set socketid as player 2.
        socket.emit('Show-readyBtn')//sending back to sender to show 'ready up' btn
        socket.to(lobbyRooms[roomIndex].player1).emit('Show-readyBtn'); //emit to 1st player to show 'ready up' btn
      }
      else {console.log("lobbyroom[" + roomIndex + "] is at maximum players (2/2)");} //If Lobby is already full. log and do nothing else
      
      console.log(lobbyRooms); //Log lobby rooms
      io.emit('lobby-rooms',lobbyRooms);//notify all clients of updated lobby-room info
    });

    //When user presses ready-up button
    socket.on("ready-up", (currRoomIndex) => 
    {      
      io.to(lobbyRooms[currRoomIndex].player1).emit('is-ready'); //emit to 1st player that someone has clicked 'ready-up'
      io.to(lobbyRooms[currRoomIndex].player2).emit('is-ready'); //emit to 2nd player that someone has clicked 'ready-up'
    });

    //When user adds a game 
    socket.on('add-game', () => 
    {
      lobbyRooms.push({key: lobbyRooms.length, playerCount: 0, player1: 'null', player2: 'null', playersReady: 0, });//Add lobby to lobbyRooms array   
      io.emit('lobby-rooms',lobbyRooms);
    });

    //When users press start game button
    socket.on("message", (message) => {socket.to(socket.roomID).emit("message", message);});
    socket.on('disconnect', () => 
    {
      console.log('User disconnected', socket.id);
      
      lobbyRooms.forEach(room => 
      {
        if(room.player1 == socket.id)
          io.to(room.player2).emit('player-disconnected');
        else if (room.player2 == socket.id)
          io.to(room.player1).emit('player-disconnected');
      });
    });
});

// API endpoint to get data
app.get('/Chat', async (req, res) => 
{
  let collection = await db.collection("jsonExample");
  let results = await collection.find().toArray();
  res.send(results).status(200);
});

server.listen(PORT2, () => {
  console.log(`WebSocket server is running on port ${PORT2}`);
});

function saltShaker(length) {
  let salt = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    salt += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return salt;
}

// function generateDeck() {
//   const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
//   const ranks = [
//     "2",
//     "3",
//     "4",
//     "5",
//     "6",
//     "7",
//     "8",
//     "9",
//     "10",
//     "Jack",
//     "Queen",
//     "King",
//     "Ace",
//   ];

//   // Create the deck by combining suits and ranks
//  const deck = [];
//   for (const suit of suits) {
//     for (const rank of ranks) {
//       deck.push({ suit, rank });
//     }
//   }

//   // Shuffle the deck 
//   for (let i = deck.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [deck[i], deck[j]] = [deck[j], deck[i]];
//   }

//   return deck;
// }

// let player1Pile = [];
// let player2Pile = [];
// function splitDeck(deck) {
//   // // Split the deck into 4 piles (arrays)
//   // const piles = [[], [], [], []];
//   // for (let i = 0; i < deck.length; i++) {
//   //   const pileIndex = i % 4;
//   //   piles[pileIndex].push(deck[i]);
//   // }
//   // // 2 5-card piles for players
//   //   let player1 = [];
//   //   let player2 = [];
//   // // 2 15-card piles for the piles
//   //   let player1Side = [];
//   //   let player2Side = [];
//   // // 2 1-card piles
//   //   let player1Down = [];
//   //   let player2Down = [];
//   // // 2 5-card piles
//   // let player1Stuck = [];
//   // let player2Stuck = [];

//   // player1 = deck.slice(0, 5);
//   // player2 = deck.slice(5, 10);
//   // player1Side = deck.slice(10, 25);
//   // player2Side = deck.slice(25, 40);
//   // player1Down = deck.slice(40, 41);
//   // player2Down = deck.slice(41, 42);
//   // player1Stuck = deck.slice(42, 47);
//   // player2Stuck = deck.slice(47, 52);
//   // const piles = ([[player1], [player2], [player1Side], [player2Side], [player1Down], [player2Down], [player1Stuck], [player2Stuck]])
//   // return piles;

//   const piles = [[], [], [], [], [], [], [], []]; // 8 piles in total

//   // Distribute 4 piles with 5 cards each
//   for (let i = 0; i < 4; i++) {
//     piles[i] = deck.slice(i * 5, i * 5 + 5);
//   }

//   // Distribute 2 piles with 15 cards each
//   piles[4] = deck.slice(20, 35);
//   piles[5] = deck.slice(35, 50);

//   // Distribute 2 piles with 1 card each
//   piles[6] = deck.slice(50, 51);
//   piles[7] = deck.slice(51, 52);

//   // Set the piles for each player
//   player1Pile = piles.slice(0, 4).concat(piles[6], piles[7]);
//   player2Pile = piles.slice(4, 6).concat(piles[6], piles[7]);
//   return player1Pile, player2Pile;
// }

// GET Requests
app.get("/", (req, res) => res.send("Hello, World!"));
app.get("/salt", (req, res) => res.send(saltShaker(8)));

// app.get("/deck", (req, res) => {
//   const deck = generateDeck();
//   splitDeck(deck);
//   res.json({
//     player1Pile,
//     player2Pile,
//   });
// });

// POST Requests
app.post("/loginWithSalt", async (req, res) => {
  const username = req.body.username;

  let collection = await db.collection("users");
  let results = await collection.find({ username: username });
  console.log();
  results.forEach((document) => {
    let tempSalt = document.salt;
    res.send(tempSalt);
  });
});

app.post("/account", async (req, res) => {
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    type: req.body.type,
    salt: req.body.salt,
  };
  let collection = await db.collection("users");
  let result = await collection.insertOne(newUser);
  res.send(result);
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let collection = await db.collection("users");
  let results = await collection.find({ username: username }).toArray();

  results.forEach((document) => {
    let storedUsername = document.username;
    let storedPassword = document.password;
    if (username === storedUsername && password === storedPassword) {
      res.send({ loggedIn: true }).status(200);
    } else {
      res.send({ loggedIn: false }).status(200);
    }
  });
});

app.post("/hello", async (req, res) => {
  const message = req.body.message;
  
  let collection = await db.collection("hello");
  let results = await collection.find({ message: message }).toArray();
  
  results.forEach((document) => {
    let storedMessage = document.message;
    
    if (JSON.stringify(message) === JSON.stringify(storedMessage)) {
      res.send(JSON.stringify(message)).status(200);
    } else {
      res.send("Did not work").status(200);
    }
  });
});


// Code for Shuffling and Dealing Cards
// Initialize the card deck
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
};

const shuffle = (array) => {
  // Function to shuffle an array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

let deck = createDeck();

// Shuffle the deck on server startup
deck = shuffle(deck);

// Piles for each player
let player1Piles = [];
let player2Piles = [];

// Function to reset the piles
const resetPiles = () => {
  player1Piles = [];
  player2Piles = [];
};

// Distribute cards to each player into the specified piles
const distributeCards = () => {
  // Reset the piles first
  resetPiles();

  const piles = [[], [], [], [], [], [], [], []]; // 8 piles in total

  // Distribute 4 piles with 5 cards each
  for (let i = 0; i < 4; i++) {
    piles[i] = deck.slice(i * 5, i * 5 + 5);
  }

  // Distribute 2 piles with 15 cards each
  piles[4] = deck.slice(20, 35);
  piles[5] = deck.slice(35, 50);

  // Distribute 2 piles with 1 card each
  piles[6] = deck.slice(50, 51);
  piles[7] = deck.slice(51, 52);

  // Set the piles for each player
  player1Piles = piles.slice(0, 4).concat(piles[6], piles[7]);
  player2Piles = piles.slice(4, 6).concat(piles[6], piles[7]);

  
};

// Start the game and distribute cards
distributeCards();

// Endpoint to deal cards to each player
app.get('/deal-cards', (req, res) => {
  distributeCards();
  res.json({
    player1Piles,
    player2Piles,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


