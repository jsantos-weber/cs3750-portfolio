import axios from "axios";
import { useState } from "react";

const HelloWorld = () => {
    const [display, setDisplay] = useState(false);
    const [message, setMessage] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:4000/hello").then((response) => {
            console.log(response.data);
             setMessage(response.data);
            setDisplay(true);
        }).catch((error) => {
            console.log(error);
        })
    }
    
    return (
        <div>
            <button onClick={handleSubmit}>Click Me</button>
            {display && <p>{message}</p>} 
        </div>
    )
}

export default HelloWorld;