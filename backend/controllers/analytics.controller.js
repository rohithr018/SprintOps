const Task = require("../models/Task");
const TaskLog = require("../models/TaskLog");
const PR = require("../models/PR");
const Sprint = require("../models/Sprint");
const Feedback = require("../models/Feedback");
const apiResponse = require("../utils/apiResponse");
const mongoose = require("mongoose");

// Global Analytics
exports.globalAnalytics = async (req, res, next) => {
	try {
		const userId = new mongoose.Types.ObjectId(req.userId);

		// Task Status
		const taskStatusBreakdown = await Task.aggregate([
			{
				$lookup: {
					from: "sprints",
					localField: "sprint",
					foreignField: "_id",
					as: "sprintDoc",
				},
			},
			{ $unwind: "$sprintDoc" },
			{ $match: { "sprintDoc.user": userId } },
			{
				$group: {
					_id: "$status",
					value: { $sum: 1 },
				},
			},
		]);

		// PR Status
		const prStatusBreakdown = await PR.aggregate([
			{
				$lookup: {
					from: "sprints",
					localField: "sprint",
					foreignField: "_id",
					as: "sprintDoc",
				},
			},
			{ $unwind: "$sprintDoc" },
			{ $match: { "sprintDoc.user": userId } },
			{
				$group: {
					_id: "$status",
					value: { $sum: 1 },
				},
			},
		]);
		// Story Points Over Time-average story points per sprint
		const storyPointsOverTime = await Task.aggregate([
			{
				$lookup: {
					from: "sprints",
					localField: "sprint",
					foreignField: "_id",
					as: "sprintDoc",
				},
			},
			{ $unwind: "$sprintDoc" },
			{ $match: { "sprintDoc.user": userId } },
			{
				$group: {
					_id: "$sprint",
					sprintName: { $first: "$sprintDoc.name" },
					totalPoints: { $sum: "$storyPoints" },
					taskCount: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					sprintId: "$_id",
					sprintName: 1,
					avgPoints: {
						$cond: [
							{ $eq: ["$taskCount", 0] },
							0,
							{ $ceil: [{ $divide: ["$totalPoints", "$taskCount"] }] },
						],
					},
				},
			},
		]);

		// Feedback By Type
		const feedbackTypeBreakdown = await Feedback.aggregate([
			{
				$lookup: {
					from: "sprints",
					localField: "sprint",
					foreignField: "_id",
					as: "sprintDoc",
				},
			},
			{ $unwind: "$sprintDoc" },
			{ $match: { "sprintDoc.user": userId } },
			{
				$group: {
					_id: "$type",
					value: { $sum: 1 },
				},
			},
		]);

		// Feedback By Source
		const feedbackBySource = await Feedback.aggregate([
			{
				$lookup: {
					from: "sprints",
					localField: "sprint",
					foreignField: "_id",
					as: "sprintDoc",
				},
			},
			{ $unwind: "$sprintDoc" },
			{ $match: { "sprintDoc.user": userId } },
			{
				$group: {
					_id: "$source",
					count: { $sum: 1 },
				},
			},
		]);

		// Skills
		const skillsAgg = await TaskLog.aggregate([
			{
				$lookup: {
					from: "sprints",
					localField: "sprint",
					foreignField: "_id",
					as: "sprintDoc",
				},
			},
			{ $unwind: "$sprintDoc" },
			{ $match: { "sprintDoc.user": userId } },
			{ $unwind: "$skillsUsed" },
			{
				$group: {
					_id: "$skillsUsed",
					value: { $sum: 1 },
				},
			},
		]).then((x) => x.map((s) => ({ skill: s._id, value: s.value })));

		return apiResponse(res, {
			success: true,
			data: {
				taskStatusBreakdown,
				prStatusBreakdown,
				storyPointsOverTime,
				feedbackTypeBreakdown,
				feedbackBySource,
				skillsRadar: skillsAgg,
				skillFrequency: skillsAgg,
			},
		});
	} catch (err) {
		next(err);
	}
};

// Sprint Analytics
exports.sprintAnalytics = async (req, res, next) => {
	try {
		const userId = req.userId;
		const sprintId = req.params.id;

		const sprint = await Sprint.findOne({ _id: sprintId, user: userId });
		if (!sprint)
			return apiResponse(res, {
				success: false,
				message: "Sprint not found",
				status: 404,
			});

		const sprintObj = new mongoose.Types.ObjectId(sprintId);

		// Task Status
		const taskStatusBreakdown = await Task.aggregate([
			{ $match: { sprint: sprintObj } },
			{ $group: { _id: "$status", value: { $sum: 1 } } },
		]);

		// PR Status
		const prStatusBreakdown = await PR.aggregate([
			{ $match: { sprint: sprintObj } },
			{ $group: { _id: "$status", value: { $sum: 1 } } },
		]);

		// Story Points Over Time-cumulative story points per task
		const storyPointsOverTime = await Task.aggregate([
			{ $match: { sprint: sprintObj } },
			{
				$sort: {
					createdAt: 1,
					_id: 1,
				},
			},

			{
				$setWindowFields: {
					sortBy: { createdAt: 1, _id: 1 },
					output: {
						cumulativePoints: {
							$sum: "$storyPoints",
							window: { documents: ["unbounded", "current"] },
						},
					},
				},
			},

			{
				$group: {
					_id: null,
					series: { $push: "$cumulativePoints" },
				},
			},
			{
				$project: {
					_id: 0,
					series: 1,
				},
			},
		]).then((docs) => docs[0]?.series ?? []);

		// Feedback Types
		const feedbackTypeBreakdown = await Feedback.aggregate([
			{ $match: { sprint: sprintObj } },
			{ $group: { _id: "$type", value: { $sum: 1 } } },
		]);

		// Feedback By Source
		const feedbackBySource = await Feedback.aggregate([
			{ $match: { sprint: sprintObj } },
			{ $group: { _id: "$source", count: { $sum: 1 } } },
		]);

		// Skills
		const skillsAgg = await TaskLog.aggregate([
			{ $match: { sprint: sprintObj } },
			{ $unwind: "$skillsUsed" },
			{ $group: { _id: "$skillsUsed", value: { $sum: 1 } } },
		]).then((x) => x.map((s) => ({ skill: s._id, value: s.value })));

		return apiResponse(res, {
			success: true,
			data: {
				taskStatusBreakdown,
				prStatusBreakdown,
				storyPointsOverTime,
				feedbackTypeBreakdown,
				feedbackBySource,
				skillsRadar: skillsAgg,
			},
		});
	} catch (err) {
		next(err);
	}
};
