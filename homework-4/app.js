const Koa = require("koa");
const app = new Koa();
const Pug = require("koa-pug");
const static = require("koa-static");

const config = require("./config.json");

const pug = new Pug({
  viewPath: config["templates"],
  pretty: false,
  noCashe: true,
  basedir: config["templates"],
  app: app
});

app.use(static(config["static"]));
const router = require("./routes");

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
