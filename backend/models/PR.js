const mongoose = require("mongoose");

const prSchema = new mongoose.Schema(
	{
		sprint: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sprint",
			required: true,
		},
		title: { type: String, required: true },
		purpose: String,
		summary: String,
		challenges: String,
		skillsUsed: [{ type: String }],
		status: {
			type: String,
			enum: ["Created", "Under Review", "Merged"],
			default: "Created",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("PR", prSchema);
