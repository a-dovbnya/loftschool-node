const { auth } = require("../libs/auth");

module.exports.getLogin = function(req, res) {
  res.render("pages/login");
};

module.exports = {
  getLogin: (req, res) => {
    if (req.session.isAuth) {
      return res.redirect("/admin");
    }
    res.render("pages/login", { msglogin: req.flash("auth")[0] });
  },
  logIn: (req, res) => {
    if (!req.body.email && !req.body.password) {
      req.flash("auth", "Все поля должны быть заполнены!");
      return res.redirect("/login");
    }
    if (auth(req.body)) {
      req.session.isAuth = true;
      return res.redirect("/admin");
    }
    req.flash("auth", "Неверный логин или пароль");
    res.redirect("/login");
  }
};
