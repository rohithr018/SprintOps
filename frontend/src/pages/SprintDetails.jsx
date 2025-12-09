import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import sprintService from "../services/sprint.service";
import Loading from "../components/Loading";
import TaskBoard from "../modules/tasks/TaskBoard";
import PRPanel from "../modules/prs/PRPanel";
import FeedbackPanel from "../modules/feedback/FeedbackPanel";
import {
	FiShare2,
	FiEdit,
	FiTrash2,
	FiChevronRight,
	FiFolder,
} from "react-icons/fi";
import { showError, showSuccess } from "../utils/toast";
import SprintFormModal from "../components/SprintFormModal";
import ConfirmModal from "../components/ConfirmModal";
import Modal from "../components/Modal";

export default function SprintDetails() {
	const { id } = useParams();
	const nav = useNavigate();
	const [sprint, setSprint] = useState(null);
	const [loading, setLoading] = useState(true);
	const [active, setActive] = useState("tasks");
	const [confirmDelete, setConfirmDelete] = useState(false);

	const [editOpen, setEditOpen] = useState(false);
	const [editInitialForm, setEditInitialForm] = useState(null);

	const normalize = (res) => res?.data?.data || res?.data || res || null;

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			try {
				const r = await sprintService.getSprint(id);
				const payload = normalize(r);
				if (mounted) setSprint(payload);
			} catch {
				if (mounted) setSprint(null);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [id]);

	const onDelete = async () => {
		try {
			await sprintService.deleteSprint(id);
			showSuccess("Sprint deleted");
			nav("/dashboard");
		} catch (err) {
			showError(err?.response?.data?.message || "Failed to delete sprint");
		}
	};

	const openEditModal = () => {
		if (!sprint) return;
		const base = {
			name: sprint.name || "",
			goal: sprint.goal || "",
			startDate: sprint.startDate ? sprint.startDate.slice(0, 10) : "",
			endDate: sprint.endDate ? sprint.endDate.slice(0, 10) : "",
		};
		setEditInitialForm(base);
		setEditOpen(true);
	};

	const closeEditModal = () => {
		setEditOpen(false);
	};

	const handleUpdateSubmit = async (values) => {
		try {
			const res = await sprintService.updateSprint(id, values);
			const updated = normalize(res);
			setSprint(updated);
			showSuccess("Sprint updated");
			setEditOpen(false);
		} catch (err) {
			showError(err?.response?.data?.message || "Failed to update sprint");
			throw err;
		}
	};

	if (loading)
		return (
			<div className="py-16">
				<Loading />
			</div>
		);

	if (!sprint) return <div className="text-center p-8">Sprint not found</div>;

	const tabs = [
		{ id: "tasks", label: "Tasks" },
		{ id: "prs", label: "PRs" },
		{ id: "feedback", label: "Feedback" },
		{ id: "analytics", label: "Analytics" },
	];

	return (
		<div className="min-h-[calc(100vh-80px)] px-4 md:px-6 lg:px-10 py-8 overflow-hidden">
			<div className="max-w-6xl mx-auto space-y-10 overflow-auto pb-10">
				{/* HEADER */}
				<header
					className="
				backdrop-blur-xl bg-white/60 
				border border-white/50 
				shadow-xl 
				rounded-2xl 
				p-6 
				flex flex-col md:flex-row 
				md:items-center md:justify-between 
				gap-6
			"
				>
					<div className="flex items-start gap-4">
						<div
							className="
						w-14 h-14 rounded-2xl 
						bg-gradient-to-br from-blue-50 to-slate-100 
						text-slate-700 
						grid place-items-center
						border border-slate-200
						shadow-sm
					"
						>
							<FiFolder className="w-7 h-7 text-blue-600" />
						</div>

						<div>
							<h1 className="text-2xl font-bold text-slate-900">
								{sprint.name}
							</h1>

							<p className="text-sm text-slate-600 mt-1 max-w-xl">
								{sprint.goal || "No sprint goal provided."}
							</p>

							<div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
								<span
									className="
								px-3 py-1 rounded-full 
								bg-white/80 
								border border-slate-200 
								font-medium
							"
								>
									{new Date(sprint.startDate).toLocaleDateString()} —{" "}
									{new Date(sprint.endDate).toLocaleDateString()}
								</span>

								<span
									className="
								px-3 py-1 rounded-full 
								bg-white/80 
								border border-slate-200 
								font-medium
							"
								>
									Created:{" "}
									{new Date(
										sprint.createdAt || sprint.startDate
									).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>

					{/* ACTION BUTTONS */}
					<div className="flex items-center gap-3">
						<button
							onClick={openEditModal}
							className="
						inline-flex items-center gap-2 px-4 py-2 
						rounded-xl 
						border border-slate-300 
						bg-white/80
						text-slate-700 
						text-sm 
						hover:bg-white
						shadow-sm
					"
						>
							<FiEdit /> Edit
						</button>

						<button
							onClick={() => setConfirmDelete(true)}
							className="
						inline-flex items-center gap-2 px-4 py-2 
						rounded-xl 
						bg-red-600 text-white 
						text-sm 
						shadow-sm 
						hover:bg-red-700
					"
						>
							<FiTrash2 /> Delete
						</button>
					</div>
				</header>

				{/* BODY CARD */}
				<div className="backdrop-blur-xl bg-white/60 border border-white/50 shadow-xl rounded-2xl p-4">
					{/* TABS */}
					<nav className="border-b border-slate-200 pb-3 mb-4">
						<div className="flex flex-wrap gap-2">
							{tabs.map((t) => (
								<button
									key={t.id}
									onClick={() => setActive(t.id)}
									className={`
								inline-flex items-center gap-1.5 px-4 py-1.5 
								rounded-full text-sm font-medium transition
								${
									active === t.id
										? "bg-blue-600 text-white shadow"
										: "bg-white/60 border border-slate-200 text-slate-700 hover:bg-white"
								}
							`}
								>
									{t.label}
									{active === t.id && <FiChevronRight className="opacity-70" />}
								</button>
							))}
						</div>
					</nav>

					{/* SECTION CONTENT */}
					<section className="mt-2">
						{active === "tasks" && <TaskBoard sprintId={id} />}
						{active === "prs" && <PRPanel sprintId={id} />}
						{active === "feedback" && <FeedbackPanel sprintId={id} />}
						{active === "analytics" && (
							<div
								className="
							p-6 rounded-xl 
							bg-white/70 
							border border-slate-200 
							text-sm text-slate-600
							shadow-inner
						"
							>
								View detailed sprint analytics{" "}
								<Link
									to={`/analytics?sprint=${id}`}
									className="text-blue-600 font-medium underline"
								>
									here
								</Link>
								.
							</div>
						)}
					</section>
				</div>

				{/* EDIT MODAL */}
				<SprintFormModal
					isOpen={editOpen}
					mode="edit"
					initialData={editInitialForm}
					onSubmit={handleUpdateSubmit}
					onClose={closeEditModal}
				/>

				{/* DELETE CONFIRMATION */}
				{confirmDelete && (
					<Modal onClose={() => setConfirmDelete(false)}>
						<ConfirmModal
							title="Delete Sprint?"
							message="This will permanently delete this sprint and all data inside it."
							confirmText="Delete Sprint"
							cancelText="Cancel"
							onCancel={() => setConfirmDelete(false)}
							onConfirm={() => {
								setConfirmDelete(false);
								onDelete();
							}}
						/>
					</Modal>
				)}
			</div>
		</div>
	);
}
