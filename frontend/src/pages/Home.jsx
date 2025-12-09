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

/* ---------------- ANIMATIONS ---------------- */
const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const container = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.18 },
	},
};

export default function Home() {
	const user = useSelector((s) => s.user?.user ?? null);

	/* ---------------- HERO ---------------- */
	const LoggedInHero = () => (
		<motion.div
			variants={fadeUp}
			initial="hidden"
			animate="show"
			className="text-center"
		>
			<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
				Welcome back,
				<span className="text-blue-600">
					{" " + String(user.name).split(" ")[0]}
				</span>
			</h1>

			<p className="mt-5 text-slate-600 max-w-2xl mx-auto text-xl">
				Manage sprints, log your work, and explore meaningful insights.
			</p>

			<p className="mt-3 text-slate-500 max-w-xl mx-auto text-base">
				<span className="font-semibold text-slate-700">
					Prepare for performance reviews like never before.
				</span>{" "}
				Your progress — perfectly organized & ready to showcase.
			</p>

			<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
				<Link
					to="/dashboard"
					className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full shadow-md transition"
				>
					Open Dashboard <FiArrowRight />
				</Link>

				<Link
					to="/analytics"
					className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition"
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
			className="text-center"
		>
			<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
				Track your internship —
				<br />
				<span className="text-blue-600">log smarter, learn faster</span>
			</h1>

			<p className="mt-5 text-slate-600 max-w-2xl mx-auto text-xl">
				A simple workspace for tasks, updates, PRs, reviews, and feedback.
			</p>

			<p className="mt-3 text-slate-500 max-w-xl mx-auto text-base">
				<span className="font-semibold text-slate-700">Prepare better.</span>{" "}
				Show measurable growth with clear timelines & analytics.
			</p>

			<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
				<Link
					to="/register"
					className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full shadow-md transition"
				>
					Get Started <FiArrowRight />
				</Link>

				<Link
					to="/login"
					className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition"
				>
					Sign in
				</Link>
			</div>
		</motion.div>
	);

	return (
		<section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 px-6">
			<div className="w-full max-w-6xl flex flex-col items-center">
				{/* HERO */}
				<div className="text-center max-w-3xl">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
						{user ? (
							<>
								Welcome back,
								<span className="text-blue-600">
									{" " + String(user.name).split(" ")[0]}
								</span>
							</>
						) : (
							<>
								Track your internship — <br />
								<span className="text-blue-600">log smarter, learn faster</span>
							</>
						)}
					</h1>

					<p className="mt-4 text-slate-600 text-lg">
						{user
							? "Manage sprints, log your work, and explore meaningful insights."
							: "A simple workspace for tasks, PRs, reviews, and feedback."}
					</p>

					<p className="mt-2 text-slate-500 text-sm md:text-base">
						<span className="font-semibold text-slate-700">
							Prepare for performance reviews like never before.
						</span>{" "}
						Your progress—organized, clean, and ready to showcase.
					</p>

					<div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
						{user ? (
							<>
								<Link
									to="/dashboard"
									className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow transition"
								>
									Open Dashboard <FiArrowRight />
								</Link>
								<Link
									to="/analytics"
									className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition"
								>
									<FiBarChart2 /> View Analytics
								</Link>
							</>
						) : (
							<>
								<Link
									to="/register"
									className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow transition"
								>
									Get Started <FiArrowRight />
								</Link>
								<Link
									to="/login"
									className="inline-flex items-center px-6 py-3 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition"
								>
									Sign in
								</Link>
							</>
						)}
					</div>
				</div>

				{/* SPACING BETWEEN HERO & FEATURES (small so whole fits on screen) */}
				<div className="h-10"></div>

				{/* FEATURES */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
					{features.map((f) => (
						<div
							key={f.title}
							className="backdrop-blur-xl bg-white/40 border border-white/50 shadow-lg rounded-xl p-5 text-center hover:bg-white/60 transition"
						>
							<div className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-xl">
								{f.icon}
							</div>
							<h3 className="mt-3 text-lg font-semibold text-slate-900">
								{f.title}
							</h3>
							<p className="mt-1 text-slate-700 text-sm">{f.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
