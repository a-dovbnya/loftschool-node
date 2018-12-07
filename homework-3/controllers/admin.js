const db = require("../models/db");
const { uploadImage } = require("../libs/uploadImage");

module.exports = {
  getAdmin: (req, res) => {
    if (req.session.isAuth) {
      return res.render("pages/admin", {
        msgfile: req.flash("upload")[0],
        msgskill: req.flash("skills")[0]
      });
    }
    req.flash("auth", "Необходима авторизация");
    res.redirect("/login");
  },
  setSkills: (req, res) => {
    if (!req.session.isAuth) {
      return res.redirect("/login");
    }

    const skills = req.body;

    for (let skill in skills) {
      if (skills[skill]) {
        db.get("skills")
          .find({ name: skill })
          .assign({ number: skills[skill] })
          .write();
      }
    }
    req.flash("skills", "Успешно изменено!");
    return res.redirect("/admin");
  },
  addProduct: (req, res) => {
    if (!req.session.isAuth) {
      return res.redirect("/login");
    }
    uploadImage(req)
      .then(msg => {
        req.flash("upload", msg);
        return res.redirect("/admin");
      })
      .catch(err => {
        req.flash("upload", err.message);
        return res.redirect("/admin");
      });
  }
};
