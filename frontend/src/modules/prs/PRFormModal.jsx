import { useState } from "react";
import prService from "../../services/pr.service";
import { showSuccess, showError } from "../../utils/toast";

export default function PRFormModal({ sprintId, pr = null, onClose }) {
	const [form, setForm] = useState({
		title: pr?.title || "",
		purpose: pr?.purpose || "",
		contributionSummary: pr?.contributionSummary || "",
		challenges: pr?.challenges || "",
		status: pr?.status || "Created",
		skillsUsed: (pr?.skillsUsed || []).join(", "),
	});

	const [saving, setSaving] = useState(false);
	const isEdit = !!pr?._id;

	const save = async (e) => {
		e.preventDefault();
		if (saving) return;

		setSaving(true);

		const payload = {
			...form,
			skillsUsed: form.skillsUsed
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		};

		try {
			if (isEdit) {
				await prService.updatePR(sprintId, pr._id, payload);
			} else {
				await prService.createPR(sprintId, payload);
			}

			showSuccess("Saved");
			onClose();
		} catch (err) {
			console.error("Failed to save PR", err);

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
					{isEdit ? "Edit PR" : "New PR"}
				</h3>
				<p className="mt-1 text-xs text-slate-500">
					Describe what this pull request delivered for the sprint.
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-1">
					<label className="block text-xs font-medium text-slate-600">
						Title
					</label>
					<input
						required
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="E.g. Implement auth middleware"
						value={form.title}
						onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-1 gap-4">
					<div className="space-y-1">
						<label className="block text-xs font-medium text-slate-600">
							Purpose
						</label>
						<textarea
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="What problem does this PR solve?"
							value={form.purpose}
							onChange={(e) =>
								setForm((f) => ({ ...f, purpose: e.target.value }))
							}
						/>
					</div>
				</div>

				<div className="space-y-1">
					<label className="block text-xs font-medium text-slate-600">
						Challenges
					</label>
					<textarea
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Any blockers or tricky parts worth remembering?"
						value={form.challenges}
						onChange={(e) =>
							setForm((f) => ({ ...f, challenges: e.target.value }))
						}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="block text-xs font-medium text-slate-600">
							Status
						</label>
						<select
							className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={form.status}
							onChange={(e) =>
								setForm((f) => ({ ...f, status: e.target.value }))
							}
						>
							<option>Created</option>
							<option>Under Review</option>
							<option>Merged</option>
						</select>
					</div>

					<div className="space-y-1">
						<label className="block text-xs font-medium text-slate-600">
							Skills used
						</label>
						<input
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="React, Node.js, Jest (comma-separated)"
							value={form.skillsUsed}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									skillsUsed: e.target.value,
								}))
							}
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<button
					type="button"
					className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-60"
					onClick={onClose}
					disabled={saving}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:brightness-110 disabled:opacity-60"
					disabled={saving}
				>
					{saving ? "Saving..." : isEdit ? "Update PR" : "Create PR"}
				</button>
			</div>
		</form>
	);
}
