const User = require("../models/User");
const Sprint = require("../models/Sprint");
const Task = require("../models/Task");
const PR = require("../models/PR");
const TaskLog = require("../models/TaskLog");
const Feedback = require("../models/Feedback");
// Add any other related models

const bcrypt = require("bcryptjs");
const apiResponse = require("../utils/apiResponse");

// GET
exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find({})
			.select("_id name email createdAt updatedAt")
			.sort({ createdAt: -1 });

		return apiResponse(res, {
			success: true,
			message: "Users fetched",
			data: users.map((u) => ({
				id: u._id,
				name: u.name,
				email: u.email,
				createdAt: u.createdAt,
				updatedAt: u.updatedAt,
			})),
		});
	} catch (err) {
		next(err);
	}
};

// GET
exports.getUserById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).select(
			"_id name email createdAt updatedAt"
		);
		if (!user) {
			return apiResponse(res, {
				success: false,
				message: "User not found",
				status: 404,
			});
		}

		return apiResponse(res, {
			success: true,
			message: "User fetched",
			data: {
				id: user._id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	} catch (err) {
		next(err);
	}
};

// POST
exports.createUser = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return apiResponse(res, {
				success: false,
				message: "Name, email and password are required",
				status: 400,
			});
		}

		const exists = await User.findOne({ email });
		if (exists) {
			return apiResponse(res, {
				success: false,
				message: "Email already registered",
				status: 400,
			});
		}

		const hash = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hash,
		});

		return apiResponse(res, {
			success: true,
			message: "User created",
			status: 201,
			data: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		next(err);
	}
};

// PUT
exports.updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, email, password } = req.body;

		const user = await User.findById(id);
		if (!user) {
			return apiResponse(res, {
				success: false,
				message: "User not found",
				status: 404,
			});
		}

		// Update name
		if (typeof name === "string" && name.trim()) {
			user.name = name.trim();
		}

		// Update email (unique check)
		if (typeof email === "string" && email.trim() && email !== user.email) {
			const exists = await User.findOne({ email: email.trim() });
			if (exists && exists._id.toString() !== user._id.toString()) {
				return apiResponse(res, {
					success: false,
					message: "Email already in use",
					status: 400,
				});
			}
			user.email = email.trim();
		}

		// Update password
		if (typeof password === "string" && password.trim()) {
			const hash = await bcrypt.hash(password, 10);
			user.password = hash;
		}

		await user.save();

		return apiResponse(res, {
			success: true,
			message: "User updated",
			data: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		next(err);
	}
};

// DELETE
exports.deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id);
		if (!user) {
			return apiResponse(res, {
				success: false,
				message: "User not found",
				status: 404,
			});
		}

		await Sprint.deleteMany({ user: id });
		await Task.deleteMany({ user: id });
		await PR.deleteMany({ user: id });
		await TaskLog.deleteMany({ user: id });
		await Feedback.deleteMany({ user: id });
		await user.deleteOne();

		return apiResponse(res, {
			success: true,
			message: "User and all associated data deleted",
			data: { id },
		});
	} catch (err) {
		next(err);
	}
};
