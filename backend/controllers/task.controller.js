const Task = require("../models/Task");
const TaskLog = require("../models/TaskLog");
const Sprint = require("../models/Sprint");
const apiResponse = require("../utils/apiResponse");

// Get
const ensureSprint = async (userId, sprintId) => {
	const sprint = await Sprint.findOne({ _id: sprintId, user: userId });
	if (!sprint) {
		const err = new Error("Sprint not found");
		err.statusCode = 404;
		throw err;
	}
};

// Get
exports.getTasks = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const tasks = await Task.find({ sprint: req.params.sprintId }).sort({
			createdAt: -1,
		});
		return apiResponse(res, { success: true, data: tasks });
	} catch (err) {
		next(err);
	}
};

// Create
exports.createTask = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const { title, description, storyPoints, skills, status } = req.body;
		const task = await Task.create({
			sprint: req.params.sprintId,
			title,
			description,
			storyPoints,
			skills,
			status,
		});
		return apiResponse(res, {
			success: true,
			message: "Task created",
			data: task,
			status: 201,
		});
	} catch (err) {
		next(err);
	}
};

// Get
exports.getTask = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const task = await Task.findOne({
			_id: req.params.taskId,
			sprint: req.params.sprintId,
		});
		if (!task)
			return apiResponse(res, {
				success: false,
				message: "Task not found",
				status: 404,
			});
		return apiResponse(res, { success: true, data: task });
	} catch (err) {
		next(err);
	}
};

// Update
exports.updateTask = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const { title, description, storyPoints, skills, status } = req.body;
		const task = await Task.findOneAndUpdate(
			{ _id: req.params.taskId, sprint: req.params.sprintId },
			{ title, description, storyPoints, skills, status },
			{ new: true }
		);
		if (!task)
			return apiResponse(res, {
				success: false,
				message: "Task not found",
				status: 404,
			});
		return apiResponse(res, {
			success: true,
			message: "Task updated",
			data: task,
		});
	} catch (err) {
		next(err);
	}
};

// Delete
exports.deleteTask = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const task = await Task.findOneAndDelete({
			_id: req.params.taskId,
			sprint: req.params.sprintId,
		});
		if (!task)
			return apiResponse(res, {
				success: false,
				message: "Task not found",
				status: 404,
			});
		await TaskLog.deleteMany({ task: task._id });
		return apiResponse(res, { success: true, message: "Task deleted" });
	} catch (err) {
		next(err);
	}
};

// Add Log
exports.addLog = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const { summary, skillsUsed, timeSpentMinutes, progressPercent } = req.body;
		const log = await TaskLog.create({
			sprint: req.params.sprintId,
			task: req.params.taskId,
			summary,
			skillsUsed,
			timeSpentMinutes,
			progressPercent,
		});
		return apiResponse(res, {
			success: true,
			message: "Log added",
			data: log,
			status: 201,
		});
	} catch (err) {
		next(err);
	}
};

// Get Logs
exports.getLogs = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const logs = await TaskLog.find({ task: req.params.taskId }).sort({
			date: -1,
		});
		return apiResponse(res, { success: true, data: logs });
	} catch (err) {
		next(err);
	}
};
