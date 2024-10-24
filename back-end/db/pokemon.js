const client = require("./client");

//create pokemon req(team_id, nickname, pokedex_number)
async function createPokemon({ team_id, nickname, pokedex_number }) {
  try {
    const {
      rows: [newPokemon],
    } = await client.query(
      `
    INSERT INTO pokemon(team_id, nickname, pokedex_number) VALUES ($1, $2, $3) RETURNING *`,
      [team_id, nickname, pokedex_number]
    );
    if (!newPokemon) return null;
    return newPokemon;
  } catch (err) {
    throw err;
  }
}

//getpokemon by id
async function getPokemonById(id) {
  try {
    const {
      rows: [pokemon],
    } = await client.query(
      `
      SELECT * FROM pokemon WHERE id=$1`,
      [id]
    );
    if (!pokemon) return null;
    return pokemon;
  } catch (err) {
    throw err;
  }
}
//delete pokemon by id
async function deletePokemon(id) {
  try {
    const pokemonToDelete = await getPokemonById(id);
    if (!pokemonToDelete) return null;
    else {
      const deletedPokemon = await client.query(
        `
        DELETE from pokemon WHERE id = $1`,
        [id]
      );
      return pokemonToDelete;
    }
  } catch (err) {
    throw err;
  }
}

//change nickname
async function updateNickname({ id, newNickname }) {
  try {
    const { rowCount } = await client.query(
      `
      UPDATE pokemon SET nickname = $1 WHERE id=$2`,
      [newNickname, id]
    );
    if (rowCount === 0) return null;
    else {
      const updatedPokemon = await getPokemonById(id);
      return updatedPokemon;
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createPokemon,
  updateNickname,
  deletePokemon,
  getPokemonById,
};
