import axios from "axios";
import { useState } from "react";


const HelloWorld = () => {
  const [display, setDisplay] = useState(false);
  const [message, setMessage] = useState("");
  let hello_message = "Hello World!";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      message: hello_message,
    };

   

    axios
      .post("http://localhost:4000/hello", {
        message: message,
      })
      .then((response) => {
        console.log(response.data);
        setMessage(response.data.message);
        setDisplay(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  
  return (
    <div>
      <button onClick={handleSubmit}>Click Me</button>
      
      {display && <p>{message}</p>}
    </div>
  );
};

export default HelloWorld;
