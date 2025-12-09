import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import userService from "../services/user.service";
import { logout, setUser } from "../redux/userslice";
import ConfirmModal from "../components/ConfirmModal";
import Modal from "../components/Modal";
import { showError, showSuccess } from "../utils/toast";

export default function Profile() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const storedUser = useSelector((s) => s.user?.user ?? null);
	const [showPassword, setShowPassword] = useState(false);

	const [userId, setUserId] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [savingProfile, setSavingProfile] = useState(false);
	const [savingPassword, setSavingPassword] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const isProfileChanged =
		name !== storedUser?.name || email !== storedUser?.email;

	useEffect(() => {
		if (!storedUser) return;
		setUserId(storedUser.id);
		setName(storedUser.name);
		setEmail(storedUser.email);
	}, [storedUser]);

	// Update Profile
	const handleProfileSubmit = async (e) => {
		e.preventDefault();

		try {
			setSavingProfile(true);

			const res = await userService.update(userId, { name, email });

			if (res?.data?.success === false) {
				showError(res.data.message || "Profile update not allowed");
				return;
			}

			const updated = res?.data?.data || res?.data;

			dispatch(setUser(updated));
			showSuccess("Profile updated successfully");
		} catch (err) {
			const msg =
				err?.response?.data?.message ||
				err?.message ||
				"Failed to update profile";

			showError(msg);
		} finally {
			setSavingProfile(false);
		}
	};

	// Update Password
	const handlePasswordSubmit = async (e) => {
		e.preventDefault();

		if (newPassword.length < 6) {
			showError("Password must be at least 6 characters");
			return;
		}
		if (newPassword !== confirmPassword) {
			showError("Passwords do not match");
			return;
		}

		try {
			setSavingPassword(true);

			const res = await userService.update(userId, { password: newPassword });

			if (res?.data?.success === false) {
				showError(res.data.message || "Action not allowed");
				return;
			}

			setNewPassword("");
			setConfirmPassword("");
			setShowPassword(false);

			showSuccess("Password updated successfully");
		} catch (err) {
			const msg =
				err?.response?.data?.message ||
				err?.message ||
				"Failed to update password";

			showError(msg);
		} finally {
			setSavingPassword(false);
		}
	};

	//Delete Account
	const confirmDelete = async () => {
		if (!userId || deleting) return;

		try {
			setDeleting(true);

			const res = await userService.remove(userId);

			if (res?.data?.success === false) {
				showError(res.data.message || "Action not allowed");
				setDeleting(false);
				return;
			}

			const msg =
				res?.data?.message ||
				res?.data?.data?.message ||
				"Account deleted successfully";

			setShowDeleteConfirm(false);

			dispatch(logout());
			showSuccess(msg);

			navigate("/login");
		} catch (err) {
			const msg =
				err?.response?.data?.message ||
				err?.message ||
				"Failed to delete account";

			showError(msg);
			setDeleting(false);
		}
	};

	// UI
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-white to-slate-100px-4">
			<div className="w-full max-w-5xl flex flex-col items-center gap-10">
				<h1 className="text-3xl font-bold text-slate-900 text-center">
					Profile Settings
				</h1>

				{/* --- TOP ROW: Two Equal Height Cards --- */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch">
					{/* ACCOUNT INFO */}
					<section className="backdrop-blur-xl bg-white/50 border border-white/60 shadow-xl rounded-2xl p-8 h-full flex-col justify-center">
						<h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide text-center mb-6">
							Account Info
						</h2>

						<form onSubmit={handleProfileSubmit} className="space-y-4">
							{/* Name */}
							<div>
								<label className="block text-xs font-medium text-slate-600 mb-1">
									Name
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
								/>
							</div>

							{/* Email */}
							<div>
								<label className="block text-xs font-medium text-slate-600 mb-1">
									Email
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
								/>
							</div>

							<button
								type="submit"
								disabled={!isProfileChanged || savingProfile}
								className={`w-full py-2.5 rounded-lg text-sm font-medium text-white shadow-md transition
									${
										!isProfileChanged || savingProfile
											? "bg-blue-300 cursor-not-allowed"
											: "bg-blue-600 hover:bg-blue-700"
									}`}
							>
								{savingProfile ? "Saving..." : "Save Changes"}
							</button>
						</form>
					</section>

					{/* CHANGE PASSWORD */}
					<section className="bg-white/50 border border-white/60 shadow-xl rounded-2xl p-8 h-full flex flex-col justify-center">
						<h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide text-center mb-6">
							Change Password
						</h2>

						<form onSubmit={handlePasswordSubmit} className="space-y-4">
							{/* New Password */}
							<div className="relative">
								<label className="block text-xs font-medium text-slate-600 mb-1">
									New Password
								</label>

								<input
									type={showPassword ? "text" : "password"}
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
								/>

								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-8 text-slate-500 hover:text-slate-700"
								>
									{showPassword ? <FiEyeOff /> : <FiEye />}
								</button>
							</div>

							{/* Confirm Password */}
							<div className="relative">
								<label className="block text-xs font-medium text-slate-600 mb-1">
									Confirm Password
								</label>

								<input
									type={showPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
								/>

								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-[32px] text-slate-500 hover:text-slate-700"
								>
									{showPassword ? <FiEyeOff /> : <FiEye />}
								</button>
							</div>

							<button
								type="submit"
								disabled={savingPassword}
								className="w-full bg-slate-800 text-white py-2.5 rounded-lg text-sm shadow-md hover:bg-slate-900 transition disabled:opacity-60"
							>
								{savingPassword ? "Updating..." : "Update Password"}
							</button>
						</form>
					</section>
				</div>

				{/* --- DANGER ZONE --- */}
				<div
					className="w-full max-w-md mx-auto backdrop-blur-xl bg-white/50 
                    border border-red-300 shadow-xl rounded-2xl p-6 mt-2"
				>
					<h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide text-center mb-2">
						Danger Zone
					</h2>

					<p className="text-xs text-slate-600 text-center mb-4">
						This will permanently delete your account.
					</p>

					<button
						onClick={() => setShowDeleteConfirm(true)}
						className="
							w-full border border-red-500 text-red-600 py-2.5 rounded-lg text-sm
							hover:bg-red-50 transition
						"
					>
						Delete Account
					</button>
				</div>
			</div>

			{/* MODAL */}
			{showDeleteConfirm && (
				<Modal onClose={() => !deleting && setShowDeleteConfirm(false)}>
					<ConfirmModal
						title="Delete Account?"
						message="This action cannot be undone."
						confirmText={deleting ? "Deleting..." : "Delete Account"}
						cancelText="Cancel"
						onCancel={() => !deleting && setShowDeleteConfirm(false)}
						onConfirm={confirmDelete}
					/>
				</Modal>
			)}
		</div>
	);
}
