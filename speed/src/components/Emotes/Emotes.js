import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import EmoteList from "./EmoteList";

const ENDPOINT = "http://localhost:5000";

const Emotes = () => {
  const [emotes, setEmotes] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("emote", (emote) => {
      // Update the emotes state when a new emote is received from the server
      setEmotes((prevEmotes) => [...prevEmotes, emote]);
    });

    return () => {
      socket.disconnect(); // Cleanup the socket on unmount
    };
  }, []);

  const handleEmoteClick = (emoteId) => {
    // Send the selected emote ID to the backend server
    const socket = socketIOClient(ENDPOINT);
    socket.emit("emote", emoteId);
  };

  return (
    <div>
      <h1>Emote App</h1>
      <EmoteList emotes={emotes} onEmoteClick={handleEmoteClick} />
    </div>
  );
};

export default Emotes;