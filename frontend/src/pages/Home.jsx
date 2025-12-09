import { Link } from "react-router-dom";
import { FiCheck, FiArrowRight, FiBarChart2, FiLayers } from "react-icons/fi";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

/* ---------------- FEATURES ---------------- */
const features = [
	{
		title: "Daily Logging",
		desc: "Capture what you worked on in under 2 minutes.",
		icon: <FiCheck />,
	},
	{
		title: "Pull Requests & Reviews",
		desc: "Track PRs, reviews, and learning insights in one place.",
		icon: <FiLayers />,
	},
	{
		title: "Analytics Dashboard",
		desc: "Visualize sprint insights and personal growth over time.",
		icon: <FiBarChart2 />,
	},
];

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function Home() {
	const user = useSelector((s) => s.user?.user ?? null);

	const LoggedInHero = () => (
		<motion.div
			variants={fadeUp}
			initial="hidden"
			animate="show"
			transition={{ duration: 0.5 }}
			className="text-center"
		>
			<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
				Welcome back,
				<span className="text-blue-600">
					{" " + String(user.name).split(" ")[0]}
				</span>
			</h1>

			<p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
				Manage sprints, log your work, and dive into your personal analytics.
			</p>

			<p className="mt-2 text-slate-500 text-sm md:text-base">
				<span className="font-semibold text-slate-700">
					Prepare for performance reviews like never before.
				</span>{" "}
				Have everything you&apos;ve done, ready to showcase.
			</p>

			<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
				<Link
					to="/dashboard"
					className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full shadow-md transition"
				>
					Open Dashboard <FiArrowRight />
				</Link>

				<Link
					to="/analytics"
					className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
				>
					<FiBarChart2 />
					View Analytics
				</Link>
			</div>
		</motion.div>
	);

	const GuestHero = () => (
		<motion.div
			variants={fadeUp}
			initial="hidden"
			animate="show"
			transition={{ duration: 0.5 }}
			className="text-center"
		>
			<h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
				Track your internship —
				<br />
				<span className="text-blue-600">log smarter, learn faster</span>
			</h1>

			<p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
				A lightweight sprint management tool for interns. Log tasks, daily
				updates, PRs, reviews, and feedback — all in one simple workspace.
			</p>

			<p className="mt-2 text-slate-500 text-sm md:text-base">
				<span className="font-semibold text-slate-700">
					Prepare for performance reviews like never before.
				</span>{" "}
				Show tangible progress with clear timelines and metrics.
			</p>

			<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
				<Link
					to="/register"
					className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full shadow-md transition"
				>
					Get Started <FiArrowRight />
				</Link>

				<Link
					to="/login"
					className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
				>
					Sign in
				</Link>
			</div>
		</motion.div>
	);

	return (
		<div className="pt-35  bg-gradient-to-br from-slate-50 via-white to-slate-100">
			<div className="max-w-6xl mx-auto px-4 flex flex-col justify-center h-full py-10">
				<div className="mx-auto w-full max-w-4xl">
					{user ? <LoggedInHero /> : <GuestHero />}
				</div>

				<motion.div
					initial="hidden"
					animate="show"
					transition={{ delay: 0.1, staggerChildren: 0.1 }}
					className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6"
				>
					{features.map((f) => (
						<motion.div
							key={f.title}
							variants={fadeUp}
							className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col items-start text-left"
						>
							<div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl">
								{f.icon}
							</div>

							<h3 className="mt-3 text-base font-semibold text-slate-900">
								{f.title}
							</h3>
							<p className="mt-1 text-slate-500 text-sm leading-relaxed">
								{f.desc}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
}
