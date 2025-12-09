import toast from "react-hot-toast";

// Success toast
export const showSuccess = (msg = "Success!") =>
	toast.success(msg, {
		duration: 3000,
		style: {
			borderRadius: "8px",
			background: "#ecfdf5",
			color: "#065f46",
		},
		iconTheme: {
			primary: "#059669",
			secondary: "#ffffff",
		},
	});

// Error toast
export const showError = (msg = "Something went wrong.") =>
	toast.error(msg, {
		duration: 3500,
		style: {
			borderRadius: "8px",
			background: "#fef2f2",
			color: "#991b1b",
		},
		iconTheme: {
			primary: "#dc2626",
			secondary: "#ffffff",
		},
	});

// Promise-based toast
export const showPromise = (promise, msgs) =>
	toast.promise(promise, msgs, {
		style: {
			borderRadius: "8px",
			background: "#f8fafc",
			color: "#1e293b",
		},
		success: {
			duration: 3000,
		},
		error: {
			duration: 3500,
		},
		loading: {
			duration: 2000,
		},
	});

export default {
	showSuccess,
	showError,
	showPromise,
};
