const express = require("express");
const morgan = require("morgan");
const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process is running. Forking ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });
} else {
  const app = express();

  app.use(morgan("dev"));

  app.get("/", (req, res) => {
    for (let i = 0; i < 1000000000; i++) {} // Simulate a long-running process
    res.send("Hello World!");
  });

  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on http://localhost:${PORT}`);
  });
}
