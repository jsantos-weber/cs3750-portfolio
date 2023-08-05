import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import HomePage from "./Pages/Home";
import HelloWorld from "./components/HelloWorld";
import SpeedNavbar from "./components/SpeedNavbar";
import Deck from "./components/Deck";
import Emotes from "./components/Emotes/Emotes";
import { Gamelobby } from "./components/Gamelobby";
import MessageComponent from "./components/MessageComponent";
import PlayPage from "./Pages/Play";
<<<<<<< Updated upstream
import DeckPage from "./Pages/Deck";

=======
>>>>>>> Stashed changes
function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
<<<<<<< Updated upstream
        <Route path="play" element={<PlayPage />} />
        <Route path="deck" element={<DeckPage />} />
=======
        <Route path="play" element={<PlayPage/>}/>
>>>>>>> Stashed changes
      </Routes>
    </div>
  );
}

export default App;
