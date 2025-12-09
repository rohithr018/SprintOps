const dotenv = require("dotenv");
dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL;

const allowedOrigins = [FRONTEND_URL].filter(Boolean);

module.exports = {
	origin: allowedOrigins,
	credentials: true,
};
