const db = require("../models/db");
const { sendEmail } = require("../libs/sendEmail");

module.exports = {
  getIndex: (req, res) => {
    const data = {
      msgemail: req.flash("info")[0],
      skills: db.get("skills").value(),
      products: db.get("products").value()
    };
    res.render("pages/index", data);
  },
  sendMailForm: (req, res) => {
    sendEmail(req)
      .then(info => {
        req.flash("info", "Сообщение успешно отправлено!");
        res.redirect("/#status");
      })
      .catch(err => {
        req.flash("info", err.message);
        return res.redirect("/#status");
      });
  }
};
