const fs = require("fs");
const util = require("util");
const _path = require("path");

const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

const db = require("../models/db");
const config = require("../config.json");
const { validation } = require("../libs/uploadValidation");
const { sendEmail } = require("../libs/sendEmail");
const { auth } = require("../libs/auth");

module.exports.index = async ctx => {
  const data = {
    msgemail: ctx.flash("info")[0],
    skills: db.getState().skills || [],
    products: db.get("products").value() || []
  };
  ctx.render("pages/index", data);
};

module.exports.sendMailForm = async ctx => {
  const { name, email, message } = ctx.request.body;
  await sendEmail(name, email, message)
    .then(info => {
      ctx.flash("info", "Сообщение успешно отправлено!");
      ctx.redirect("/#status");
    })
    .catch(err => {
      ctx.flash("info", err.message);
      return ctx.redirect("/#status");
    });
};

module.exports.login = async ctx => {
  if (ctx.session.isAuth) {
    return ctx.redirect("/admin");
  }
  ctx.render("pages/login", { msglogin: ctx.flash("auth")[0] });
};

module.exports.authorize = async ctx => {
  const { email, password } = ctx.request.body;
  if (!email && !password) {
    ctx.flash("auth", "Все поля должны быть заполнены!");
    return ctx.redirect("/login");
  }
  if (auth(email, password)) {
    ctx.session.isAuth = true;
    return ctx.redirect("/admin");
  }
  ctx.flash("auth", "Неверный логин или пароль");
  ctx.redirect("/login");
};

module.exports.admin = async ctx => {
  if (ctx.session.isAuth) {
    return ctx.render("pages/admin", {
      msgfile: ctx.flash("upload")[0],
      msgskill: ctx.flash("skills")[0]
    });
  }
  ctx.flash("auth", "Необходима авторизация");
  ctx.redirect("/login");
};

module.exports.setSkills = async ctx => {
  if (!ctx.session.isAuth) {
    return ctx.redirect("/login");
  }
  const skills = ctx.request.body;

  for (let skill in skills) {
    if (skills[skill]) {
      db.get("skills")
        .find({ name: skill })
        .assign({ number: skills[skill] })
        .write();
    }
  }
  ctx.flash("skills", "Успешно изменено!");
  ctx.redirect("/admin");
};

module.exports.addProduct = async ctx => {
  const { productName, productPrice } = ctx.request.body;
  const { name, size, path } = ctx.request.files.photo;
  const valid = validation(productName, productPrice, name, size);
  const photoSrc = _path
    .join(config.upload, name)
    .split("\\")
    .join("/");

  if (valid.err) {
    await unlink(path);
    ctx.flash(config.upload, valid.status);
    return ctx.redirect("/admin");
  }
  let fileName = _path.join(process.cwd(), config.static, config.upload, name);
  const errUpload = await rename(path, fileName);

  if (errUpload) {
    ctx.flash("upload", "Произошла ошибка при загрузке");
    return ctx.redirect("/admin");
  }

  db.get("products")
    .push({
      src: photoSrc,
      name: productName,
      price: productPrice
    })
    .write();

  ctx.flash("upload", "Проект успешно добавлен");
  ctx.redirect("/admin");
};
