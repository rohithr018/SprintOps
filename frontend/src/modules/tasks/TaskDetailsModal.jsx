import { useState, useEffect } from "react";
import taskService from "../../services/task.service";
import TaskLogsSection from "./TaskLogsSection";
import AddLogModal from "./AddLogModal";
import Modal from "../../components/Modal";
import { showError } from "../../utils/toast";

export default function TaskDetailsModal({ task, sprintId, onClose }) {
	const [logs, setLogs] = useState([]);
	const [loadingLogs, setLoadingLogs] = useState(true);
	const [openAddLog, setOpenAddLog] = useState(false);

	const loadLogs = async () => {
		setLoadingLogs(true);
		try {
			const res = await taskService.getLogs(sprintId, task._id);
			setLogs(res.data.data || []);
		} catch (err) {
			console.error("Failed to load logs", err);
			showError("Failed to load logs");
		} finally {
			setLoadingLogs(false);
		}
	};

	useEffect(() => {
		loadLogs();
	}, [task._id, sprintId]);

	return (
		<>
			{/* Main task details modal */}
			<Modal onClose={onClose}>
				<div className="space-y-5">
					{/* Header */}
					<div className="flex items-start justify-between gap-4">
						<div>
							<h3 className="text-lg font-semibold text-slate-900">
								{task.title}
							</h3>
							{task.description && (
								<p className="mt-1 text-xs text-slate-500">
									{task.description}
								</p>
							)}

							<div className="mt-2 text-xs text-slate-500 flex flex-wrap gap-3">
								<span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
									Status: {task.status}
								</span>
								<span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
									{task.storyPoints ?? 0} pts
								</span>
								{task.skills?.length > 0 && (
									<span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
										{task.skills.join(", ")}
									</span>
								)}
							</div>
						</div>

						<div className="flex flex-col items-end gap-2">
							<button
								type="button"
								onClick={() => setOpenAddLog(true)}
								className="px-3 py-1.5 text-xs rounded-full bg-blue-600 text-white hover:brightness-110"
							>
								Add log
							</button>
						</div>
					</div>

					{/* Logs */}
					<section className="flex flex-col max-h-[35vh]">
						<h4 className="text-sm font-semibold text-slate-800 mb-2">Logs</h4>

						<div className="overflow-y-auto pr-1 space-y-3">
							<TaskLogsSection logs={logs} loading={loadingLogs} />
						</div>
					</section>
				</div>
			</Modal>

			{/* Separate Add Log modal (overlays on top of details) */}
			{openAddLog && (
				<Modal
					onClose={() => {
						setOpenAddLog(false);
						loadLogs();
					}}
				>
					<AddLogModal
						sprintId={sprintId}
						taskId={task._id}
						onClose={() => {
							setOpenAddLog(false);
							loadLogs();
						}}
					/>
				</Modal>
			)}
		</>
	);
}
