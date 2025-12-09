import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmModal({
	title = "Are you sure?",
	message = "This action cannot be undone.",
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	onCancel,
}) {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start gap-3">
				<div className="p-2 rounded-full bg-red-100 text-red-600 shrink-0">
					<FiAlertTriangle size={20} />
				</div>

				<div>
					<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
					<p className="text-sm text-slate-600 mt-1">{message}</p>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
				>
					{cancelText}
				</button>

				<button
					type="button"
					onClick={onConfirm}
					className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
				>
					{confirmText}
				</button>
			</div>
		</div>
	);
}
