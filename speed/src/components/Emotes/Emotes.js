import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Emotes = () => {
  const [emotes, setEmotes] = useState([]);

  useEffect(() => {
    // Listen for the 'emoteUpdate' event from the backend
    socket.on("initialEmotes", (emote) => {
      console.log(emote);
      setEmotes((prevEmotes) => [...prevEmotes, emote]);
    });

    socket.on("emote", (emote) => {
      setEmotes((prevEmotes) => [...prevEmotes, emote]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      //socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Emotes</h1>
      <ul>
        {emotes.map((emote, index) => (
          <li key={index}>{emote}</li>
        ))}
      </ul>
    </div>
  );
};

export default Emotes;
