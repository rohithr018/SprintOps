import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiFolder } from "react-icons/fi";
import sprintService from "../services/sprint.service";
import Loading from "../components/Loading";
import { showError, showSuccess } from "../utils/toast";
import SprintFormModal from "../components/SprintFormModal";

const formatDate = (iso) =>
	iso
		? new Intl.DateTimeFormat("en-IN", {
				year: "numeric",
				month: "short",
				day: "numeric",
		  }).format(new Date(iso))
		: "-";

export default function Dashboard() {
	const mounted = useRef(true);
	const navigate = useNavigate();
	const user = useSelector((s) => s.user?.user ?? null);

	const [sprints, setSprints] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	const extractSprintArray = (res) => {
		const payload = res?.data ?? res;
		if (!payload) return [];
		if (Array.isArray(payload)) return payload;
		if (Array.isArray(payload.data)) return payload.data;
		if (payload.data && typeof payload.data === "object") return [payload.data];
		if (payload._id || payload.id) return [payload];
		return [];
	};

	const load = async () => {
		setLoading(true);
		if (!user) {
			setSprints([]);
			setLoading(false);
			return;
		}
		try {
			const res = await sprintService.getSprints();
			if (!mounted.current) return;
			setSprints(extractSprintArray(res));
		} catch (err) {
			showError(err?.response?.data?.message || "Failed to load sprints");
			setSprints([]);
		} finally {
			if (mounted.current) setLoading(false);
		}
	};

	useEffect(() => {
		mounted.current = true;
		load();
		return () => (mounted.current = false);
	}, [user]);

	const handleCreateSubmit = async (values) => {
		try {
			await sprintService.createSprint(values);
			showSuccess("Sprint created");
			setOpen(false);
			await load();
		} catch (err) {
			showError(err?.response?.data?.message || "Failed to create sprint");
			throw err;
		}
	};

	const getStatusBadge = (sprint) => {
		const end = sprint.endDate ? new Date(sprint.endDate) : null;

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (end) end.setHours(0, 0, 0, 0);

		const completed = end && end < today;

		return (
			<span
				className={`px-2.5 py-0.5 text-xs rounded-full border font-medium ${
					completed
						? "text-slate-600 bg-slate-100 border-slate-300"
						: "text-emerald-700 bg-emerald-100 border-emerald-200"
				}`}
			>
				{completed ? "Completed" : "Ongoing"}
			</span>
		);
	};

	return (
		<div className="px-4 md:px-6 lg:px-10 py-6 space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-100  min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between bg-white/80 border border-slate-200 rounded-xl shadow-sm p-5 backdrop-blur-sm">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Your Sprints</h1>
					<p className="text-sm text-slate-500 mt-1">
						Personal workspace — only visible to you
					</p>
				</div>

				<button
					onClick={() => setOpen(true)}
					className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition"
				>
					<FiPlus /> New Sprint
				</button>
			</div>

			{/* Loading */}
			{loading && (
				<div className="flex justify-center py-12">
					<Loading />
				</div>
			)}

			{/* Empty State */}
			{!loading && sprints.length === 0 && (
				<div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 text-center max-w-lg mx-auto">
					<p className="text-slate-600 mb-4 text-sm">
						You have no sprints yet. Start by creating your first one.
					</p>
					<button
						onClick={() => setOpen(true)}
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow"
					>
						<FiPlus /> Create Sprint
					</button>
				</div>
			)}

			{/* Sprint Grid */}
			{!loading && sprints.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{sprints.map((s) => {
						const id = s._id ?? s.id;
						return (
							<div
								key={id}
								onClick={() => navigate(`/sprint/${id}`)}
								className="cursor-pointer bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
							>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-blue-50 transition">
											<FiFolder className="text-slate-600 group-hover:text-blue-600 transition" />
										</div>
										<h3 className="font-semibold text-slate-800">{s.name}</h3>
									</div>

									{getStatusBadge(s)}
								</div>

								<p className="text-sm text-slate-600">
									{s.goal || "No goal specified"}
								</p>

								<div className="text-xs text-slate-400 mt-4 font-medium">
									{formatDate(s.startDate)} → {formatDate(s.endDate)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Create Sprint Modal */}
			<SprintFormModal
				isOpen={open}
				mode="create"
				initialData={null}
				onSubmit={handleCreateSubmit}
				onClose={() => setOpen(false)}
			/>
		</div>
	);
}
