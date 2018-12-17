const { auth, register } = require("../mock");

module.exports = {
  saveNewUser: (req, res) => {
    console.log(req.body);
    res.status(200).json(register);
  },
  login: (req, res) => {
    console.log(req.body);
    res.status(200).json(auth);
  },
  authFromToken: (req, res) => {
    console.log(req.body);
    res.status(200).json(auth);
  }
};
