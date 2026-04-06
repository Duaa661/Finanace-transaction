// routes/record.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware.js");
const authorizeRoles = require("../middlewares/role.middleware.js");
const controller = require("../controllers/record.controller.js");

router.post("/", auth.authMiddleware, authorizeRoles("ADMIN"), controller.createRecord);
router.get("/", auth.authMiddleware, controller.getRecords);
router.put("/:id", auth.authMiddleware, authorizeRoles("ADMIN"), controller.updateRecord);
router.delete("/:id", auth.authMiddleware, authorizeRoles("ADMIN"), controller.deleteRecord);

module.exports = router;