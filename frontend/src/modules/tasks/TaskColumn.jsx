import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function TaskColumn({
	columnId,
	title,
	tasks,
	onView,
	onEdit,
	selected,
	selectedIndex,
	onRequestSelect,
}) {
	return (
		<div className="flex flex-col h-full bg-slate-50 rounded shadow-sm border border-slate-300 overflow-hidden">
			{/* Column Header */}
			<div className="font-medium px-3 py-2 border-b border-slate-200 bg-white sticky top-0 z-10">
				{title}
			</div>

			{/* Scrollable Task Area */}
			<Droppable droppableId={columnId}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`flex-1 overflow-y-auto px-2 py-2 space-y-2 transition-colors ${
							snapshot.isDraggingOver ? "bg-slate-100" : "bg-slate-50"
						}`}
					>
						{tasks.map((t, idx) => (
							<TaskCard
								key={t._id}
								task={t}
								index={idx}
								onView={onView}
								onEdit={onEdit}
								isSelected={selected && selectedIndex === idx}
								onSelect={() => onRequestSelect(idx)}
							/>
						))}

						{/* Placeholder for Dragging */}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
}
