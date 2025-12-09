import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import Loading from "./Loading";

const emptyForm = {
	name: "",
	goal: "",
	startDate: "",
	endDate: "",
};

export default function SprintFormModal({
	isOpen,
	mode = "create",
	initialData,
	onSubmit,
	onClose,
}) {
	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [initialSnapshot, setInitialSnapshot] = useState(emptyForm);
	const modalRef = useRef(null);

	const isEdit = mode === "edit";

	useEffect(() => {
		if (!isOpen) return;
		const base = {
			name: initialData?.name || "",
			goal: initialData?.goal || "",
			startDate: initialData?.startDate || "",
			endDate: initialData?.endDate || "",
		};
		setForm(base);
		setInitialSnapshot(base);
		setErrors({});
		setSubmitting(false);
	}, [isOpen, initialData]);

	const validateForm = () => {
		const e = {};
		if (!form.name.trim()) e.name = "Sprint name is required";
		if (!form.startDate) e.startDate = "Start date is required";
		if (!form.endDate) e.endDate = "End date is required";
		if (
			form.startDate &&
			form.endDate &&
			new Date(form.startDate) > new Date(form.endDate)
		) {
			e.date = "Start date cannot be after end date";
		}
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const isDirty = JSON.stringify(form) !== JSON.stringify(initialSnapshot);

	const handleSubmit = async (ev) => {
		ev?.preventDefault();
		if (submitting) return;
		if (!validateForm()) return;

		setSubmitting(true);
		try {
			await onSubmit(form);
		} catch (err) {
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	const handleBackdropClick = (e) => {
		if (submitting) return;
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			onClose?.();
		}
	};

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e) => {
			if (e.key === "Escape" && !submitting) {
				onClose?.();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isOpen, submitting, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/40"
				onMouseDown={handleBackdropClick}
			></div>
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				className="relative z-10 w-[min(36rem,92vw)]"
			>
				<form
					onSubmit={handleSubmit}
					className="space-y-4 bg-white p-6 rounded-lg shadow-lg"
				>
					<div className="flex items-start justify-between">
						<h3 className="text-lg font-semibold">
							{isEdit ? "Edit Sprint" : "Create Sprint"}
						</h3>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close dialog"
							className="p-2 rounded hover:bg-slate-100"
							disabled={submitting}
						>
							<FiX />
						</button>
					</div>

					<label className="block">
						<span className="text-sm text-slate-700">Sprint name</span>
						<input
							required
							className={`w-full mt-2 p-3 border rounded-lg text-sm ${
								errors.name ? "border-red-400" : "border-slate-200"
							}`}
							placeholder="e.g. Q4 Release"
							value={form.name}
							onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
							aria-invalid={!!errors.name}
						/>
						{errors.name && (
							<p className="text-xs text-red-600 mt-1">{errors.name}</p>
						)}
					</label>

					<label className="block">
						<span className="text-sm text-slate-700">Goal (optional)</span>
						<input
							className="w-full mt-2 p-3 border rounded-lg text-sm border-slate-200"
							placeholder="Short description of the sprint goal"
							value={form.goal}
							onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
						/>
					</label>

					<div className="grid grid-cols-2 gap-3">
						<label className="block">
							<span className="text-sm text-slate-700">Start date</span>
							<input
								required
								type="date"
								className={`w-full mt-2 p-2 border rounded-lg text-sm ${
									errors.startDate || errors.date
										? "border-red-400"
										: "border-slate-200"
								}`}
								value={form.startDate}
								onChange={(e) =>
									setForm((f) => ({ ...f, startDate: e.target.value }))
								}
								aria-invalid={!!(errors.startDate || errors.date)}
							/>
							{errors.startDate && (
								<p className="text-xs text-red-600 mt-1">{errors.startDate}</p>
							)}
						</label>

						<label className="block">
							<span className="text-sm text-slate-700">End date</span>
							<input
								required
								type="date"
								className={`w-full mt-2 p-2 border rounded-lg text-sm ${
									errors.endDate || errors.date
										? "border-red-400"
										: "border-slate-200"
								}`}
								value={form.endDate}
								onChange={(e) =>
									setForm((f) => ({ ...f, endDate: e.target.value }))
								}
								aria-invalid={!!(errors.endDate || errors.date)}
							/>
							{errors.endDate && (
								<p className="text-xs text-red-600 mt-1">{errors.endDate}</p>
							)}
						</label>
					</div>

					{errors.date && <p className="text-xs text-red-600">{errors.date}</p>}

					<div className="flex justify-end gap-3 mt-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border rounded-lg text-sm"
							disabled={submitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting || (isEdit && !isDirty)}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
						>
							{submitting ? <Loading /> : isEdit ? "Update" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
