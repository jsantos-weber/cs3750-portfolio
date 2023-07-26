import "./App.css";
import HelloWorld from "./components/HelloWorld";
import SpeedNavbar from "./components/SpeedNavbar";
import Deck from "./components/Deck";
import Emotes from "./components/Emotes/Emotes";
import Chat from "./components/Chat.js";

function App() {
  return (
    <div>
      <SpeedNavbar />
      <HelloWorld />
      <Deck />
      <Emotes />
      <Chat />
    </div>
  );
}

export default App;
