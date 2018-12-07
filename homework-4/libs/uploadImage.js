const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { validate } = require("./uploadValidation");
const db = require("../models/db");
const uploadDir = require("../config.json")["upload"];

module.exports.uploadImage = req =>
  new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm();
    let upload = path.join("./public", uploadDir);

    if (!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, function(err, fields, files) {
      if (err) {
        return reject(err);
      }

      const valid = validate(fields, files);
      const fileName = path.join(upload, files.photo.name);

      if (valid.err) {
        return reject(new Error(valid.status));
      }

      fs.rename(files.photo.path, fileName, function(err) {
        if (err) {
          return reject(err);
        }
        const file = path
          .join(uploadDir, files.photo.name)
          .split("\\")
          .join("/");

        db.get("products")
          .push({ src: file, name: fields.name, price: fields.price })
          .write();

        return resolve("Картинка успешно загружена!");
      });
    });
  });
