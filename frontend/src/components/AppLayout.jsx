// src/layouts/AppLayout.jsx
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import SuspenseFallback from "../components/SuspenseFallback";
export default function AppLayout() {
	return (
		<div className="min-h-screen bg-slate-50">
			<Navbar />
			<main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
				<Suspense fallback={<SuspenseFallback />}>
					<Outlet />
				</Suspense>
			</main>
		</div>
	);
}
