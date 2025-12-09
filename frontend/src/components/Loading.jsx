import { FiLoader } from "react-icons/fi";

export default function Loading({
	size = 24,
	color = "text-blue-600",
	inline = false,
	className = "",
}) {
	const actualSize = inline ? size : size * 1.7;

	return (
		<div
			className={
				inline
					? "inline-flex items-center justify-center"
					: "flex items-center justify-center py-10 w-full"
			}
		>
			<FiLoader
				className={`animate-spin ${color} opacity-80 ${className}`}
				style={{ fontSize: actualSize }}
				fontSize={24}
			/>
		</div>
	);
}
