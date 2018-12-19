const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid-v4");
const userController = require("../../../controllers/user.js");
//const db = require("../../../../models/db");
const News = require("../../../models/news");
const User = require("../../../models/user");

const passport = require("passport");
const authJwt = passport.authenticate("jwt", { session: false });

// mock
//const { auth, register, getNews } = require("../../../mock");

// На все get-запросы отдавать index.html
router.get("/", (req, res) => {
  res.render("dist");
});

router.post("/api/saveNewUser", userController.saveNewUser);
router.post("/api/login", userController.login);
router.post("/api/authFromToken", userController.authFromToken);

router.put("/api/updateUser/:id", authJwt, (req, res) => {
  //обновление информации о пользователе. Необходимо вернуть объект обновленного пользователя.
});

router.delete("/api/deleteUser/:id", authJwt, (req, res) => {
  //удаление пользователя
});

router.post("/api/saveUserImage/:id", authJwt, (req, res) => {
  //сохранение изображения пользователя. Необходимо вернуть объект со свойством path, которое хранит путь до сохраненного изображения
});

router.get("/api/getNews", authJwt, (req, res, next) => {
  //получение списка новостей. Необходимо вернуть список всех новостей из базы данных.
  getAllNews()
    .then(allNews => {
      return res.status(200).json(allNews);
    })
    .catch(err => {
      return res.status(400).json({
        error: `Произошла ошибка при выборке новостей: ${err.message}`
      });
    });
});

router.post("/api/newNews", authJwt, (req, res, next) => {
  //создание новой новости. Необходимо вернуть обновленный список всех новостей из базы данных.
  const data = req.body;
  const newNews = new News({
    id: uuidv4(),
    date: data.date,
    text: data.text,
    theme: data.theme,
    userId: data.userId
  });
  newNews
    .save()
    .then(news => {
      getAllNews().then(allNews => {
        return res.status(200).json(allNews);
      });
    })
    .catch(err => {
      return res.status(400).json({
        error: `Произошла ошибка при добавлении новости ${err.message}`
      });
    });
});

router.put("/api/updateNews/:id", authJwt, (req, res, next) => {
  //обновление существующей новости. Необходимо вернуть обновленный список всех новостей из базы данных.
  const id = req.params.id;
  const data = req.body;

  News.findOneAndUpdate(
    { id: id },
    { text: data.text, theme: data.theme, date: data.date, userId: data.userId }
  )
    .then(newsItem => {
      getAllNews().then(allNews => {
        return res.status(200).json(allNews);
      });
    })
    .catch(err => {
      return res.status(400).json({
        error: `Произошла ошибка при обновлении новости ${err.message}`
      });
    });
});

router.delete("/api/deleteNews/:id", authJwt, (req, res) => {
  //удаление Новости
  const id = req.params.id;
  News.findOneAndRemove({ id: id })
    .then(() => {
      getAllNews().then(allNews => {
        return res.status(200).json(allNews);
      });
    })
    .catch(err => {
      return res.status(400).json({
        error: `Произошла ошибка при удалении новости ${err.message}`
      });
    });
});

router.get("/api/getUsers", authJwt, (req, res) => {
  //получение списка пользователей. Необходимо вернуть список всех пользоватлей из базы данных.
});

router.put("/api/updateUserPermission/:id", authJwt, (req, res) => {
  //обновление существующей записи о разрешениях конкретного пользователя.
});

const composeNews = async news => {
  const newsPromises = news.map(el => {
    return User.findOne({ id: el.userId }).then(user => {
      return {
        _id: el._id,
        id: el.id,
        data: el.date,
        text: el.text,
        theme: el.theme,
        userId: el.userId,
        user: user
      };
    });
  });

  return await Promise.all(newsPromises);
};

const getAllNews = async () => {
  return await News.find({}).then(async news => {
    return await composeNews(news);
  });
};

module.exports = router;
