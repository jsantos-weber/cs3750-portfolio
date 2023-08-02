import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
import http from 'http'
import { Server as socketIOServer } from 'socket.io';
import { MongoClient } from 'mongodb';


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
];


//VARIABLES
let lobbyRooms = [];

io.on('connection', (socket) => //listening for a connection of type 'connection'
{
  console.log('User connected::', socket.id);
  socket.on('emote', (emoteId) => 
  {
    const emote = emotes.find((e) => e.id === emoteId);
    if (emote) {io.emit('emote', emote);}; // Broadcast the emote to all connected clients 
  });



    //GAME LOBBY//
    io.emit('lobby-rooms',lobbyRooms);
    //When player joins a game (selects a button)
    socket.on('join-game', (roomIndex) => 
    {
      //If 0 players are in lobby
      if(socket.id === lobbyRooms[roomIndex].player1 || socket.id === lobbyRooms[roomIndex].player2)
      {
        console.log(socket.id+" has already joined");
      }
      else if(lobbyRooms[roomIndex].playerCount <= 0) 
      {
        lobbyRooms[roomIndex].playerCount++;  //increment player count
        lobbyRooms[roomIndex].player1 = socket.id; //set socketid as player 1.
      }
      //Initiate game upon 2nd player joining
      else if(lobbyRooms[roomIndex].playerCount < 2)//if 1 player is alredy in lobby and you are adding 2nd player
      {
        lobbyRooms[roomIndex].playerCount++;  //increment player count
        lobbyRooms[roomIndex].player2 = socket.id; //set socketid as player 2.
        socket.emit('start-game')//sending back to sender a start-game event
        socket.to(lobbyRooms[roomIndex].player1).emit('start-game'); //emit to 1st player a start game event
      }
      else {console.log("lobbyroom[" + roomIndex + "] is at maximum players (2/2)");}
      
      console.log(lobbyRooms)
      io.emit('lobby-rooms',lobbyRooms);
    });

    //When user adds a game 
    socket.on('add-game', () => 
    {
      lobbyRooms.push({key: lobbyRooms.length, playerCount: 0, player1: 'null', player2: 'null'});//Add lobby to lobbyRooms array   
      io.emit('lobby-rooms',lobbyRooms);
    });

    socket.on('disconnect', () => { console.log('User disconnected::', socket.id); socket.disconnect()});
});


// API endpoint to get data
app.get('/Chat', async (req, res) => 
{
  let collection = await db.collection("jsonExample");
  let results = await collection.find().toArray();
  res.send(results).status(200);
});

app.get('/Gamelobby', async(req,res) => 
{
  res.send(lobbyCount).status(200);
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

function generateDeck() {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];

  // Create the deck by combining suits and ranks
 const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  // Shuffle the deck 
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function splitDeck(deck) {
  // Split the deck into 4 piles (arrays)
  const piles = [[], [], [], []];
  for (let i = 0; i < deck.length; i++) {
    const pileIndex = i % 4;
    piles[pileIndex].push(deck[i]);
  }

  return piles;
}

// GET Requests
app.get("/", (req, res) => res.send("Hello, World!"));
app.get("/salt", (req, res) => res.send(saltShaker(8)));

app.get("/deck", (req, res) => {
  const deck = generateDeck();
  const piles = splitDeck(deck);
  console.log("Pile 1:", piles[0]);
  console.log("Pile 2:", piles[1]);
  console.log("Pile 3:", piles[2]);
  console.log("Pile 4:", piles[3]);
  // Return the deck as the API response
  res.json(piles);
});

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

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


