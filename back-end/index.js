const express = require("express"); //import express
const app = express(); //server
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000; //port
const client = require("./db/client");

//connect to db
client.connect();

//parser
app.use(bodyParser.json());
//route
app.use("/api", require("./api"));

//handle errors
app.use((error, req, res, next) => {
  console.log("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name });
});

//starts server on port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
