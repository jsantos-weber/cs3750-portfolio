import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Emotes = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socket.on("emote", handleEmoteReceived);

    // Clean up the event listener 
    return () => {
      socket.off("emote", handleEmoteReceived);
    };
  }, []);

  // Function to send an event to the backend when a button is clicked
  const handleButtonClick = (emoteId) => {
    const emotes = [
      { id: 1, name: 'Happy', emoji: '😄' },
      { id: 2, name: 'Sad', emoji: '😢' },
     
    ];

    const emote = emotes.find((e) => e.id === emoteId);
    if (emote) {
      console.log(`Button ${emote.name} Clicked - Emoji: ${emote.emoji}`);
      
      socket.emit('emote', emoteId); // Emit the emote ID to the backend
      setMessages((prevMessages) => [...prevMessages, emote]);
    }
  };
  const handleEmoteReceived = (emote) => {
    setMessages((prevMessages) => [...prevMessages, emote]);
  };

  return (
    <div>
      <h1>Emotes</h1>
      <div className="chat-container">
        <div className="messages" id="messages">
          {messages.map((message, index) => (
            <div key={index}>{`${message.name}: ${message.emoji}`}</div>
          ))}
        </div>
      </div>
      <div>
        <button onClick={() => handleButtonClick(1)}>Happy</button>
        <button onClick={() => handleButtonClick(2)}>Sad</button>
      </div>
    </div>
  );
};
export default Emotes;