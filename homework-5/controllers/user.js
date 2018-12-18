const { auth, register } = require("../mock");

const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid-v4");
const jwts = require("jwt-simple");
const passport = require("passport");
const User = require("../models/user");
const secret = require("../config/config.json").secret;

module.exports = {
  saveNewUser: async (req, res) => {
    const data = JSON.parse(req.body);

    if (!data.username || !data.password) {
      return res
        .status(401)
        .json({ error: "Для регистрации должны быть указаны логин и пароль" });
    }
    User.findOne({ username: data.username }).then(async user => {
      if (user) {
        console.log("Такой пользователь уже существует");
        return res
          .status(409)
          .json({ error: "Такой пользователь уже существует" });
      }
      // Если данные введены корректно, то создаём пользователя
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(data.password, salt);
      const date = new Date();
      const id = uuidv4();
      //const token = jwt.encode({ id: user.id }, secret);
      const newUser = new User({
        id: id,
        username: data.username,
        password: hash,
        firstName: data.firstName,
        surName: data.surName,
        middleName: data.middleName,
        permission: data.permission,
        permissionId: id,
        createdAt: date,
        updatedAt: date,
        access_token: jwts.encode({ id: id }, secret)
      });

      newUser
        .save()
        .then(user => {
          return res.status(201).json(user);
        })
        .catch(err => {
          // Пробрасываем ошибку дальше с помощью next
          return res.status(400).json({ error: "Произошла ошибка" });
        });
    });
  },
  login: (req, res, next) => {
    /* console.log(req.body);
    res.status(200).json(auth); */
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({
          error: `Пользователь с логином ${req.body.username} не существует!!!`
        });
      }
      if (user) {
        console.log("user = ", user);
      }
    })(req.body, res, next);
  },
  authFromToken: (req, res) => {
    console.log(req.body);
    res.status(200).json(auth);
  }
};
