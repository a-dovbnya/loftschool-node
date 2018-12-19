//const { auth, register } = require("../mock");
const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid-v4");
const jwts = require("jwt-simple");
const passport = require("passport");
const User = require("../models/user");
const secret = require("../config/config.json").secret;

module.exports = {
  saveNewUser: async (req, res) => {
    const data = req.body;

    if (!data.username || !data.password) {
      return res
        .status(401)
        .json({ error: "Для регистрации должны быть указаны логин и пароль" });
    }
    User.findOne({ username: data.username }).then(async user => {
      if (user) {
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
          return res.status(400).json({ error: "Произошла ошибка" });
        });
    });
  },
  login: (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({
          error: `Неправильный логин или пароль`
        });
      }
      if (user) {
        if (req.body.remembered) {
          res.cookie("access_token", user.access_token, {
            httpOnly: false,
            expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
            path: "/"
          });
        }
        // В любом случае ставим пользователю куку с токеном для jwt авторизации
        res.cookie("jwt", user.access_token, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
          path: "/"
        });
        return res.status(200).json(user);
      }
    })(req, res, next);
  },
  authFromToken: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({
          error: `Пользователь с таким токеном не найден`
        });
      }
      if (user) {
        res.status(200).json(user);
      }
    })(req, res, next);
  },
  getUsers: (req, res, next) => {
    //получение списка пользователей. Необходимо вернуть список всех пользоватлей из базы данных.
    User.find({})
      .then(users => {
        return res.status(200).json(users);
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при выборке новостей: ${err.message}`
        });
      });
  },
  updateUser: (req, res, next) => {
    //обновление информации о пользователе. Необходимо вернуть объект обновленного пользователя.
    const data = req.body;
    const newData = userUpateData(data);
    console.log(req.body);
    // Если запрос на смену пароля
    //console.log("cp = ", checkPassword(data));
    checkPassword(data, newData)
      .then(checkedData => {
        console.log("cd = ", checkedData);
        console.log("id = ", req.body.id);
        User.findOneAndUpdate({ id: req.body.id }, checkedData).then(() => {
          User.findOne({ id: req.body.id }).then(user => {
            res.status(200).json(user);
          });
        });
      })
      .catch(err => {
        return res
          .status(400)
          .json({ error: `Произошла ошибка: ${err.message}` });
      });
    /*if (data.password && data.oldPassword) {
      // Проверяем, корректный ли текущий пароль
      User.findOne({ id: data.id }).then(user => {
        if (user.validPassword(data.oldPassword)) {
          // Обновляем данные
          const salt = await bcrypt.genSalt(10);
          newData.password = await bcrypt.hash(data.password, salt);
        } else {
          return res.status(400).json({ error: `Неправильный пароль!` });
        }
      });
    }*/
    /*User.findOneAndUpdate({ id: req.body.id }, data)
      .then(() => {
        User.findOne({ id: req.body.id }).then(user => {
          res.status(200).json(user);
        });
      })
      .catch(err => {
        return res
          .status(400)
          .json({ error: `Произошла ошибка: ${err.message}` });
      });*/
  }
};

const userUpateData = data => {
  let obj = {};
  for (let key in data) {
    if (key !== "id" && key !== "oldPassword" && key !== "password") {
      obj[key] = data[key];
    }
  }
  console.log(obj);
  return obj;
};

const checkPassword = async (data, newData) => {
  return await new Promise((resolve, reject) => {
    if (data.password && data.oldPassword) {
      // Проверяем, корректный ли текущий пароль
      return User.findOne({ id: data.id }).then(async user => {
        if (user.validPassword(data.oldPassword)) {
          // Обновляем данные
          const salt = await bcrypt.genSalt(10);
          newData.password = await bcrypt.hash(data.password, salt);
          resolve(newData);
        } else {
          reject(new Error(`Неправильный пароль!`));
        }
      });
    } else {
      resolve(newData);
    }
  });
};
