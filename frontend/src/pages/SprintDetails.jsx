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
		<div className="space-y-6">
			<header className="bg-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div className="flex items-start gap-4">
					<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 text-slate-700 grid place-items-center">
						<FiFolder className="w-6 h-6" />
					</div>

					<div>
						<h1 className="text-2xl font-semibold leading-tight text-slate-900">
							{sprint.name}
						</h1>
						<p className="text-sm text-slate-500 mt-1 max-w-xl">
							{sprint.goal || "No sprint goal provided."}
						</p>

						<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
							<div className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
								{new Date(sprint.startDate).toLocaleDateString()} —{" "}
								{new Date(sprint.endDate).toLocaleDateString()}
							</div>
							<div className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
								Created:{" "}
								{new Date(
									sprint.createdAt || sprint.startDate
								).toLocaleDateString()}
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 md:gap-3">
					<button
						onClick={openEditModal}
						className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm hover:bg-slate-50 text-slate-700"
						title="Edit sprint"
					>
						<FiEdit /> Edit
					</button>

					<button
						onClick={() => setConfirmDelete(true)}
						className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-xs md:text-sm hover:bg-red-700"
						title="Delete sprint"
					>
						<FiTrash2 /> Delete
					</button>
				</div>
			</header>

			<div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
				<nav
					aria-label="Sprint sections"
					className="mb-4 border-b border-slate-100 pb-2"
				>
					<div className="flex flex-wrap gap-1.5">
						{tabs.map((t) => (
							<button
								key={t.id}
								onClick={() => setActive(t.id)}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition ${
									active === t.id
										? "bg-blue-600 text-white shadow-sm"
										: "bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200"
								}`}
								aria-current={active === t.id ? "true" : "false"}
							>
								<span>{t.label}</span>
								{active === t.id && <FiChevronRight className="opacity-70" />}
							</button>
						))}
					</div>
				</nav>

				<section className="mt-2">
					{active === "tasks" && <TaskBoard sprintId={id} />}
					{active === "prs" && <PRPanel sprintId={id} />}
					{active === "feedback" && <FeedbackPanel sprintId={id} />}
					{active === "analytics" && (
						<div className="p-6 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
							<p>
								View detailed sprint analytics{" "}
								<Link
									to={`/analytics?sprint=${id}`}
									className="text-blue-600 underline font-medium"
								>
									here
								</Link>
								.
							</p>
						</div>
					)}
				</section>
			</div>

			<SprintFormModal
				isOpen={editOpen}
				mode="edit"
				initialData={editInitialForm}
				onSubmit={handleUpdateSubmit}
				onClose={closeEditModal}
			/>
			{confirmDelete && (
				<Modal onClose={() => setConfirmDelete(false)}>
					<ConfirmModal
						title="Delete Sprint?"
						message="This will permanently delete this sprint and all data in it. This action cannot be undone."
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
	);
}
