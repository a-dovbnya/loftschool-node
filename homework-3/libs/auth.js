const crypto = require("crypto");
const db = require("../models/db.js");

module.exports.auth = body => {
  const { email, password } = body;
  const admin = db.get("admin").value();
  const salt = admin.salt;
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 512, "sha512")
    .toString("hex");

  if (admin.email === email && admin.hash === hash) {
    return true;
  }

  return false;
};
