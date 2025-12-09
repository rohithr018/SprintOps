const router = require("express").Router({ mergeParams: true });
const {
	getTasks,
	createTask,
	getTask,
	updateTask,
	deleteTask,
	addLog,
	getLogs,
} = require("../controllers/task.controller");
const restrictDemo = require("../middleware/restrict.middleware");

router.get("/", getTasks);
router.post("/", restrictDemo, createTask);
router.get("/:taskId", getTask);
router.put("/:taskId", restrictDemo, updateTask);
router.delete("/:taskId", restrictDemo, deleteTask);
router.post("/:taskId/logs", restrictDemo, addLog);
router.get("/:taskId/logs", getLogs);

module.exports = router;
