const apiUrl = "https://pokeapi.co/api/v2";

//get pokemon by id
export async function getPokemonById(id) {
  try {
    const res = await fetch(`${apiUrl}/pokemon/${id}`);
    const pokemon = await res.json();
    return pokemon;
  } catch (err) {
    console.log("Error fetching pokemon..");
  }
}

export async function getPokemonType(id) {
  try {
    const res = await fetch(`${apiUrl}/type/${id}`);
    const pokemonType = await res.json();
    return pokemonType;
  } catch (err) {
    console.log("Error fetching pokemon type..");
  }
}
