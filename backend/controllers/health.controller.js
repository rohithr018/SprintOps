const mongoose = require("mongoose");
const os = require("os");

const bytesToMB = (bytes) => Math.round((bytes / 1024 / 1024) * 100) / 100;

const mapDbState = (state) =>
	({
		0: "disconnected",
		1: "connected",
		2: "connecting",
		3: "disconnecting",
	}[state] || "unknown");

const buildHealthPayload = ({ dbStatus, dbOk, dbLatencyMs }) => {
	const env = process.env.NODE_ENV || "development";
	const version =
		process.env.APP_VERSION || process.env.npm_package_version || "unknown";

	const mem = process.memoryUsage();

	return {
		status: dbOk ? "ok" : "degraded",
		timestamp: new Date().toISOString(),

		environment: env,
		version,

		uptime: {
			seconds: Math.floor(process.uptime()),
		},

		os: {
			platform: os.platform(),
			arch: os.arch(),
			release: os.release(),
			uptime: os.uptime(),
			loadavg: os.loadavg(),
		},

		process: {
			pid: process.pid,
			nodeVersion: process.version,
			memory: {
				rssMB: bytesToMB(mem.rss),
				heapTotalMB: bytesToMB(mem.heapTotal),
				heapUsedMB: bytesToMB(mem.heapUsed),
				externalMB: bytesToMB(mem.external),
			},
		},

		database: {
			status: dbStatus,
			ok: dbOk,
			latencyMs: dbLatencyMs,
		},
	};
};

const healthCheck = async (req, res) => {
	try {
		const dbState = mongoose.connection.readyState;
		const dbStatus = mapDbState(dbState);

		let dbOk = dbState === 1;
		let dbLatencyMs = null;

		if (dbOk && mongoose.connection.db?.admin) {
			const start = Date.now();
			try {
				await mongoose.connection.db.admin().ping();
				dbLatencyMs = Date.now() - start;
			} catch (err) {
				dbOk = false;
			}
		}

		const payload = buildHealthPayload({ dbStatus, dbOk, dbLatencyMs });

		return res.status(dbOk ? 200 : 503).json(payload);
	} catch (err) {
		return res.status(500).json({
			status: "error",
			error: "Health check failed",
			details: err.message,
			timestamp: new Date().toISOString(),
		});
	}
};

module.exports = { healthCheck };
