const router = require("express").Router({ mergeParams: true });
const {
	getFeedback,
	createFeedback,
	updateFeedback,
	deleteFeedback,
} = require("../controllers/feedback.controller");
const restrictDemo = require("../middleware/restrict.middleware");

router.get("/", getFeedback);
router.post("/", restrictDemo, createFeedback);
router.put("/:id", restrictDemo, updateFeedback);
router.delete("/:id", restrictDemo, deleteFeedback);

module.exports = router;
