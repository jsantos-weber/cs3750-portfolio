import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

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

// const suits = ["♠", "♣", "♥", "♦"];
// const ranks = [
//   "A",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "9",
//   "10",
//   "J",
//   "Q",
//   "K",
// ];
// function generateDeck() {
//    const deck = [];

//    for (let suit of suits) {
//      for (let rank of ranks) {
//        deck.push({ suit, rank });
//      }
//    }

//    // Shuffle the deck using Fisher-Yates algorithm
//    for (let i = deck.length - 1; i > 0; i--) {
//      const j = Math.floor(Math.random() * (i + 1));
//      [deck[i], deck[j]] = [deck[j], deck[i]];
//    }

//    return deck;
// }

// app.get("/deck", (req, res) => {
//   const deck = generateDeck(); // Generate the deck of cards

//   // Return the deck as the API response
//   res.json(deck);
// });

app.get("/", (req, res) => res.send("Hello, World!"));
app.get("/salt", (req, res) => res.send(saltShaker(8)));

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
