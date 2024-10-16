import React from "react";
import SinglePokemon from "./SinglePokemon";
import "./pokemon.css";

export default function Party() {
  return (
    <div className="party-container">
      <SinglePokemon />
      <SinglePokemon />
      <SinglePokemon />
      <SinglePokemon />
      <SinglePokemon />
      <SinglePokemon />
    </div>
  );
}
