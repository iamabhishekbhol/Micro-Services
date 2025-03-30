const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev")); // Use morgan for logging requests

app.get("/", (req, res) => {
  for (let i = 0; i < 100000000; i++) {} // Simulate a long-running process
  res.send("Hello World!");
});

// app.get("/stress-test", (req, res) => {
//   for (let i = 0; i < 10000000000000; i++) {} // Simulate a long-running process
//   res.send("Hello World!");
// });

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
