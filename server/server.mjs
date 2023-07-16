import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Helper Functions

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

  // Shuffle the deck using Fisher-Yates shuffle
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
