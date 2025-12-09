const Feedback = require("../models/Feedback");
const Sprint = require("../models/Sprint");
const apiResponse = require("../utils/apiResponse");

// Get
const ensureSprint = async (userId, sprintId) => {
	const sprint = await Sprint.findOne({ _id: sprintId, user: userId });
	if (!sprint) {
		const e = new Error("Sprint not found");
		e.statusCode = 404;
		throw e;
	}
};

// Get
exports.getFeedback = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const list = await Feedback.find({ sprint: req.params.sprintId }).sort({
			date: -1,
		});
		return apiResponse(res, { success: true, data: list });
	} catch (err) {
		next(err);
	}
};

// Create
exports.createFeedback = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const { type, source, content, context, date } = req.body;
		const f = await Feedback.create({
			sprint: req.params.sprintId,
			type,
			source,
			content,
			context,
			date: date || new Date(),
		});
		return apiResponse(res, {
			success: true,
			message: "Feedback added",
			data: f,
			status: 201,
		});
	} catch (err) {
		next(err);
	}
};

// Update
exports.updateFeedback = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const { type, source, content, context, date } = req.body;
		const f = await Feedback.findOneAndUpdate(
			{ _id: req.params.id, sprint: req.params.sprintId },
			{ type, source, content, context, date },
			{ new: true }
		);
		if (!f)
			return apiResponse(res, {
				success: false,
				message: "Feedback not found",
				status: 404,
			});
		return apiResponse(res, {
			success: true,
			message: "Feedback updated",
			data: f,
		});
	} catch (err) {
		next(err);
	}
};

// Delete
exports.deleteFeedback = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const f = await Feedback.findOneAndDelete({
			_id: req.params.id,
			sprint: req.params.sprintId,
		});
		if (!f)
			return apiResponse(res, {
				success: false,
				message: "Feedback not found",
				status: 404,
			});
		return apiResponse(res, { success: true, message: "Feedback deleted" });
	} catch (err) {
		next(err);
	}
};
