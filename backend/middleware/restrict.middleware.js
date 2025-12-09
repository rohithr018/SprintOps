module.exports = (req, res, next) => {
	if (req.isDemo) {
		return res.status(403).json({
			success: false,
			message:
				"This Account is only for Demo Purposes. Modifications are not allowed.",
		});
	}
	next();
};
