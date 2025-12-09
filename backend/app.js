const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const corsOptions = require("./config/cors");
const errorHandler = require("./middleware/error.middleware");
const authMiddleware = require("./middleware/auth.middleware");

const authRoutes = require("./routes/auth.routes");
const sprintRoutes = require("./routes/sprint.routes");
const taskRoutes = require("./routes/task.routes");
const prRoutes = require("./routes/pr.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/user.routes");
const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000,
});
app.use(limiter);

app.use("/health", healthRoutes);

app.use("/auth", authRoutes);

app.use(authMiddleware);
app.use("/users", userRoutes);
app.use("/sprints", sprintRoutes);
app.use("/sprints/:sprintId/tasks", taskRoutes);
app.use("/sprints/:sprintId/prs", prRoutes);
app.use("/sprints/:sprintId/feedback", feedbackRoutes);
app.use("/analytics", analyticsRoutes);

app.use((req, res) => {
	return res.status(403).json({
		success: false,
		message: "Access forbidden",
	});
});
app.use(errorHandler);

module.exports = app;
