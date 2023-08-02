import "./App.css";
import HelloWorld from "./components/HelloWorld";
import SpeedNavbar from "./components/SpeedNavbar";
import Deck from "./components/Deck";
import Emotes from "./components/Emotes/Emotes";
import Chat from "./components/Chat.js";
import { Gamelobby } from "./components/Gamelobby";
import MessageComponent from "./components/MessageComponent";

function App() {
  return (
    <div>
      <SpeedNavbar />
      <HelloWorld />
      <Deck />
      <Emotes />
      <Chat />
      <Gamelobby/>
    </div>
  );
}

export default App;
