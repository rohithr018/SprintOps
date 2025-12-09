import { useState, useEffect } from "react";
import taskService from "../../services/task.service";
import { showSuccess, showError } from "../../utils/toast";

export default function AddLogModal({
	sprintId,
	taskId,
	onClose,
	quick = null,
}) {
	const [form, setForm] = useState({
		summary: "",
		skillsUsed: "",
		timeSpentMinutes: 30,
		progressPercent: 0,
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (quick) {
			setForm({
				summary: quick.summary || "Quick update",
				skillsUsed: quick.skillsUsed || "",
				timeSpentMinutes: quick.timeSpentMinutes ?? 15,
				progressPercent: quick.progressPercent ?? 0,
			});
		}
	}, [quick]);

	const submit = async (e) => {
		e?.preventDefault();
		if (saving) return;

		setSaving(true);
		try {
			const payload = {
				...form,
				timeSpentMinutes: Number(form.timeSpentMinutes) || 0,
				progressPercent: Number(form.progressPercent) || 0,
				skillsUsed: form.skillsUsed
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
			};

			await taskService.addLog(sprintId, taskId, payload);
			showSuccess("Log added");
			onClose();
		} catch (err) {
			console.error("Failed to add log", err);
			showError("Add log failed");
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={submit} className="space-y-5">
			<div>
				<h3 className="text-xl font-semibold text-slate-900">Add log</h3>
				<p className="mt-1 text-xs text-slate-500">
					Record today’s progress, time spent, and any skills you used.
				</p>
			</div>

			<div className="space-y-3">
				{/* Summary */}
				<div className="space-y-1">
					<label className="block text-xs font-medium text-slate-600">
						Summary
					</label>
					<textarea
						required
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-height-[90px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="E.g. Refactored API handlers and fixed validation bugs."
						value={form.summary}
						onChange={(e) =>
							setForm((f) => ({ ...f, summary: e.target.value }))
						}
					/>
				</div>

				{/* Skills */}
				<div className="space-y-1">
					<label className="block text-xs font-medium text-slate-600">
						Skills used (comma-separated)
					</label>
					<input
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Node.js, React, Jest"
						value={form.skillsUsed}
						onChange={(e) =>
							setForm((f) => ({ ...f, skillsUsed: e.target.value }))
						}
					/>
					<p className="mt-1 text-[11px] text-slate-400">
						Helps later when summarizing sprint contributions.
					</p>
				</div>

				{/* Time + Progress */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-1">
						<label className="block text-xs font-medium text-slate-600">
							Time spent (minutes)
						</label>
						<input
							type="number"
							min={0}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={form.timeSpentMinutes}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									timeSpentMinutes: e.target.value,
								}))
							}
						/>
					</div>

					<div className="space-y-1">
						<label className="block text-xs font-medium text-slate-600">
							Progress (% complete)
						</label>
						<input
							type="number"
							min={0}
							max={100}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={form.progressPercent}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									progressPercent: e.target.value,
								}))
							}
						/>
					</div>
				</div>
			</div>

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
					{saving ? "Saving…" : "Add log"}
				</button>
			</div>
		</form>
	);
}
