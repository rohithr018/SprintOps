const router = require("express").Router();
const { healthCheck } = require("../controllers/health.controller.js");

router.get("/", healthCheck);

module.exports = router;
