const nodemailer = require("nodemailer");
const config = require("../config.json");

module.exports.sendEmail = req =>
  new Promise((resolve, reject) => {
    console.log("send mail is starting");
    const mailOptions = {
      from: `${req.body.name} <${req.body.email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text:
        req.body.message.trim().slice(0, 500) +
        `\n Отправлено с: <${req.body.email}>`
    };

    const transporter = nodemailer.createTransport(config.mail.smtp);
    console.log("config = ", config);
    console.log("mailOptions = ", mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("callback");
      if (error) {
        return reject(error);
      }
      return resolve(info);
    });
  });
