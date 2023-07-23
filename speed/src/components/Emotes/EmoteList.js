import React from "react";
import EmoteButton from "./EmoteButton";

const EmoteList = ({ emotes, onEmoteClick }) => {
  console.log(emotes);
  console.log("Here")
  return (
    <div>
      <h2>Choose an emote:</h2>
      {emotes.map((emote) => (
        <EmoteButton key={emote.id} emote={emote} onEmoteClick={onEmoteClick} />
      ))}
    </div>
  );
};

export default EmoteList;
