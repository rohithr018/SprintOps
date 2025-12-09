const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
		goal: String,
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Sprint", sprintSchema);
