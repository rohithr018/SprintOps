import { useEffect, useState, useMemo } from "react";
import feedbackService from "../../services/feedback.service";
import Modal from "../../components/Modal";
import FeedbackFormModal from "./FeedbackFormModal";
import Loading from "../../components/Loading";
import { FiPlus } from "react-icons/fi";
import { showError } from "../../utils/toast";

export default function FeedbackPanel({ sprintId }) {
	const [feedback, setFeedback] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openForm, setOpenForm] = useState(null);
	const [filter, setFilter] = useState("All");

	const load = async () => {
		setLoading(true);
		try {
			const res = await feedbackService.getFeedback(sprintId);
			setFeedback(res.data.data || []);
		} catch (err) {
			console.error("Failed to load feedback", err);
			showError("Failed to load feedback");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, [sprintId]);

	const colorForType = (type) =>
		type === "Positive"
			? "text-emerald-700 bg-emerald-50 border border-emerald-100"
			: "text-amber-700 bg-amber-50 border border-amber-100";

	const visible = useMemo(() => {
		if (!feedback) return [];
		if (filter === "All") return feedback;
		return feedback.filter((f) => f.type === filter);
	}, [feedback, filter]);

	const counts = useMemo(
		() => ({
			All: feedback.length,
			Positive: feedback.filter((f) => f.type === "Positive").length,
			Constructive: feedback.filter((f) => f.type === "Constructive").length,
		}),
		[feedback]
	);

	return (
		<div className="flex flex-col h-[480px] max-h-[480px] bg-transparent">
			{/* Header */}
			<div className="flex items-center justify-between mb-3 flex-shrink-0">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">Feedback</h3>
					<p className="text-xs text-slate-500">
						Notes, shoutouts & improvement points from this sprint.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="hidden sm:flex items-center gap-1">
						{["All", "Positive", "Constructive"].map((t) => (
							<button
								key={t}
								onClick={() => setFilter(t)}
								className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
									filter === t
										? "bg-slate-900 text-white shadow"
										: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
								}`}
							>
								<span>{t}</span>
								<span className="text-[10px] opacity-70">{counts[t] ?? 0}</span>
							</button>
						))}
					</div>

					<button
						onClick={() => setOpenForm({})}
						className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:brightness-110"
						title="Add Feedback"
					>
						<FiPlus className="text-base" />
						Add
					</button>
				</div>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto pr-2 space-y-3">
				{loading ? (
					<div className="min-height-[200px] flex items-center justify-center">
						<Loading />
					</div>
				) : visible.length === 0 ? (
					<div className="text-sm text-slate-500 p-6 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/60">
						No feedback {filter !== "All" ? `(${filter})` : ""}. Add the first
						item to capture learnings from this sprint.
					</div>
				) : (
					visible.map((f) => (
						<article
							key={f._id}
							className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm flex flex-col md:flex-row justify-between gap-3 hover:shadow-md transition-shadow"
						>
							<div className="flex-1">
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-700 text-sm">
										{(f.source && f.source.charAt(0)) || "U"}
									</div>
									<div>
										<div className="font-medium text-slate-900">
											{f.source || "Unknown"}
										</div>
										<div className="text-[11px] uppercase tracking-wide text-slate-400">
											{f.context}
										</div>
									</div>
								</div>

								<p className="mt-3 text-sm leading-snug text-slate-700 whitespace-pre-line">
									{f.content}
								</p>
							</div>

							<div className="flex flex-col items-start md:items-end gap-2 text-xs">
								<span
									className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${colorForType(
										f.type
									)}`}
								>
									{f.type}
								</span>
								<div className="text-slate-400">
									{new Date(
										f.createdAt || f.date || Date.now()
									).toLocaleString()}
								</div>

								<button
									className="text-blue-600 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
									onClick={() => setOpenForm(f)}
								>
									Edit
								</button>
							</div>
						</article>
					))
				)}
			</div>

			{openForm && (
				<Modal onClose={() => setOpenForm(null)}>
					<FeedbackFormModal
						sprintId={sprintId}
						feedback={openForm}
						onClose={() => {
							setOpenForm(null);
							load();
						}}
					/>
				</Modal>
			)}
		</div>
	);
}
