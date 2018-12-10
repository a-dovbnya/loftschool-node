const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");
const controllers = require("../controllers");

router.get("/", controllers.index);
router.get("/login", controllers.login);
router.get("/admin", controllers.admin);
router.post(
  "/admin/upload",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/public/upload"
    },
    formLimit: 1000000
  }),
  controllers.uploadWork
);

module.exports = router;
