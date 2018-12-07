const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");

router.get("/", async ctx => {
  ctx.body = "hello World";
});
module.exports = router;
