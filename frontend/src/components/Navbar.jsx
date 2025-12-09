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

	// Close dropdowns on route change
	useEffect(() => {
		setMobileOpen(false);
		setDropdownOpen(false);
		setMobileUserOpen(false);
	}, [location.pathname]);

	// Close desktop dropdown on outside click
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
		<nav
			className="
				fixed top-0 left-0 w-full z-50
				backdrop-blur-xl bg-white/60
				border-b border-white/40
				shadow-[0_2px_12px_rgba(0,0,0,0.06)]
			"
		>
			<div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
				{/* LOGO */}
				<Link to="/" className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200">
						<img src="/icon.svg" alt="SprintOps logo" className="w-6 h-6" />
					</div>

					<span className="font-semibold text-lg text-slate-900 tracking-tight">
						SprintOps
					</span>
				</Link>

				{/* DESKTOP MENU */}
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
								className="
									text-sm px-4 py-1.5 rounded-md
									bg-blue-600 text-white 
									shadow-sm hover:bg-blue-700 transition
								"
							>
								Register
							</Link>
						</>
					)}

					{user && (
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setDropdownOpen((s) => !s)}
								className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/60 transition"
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
								className={`
									absolute right-0 mt-2 w-56 rounded-xl
									backdrop-blur-xl bg-white/80 border border-white/60
									shadow-xl transition-all duration-150
									${
										dropdownOpen
											? "opacity-100 translate-y-0"
											: "opacity-0 -translate-y-2 pointer-events-none"
									}
								`}
							>
								<div className="px-4 py-3">
									<div className="text-sm font-semibold text-slate-900">
										{user.name}
									</div>
									<div className="text-xs text-slate-500">{user.email}</div>
								</div>

								<hr className="border-slate-200" />

								<button
									onClick={() => nav("/profile")}
									className="
										w-full text-left px-4 py-2 flex items-center gap-2
										text-sm text-slate-700 hover:bg-white
									"
								>
									<FiSettings /> Profile
								</button>

								<button
									onClick={onLogout}
									disabled={loading}
									className="
										w-full text-left px-4 py-2 flex items-center gap-2
										text-sm text-slate-700 hover:bg-white
									"
								>
									<FiLogOut /> Logout
								</button>
							</div>
						</div>
					)}
				</div>

				{/* MOBILE MENU BUTTON */}
				<button
					onClick={() => setMobileOpen((s) => !s)}
					className="sm:hidden p-2 rounded-md hover:bg-white/50 transition"
				>
					{mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
				</button>
			</div>

			{/* MOBILE MENU */}
			<div
				className={`
					sm:hidden overflow-hidden 
					transition-[max-height] duration-300
					backdrop-blur-xl bg-white/70 border-t border-white/50
					${mobileOpen ? "max-h-[400px]" : "max-h-0"}
				`}
			>
				<div className="px-6 py-4 space-y-4">
					{!user && (
						<>
							<Link
								to="/login"
								className="block py-2 text-slate-800 font-medium rounded-md hover:bg-white"
							>
								Login
							</Link>

							<Link
								to="/register"
								className="block py-2 text-blue-600 font-medium rounded-md hover:bg-blue-50"
							>
								Register
							</Link>
						</>
					)}

					{/* MOBILE USER MENU */}
					{user && (
						<div>
							<button
								onClick={() => setMobileUserOpen((x) => !x)}
								className="flex items-center gap-3 w-full text-left py-2 rounded-md hover:bg-white"
							>
								<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
									<FiUser className="w-5 h-5" />
								</div>

								<span className="text-sm font-medium text-slate-900">
									{user.name}
								</span>
								<FiChevronDown className="ml-auto text-slate-500" />
							</button>

							<div
								className={`
									mt-2 rounded-md border bg-white/70 shadow-inner overflow-hidden
									transition-all duration-300
									${mobileUserOpen ? "max-h-40 py-2" : "max-h-0"}
								`}
							>
								<div className="px-4 pb-2">
									<div className="text-sm font-semibold text-slate-900">
										{user.name}
									</div>
									<div className="text-xs text-slate-500">{user.email}</div>
								</div>

								<button
									onClick={() => nav("/profile")}
									className="flex items-center gap-2 w-full text-left px-4 py-2 text-slate-700 hover:bg-white"
								>
									<FiSettings /> Profile
								</button>

								<button
									onClick={onLogout}
									className="flex items-center gap-2 w-full text-left px-4 py-2 text-slate-700 hover:bg-white"
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
