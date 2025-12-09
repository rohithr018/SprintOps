const router = require("express").Router();
const {
	getSprints,
	getSprint,
	createSprint,
	updateSprint,
	deleteSprint,
} = require("../controllers/sprint.controller");
const auth = require("../middleware/auth.middleware");
const restrictDemo = require("../middleware/restrict.middleware");
router.use(auth);

router.get("/", getSprints);
router.post("/", restrictDemo, createSprint);
router.get("/:id", getSprint);
router.put("/:id", restrictDemo, updateSprint);
router.delete("/:id", restrictDemo, deleteSprint);

module.exports = router;
