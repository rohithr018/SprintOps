import { useState } from "react";
import taskService from "../../services/task.service";
import { showSuccess, showError } from "../../utils/toast";

export default function TaskFormModal({
	sprintId,
	task = null,
	onClose,
	onPrefill,
	defaults = {},
}) {
	const isEdit = !!task?._id;

	const [form, setForm] = useState({
		title: task?.title || defaults.title || "",
		description: task?.description || "",
		storyPoints: task?.storyPoints ?? defaults.storyPoints ?? 0,
		skills: (task?.skills || defaults.skills || "").toString(),
		status: task?.status || "Todo",
	});

	const [saving, setSaving] = useState(false);

	const save = async (e) => {
		e.preventDefault();
		if (saving) return;

		setSaving(true);

		const payload = {
			...form,
			storyPoints: Number(form.storyPoints) || 0,
			skills: form.skills
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		};

		try {
			if (isEdit) {
				await taskService.updateTask(sprintId, task._id, payload);
			} else {
				await taskService.createTask(sprintId, payload);
			}

			onPrefill?.({
				title: form.title,
				storyPoints: payload.storyPoints,
				skills: form.skills,
			});

			showSuccess("Saved");
			onClose();
		} catch (err) {
			console.error("Failed to save task", err);

			const message =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				err?.response?.data?.errors?.[0] ||
				JSON.stringify(err?.response?.data?.errors || "") ||
				err?.message ||
				"Save failed";

			showError(message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={save} className="space-y-6">
			<div>
				<h3 className="text-xl font-semibold text-slate-900">
					{isEdit ? "Edit Task" : "New Task"}
				</h3>
				<p className="mt-1 text-xs text-slate-500">
					Tasks appear in the sprint board. Keep titles short and descriptive.
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-600">Title</label>
					<input
						required
						value={form.title}
						onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
						className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Implement authentication"
					/>
				</div>

				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-600">
						Description
					</label>
					<textarea
						value={form.description}
						onChange={(e) =>
							setForm((f) => ({ ...f, description: e.target.value }))
						}
						className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm min-h-[90px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Add details or acceptance criteria"
					/>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-600">
							Story Points
						</label>
						<input
							type="number"
							min={0}
							value={form.storyPoints}
							onChange={(e) =>
								setForm((f) => ({ ...f, storyPoints: e.target.value }))
							}
							className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-600">Status</label>
						<select
							value={form.status}
							onChange={(e) =>
								setForm((f) => ({ ...f, status: e.target.value }))
							}
							className="w-full px-3 py-2 border rounded-md bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option>Todo</option>
							<option>In Progress</option>
							<option>Blocked</option>
							<option>Done</option>
						</select>
					</div>
				</div>

				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-600">Skills</label>
					<input
						value={form.skills}
						onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
						className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Node.js, React, Docker"
					/>
					<p className="text-[11px] text-slate-400">
						Useful for analytics and sprint reports.
					</p>
				</div>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onClick={onClose}
					disabled={saving}
					className="px-4 py-2 text-sm border rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-60"
				>
					Cancel
				</button>

				<button
					type="submit"
					disabled={saving}
					className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:brightness-110 disabled:opacity-60"
				>
					{saving ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
				</button>
			</div>
		</form>
	);
}
