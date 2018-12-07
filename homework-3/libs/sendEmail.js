const nodemailer = require("nodemailer");
const config = require("../config.json");

module.exports.sendEmail = req =>
  new Promise((resolve, reject) => {
    if (!req.body.name && !req.body.email && !req.body.message) {
      return reject(new Error("Неоходимо заполнить все поля!"));
    }
    const mailOptions = {
      from: `${req.body.name} <${req.body.email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text:
        req.body.message.trim().slice(0, 500) +
        `\n Отправлено с: <${req.body.email}>`
    };

    const transporter = nodemailer.createTransport(config.mail.smtp);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      return resolve(info);
    });
  });
