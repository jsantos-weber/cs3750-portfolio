import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const MessageComponent = () => {
  const [messages, setMessages] = useState([]);
  const socket = socketIOClient('http://localhost:5000'); // Replace with your server URL

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('message', data => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const message = prompt('Enter your message:');
    if (message) {
      // Send the message to the server
      socket.emit('message', message);
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessageComponent;