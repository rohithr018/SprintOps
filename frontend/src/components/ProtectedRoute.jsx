import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
	const token = useSelector((s) => s.user?.token ?? null);

	if (!token) return <Navigate to="/login" replace />;

	return children;
}
