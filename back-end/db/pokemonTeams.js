const client = require("./client");

//create team in db req(user_id, team_name)
async function createPokemonTeam({ user_id, team_name }) {
  try {
    const {
      rows: [newTeam],
    } = await client.query(
      `
            INSERT INTO pokemon_teams(
            user_id, team_name) VALUES ($1, $2)
            RETURNING *`,
      [user_id, team_name]
    );
    return newTeam;
  } catch (err) {
    throw err;
  }
}

module.exports = { createPokemonTeam };
