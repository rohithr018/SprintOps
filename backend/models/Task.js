const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
	{
		sprint: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sprint",
			required: true,
		},
		title: { type: String, required: true },
		description: String,
		storyPoints: { type: Number, default: 0 },
		skills: [{ type: String }],
		status: {
			type: String,
			enum: ["Todo", "In Progress", "Blocked", "Done"],
			default: "Todo",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
