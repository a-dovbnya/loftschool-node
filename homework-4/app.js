const Koa = require("koa");
const app = new Koa();
const Pug = require("koa-pug");
const static = require("koa-static");
const session = require("koa-session");
const flash = require("koa-better-flash");
const fs = require("fs");

const config = require("./config.json");

const pug = new Pug({
  viewPath: config["templates"],
  pretty: false,
  noCashe: true,
  basedir: config["templates"],
  app: app
});

const errorHandler = require("./libs/error");

app.use(static(config["static"]));
app.use(errorHandler);
app.on("error", (errorHandler, ctx) => {
  ctx.render("pages/error", {
    status: ctx.response.status,
    message: ctx.response.message
  });
});
const router = require("./routes");

app
  .use(session(config.session, app))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  if (!fs.existsSync("./public/upload")) {
    fs.mkdirSync("./public/upload");
  }
});
