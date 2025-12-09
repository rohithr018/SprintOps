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
		} catch {
			showError("Error logging out.");
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
		<nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
			<div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
				{/* LOGO */}
				<Link to="/" className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
						<img src="/icon.svg" alt="SprintOps logo" className="w-6 h-6" />
					</div>
					<span className="font-semibold text-lg text-slate-900 tracking-tight">
						SprintOps
					</span>
				</Link>

				{/* DESKTOP MENU */}
				<div className="hidden sm:flex items-center gap-5">
					{!user ? (
						<>
							<Link
								to="/login"
								className="text-sm text-slate-700 hover:text-blue-600 transition"
							>
								Login
							</Link>

							<Link
								to="/register"
								className="text-sm px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
							>
								Register
							</Link>
						</>
					) : (
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setDropdownOpen((s) => !s)}
								className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition"
							>
								<div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
									<FiUser className="w-5 h-5" />
								</div>

								<span className="text-sm font-medium text-slate-900">
									{user.name}
								</span>
								<FiChevronDown className="w-4 h-4 text-slate-600" />
							</button>

							{/* SIMPLE DESKTOP DROPDOWN */}
							<div
								className={`
									absolute right-0 mt-2 w-48 rounded-md bg-white border border-slate-200 shadow-md 
									transition-all duration-150
									${
										dropdownOpen
											? "opacity-100 translate-y-0"
											: "opacity-0 -translate-y-2 pointer-events-none"
									}
								`}
							>
								<button
									onClick={() => nav("/profile")}
									className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center gap-2 text-slate-700"
								>
									<FiSettings /> Profile
								</button>

								<button
									onClick={onLogout}
									className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center gap-2 text-red-600"
									disabled={loading}
								>
									<FiLogOut /> Logout
								</button>
							</div>
						</div>
					)}
				</div>

				{/* MOBILE TOGGLE */}
				<button
					onClick={() => setMobileOpen((s) => !s)}
					className="sm:hidden p-2 rounded-md hover:bg-slate-100 transition"
				>
					{mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
				</button>
			</div>

			{/* MOBILE MENU */}
			<div
				className={`
					sm:hidden overflow-hidden transition-[max-height] duration-300 bg-white border-t border-slate-200
					${mobileOpen ? "max-h-[400px]" : "max-h-0"}
				`}
			>
				<div className="px-6 py-4 space-y-4">
					{!user ? (
						<>
							<Link
								to="/login"
								className="block py-2 hover:bg-slate-100 rounded-md"
							>
								Login
							</Link>

							<Link
								to="/register"
								className="block py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md"
							>
								Register
							</Link>
						</>
					) : (
						<div>
							<button
								onClick={() => setMobileUserOpen((x) => !x)}
								className="flex items-center gap-3 w-full text-left py-2 rounded-md hover:bg-slate-100"
							>
								<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
									<FiUser className="w-5 h-5 text-slate-700" />
								</div>

								<span className="text-sm font-medium">{user.name}</span>

								<FiChevronDown className="ml-auto text-slate-500" />
							</button>

							<div
								className={`
									overflow-hidden transition-all duration-300
									${mobileUserOpen ? "max-h-40" : "max-h-0"}
								`}
							>
								<button
									onClick={() => nav("/profile")}
									className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm"
								>
									<FiSettings className="inline-block mr-2" /> Profile
								</button>

								<button
									onClick={onLogout}
									className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-red-600"
								>
									<FiLogOut className="inline-block mr-2" /> Logout
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
