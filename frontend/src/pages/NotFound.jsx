import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
	return (
		<div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
			<div className="max-w-md w-full text-center bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg px-8 py-10">
				<div className="flex flex-col items-center gap-3">
					<div className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600 w-16 h-16 shadow-inner">
						<span className="text-2xl font-bold">404</span>
					</div>

					<h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
						Page not found
					</h1>

					<p className="text-sm md:text-base text-slate-500 mt-1">
						The page you&apos;re looking for doesn&apos;t exist or may have been
						moved. Check the URL, or go back to the dashboard.
					</p>

					<div className="mt-6">
						<Link
							to="/"
							className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-blue-600 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition"
						>
							<FiArrowLeft className="text-base" />
							<span>Back to Home</span>
						</Link>
					</div>

					<p className="mt-4 text-xs text-slate-400">
						Error code: <span className="font-mono">404_NOT_FOUND</span>
					</p>
				</div>
			</div>
		</div>
	);
}
