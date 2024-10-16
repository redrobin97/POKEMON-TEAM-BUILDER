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
    return newPokemon;
  } catch (err) {
    console.log("error creating new pokemon");
    throw err;
  }
}

module.exports = { createPokemon };
