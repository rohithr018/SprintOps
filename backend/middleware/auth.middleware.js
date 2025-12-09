const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const DEMO_EMAIL = "johndoe.test@example.com";

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ")
		? authHeader.split(" ")[1]
		: null;

	if (!token) {
		return res.status(403).json({
			success: false,
			message: "Forbidden",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id || decoded._id;

		req.isDemo = decoded.email === DEMO_EMAIL;
		// if (!req.isDemo && !mongoose.Types.ObjectId.isValid(req.userId)) {
		// 	return res.status(401).json({
		// 		success: false,
		// 		message: "Invalid token payload",
		// 	});
		// }
		if (!req.isDemo && !mongoose.Types.ObjectId.isValid(req.userId)) {
			return res.status(403).json({
				success: false,
				message: "Forbidden",
			});
		}

		next();
	} catch (err) {
		// return res.status(401).json({ success: false, message: "Invalid token" });
		return res.status(403).json({
			success: false,
			message: "Forbidden",
		});
	}
};
