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
    if (!newTeam) return null;
    return newTeam;
  } catch (err) {
    throw err;
  }
}

//get team by team id
async function getTeamById({ id }) {
  try {
    const {
      rows: [pokemonTeam],
    } = await client.query(
      `
      SELECT * FROM pokemon_teams WHERE id = $1`,
      [id]
    );
    if (!pokemonTeam) return null;
    return pokemonTeam;
  } catch (err) {
    throw err;
  }
}
//update teamName
async function updateTeamName({ id, newTeamName }) {
  try {
    const { rowCount } = await client.query(
      `
      UPDATE pokemon_teams SET team_name = $1 WHERE id=$2`,
      [newTeamName, id]
    );
    if (rowCount === 0) return null;

    return { message: "Updated team name successfully!", newName: newTeamName };
  } catch (err) {
    throw err;
  }
}

//delete pokemonteam
async function deleteTeam({ id }) {
  try {
    const { rowCount } = await client.query(
      `
      DELETE FROM pokemon_teams WHERE id=$1`,
      [id]
    );
    if (rowCount === 0) return null;
    return { message: "Pokemon Team successfully deleted" };
  } catch (err) {
    throw err;
  }
}

//get all pokemon on a team
async function getPokemonTeam({ id }) {
  try {
    const { rows } = await client.query(
      `
    SELECT * FROM pokemon WHERE team_id = $1`,
      [id]
    );
    if (rows.length === 0) return null;

    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createPokemonTeam,
  getTeamById,
  deleteTeam,
  updateTeamName,
  getPokemonTeam,
};
