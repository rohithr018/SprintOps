const dotenv = require("dotenv");
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;

const allowedOrigins = [
	FRONTEND_URL,
	"http://localhost:5173",
	"http://localhost:3000",
].filter(Boolean);

module.exports = {
	origin: function (origin, callback) {
		if (!origin) return callback(null, true);

		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error("CORS not allowed"), false);
	},
	credentials: true,
};
