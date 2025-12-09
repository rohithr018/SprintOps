import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AutoLogout from "./components/AutoLogout";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SprintDetails = lazy(() => import("./pages/SprintDetails"));
const Analytics = lazy(() => import("./pages/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
	return (
		<>
			<AutoLogout />

			<Routes>
				{/* all routes share app layout */}
				<Route element={<AppLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/sprint/:id"
						element={
							<ProtectedRoute>
								<SprintDetails />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/analytics"
						element={
							<ProtectedRoute>
								<Analytics />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>

					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>

			<Toaster
				position="top-right"
				toastOptions={{
					duration: 3000,
					style: { fontSize: "14px" },
				}}
			/>
		</>
	);
}
