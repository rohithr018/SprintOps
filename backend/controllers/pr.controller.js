const PR = require("../models/PR");
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
exports.getPRs = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const prs = await PR.find({ sprint: req.params.sprintId }).sort({
			createdAt: -1,
		});
		return apiResponse(res, { success: true, data: prs });
	} catch (err) {
		next(err);
	}
};

// Create
exports.createPR = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const { title, purpose, summary, challenges, skillsUsed, status } =
			req.body;
		const pr = await PR.create({
			sprint: req.params.sprintId,
			title,
			purpose,
			summary,
			challenges,
			skillsUsed,
			status,
		});
		return apiResponse(res, {
			success: true,
			message: "PR created",
			data: pr,
			status: 201,
		});
	} catch (err) {
		next(err);
	}
};

// Update
exports.updatePR = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const { title, purpose, summary, challenges, skillsUsed, status } =
			req.body;
		const pr = await PR.findOneAndUpdate(
			{ _id: req.params.id, sprint: req.params.sprintId },
			{ title, purpose, summary, challenges, skillsUsed, status },
			{ new: true }
		);
		if (!pr)
			return apiResponse(res, {
				success: false,
				message: "PR not found",
				status: 404,
			});
		return apiResponse(res, { success: true, message: "PR updated", data: pr });
	} catch (err) {
		next(err);
	}
};

// Delete
exports.deletePR = async (req, res, next) => {
	try {
		await ensureSprint(req.userId, req.params.sprintId);
		const pr = await PR.findOneAndDelete({
			_id: req.params.id,
			sprint: req.params.sprintId,
		});
		if (!pr)
			return apiResponse(res, {
				success: false,
				message: "PR not found",
				status: 404,
			});
		return apiResponse(res, { success: true, message: "PR deleted" });
	} catch (err) {
		next(err);
	}
};
