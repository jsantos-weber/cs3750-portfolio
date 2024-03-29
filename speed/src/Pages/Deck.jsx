import React, { useState } from "react";
import axios from "axios";

function DeckPage(lobby, target) {
  const [piles, setPiles] = useState({ player1Piles: [], player2Piles: [] });
  const [loading, setLoading] = useState(false);
  const lobbyRoom = lobby[target];

  const handleDealCards = () => {
    setLoading(true);
    axios
      .get("http://localhost:4000/deal-cards")
      .then((response) => {
        setPiles(response.data);
        setLoading(false);
        console.log(lobbyRoom);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <>
      <div>
        <h2>Player 1 Piles</h2>
        {Array.isArray(piles.player1Piles) && piles.player1Piles.length > 0 ? (
          piles.player1Piles.map((pile, pileIndex) => (
            <div key={pileIndex}>
              Pile {pileIndex + 1}:{" "}
              {Array.isArray(pile) ? (
                pile.map((card, cardIndex) => (
                  <span key={cardIndex}>
                    {card.rank} of {card.suit} |{" "}
                  </span>
                ))
              ) : (
                <span>Invalid pile data</span>
              )}
            </div>
          ))
        ) : (
          <div>No piles available for Player 1</div>
        )}
        <h2>Player 2 Piles</h2>
        {Array.isArray(piles.player2Piles) && piles.player2Piles.length > 0 ? (
          piles.player2Piles.map((pile, pileIndex) => (
            <div key={pileIndex}>
              Pile {pileIndex + 1}:{" "}
              {Array.isArray(pile) ? (
                pile.map((card, cardIndex) => (
                  <span key={cardIndex}>
                    {card.rank} of {card.suit} |{" "}
                  </span>
                ))
              ) : (
                <span>Invalid pile data</span>
              )}
            </div>
          ))
        ) : (
          <div>No piles available for Player 2</div>
        )}
        <button onClick={handleDealCards}>Deal Cards</button>
        {loading && <div>Loading...</div>}
      </div>
      <div>{lobbyRoom}</div>
    </>
  );
}

export default DeckPage;
