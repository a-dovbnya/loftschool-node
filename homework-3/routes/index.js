const express = require("express");
const router = express.Router();

const main = require("../controllers/index");
const admin = require("../controllers/admin");
const login = require("../controllers/login");

router.get("/", main.getIndex);
router.post("/", main.sendMailForm);
router.get("/login", login.getLogin);
router.post("/login", login.logIn);
router.get("/admin", admin.getAdmin);
router.post("/admin/skills", admin.setSkills);
router.post("/admin/upload", admin.addProduct);

module.exports = router;
