import {React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Chat = () => 
{
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://localhost:4000/Chat')
    .then((response) => {setData(response.data);})
    .catch((error) => {console.error('Error fetching data from API:', error);
});}, []);

  return (
    <div>
      {/* Display your data here */}
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default Chat;

