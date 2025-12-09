const router = require("express").Router();
const {
	globalAnalytics,
	sprintAnalytics,
} = require("../controllers/analytics.controller");
const auth = require("../middleware/auth.middleware");

router.get("/global", auth, globalAnalytics);
router.get("/sprint/:id", auth, sprintAnalytics);

module.exports = router;
