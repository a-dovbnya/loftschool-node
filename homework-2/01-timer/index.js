const commander = require("commander");
const http = require("http");
const port = 3000;

commander
  .version("0.0.1")
  .option("-t, --time-interval [opt]", "Date display interval (ms)")
  .option(
    "-r, --time-request [opt]",
    "The time after which there will be a response from the server (ms)"
  )
  .parse(process.argv);

const env = process.env;

env.timeInterval = parseInt(commander.timeInterval, 10) || 1000;
env.timeRequest = parseInt(commander.timeRequest, 10) || 10000;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url !== "/favicon.ico") {
    const timer = setInterval(() => {
      console.log(new Date().toUTCString());
    }, env.timeInterval);

    setTimeout(() => {
      clearInterval(timer);
      console.log("done");
      res.end(new Date().toUTCString());
    }, env.timeRequest);
  } else {
    console.log("Use the get method to run");
  }
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
