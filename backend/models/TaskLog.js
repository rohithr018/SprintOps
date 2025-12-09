const mongoose = require("mongoose");

const taskLogSchema = new mongoose.Schema(
	{
		sprint: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sprint",
			required: true,
		},
		task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
		summary: String,
		skillsUsed: [{ type: String }],
		timeSpentMinutes: { type: Number, default: 0 },
		progressPercent: { type: Number, default: 0 },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("TaskLog", taskLogSchema);
