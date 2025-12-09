import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userslice";
import { showError, showSuccess } from "../utils/toast";

import {
	FiLogOut,
	FiMenu,
	FiX,
	FiUser,
	FiChevronDown,
	FiSettings,
} from "react-icons/fi";

export default function Navbar() {
	const dispatch = useDispatch();
	const nav = useNavigate();
	const location = useLocation();

	const user = useSelector((s) => s.user?.user ?? null);
	const loading = useSelector((s) => s.user?.loading ?? false);

	const [mobileOpen, setMobileOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileUserOpen, setMobileUserOpen] = useState(false);

	const dropdownRef = useRef(null);

	const onLogout = () => {
		try {
			dispatch(logout());
			showSuccess("Logged out successfully.");
			nav("/login");
		} catch (err) {
			console.error("Logout error:", err);
			showError("Error logging out. Please try again.");
		}
	};

	// close dropdown on route change
	useEffect(() => {
		setMobileOpen(false);
		setDropdownOpen(false);
		setMobileUserOpen(false);
	}, [location.pathname]);

	// close dropdown on outside click
	useEffect(() => {
		const handler = (e) => {
			if (
				dropdownOpen &&
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target)
			) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [dropdownOpen]);

	return (
		<nav className="fixed top-0 left-0 w-full z-50 border-b bg-gradient-to-br from-slate-50 via-white to-slate-100 backdrop-blur-xl">
			<div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-100 flex items-center justify-center shadow-sm">
							<img
								src="/icon.svg"
								alt="SprintOps logo"
								className="w-6 h-6 font-bold "
							/>
						</div>
						<span className="font-semibold text-lg text-slate-900 tracking-tight">
							SprintOps
						</span>
					</div>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden sm:flex items-center gap-5">
					{!user && (
						<>
							<Link
								to="/login"
								className="text-sm text-slate-700 hover:text-blue-600 transition"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md shadow-sm transition"
							>
								Register
							</Link>
						</>
					)}

					{user && (
						<div className="relative" ref={dropdownRef}>
							{/* DESKTOP TRIGGER */}
							<button
								onClick={() => setDropdownOpen((s) => !s)}
								className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 transition"
							>
								<div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
									<FiUser className="w-5 h-5" />
								</div>

								<span className="text-sm font-medium text-slate-900">
									{user.name}
								</span>

								<FiChevronDown className="w-4 h-4 text-slate-500" />
							</button>

							{/* DESKTOP DROPDOWN */}
							<div
								className={`absolute right-0 mt-2 w-52 bg-white rounded-lg border shadow-lg py-2 transition-all duration-150 ${
									dropdownOpen
										? "opacity-100 translate-y-0"
										: "opacity-0 -translate-y-2 pointer-events-none"
								}`}
							>
								{/* Name + Email */}
								<div className="px-4 py-2">
									<div className="text-sm font-semibold text-slate-900">
										{user.name}
									</div>
									<div className="text-xs text-slate-500">{user.email}</div>
								</div>

								<hr className="my-1" />

								{/* Profile */}
								<button
									onClick={() => {
										setDropdownOpen(false);
										nav("/profile");
									}}
									className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
								>
									<FiSettings /> Profile
								</button>

								{/* Logout */}
								<button
									onClick={onLogout}
									disabled={loading}
									className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
								>
									<FiLogOut /> Logout
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					onClick={() => setMobileOpen((s) => !s)}
					className="sm:hidden p-2 rounded-md hover:bg-slate-100 transition"
				>
					{mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
				</button>
			</div>

			{/* MOBILE MENU */}
			<div
				className={`sm:hidden overflow-hidden transition-[max-height] duration-300 bg-white border-t ${
					mobileOpen ? "max-h-screen" : "max-h-0"
				}`}
			>
				<div className="px-6 py-4 space-y-4">
					{/* Login/Register */}
					{!user && (
						<>
							<Link
								to="/login"
								onClick={() => setMobileOpen(false)}
								className="block py-2 text-slate-800 font-medium rounded-md hover:bg-slate-50"
							>
								Login
							</Link>
							<Link
								to="/register"
								onClick={() => setMobileOpen(false)}
								className="block py-2 text-blue-600 font-medium rounded-md hover:bg-blue-50"
							>
								Register
							</Link>
						</>
					)}

					{/* MOBILE USER SECTION */}
					{user && (
						<div>
							<button
								onClick={() => setMobileUserOpen((x) => !x)}
								className="flex items-center gap-3 w-full text-left py-2 rounded-md hover:bg-slate-50"
							>
								<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
									<FiUser className="w-5 h-5" />
								</div>

								<span className="text-sm font-medium text-slate-900">
									{user.name}
								</span>

								<FiChevronDown className="ml-auto text-slate-500" />
							</button>

							{/* MOBILE DROPDOWN */}
							<div
								className={`mt-2 rounded-md border bg-white overflow-hidden transition-all ${
									mobileUserOpen ? "max-h-40 py-2" : "max-h-0"
								}`}
							>
								{/* Name + email */}
								<div className="px-4 pb-2">
									<div className="text-sm font-semibold text-slate-900">
										{user.name}
									</div>
									<div className="text-xs text-slate-500">{user.email}</div>
								</div>

								{/* Profile */}
								<button
									onClick={() => {
										setMobileOpen(false);
										nav("/profile");
									}}
									className="flex items-center gap-2 w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
								>
									<FiSettings /> Profile
								</button>

								{/* Logout */}
								<button
									onClick={() => {
										setMobileOpen(false);
										onLogout();
									}}
									className="flex items-center gap-2 w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
								>
									<FiLogOut /> Logout
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
