const mongoose = require("mongoose");

module.exports = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("[INFO] Database Connected");
	} catch (err) {
		console.error("[ERROR] Database Connection Error:", err.message);
		process.exit(1);
	}
};
