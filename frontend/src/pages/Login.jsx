import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Loading from "../components/Loading";
import { showError, showSuccess } from "../utils/toast";
import { loginStart, loginSuccess, loginFailure } from "../redux/userslice";
import authService from "../services/auth.service";
import { motion } from "framer-motion";

export default function Login() {
	const dispatch = useDispatch();
	const auth = useSelector((s) => s.user);
	const nav = useNavigate();

	const [form, setForm] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [serverError, setServerError] = useState("");

	useEffect(() => {
		if (auth?.token) {
			nav("/");
		}
	}, [auth?.token, nav]);

	const validate = () => {
		const e = {};
		const email = (form.email || "").trim();
		const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		if (!email) e.email = "Email is required";
		else if (!emailRE.test(email)) e.email = "Enter a valid email";
		if (!form.password) e.password = "Password is required";
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const submit = async (ev) => {
		ev.preventDefault();
		setServerError("");
		if (!validate()) return;

		dispatch(loginStart());
		try {
			const res = await authService.login({
				email: form.email.trim(),
				password: form.password,
			});

			const payload = res.data?.data ?? res.data ?? {};
			const token = payload.token ?? payload.accessToken ?? null;
			const user = payload.user ?? payload.userData ?? null;

			dispatch(loginSuccess({ user, token }));
			showSuccess("Logged in successfully");
			nav("/");
		} catch (err) {
			const message =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				"Login failed";
			dispatch(loginFailure(message));
			setServerError(message);
			showError(message);
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center 
		bg-gradient-to-br from-white via-white to-slate-100 px-4"
		>
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35 }}
				className="w-full max-w-md backdrop-blur-xl bg-white/50 
				border border-white/60 shadow-xl rounded-2xl p-8 sm:p-10"
			>
				{/* HEADER */}
				<header className="mb-7 text-center">
					<h1 className="text-3xl font-bold text-slate-900 tracking-tight">
						Welcome Back 👋
					</h1>
					<p className="text-sm text-slate-600 mt-1">
						Sign in to access your workspace
					</p>
				</header>

				<form onSubmit={submit} className="space-y-5" noValidate>
					{/* EMAIL INPUT */}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Email
						</label>

						<input
							type="email"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							placeholder="you@company.com"
							className={`mt-1 block w-full rounded-lg border px-3 py-2.5 
							placeholder:text-slate-400 focus:outline-none focus:ring-2 
							focus:ring-blue-400 transition 
							${errors.email ? "border-red-300" : "border-slate-300"}`}
						/>

						{errors.email && (
							<p className="mt-1 text-xs text-red-600">{errors.email}</p>
						)}
					</div>

					{/* PASSWORD INPUT */}
					<div className="relative">
						<label className="block text-sm font-medium text-slate-700">
							Password
						</label>

						<input
							type={showPassword ? "text" : "password"}
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
							placeholder="••••••••"
							className={`mt-1 block w-full rounded-lg border px-3 py-2.5 pr-10 
							placeholder:text-slate-400 focus:outline-none focus:ring-2 
							focus:ring-blue-400 transition 
							${errors.password ? "border-red-300" : "border-slate-300"}`}
						/>

						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-9 text-slate-500 hover:text-slate-700"
						>
							{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
						</button>

						{errors.password && (
							<p className="mt-1 text-xs text-red-600">{errors.password}</p>
						)}
					</div>

					{/* SUBMIT BUTTON */}
					<button
						type="submit"
						disabled={auth.loading}
						className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 
						text-white py-2.5 font-medium shadow-lg transition 
						disabled:opacity-60 focus:outline-none focus:ring-2 
						focus:ring-blue-300"
					>
						{auth.loading ? <Loading inline color="text-black" /> : "Sign in"}
					</button>
				</form>

				{/* FOOTER */}
				<footer className="mt-6 text-center text-sm text-slate-600">
					New to the platform?{" "}
					<Link
						to="/register"
						className="text-blue-600 font-medium hover:underline"
					>
						Create an account
					</Link>
				</footer>
			</motion.div>
		</div>
	);
}
