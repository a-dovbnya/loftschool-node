const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");
const controllers = require("../controllers");

router.get("/", controllers.index);
router.post("/", koaBody(), controllers.sendMailForm);
router.get("/login", controllers.login);
router.post("/login", koaBody(), controllers.authorize);
router.get("/admin", controllers.admin);
router.post("/admin/skills", koaBody(), controllers.setSkills);
router.post(
  "/admin/upload",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/public/upload"
    },
    formLimit: 1000000
  }),
  controllers.addProduct
);

module.exports = router;
