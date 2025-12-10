import { useEffect, useState, useCallback, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import TaskFormModal from "./TaskFormModal";
import TaskDetailsModal from "./TaskDetailsModal";
import taskService from "../../services/task.service";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";
import { showError } from "../../utils/toast";
import { FiPlus } from "react-icons/fi";

const COLUMNS = ["Todo", "In Progress", "Blocked", "Done"];

export default function TaskBoard({ sprintId }) {
	const [tasks, setTasks] = useState([]);
	const [grouped, setGrouped] = useState({});
	const [loading, setLoading] = useState(true);

	const [openCreate, setOpenCreate] = useState(false);
	const [openDetails, setOpenDetails] = useState(null);
	const [openEdit, setOpenEdit] = useState(null);

	const lastUsedDefaults = useRef({ title: "", storyPoints: 0, skills: "" });

	// Load tasks
	const load = useCallback(async () => {
		setLoading(true);
		try {
			const res = await taskService.getTasks(sprintId);
			setTasks(res.data.data || []);
		} catch (err) {
			const msg =
				err?.response?.data?.message || err?.message || "Failed to load tasks";

			showError(msg);
		} finally {
			setLoading(false);
		}
	}, [sprintId]);

	useEffect(() => {
		load();
	}, [load]);

	// Group by columns
	useEffect(() => {
		const g = {};
		COLUMNS.forEach((c) => (g[c] = []));
		tasks.forEach((t) => g[t.status]?.push(t));
		setGrouped(g);
	}, [tasks]);

	// Drag handler
	const onDragEnd = async (result) => {
		const { destination, source, draggableId } = result;
		if (!destination) return;

		const fromCol = source.droppableId;
		const toCol = destination.droppableId;

		if (fromCol === toCol) return;

		// Optimistic UI update
		setTasks((prev) =>
			prev.map((t) =>
				String(t._id) === String(draggableId) ? { ...t, status: toCol } : t
			)
		);

		try {
			await taskService.updateTask(sprintId, draggableId, { status: toCol });
		} catch (err) {
			const msg =
				err?.response?.data?.message || err?.message || "Failed to move task";

			showError(msg);
			load(); // revert
		}
	};

	if (loading) return <Loading />;

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Tasks</h3>

				<button
					onClick={() => setOpenCreate(true)}
					className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:brightness-110"
				>
					<FiPlus /> Add
				</button>
			</div>

			{/* Columns */}
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full h-[50vh] min-h-0 mb-5">
					{COLUMNS.map((col) => (
						<TaskColumn
							key={col}
							columnId={col}
							title={`${col} (${(grouped[col] || []).length})`}
							tasks={grouped[col] || []}
							onView={(task) => setOpenDetails(task)}
							onEdit={(task) => setOpenEdit(task)}
						/>
					))}
				</div>
			</DragDropContext>

			{/* Create Modal */}
			{openCreate && (
				<Modal onClose={() => setOpenCreate(false)}>
					<TaskFormModal
						sprintId={sprintId}
						defaults={lastUsedDefaults.current}
						onClose={() => {
							setOpenCreate(false);
							load();
						}}
					/>
				</Modal>
			)}

			{/* Details Modal */}
			{openDetails && (
				<TaskDetailsModal
					task={openDetails}
					sprintId={sprintId}
					onClose={() => setOpenDetails(null)}
				/>
			)}

			{/* Edit Modal */}
			{openEdit && (
				<Modal onClose={() => setOpenEdit(null)}>
					<TaskFormModal
						sprintId={sprintId}
						task={openEdit}
						onClose={() => {
							setOpenEdit(null);
							load();
						}}
					/>
				</Modal>
			)}
		</div>
	);
}
