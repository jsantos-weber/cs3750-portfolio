import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Emotes = () => {
  useEffect(() => {
    // Clean up function for disconnection when the component unmounts.
    return () => {
      //socket.disconnect();
    };
  }, []);

  // Function to send an event to the backend when a button is clicked.
  const handleButtonClick = (emoteId) => {
    const emotes = [
      { id: 1, name: 'Happy', emoji: '😄' },
      { id: 2, name: 'Sad', emoji: '😢' },
      // Add more emotes as needed
    ];

    const emote = emotes.find((e) => e.id === emoteId);
    if (emote) {
      console.log(`Button ${emote.name} Clicked - Emoji: ${emote.emoji}`);
      socket.emit('emote', emoteId); // Emit the emote ID to the backend
    }
  };

  return (
    <div>
      <h1>Emotes</h1>
      <div>
        <button onClick={() => handleButtonClick(1)}>Happy</button>
        <button onClick={() => handleButtonClick(2)}>Sad</button>
        {/* Add more buttons for other emotes as needed */}
      </div>
    </div>
  );
};

export default Emotes;