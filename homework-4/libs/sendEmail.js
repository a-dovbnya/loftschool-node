const nodemailer = require("nodemailer");
const config = require("../config.json");

module.exports.sendEmail = (name, email, message) =>
  new Promise((resolve, reject) => {
    if (!name && !email && !message) {
      return reject(new Error("Неоходимо заполнить все поля!"));
    }
    const mailOptions = {
      from: `${name} <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: message.trim().slice(0, 500) + `\n Отправлено с: <${email}>`
    };

    const transporter = nodemailer.createTransport(config.mail.smtp);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      return resolve(info);
    });
  });
