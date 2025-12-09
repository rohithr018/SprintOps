const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const apiResponse = require("../utils/apiResponse");

// Register
exports.register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		const exists = await User.findOne({ email });
		if (exists)
			return apiResponse(res, {
				success: false,
				message: "Email already registered",
				status: 400,
			});

		const hash = await bcrypt.hash(password, 10);

		const user = await User.create({ name, email, password: hash });

		return apiResponse(res, {
			success: true,
			message: "User registered",
			data: { id: user._id, name: user.name, email: user.email },
			status: 201,
		});
	} catch (err) {
		next(err);
	}
};

// Login
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user)
			return apiResponse(res, {
				success: false,
				message: "Invalid credentials",
				status: 400,
			});

		const match = await bcrypt.compare(password, user.password);
		if (!match)
			return apiResponse(res, {
				success: false,
				message: "Invalid credentials",
				status: 400,
			});

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "6h" }
		);

		return apiResponse(res, {
			success: true,
			message: "Login successful",
			data: {
				token,
				user: { id: user._id, name: user.name, email: user.email },
			},
		});
	} catch (err) {
		next(err);
	}
};
