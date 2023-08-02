import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sha256 from "js-sha256";
import SpeedNavbar from "../components/SpeedNavbar";

const Login = () => {
  // state
  const [username, setUsername] = useState("");
  const [passwordKeyVal, setPasswordKeyVal] = useState("");
  let type = "Admin";
  let loggedIn = false;
  const [saltResponse, setSaltResponse] = useState("");

  //prepare objects
  const navigate = useNavigate();

  async function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPasswordKeyVal(e.target.value);
  }
  function hasher(word) {
    const hashed = sha256(word + saltResponse).toString();
    return hashed;
  }
  // code
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/loginWithSalt", {
        username: username,
      })
      .then((response) => {
        // Handle the response data
        console.log(response.data);
        setSaltResponse(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
    console.log(saltResponse);
    const hashed = hasher(passwordKeyVal);

    const user = {
      username: username,
      password: hashed,
      salt: saltResponse,
      type: type,
    };
    axios
      .post("http://localhost:4000/login", user)
      .then((res) => {
        console.log(
          "The express server response is: " + JSON.stringify(res.data)
        );

        localStorage.setItem("loggedIn", res.data.loggedIn);

        if (res.data.loggedIn) {
          console.log("Logged in!");
          // If they are logged in, this will navigate them to the home page
          navigate("/", { replace: true });
        }
        if (!res.data.loggedIn) {
          alert("Passwords don't match!");
        }
      })
      .catch((err) => {
        console.log(err.message);
        localStorage.setItem("loggedIn", false);
      });
  };
  // return html
  return (
    <div>
      <SpeedNavbar />
      <form onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleUsernameChange}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handlePasswordChange}
        ></input>
        <br />
        <button type="Submit">Submit username</button>
      </form>
    </div>
  );
};

export default Login;
