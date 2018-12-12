const fs = require("fs");
const util = require("util");
const _path = require("path");

const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

const db = require("../models/db");
const config = require("../config.json");
const { validation } = require("../libs/uploadValidation");

module.exports.index = async ctx => {
  const data = {
    //msgemail: ctx.flash("info")[0],
    skills: db.getState().skills || [],
    products: db.get("products").value() || []
  };
  ctx.render("pages/index", data);
};
module.exports.login = async ctx => {
  ctx.render("pages/login");
};
module.exports.admin = async ctx => {
  ctx.render("pages/admin", {
    msgfile: ctx.flash("upload")[0],
    msgskill: ctx.flash("skills")[0]
  });
};
module.exports.uploadWork = async ctx => {
  const { productName, productPrice } = ctx.request.body;
  const { name, size, path } = ctx.request.files.photo;
  const valid = validation(productName, productPrice, name, size);
  const photoSrc = _path
    .join("./upload", name)
    .split("\\")
    .join("/");

  if (valid.err) {
    await unlink(path);
    ctx.body = valid.status;
  }
  let fileName = _path.join(process.cwd(), "public", "upload", name);
  const errUpload = await rename(path, fileName);
  if (errUpload) {
    return (ctx.body = {
      mes: "При работе с картинкой произошла ошибка на сервере",
      status: "Error"
    });
  }

  db.get("products")
    .push({
      src: photoSrc,
      name: productName,
      price: productPrice
    })
    .write();
  ctx.flash("upload", "test");
  ctx.redirect("/admin");
  /*ctx.body = {
    mes: "Проект успешно добавлен",
    status: "OK"
  };*/
};
