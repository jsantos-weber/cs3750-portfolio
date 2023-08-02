import SpeedNavbar from "../components/SpeedNavbar";
import React, { useState } from "react";
import socketIOClient from "socket.io-client";

function PlayPage() {
  const [roomID, setRoomID] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const handleRoomChange = (event) => {
    setRoomID(event.target.value);
  };

  const handleJoinRoom = (event) => {
    event.preventDefault();
    const newSocket = socketIOClient("http://localhost:5000");
    newSocket.emit("joinRoom", roomID);

    // Update socket state once the connection is established and the user joins the room
    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    // Set up event listener for receiving messages
    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  };

  const handleMessageChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (socket) {
      socket.emit("message", inputMessage);
    }
    setInputMessage("");
  };

  return (
    <div className="App">
        <SpeedNavbar />
      <form onSubmit={handleJoinRoom}>
        <input
          type="text"
          value={roomID}
          onChange={handleRoomChange}
          placeholder="Enter Room ID"
        />
        <button type="submit">Join Room 1</button>
      </form>
      {roomID && socket && (
        <div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className="message">
                {message}
              </div>
            ))}
          </div>
          <form onSubmit={handleMessageSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={handleMessageChange}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
          <button>Ready</button>
        </div>
      )}
    </div>
  );
}

export default PlayPage;
