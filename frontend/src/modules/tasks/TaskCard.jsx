import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({
	task,
	index,
	onView,
	onEdit,
	isSelected,
	onSelect,
}) {
	const selectedClass = isSelected
		? "ring-2 ring-blue-500 shadow-lg scale-[1.02] transition"
		: "";

	return (
		<Draggable draggableId={String(task._id)} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					onClick={() => onSelect?.()}
					className={`bg-white rounded-lg border border-slate-300 p-3 mb-2 cursor-pointer ${selectedClass} ${
						snapshot.isDragging ? "opacity-90 shadow-xl" : ""
					}`}
				>
					{/* Content */}
					<div className="flex justify-between items-start gap-2">
						<div>
							<div className="font-medium text-slate-900">{task.title}</div>
							<div className="text-xs text-slate-500 mt-1">
								{task.storyPoints} pts •{" "}
								{(task.skills || []).slice(0, 3).join(", ")}
							</div>
						</div>

						{/* ACTION BUTTONS — pill buttons */}
						<div className="flex flex-col gap-1 items-end">
							<button
								onClick={(e) => {
									e.stopPropagation();
									onView?.(task);
								}}
								className="text-xs px-1 py-1 rounded-full bg-blue-50 text-blue-700  hover:bg-blue-100"
							>
								View
							</button>

							<button
								onClick={(e) => {
									e.stopPropagation();
									onEdit?.(task);
								}}
								className="text-xs px-1 py-1 rounded-full bg-blue-50 text-blue-700  hover:bg-blue-100"
							>
								Edit
							</button>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}
