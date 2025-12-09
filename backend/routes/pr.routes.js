const router = require("express").Router({ mergeParams: true });
const {
	getPRs,
	createPR,
	updatePR,
	deletePR,
} = require("../controllers/pr.controller");
const restrictDemo = require("../middleware/restrict.middleware");

router.get("/", getPRs);
router.post("/", restrictDemo, createPR);
router.put("/:id", restrictDemo, updatePR);
router.delete("/:id", restrictDemo, deletePR);

module.exports = router;
