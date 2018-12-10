const fs = require("fs");
const util = require("util");
const _path = require("path");

const rename = util.promisify(fs.rename);
const unllink = util.promisify(fs.unlink);

const db = require("../models/db");
const config = require("../config.json");
validation = require("../libs/uploadValidation");

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
  ctx.render("pages/admin");
};
module.exports.uploadWork = async ctx => {
  const { name, price } = ctx.request.body;
  const { name, size, path } = ctx.request.files;
};
