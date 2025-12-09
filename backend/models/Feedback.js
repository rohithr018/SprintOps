const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
	{
		sprint: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sprint",
			required: true,
		},
		type: { type: String, enum: ["Positive", "Constructive"], required: true },
		source: {
			type: String,
			enum: ["Manager", "Peer", "Lead", "Self"],
			required: true,
		},
		content: { type: String, required: true },
		context: {
			type: String,
			enum: ["Task-related", "General"],
			default: "General",
		},
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
