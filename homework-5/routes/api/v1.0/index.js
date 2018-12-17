const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/user.js");
//const db = require("../../../../models/db");

// mock
const { auth, register, getNews } = require("../../../mock");

// На все get-запросы отдавать index.html
router.get("/", (req, res) => {
  res.render("dist");
});

router.post("/api/saveNewUser", userController.saveNewUser);
router.post("/api/login", userController.login);
router.post("/api/authFromToken", userController.authFromToken);

router.put("/api/updateUser/:id", (req, res) => {
  //обновление информации о пользователе. Необходимо вернуть объект обновленного пользователя.
});

router.delete("/api/deleteUser/:id", (req, res) => {
  //удаление пользователя
});

router.post("/api/saveUserImage/:id", (req, res) => {
  //сохранение изображения пользователя. Необходимо вернуть объект со свойством path, которое хранит путь до сохраненного изображения
});

router.get("/api/getNews", (req, res) => {
  //получение списка новостей. Необходимо вернуть список всех новостей из базы данных.
  res.json(getNews);
});

router.post("/api/newNews", (req, res) => {
  //создание новой новости. Необходимо вернуть обновленный список всех новостей из базы данных.
});

router.put("/api/updateNews/:id", (req, res) => {
  //обновление существующей новости. Необходимо вернуть обновленный список всех новостей из базы данных.
});

router.get("/api/getUsers", (req, res) => {
  //получение списка пользователей. Необходимо вернуть список всех пользоватлей из базы данных.
});

router.put("/api/updateUserPermission/:id", (req, res) => {
  //обновление существующей записи о разрешениях конкретного пользователя.
});

module.exports = router;
