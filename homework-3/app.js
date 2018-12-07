const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const config = require("./config.json");

// view engine setup
app.set("views", path.join(__dirname, config["templates"]));
app.set("view engine", "pug");

app.use(express.static(path.join(process.cwd(), config["static"])));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "loftschool",
    key: "auth",
    cookie: { path: "/", httpOnly: true, maxAge: 600000 },
    saveUninitialized: false,
    resave: false
  })
);
app.use(flash());

app.use("/", require("./routes/index"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render("pages/error", { message: err.message, error: err });
  //res.sendStatus(err.status);
});

const server = app.listen(process.env.PORT || 3000, function() {
  console.log("Example app listening on port " + server.address().port);
});
