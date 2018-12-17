const express = require("express");
const router = require("./routes/api/v1.0/");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//app.use("/api/v1.0/", router);
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

app.listen(PORT, function() {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
