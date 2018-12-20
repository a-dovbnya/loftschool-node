const express = require("express");
const bodyParser = require("body-parser");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

const router = require("./routes/api/v1.0/");
const app = express();
const path = require("path");

const chat = require("./chat");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io").listen(server);
chat(io);

app.use(cookieParser());

// static
app.use(express.json({ type: "text/plain" }));
app.use(express.static(path.join(__dirname, "dist")));
/* app.use(express.urlencoded({ extended: false }));
app.use(express.json()); */
//app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use("/api/v1.0/", router);
require("./models");
require("./config/config-passport");
app.use("/", router);

app.use((req, res, next) => {
  if (req.method === "GET") {
    res.sendFile(path.join(__dirname, "dist/index.html"));
  }
});

app.use((req, res, next) => {
  console.log("next");
  res.status(404).json({ err: "404", message: "Use api on routes /api/v1.0/" });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ err: "500", message: err.message });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, function() {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
