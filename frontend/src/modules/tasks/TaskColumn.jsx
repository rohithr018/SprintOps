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
		<div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
			{/* Column Header */}
			<div className="px-3 py-2 font-medium text-sm bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
				{title}
			</div>

			{/* Scrollable Droppable Area */}
			<Droppable droppableId={columnId}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`
							flex-1 
							overflow-y-auto 
							min-h-0					
							px-2 py-2 space-y-2 
							transition-colors
							${snapshot.isDraggingOver ? "bg-blue-50/50" : "bg-white"}
						`}
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

						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
}
