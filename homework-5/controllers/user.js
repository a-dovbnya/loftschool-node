const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid-v4");
const jwts = require("jwt-simple");
const passport = require("passport");
const User = require("../models/user");
const secret = require("../config/config.json").secret;
const { uploadImage } = require("../libs/uploadImage");

module.exports = {
  saveNewUser: (req, res) => {
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

    getUpdateUserData(data)
      .then(checkedData => {
        User.findOneAndUpdate({ id: data.id }, checkedData).then(() => {
          User.findOne({ id: data.id }).then(user => {
            res.status(200).json(user);
          });
        });
      })
      .catch(err => {
        return res
          .status(400)
          .json({ error: `Произошла ошибка: ${err.message}` });
      });
  },
  saveUserImage: (req, res, next) => {
    //сохранение изображения пользователя. Необходимо вернуть объект со свойством path, которое хранит путь до сохраненного изображения
    uploadImage(req)
      .then(path => {
        console.log("img path = ", path);
        User.findOneAndUpdate({ id: req.params.id }, { image: path }).then(
          () => {
            res.status(200).json({ path: path });
          }
        );
      })
      .catch(err => {
        console.log(`ошибка при загрузке изображения ${err.message}`);
      });
  },
  updateUserPermission: (req, res, next) => {
    //обновление существующей записи о разрешениях конкретного пользователя.
    const data = req.body;
    const id = req.params.id;
    User.findOne({ permissionId: id })
      .then(user => {
        const newPermission = {
          chat: { ...user.permission.chat, ...data.permission.chat },
          news: { ...user.permission.news, ...data.permission.news },
          setting: { ...user.permission.setting, ...data.permission.setting }
        };

        User.findOneAndUpdate(
          { permissionId: id },
          { permission: newPermission }
        ).then(() => {
          User.findOne({ permissionId: id }).then(user => {
            res.status(200).json(user.permission);
          });
        });
      })
      .catch(err => {
        return res
          .status(400)
          .json({ error: `Произошла ошибка: ${err.message}` });
      });
  },
  deleteUser: (req, res, next) => {
    //удаление пользователя
    User.findOneAndRemove({ id: req.params.id })
      .then(() => {
        User.find({}).then(users => {
          return res.status(200).json(users);
        });
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при удалении пользователя ${err.message}`
        });
      });
  }
};

const userUpdateData = data => {
  /* Создает новый объект
   ** с данными для обновления информации о пользователе
   */
  let obj = {};
  for (let key in data) {
    if (key !== "id" && key !== "oldPassword" && key !== "password") {
      obj[key] = data[key];
    }
  }
  return obj;
};

const getUpdateUserData = async data => {
  const newData = userUpdateData(data);

  if (data.password && data.oldPassword) {
    /* Если был передан пароль, проверяем,
     ** корректен ли старый пароль для текущего пользователя
     */
    const currentUser = await User.findOne({ id: data.id });

    if (!currentUser.validPassword(data.oldPassword)) {
      throw new Error(`Неправильный пароль!`);
    }
    const salt = await bcrypt.genSalt(10);
    newData.password = await bcrypt.hash(data.password, salt);
  }
  return newData;
};
