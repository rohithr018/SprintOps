import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ children, onClose }) {
	// Close on ESC
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				onClose?.();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
			onClick={onClose} // backdrop click closes
		>
			<div
				role="dialog"
				aria-modal="true"
				className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
				onClick={(e) => e.stopPropagation()} // prevent click-through
			>
				<div className="flex items-center justify-end px-5 py-3 border-b border-slate-100">
					<button
						type="button"
						onClick={onClose}
						className="inline-flex items-center justify-center rounded-full p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
						aria-label="Close"
					>
						<FiX className="w-4 h-4" />
					</button>
				</div>

				<div className="max-h-[80vh] overflow-y-auto px-6 py-5">{children}</div>
			</div>
		</div>
	);
}
