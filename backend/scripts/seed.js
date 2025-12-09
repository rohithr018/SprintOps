require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Sprint = require("../models/Sprint");
const Task = require("../models/Task");
const TaskLog = require("../models/TaskLog");
const PR = require("../models/PR");
const Feedback = require("../models/Feedback");

async function connect() {
	if (!process.env.MONGO_URI) {
		console.error("MONGO_URI missing");
		process.exit(1);
	}
	await mongoose.connect(process.env.MONGO_URI);
}

// Clear collections
async function clearAll() {
	await Promise.all([
		User.deleteMany(),
		Sprint.deleteMany(),
		Task.deleteMany(),
		TaskLog.deleteMany(),
		PR.deleteMany(),
		Feedback.deleteMany(),
	]);
}

// Sprints
const sprintTimeline = [
	{
		name: "Sprint 1",
		goal: "User Authentication & Account Microservice",
		startDate: new Date("2025-08-01T09:00:00Z"),
		endDate: new Date("2025-08-28T17:00:00Z"),
		completed: true,
	},
	{
		name: "Sprint 2",
		goal: "Product Microservice + Search + Aggregations",
		startDate: new Date("2025-09-01T09:00:00Z"),
		endDate: new Date("2025-09-28T17:00:00Z"),
		completed: true,
	},
	{
		name: "Sprint 3",
		goal: "Cart & Wishlist Microservice + Redis Cache",
		startDate: new Date("2025-10-01T09:00:00Z"),
		endDate: new Date("2025-10-28T17:00:00Z"),
		completed: true,
	},
	{
		name: "Sprint 4",
		goal: "Order Service + Payments (Ongoing)",
		// Start mid-Nov so it includes Dec 9, 2025 and is ongoing
		startDate: new Date("2025-11-15T09:00:00Z"),
		endDate: new Date("2025-12-12T17:00:00Z"),
		completed: false,
	},
];

// Skills
const SKILLS = [
	"Node.js",
	"Express",
	"MongoDB",
	"Redis",
	"JWT",
	"Microservices",
	"Docker",
	"Testing",
	"CI/CD",
	"Kubernetes",
	"Observability",
	"GraphQL",
	"TypeScript",
	"Rate Limiting",
	"OAuth2",
	"Design Patterns",
	"Performance Tuning",
	"API Security",
];

async function createUser() {
	const password = await bcrypt.hash("johndoe", 10);
	return User.create({
		name: "John Doe",
		email: "johndoe.test@example.com",
		password,
	});
}

// Story point patterns
const STORYPOINT_PATTERNS = {
	// Balanced / slightly smaller early
	"Sprint 1": [8, 8, 8, 6, 6, 6, 5, 5], // sum = 52
	"Sprint 2": [8, 8, 8, 8, 7, 6, 5, 5], // sum = 55
	"Sprint 3": [9, 9, 8, 8, 7, 6, 6, 5], // sum = 58
	// Sprint 4 planned slightly smaller but mixed status
	"Sprint 4": [8, 8, 7, 7, 7, 6, 5, 5], // sum = 53
};

// Task titles per sprint
const TASK_TITLES = {
	"Sprint 1": [
		"Design user schema and JWT flow",
		"Implement registration & login routes",
		"Password hashing and validation",
		"Refresh token rotation",
		"Rate limiting & input validation",
		"Auth middleware and guards",
		"Auth unit tests",
		"Postman collection + docs",
	],
	"Sprint 2": [
		"Product CRUD API",
		"Category aggregation queries",
		"Search endpoint with pagination",
		"Product image upload & storage",
		"Variant mapping & pricing model",
		"Product validation & sanitization",
		"Product unit & integration tests",
		"API docs and swagger",
	],
	"Sprint 3": [
		"Cart microservice core APIs",
		"Redis caching layer integration",
		"Wishlist API endpoints",
		"Cache invalidation rules",
		"TTL monitoring and alerts",
		"Session handling improvements",
		"Integration tests for cache",
		"Documentation and runbooks",
	],
	"Sprint 4": [
		"Order schema design",
		"Order placement API",
		"Payments integration (Razorpay/placeholder)",
		"Email notifications for orders",
		"Refund flow design (draft)",
		"Idempotency and retries",
		"Webhooks handling",
		"End-to-end order tests",
	],
};

// Random helpers (deterministic-ish but good spread)
function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDateBetween(start, end) {
	const s = start.getTime();
	const e = end.getTime();
	const t = s + Math.floor(Math.random() * (e - s));
	return new Date(t);
}

// Post Sprints
async function createSprints(user) {
	const sprints = [];
	for (const s of sprintTimeline) {
		const spr = await Sprint.create({
			user: user._id,
			name: s.name,
			goal: s.goal,
			startDate: s.startDate,
			endDate: s.endDate,
		});
		sprints.push(spr);
	}
	return sprints;
}

// Post Tasks
async function createTasks(sprints) {
	const allTasks = [];
	for (const sprint of sprints) {
		const pattern = STORYPOINT_PATTERNS[sprint.name];
		const titles = TASK_TITLES[sprint.name];
		for (let i = 0; i < 8; i++) {
			const sp = pattern[i] || 5;
			const title = titles[i] || `Task ${i + 1} for ${sprint.name}`;
			const sprintMeta = sprintTimeline.find((t) => t.name === sprint.name);
			let status;
			if (sprintMeta.completed) {
				status = "Done";
			} else {
				// Ongoing sprint gets mixed statuses
				status = pick(["Todo", "In Progress", "Blocked", "In Progress"]);
			}

			const task = {
				sprint: sprint._id,
				title,
				storyPoints: sp,
				status,
				skills: SKILLS.slice()
					.sort(() => 0.5 - Math.random())
					.slice(0, 3),
				createdAt: randDateBetween(sprintMeta.startDate, sprintMeta.endDate),
			};
			allTasks.push(task);
		}
	}
	return Task.insertMany(allTasks);
}

