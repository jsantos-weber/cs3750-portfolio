import React from "react";

const EmoteButton = ({ emote, onEmoteClick }) => {
  console.log("LOG--------------------------" + emote.emoji);
  return (
    <button onClick={() => onEmoteClick(emote.id)}>
      {emote.name} {emote.emoji}
    </button>
  );
};

export default EmoteButton;
