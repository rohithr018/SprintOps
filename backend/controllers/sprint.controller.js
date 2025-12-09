// controllers/sprint.controller.js
const Sprint = require("../models/Sprint");
const apiResponse = require("../utils/apiResponse");

// Get
exports.getSprints = async (req, res, next) => {
	try {
		const sprints = await Sprint.find({ user: req.userId }).sort({
			startDate: -1,
		});
		return apiResponse(res, { success: true, data: sprints });
	} catch (err) {
		next(err);
	}
};

// Get
exports.getSprint = async (req, res, next) => {
	try {
		const sprint = await Sprint.findOne({
			_id: req.params.id,
			user: req.userId,
		});
		if (!sprint)
			return apiResponse(res, {
				success: false,
				message: "Sprint not found",
				status: 404,
			});
		return apiResponse(res, { success: true, data: sprint });
	} catch (err) {
		next(err);
	}
};

// Create
exports.createSprint = async (req, res, next) => {
	try {
		const { name, goal, startDate, endDate } = req.body;
		const sprint = await Sprint.create({
			user: req.userId,
			name,
			goal,
			startDate,
			endDate,
		});
		return apiResponse(res, {
			success: true,
			message: "Sprint created",
			data: sprint,
			status: 201,
		});
	} catch (err) {
		next(err);
	}
};

// Update
exports.updateSprint = async (req, res, next) => {
	try {
		const { name, goal, startDate, endDate } = req.body;
		const sprint = await Sprint.findOneAndUpdate(
			{ _id: req.params.id, user: req.userId },
			{ name, goal, startDate, endDate },
			{ new: true }
		);
		if (!sprint)
			return apiResponse(res, {
				success: false,
				message: "Sprint not found",
				status: 404,
			});
		return apiResponse(res, {
			success: true,
			message: "Sprint updated",
			data: sprint,
		});
	} catch (err) {
		next(err);
	}
};

// Delete
exports.deleteSprint = async (req, res, next) => {
	try {
		const sprint = await Sprint.findOneAndDelete({
			_id: req.params.id,
			user: req.userId,
		});
		if (!sprint)
			return apiResponse(res, {
				success: false,
				message: "Sprint not found",
				status: 404,
			});
		return apiResponse(res, { success: true, message: "Sprint deleted" });
	} catch (err) {
		next(err);
	}
};
