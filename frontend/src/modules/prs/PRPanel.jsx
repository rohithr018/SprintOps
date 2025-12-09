import { useEffect, useState } from "react";
import prService from "../../services/pr.service";
import PRFormModal from "./PRFormModal";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";
import { FiPlus, FiClock } from "react-icons/fi";
import { showError } from "../../utils/toast";

export default function PRPanel({ sprintId }) {
	const [prs, setPRs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openForm, setOpenForm] = useState(null);

	const load = async () => {
		setLoading(true);
		try {
			const res = await prService.getPRs(sprintId);
			setPRs(res.data.data || []);
		} catch (err) {
			console.error("Failed to load PRs", err);
			showError("Failed to load PRs");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, [sprintId]);

	const statusColor = (status) => {
		switch (status) {
			case "Created":
				return "bg-slate-100 text-slate-700";
			case "Under Review":
				return "bg-yellow-100 text-yellow-700";
			case "Merged":
				return "bg-green-100 text-green-700";
			default:
				return "bg-slate-100 text-slate-700";
		}
	};

	return (
		<div className="flex flex-col h-[480px] max-h-[480px] bg-transparent">
			{/* Header */}
			<div className="flex items-center justify-between mb-3 flex-shrink-0">
				<div>
					<h3 className="text-base font-semibold text-slate-900">
						Pull Requests
					</h3>
					<p className="text-xs text-slate-500">
						Key PRs that contributed to this sprint.
					</p>
				</div>

				<button
					onClick={() => setOpenForm({})}
					className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:brightness-110"
					title="Add PR"
				>
					<FiPlus className="text-base" />
					Add
				</button>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto pr-1 space-y-2">
				{loading ? (
					<div className="min-h-[200px] flex items-center justify-center">
						<Loading />
					</div>
				) : prs.length === 0 ? (
					<div className="text-sm text-slate-500 p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
						No PRs added yet.
					</div>
				) : (
					prs.map((p) => (
						<article
							key={p._id}
							className="bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition text-sm"
						>
							<div className="flex items-center justify-between gap-3">
								<div className="font-medium text-slate-900 truncate">
									{p.title}
								</div>

								<span
									className={`text-xs px-2 py-[3px] rounded-full font-medium ${statusColor(
										p.status
									)}`}
								>
									{p.status}
								</span>
							</div>

							{p.purpose && (
								<div className="text-slate-600 text-xs mt-1 line-clamp-2">
									{p.purpose}
								</div>
							)}

							{p.contributionSummary && (
								<div className="text-slate-700 text-xs mt-1 line-clamp-2">
									Summary: {p.contributionSummary}
								</div>
							)}

							{p.skillsUsed?.length > 0 && (
								<div className="text-xs text-slate-500 mt-1 line-clamp-1">
									Skills: {p.skillsUsed.join(", ")}
								</div>
							)}

							<div className="flex items-center justify-between mt-2 text-xs text-slate-500">
								<div className="flex items-center gap-1">
									<FiClock size={12} />
									{new Date(p.createdAt).toLocaleDateString()}
								</div>

								<button
									className="text-blue-600 px-2 py-1 rounded hover:bg-slate-50"
									onClick={() => setOpenForm(p)}
								>
									Edit
								</button>
							</div>
						</article>
					))
				)}
			</div>

			{/* Modal */}
			{openForm && (
				<Modal onClose={() => setOpenForm(null)}>
					<PRFormModal
						sprintId={sprintId}
						pr={openForm}
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
