import axios from "axios";

const Deck = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:4000/deck")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <button onClick={handleSubmit}>Cards Here</button>
    </div>
  );
};

export default Deck;
