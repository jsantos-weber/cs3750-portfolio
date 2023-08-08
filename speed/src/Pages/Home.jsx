import SpeedNavbar from "../components/SpeedNavbar";
import HelloWorld from "../components/HelloWorld";
import Deck from "../components/Deck";
import Chat from "../components/Chat";
import Gamelobby  from "../components/Gamelobby";
import MessageComponent from "../components/MessageComponent";

function HomePage() {
    return (
    <>
    <SpeedNavbar />
    <HelloWorld />
    <Deck />
    {/* <Chat /> */}
    <Gamelobby/>
    </>
  );
}

export default HomePage;
