// components/SuspenseFallback.jsx
import Loading from "./Loading";

export default function SuspenseFallback() {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full">
			<Loading size={30} />
		</div>
	);
}
