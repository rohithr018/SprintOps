const allowedOrigins = ["http://localhost:5173"].filter(Boolean);

module.exports = {
	origin: allowedOrigins,
	credentials: true,
};
