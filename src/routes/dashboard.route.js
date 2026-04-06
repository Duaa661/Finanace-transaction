// routes/dashboard.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware.js");
const controller = require("../controllers/dashboard.controller.js");

router.get("/summary", auth.authMiddleware, controller.getSummary);

module.exports = router;