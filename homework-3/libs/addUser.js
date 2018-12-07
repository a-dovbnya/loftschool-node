const readline = require("readline");
const crypto = require("crypto");
const db = require("../models/db.js");

const setPassword = password => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 512, "sha512")
    .toString("hex");

  return { salt, hash };
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Email: ", answer => {
  const email = answer;

  rl.question("Password: ", answer => {
    const password = setPassword(answer);
    const hash = password.hash;
    const salt = password.salt;

    db.set("admin", {
      email,
      salt,
      hash: hash.toString("hex")
    }).write();

    rl.close();
  });
});
