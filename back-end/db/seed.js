//file seeds data base by running rebuildDB

const client = require("./client");
const { rebuildDB } = require("./seedData");

//open and close db
rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
