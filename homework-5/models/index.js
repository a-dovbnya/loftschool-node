const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb://root:pass12345@ds135974.mlab.com:35974/loftmainproject",
  { useNewUrlParser: true }
);

mongoose.connection.on("connected", () => {
  console.log(
    "Mongoose connection open mongodb://root:pass12345@ds135974.mlab.com:35974/loftmainproject"
  );
});

mongoose.connection.on("error", err => {
  console.log("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection disconnected app termination");
    process.exit(0);
  });
});