// Post Task Logs
async function createTaskLogs(sprints) {
	const createdLogs = [];

	for (const sprint of sprints) {
		const sprintMeta = sprintTimeline.find((x) => x.name === sprint.name);
		const tasks = await Task.find({ sprint: sprint._id });
		if (!tasks.length) continue;

		for (let i = 0; i < 20; i++) {
			const task = pick(tasks);
			let summary;
			let progressPercent;
			let timeSpentMinutes = 30 + Math.floor(Math.random() * 180);

			if (task.status === "Done") {
				const doneSteps = [
					`Finished implementation of "${task.title}" and addressed final review comments.`,
					`Wrote unit tests and fixed edge cases for "${task.title}".`,
					`Polished docs and API contract for "${task.title}".`,
					`Merged PR and verified ${task.title} in staging environment.`,
				];
				summary = pick(doneSteps);
				progressPercent = 100;
			} else {
				const inProgressSteps = [
					`Implemented core endpoints for "${task.title}" and started testing.`,
					`Fixed bugs and optimized query performance for "${task.title}".`,
					`Worked on integration with Redis/cache for "${task.title}".`,
					`Refactored parts of the "${task.title}" flow to improve error handling.`,
					`WIP: added input validation and started writing tests for "${task.title}".`,
				];
				summary = pick(inProgressSteps);
				progressPercent = Math.min(95, Math.floor(Math.random() * 80) + 10);
			}

			const logDate = randDateBetween(
				new Date(sprintMeta.startDate.getTime()),
				new Date(Math.min(Date.now(), sprintMeta.endDate.getTime()))
			);

			createdLogs.push({
				sprint: sprint._id,
				task: task._id,
				summary,
				skillsUsed: task.skills.slice(0, 2),
				timeSpentMinutes,
				progressPercent,
				date: logDate,
			});
		}
	}

	return TaskLog.insertMany(createdLogs);
}

// Post Prs
async function createPRs(sprints) {
	const createdPRs = [];

	for (const sprint of sprints) {
		const sprintMeta = sprintTimeline.find((x) => x.name === sprint.name);
		const tasks = await Task.find({ sprint: sprint._id });

		for (let i = 0; i < 8; i++) {
			const candidate = tasks.find((t) => t.status !== "Todo") || pick(tasks);
			const statuses = sprintMeta.completed
				? ["Merged", "Merged", "Merged", "Under Review"]
				: ["Created", "Under Review", "Created", "Under Review"];
			const status = pick(statuses);

			const createdAt = randDateBetween(
				sprintMeta.startDate,
				sprintMeta.endDate
			);

			createdPRs.push({
				sprint: sprint._id,
				title: `PR – ${candidate.title} (${i + 1})`,
				purpose: "Code Review",
				summary: `Implemented work for "${candidate.title}" — changes include logic, tests and docs.`,
				challenges:
					"Minor merge conflicts and some edge case fixes in validation logic.",
				skillsUsed: candidate.skills,
				status,
				createdAt,
			});
		}
	}

	return PR.insertMany(createdPRs);
}

// Post Feedbacks
async function createFeedback(sprints) {
	const FEEDBACK_SOURCES = ["Manager", "Peer", "Lead", "Self"];
	const createdFeedback = [];

	for (const sprint of sprints) {
		const sprintMeta = sprintTimeline.find((x) => x.name === sprint.name);
		for (let i = 0; i < 8; i++) {
			const positive = Math.random() > 0.4;
			const source = pick(FEEDBACK_SOURCES);
			const positiveMessages = [
				`Showed strong ownership during ${sprint.name}.`,
				`Good clarity and test coverage in delivered features of ${sprint.name}.`,
				`Consistent progress and helpful in code reviews during ${sprint.name}.`,
				`Well structured PRs and useful documentation work in ${sprint.name}.`,
			];
			const constructiveMessages = [
				`Improve commit messages and PR descriptions for ${sprint.name}.`,
				`Break large tasks into smaller deliverables next sprint.`,
				`More end-to-end testing needed for critical flows.`,
				`Focus on better error handling and edge cases in ${sprint.name}.`,
			];

			createdFeedback.push({
				sprint: sprint._id,
				type: positive ? "Positive" : "Constructive",
				source,
				content: positive ? pick(positiveMessages) : pick(constructiveMessages),
				context: positive ? "General" : "Task-related",
				date: randDateBetween(sprintMeta.startDate, sprintMeta.endDate),
			});
		}
	}

	return Feedback.insertMany(createdFeedback);
}

async function seed() {
	try {
		console.log("Connecting to DB...");
		await connect();

		console.log("Clearing database...");
		await clearAll();

		console.log("Creating user...");
		const user = await createUser();
		console.log("User created:", user.email);

		console.log("Creating sprints...");
		const sprints = await createSprints(user);
		console.log("Inserted", sprints.length, "sprints.");

		console.log("Creating tasks...");
		const tasks = await createTasks(sprints);
		console.log("Inserted", tasks.length, "tasks.");

		console.log("Creating task logs...");
		const logs = await createTaskLogs(sprints);
		console.log("Inserted", logs.length, "task logs.");

		console.log("Creating PRs...");
		const prs = await createPRs(sprints);
		console.log("Inserted", prs.length, "PRs.");

		console.log("Creating feedback...");
		const fb = await createFeedback(sprints);
		console.log("Inserted", fb.length, "feedbacks.");

		console.log("🎉 Seed completed successfully!");
	} catch (err) {
		console.error("❌ Seed Error:", err);
	} finally {
		await mongoose.connection.close();
		process.exit(0);
	}
}

seed();
