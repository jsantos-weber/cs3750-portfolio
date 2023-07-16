import "./App.css";
import HelloWorld from "./components/HelloWorld";
import SpeedNavbar from "./components/SpeedNavbar";
import Deck from "./components/Deck";
import Emotes from "./components/Emotes/Emotes"

function App() {
  return (
    <div>
      <SpeedNavbar />
      <HelloWorld />
      <Deck />
      <Emotes />
    </div>
  );
}

export default App;
