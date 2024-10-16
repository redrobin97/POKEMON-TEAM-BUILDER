const express = require("express"); //import express
const app = express(); //server
const PORT = process.env.PORT || 3000; //port

app.get("/", (req, res) => {
  res.send("Hello, World!"); //first endpoint
});

//starts server on port, two arguments, port and callback message
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
