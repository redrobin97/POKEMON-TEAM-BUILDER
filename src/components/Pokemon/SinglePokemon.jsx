import React from "react";
import { getPokemonById, getPokemonType } from "../api";
import { useState, useEffect } from "react";

export default function SinglePokemon() {
  //setters
  const [pokemon, setPokemon] = useState(null);
  const [pokemonId, setPokemonId] = useState("");
  const [pokeGen, setPokeGen] = useState("");
  const [pokeTypes, setPokeTypes] = useState([]);

  //get pokemon by id
  useEffect(() => {
    async function getPokemonData(id) {
      if (id > 0 && id < 1011) {
        try {
          const pokeData = await getPokemonById(id);
          setPokemon(pokeData);
        } catch (err) {
          console.log("Error setting current pokemon..");
        }
        return;
      } else console.log("Not a valid id");
    }

    if (pokemonId) {
      getPokemonData(pokemonId);
    }
  }, [pokemonId]);

  //get gen
  useEffect(() => {
    function getPokemonGeneration(pokemonId) {
      let generation = "";

      switch (true) {
        case pokemonId >= 1 && pokemonId <= 151:
          generation = "Generation 1 (Kanto)";
          break;
        case pokemonId >= 152 && pokemonId <= 251:
          generation = "Generation 2 (Johto)";
          break;
        case pokemonId >= 252 && pokemonId <= 386:
          generation = "Generation 3 (Hoenn)";
          break;
        case pokemonId >= 387 && pokemonId <= 493:
          generation = "Generation 4 (Sinnoh)";
          break;
        case pokemonId >= 494 && pokemonId <= 649:
          generation = "Generation 5 (Unova)";
          break;
        case pokemonId >= 650 && pokemonId <= 721:
          generation = "Generation 6 (Kalos)";
          break;
        case pokemonId >= 722 && pokemonId <= 809:
          generation = "Generation 7 (Alola)";
          break;
        case pokemonId >= 810 && pokemonId <= 905:
          generation = "Generation 8 (Galar)";
          break;
        case pokemonId >= 906 && pokemonId <= 1010:
          generation = "Generation 9 (Paldea)";
          break;
        default:
          generation = "Unknown Generation";
      }
      setPokeGen(generation);
    }
    getPokemonGeneration(pokemonId);
  }, [pokemon]);

  //   get type
  useEffect(() => {
    function getPokeType(data) {
      let pokemonTypes = [];

      for (let i = 0; i < data.types.length; i++) {
        let pokemonType = data.types[i].type.name;
        pokemonTypes.push(pokemonType);
      }
      console.log(pokemonTypes);
      setPokeTypes(pokemonTypes);
    }
    if (pokemon) {
      getPokeType(pokemon);
    }
  }, [pokemon]);

  return (
    <div>
      <input
        type="number"
        value={pokemonId}
        onChange={(e) => {
          setPokemonId(Number(e.target.value));
        }}
      />
      <h2>
        {pokemon
          ? `${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.slice(1)}`
          : `Waiting on Pokemon...`}
      </h2>
      {pokemon && (
        <div>
          <p>{pokeGen}</p>
          {pokeTypes.map((type, index) => (
            <p key={index}>
              {type.charAt(0).toUpperCase()}
              {type.slice(1)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
