import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/auth.service";
import { showError, showSuccess } from "../utils/toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Register() {
	const nav = useNavigate();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const validate = () => {
		const e = {};
		if (!form.name.trim()) e.name = "Full name is required";

		if (!form.email) e.email = "Email is required";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
			e.email = "Enter a valid email";

		if (!form.password) e.password = "Password is required";
		else if (form.password.length < 6)
			e.password = "Password must be at least 6 characters";

		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const submit = async (ev) => {
		ev.preventDefault();
		if (!validate() || loading) return;

		setLoading(true);
		try {
			const res = await authService.register({
				name: form.name.trim(),
				email: form.email.trim(),
				password: form.password,
			});

			showSuccess(res?.data?.message || "Account created successfully!");
			setForm({ name: "", email: "", password: "" });
			nav("/login");
		} catch (err) {
			const resp = err?.response?.data;

			if (resp?.errors) {
				const fieldErrs = {};
				Object.entries(resp.errors).forEach(([k, v]) => {
					fieldErrs[k] = Array.isArray(v) ? v.join(", ") : String(v);
				});
				setErrors((prev) => ({ ...prev, ...fieldErrs }));
				showError(resp?.message || "Registration failed");
			} else {
				showError(resp?.message || "Registration failed");
			}
		} finally {
			setLoading(false);
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
				<header className="text-center mb-7">
					<h1 className="text-3xl font-bold text-slate-900 tracking-tight">
						Create your account
					</h1>
					<p className="text-sm text-slate-600 mt-1">
						Join SprintOps & start tracking smarter
					</p>
				</header>

				<form onSubmit={submit} className="space-y-5" noValidate>
					{/* FULL NAME */}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Full Name
						</label>
						<input
							value={form.name}
							onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
							placeholder="John Doe"
							autoComplete="name"
							className={`mt-1 block w-full rounded-lg border px-3 py-2.5 
							placeholder:text-slate-400 focus:outline-none focus:ring-2 
							focus:ring-blue-400 transition 
							${errors.name ? "border-red-300" : "border-slate-300"}`}
						/>
						{errors.name && (
							<p className="text-xs text-red-600 mt-1">{errors.name}</p>
						)}
					</div>

					{/* EMAIL */}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Email
						</label>
						<input
							value={form.email}
							onChange={(e) =>
								setForm((f) => ({ ...f, email: e.target.value }))
							}
							placeholder="you@company.com"
							autoComplete="email"
							type="email"
							className={`mt-1 block w-full rounded-lg border px-3 py-2.5 
							placeholder:text-slate-400 focus:outline-none focus:ring-2 
							focus:ring-blue-400 transition 
							${errors.email ? "border-red-300" : "border-slate-300"}`}
						/>
						{errors.email && (
							<p className="text-xs text-red-600 mt-1">{errors.email}</p>
						)}
					</div>

					{/* PASSWORD */}
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								value={form.password}
								onChange={(e) =>
									setForm((f) => ({ ...f, password: e.target.value }))
								}
								placeholder="••••••••"
								autoComplete="new-password"
								className={`mt-1 block w-full rounded-lg border px-3 py-2.5 pr-10 
								placeholder:text-slate-400 focus:outline-none focus:ring-2 
								focus:ring-blue-400 transition 
								${errors.password ? "border-red-300" : "border-slate-300"}`}
							/>
							<button
								type="button"
								onClick={() => setShowPassword((s) => !s)}
								className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
							>
								{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
							</button>
						</div>
						{errors.password && (
							<p className="text-xs text-red-600 mt-1">{errors.password}</p>
						)}
					</div>

					{/* SUBMIT BUTTON */}
					<div className="pt-2">
						<button
							type="submit"
							disabled={loading}
							className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 
							text-white font-medium shadow-md transition disabled:opacity-60"
						>
							{loading ? "Creating..." : "Create Account"}
						</button>
					</div>
				</form>

				{/* FOOTER */}
				<p className="mt-6 text-center text-sm text-slate-600">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-blue-600 font-medium hover:underline"
					>
						Sign in
					</Link>
				</p>
			</motion.div>
		</div>
	);
}
