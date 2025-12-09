module.exports = (
	res,
	{ success = true, message = "", data = null, status = 200 }
) => {
	return res.status(status).json({
		success,
		message,
		data,
	});
};
