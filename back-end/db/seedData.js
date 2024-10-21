//file holds rebuildDB logic and table logic
const client = require("./client");
const { createUser } = require("./users.js");
const { createPokemonTeam } = require("./pokemonTeams.js");
const { createPokemon } = require("./pokemon.js");

// drop pre-existing tables
async function dropTables() {
  console.log("dropping all tables...");
  try {
    await client.query(`
        DROP TABLE IF EXISTS pokemon;
        DROP TABLE IF EXISTS pokemon_teams;
        DROP TABLE IF EXISTS users;`);
  } catch (err) {
    throw err;
  }
}

// create user tables req(username, password)
async function createUserTables() {
  console.log("building user tables...");
  try {
    await client.query(`
        CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  } catch (err) {
    throw err;
  }
}

//create pokemon_team tables req(user_id, team_name)
async function createPokemonTeamTables() {
  console.log("building pokemon_team tables...");
  try {
    await client.query(`
            CREATE TABLE pokemon_teams(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            team_name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  } catch (err) {
    throw err;
  }
}

//create pokemon tables req(team_id, nickname, pokedex_number)
async function createPokemonTables() {
  console.log("building pokemon tables...");
  try {
    await client.query(`
        CREATE TABLE pokemon(
        id SERIAL PRIMARY KEY,
        team_id INT REFERENCES pokemon_teams(id) ON DELETE CASCADE,
        nickname VARCHAR(255),
        pokedex_number VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  } catch (err) {
    throw err;
  }
}

// insert dummy users
async function createInitialUsers() {
  console.log("initializing dummy users...");
  try {
    const fakeUsers = [
      { username: "user1", password: "password1", role: "admin" },
      { username: "user2", password: "password2", role: "user" },
      { username: "user3", password: "password3", role: "user" },
    ];
    // const users = await Promise.all(fakeUsers.map((user)=>createUser(user)));
    const users = await Promise.all(fakeUsers.map(createUser));
    console.log("dummy users created!");
  } catch (err) {
    throw err;
  }
}

//insert dummy teams
async function createInitialTeams() {
  console.log("creating dummy teams...");
  try {
    const fakeTeams = [
      { user_id: "1", team_name: "team1" },
      { user_id: "2", team_name: "team2" },
      { user_id: "3", team_name: "team3" },
    ];
    const teams = await Promise.all(fakeTeams.map(createPokemonTeam));
    console.log("dummy teams created!");
  } catch (err) {
    throw err;
  }
}
//insert dummy pokemon req(team_id, nickname, pokedex_number)
async function createInitialPokemon() {
  console.log("creating dummy pokemon...");
  try {
    const dummyPokemon = [
      { team_id: "1", nickname: "bulbasaur", pokedex_number: "1" },
      { team_id: "1", nickname: "ivysaur", pokedex_number: "2" },
      { team_id: "1", nickname: "venasaur", pokedex_number: "3" },
      { team_id: "1", nickname: "charmander", pokedex_number: "4" },
      { team_id: "1", nickname: "charmeleon", pokedex_number: "5" },
      { team_id: "1", nickname: "charizard", pokedex_number: "6" },
    ];
    const pokemon = await Promise.all(dummyPokemon.map(createPokemon));
    console.log("dummy pokemon created!");
  } catch (err) {
    throw err;
  }
}

//rebuild db
async function rebuildDB() {
  try {
    await client.connect();
    console.log("connected to DB client");
    await dropTables();
    await createUserTables();
    await createPokemonTeamTables();
    await createPokemonTables();
    await createInitialUsers();
    await createInitialTeams();
    await createInitialPokemon();
  } catch (err) {
    console.log("error during db rebuild");
    throw err;
  }
}

module.exports = { rebuildDB };
