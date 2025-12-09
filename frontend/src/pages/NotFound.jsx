import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
	return (
		<div
			className="
				min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-slate-100 px-4  "
		>
			<div className="w-full max-w-md text-center backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl rounded-2xl px-8 py-12 ">
				<div className="flex flex-col items-center gap-4">
					{/* Icon bubble */}
					<div
						className="
							w-20 h-20 rounded-full 
							bg-blue-50 text-blue-600 
							flex items-center justify-center 
							shadow-inner border border-blue-100
						"
					>
						<span className="text-3xl font-extrabold">404</span>
					</div>

					{/* Title */}
					<h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>

					{/* Description */}
					<p className="text-sm md:text-base text-slate-600 leading-relaxed">
						The page you're looking for doesn’t exist or may have been moved.
						You can go back to the home page safely.
					</p>

					{/* Button */}
					<Link
						to="/"
						className="
							mt-6 inline-flex items-center gap-2 
							px-6 py-2.5 rounded-full 
							bg-blue-600 text-white font-medium 
							shadow-md hover:bg-blue-700 
							transition active:scale-[0.98]
						"
					>
						<FiArrowLeft className="text-lg" />
						Back to Home
					</Link>

					{/* Small error code */}
					<p className="mt-3 text-xs text-slate-400">
						Error code: <span className="font-mono">404_NOT_FOUND</span>
					</p>
				</div>
			</div>
		</div>
	);
}
