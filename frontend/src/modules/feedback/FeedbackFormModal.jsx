// src/modules/feedback/FeedbackFormModal.jsx
import { useState } from "react";
import feedbackService from "../../services/feedback.service";
import { showSuccess, showError } from "../../utils/toast";

export default function FeedbackFormModal({
	sprintId,
	feedback = null,
	onClose,
}) {
	// ✅ true only when we have an existing feedback with an _id
	const isEdit = !!(feedback && feedback._id);

	const [form, setForm] = useState({
		type: feedback?.type || "Positive",
		source: feedback?.source || "Manager",
		context: feedback?.context || "General",
		content: feedback?.content || "",
	});

	const [saving, setSaving] = useState(false);

	const save = async (e) => {
		e.preventDefault();
		if (saving) return;

		setSaving(true);
		try {
			if (isEdit) {
				await feedbackService.updateFeedback(sprintId, feedback._id, form);
			} else {
				await feedbackService.createFeedback(sprintId, form);
			}
			showSuccess("Saved");
			onClose();
		} catch (err) {
			console.error("Failed to save feedback", err);
			showError("Save failed");
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={save} className="space-y-6">
			{/* Title + helper text */}
			<div>
				<h3 className="text-xl font-semibold text-slate-900">
					{isEdit ? "Edit Feedback" : "New Feedback"}
				</h3>
				<p className="mt-1 text-xs text-slate-500">
					Keep it specific and actionable. This will show up in sprint notes.
				</p>
			</div>

			{/* Type / Source / Context */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div className="space-y-1">
					<label className="block text-xs font-medium text-slate-600">
						Type
					</label>
					<select
						className="w-full rounded-md border border-slate-300 bg-slate-50 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={form.type}
						onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
					>
						<option value="Positive">Positive</option>
						<option value="Constructive">Constructive</option>
					</select>
				</div>

				<div className="space-y-1">
					<label className="block text-xs font-medium text-slate-600">
						Source
					</label>
					<select
						className="w-full rounded-md border border-slate-300 bg-slate-50 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={form.source}
						onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
					>
						<option>Manager</option>
						<option>Peer</option>
						<option>Lead</option>
						<option>Self</option>
					</select>
				</div>

				<div className="space-y-1">
					<label className="block text-xs font-medium text-slate-600">
						Context
					</label>
					<select
						className="w-full rounded-md border border-slate-300 bg-slate-50 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={form.context}
						onChange={(e) =>
							setForm((f) => ({ ...f, context: e.target.value }))
						}
					>
						<option>General</option>
						<option>Task-related</option>
					</select>
				</div>
			</div>

			{/* Feedback body */}
			<div className="space-y-1">
				<label className="block text-xs font-medium text-slate-600">
					Feedback
				</label>
				<textarea
					required
					className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="E.g. Great ownership on the deployment — you communicated clearly and resolved issues quickly."
					value={form.content}
					onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
				/>
				<p className="mt-1 text-[11px] text-slate-400">
					Avoid private details. This is visible to anyone who can view this
					sprint.
				</p>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onClick={onClose}
					disabled={saving}
					className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={saving}
					className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:brightness-110 disabled:opacity-60"
				>
					{saving ? "Saving..." : isEdit ? "Update" : "Save"}
				</button>
			</div>
		</form>
	);
}
