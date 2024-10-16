//postgres client

//import client object
const { Client } = require("pg");

//connnect to db
const connectionString =
  process.env.DATABASE_URL || "https://localhost:5432/pokemon-db";

//create client object, disable ssl
const client = new Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
