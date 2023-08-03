import React, { useState, useEffect } from "react";
import axios from "axios";
import Emotes from "./Emotes/Emotes";

const HelloWorld = () => {
  const [display, setDisplay] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(3);
  const [showTimer, setShowTimer] = useState(false);

  let hello_message = "Hello World!";

  useEffect(() => {
    if (showTimer && timer > 0) {
      const countdownInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    } else if (timer === 0 && showTimer) {
      setShowTimer(false);
      setMessage("Go!");
      setDisplay(true);
    }
  }, [showTimer, timer]);

  const handleStartTimer = () => {
    setShowTimer(true);
    setTimer(3);
    setDisplay(false);
    setMessage("");
  };

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
      {showTimer ? <p>{timer > 0 ? timer : "Go"}</p> : null}

      <button onClick={handleStartTimer} disabled={showTimer}>
        {showTimer ? "Wait..." : "Click Me"}
      </button>

      <Emotes />

      {display && <p>{message}</p>}
    </div>
  );
};

export default HelloWorld;
