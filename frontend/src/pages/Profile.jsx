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
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl font-semibold text-slate-900 mb-6">Profile</h1>

			<div className="grid gap-8 md:grid-cols-2">
				{/* ACCOUNT INFO */}
				<section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
					<h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
						Account Info
					</h2>

					<form onSubmit={handleProfileSubmit} className="space-y-4">
						<div>
							<label className="block text-xs font-medium text-slate-500 mb-1">
								Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
							/>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-500 mb-1">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
							/>
						</div>

						<button
							type="submit"
							disabled={!isProfileChanged || savingProfile}
							className={`px-4 py-2 rounded-md text-sm text-white ${
								!isProfileChanged || savingProfile
									? "bg-blue-300 cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-700"
							}`}
						>
							{savingProfile ? "Saving..." : "Save Changes"}
						</button>
					</form>
				</section>

				{/* PASSWORD + DELETE ACCOUNT */}
				<section className="space-y-6">
					{/* CHANGE PASSWORD */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
						<h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
							Change Password
						</h2>

						<form onSubmit={handlePasswordSubmit} className="space-y-4">
							{/* New Password */}
							<div className="relative">
								<label className="block text-xs font-medium text-slate-500 mb-1">
									New Password
								</label>

								<input
									type={showPassword ? "text" : "password"}
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full rounded-md border px-3 py-2 pr-10 text-sm"
								/>

								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-[32px] text-slate-500 hover:text-slate-700"
								>
									{showPassword ? <FiEyeOff /> : <FiEye />}
								</button>
							</div>

							{/* Confirm Password */}
							<div className="relative">
								<label className="block text-xs font-medium text-slate-500 mb-1">
									Confirm Password
								</label>

								<input
									type={showPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full rounded-md border px-3 py-2 pr-10 text-sm"
								/>

								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-[32px] text-slate-500 hover:text-slate-700"
								>
									{showPassword ? <FiEyeOff /> : <FiEye />}
								</button>
							</div>

							<button
								type="submit"
								disabled={savingPassword}
								className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-900 disabled:opacity-50"
							>
								{savingPassword ? "Updating..." : "Update Password"}
							</button>
						</form>
					</div>

					{/* DELETE ACCOUNT */}
					<div className="bg-white rounded-xl border border-red-300 shadow-sm p-5">
						<h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">
							Danger Zone
						</h2>

						<p className="text-xs text-slate-600 mb-4">
							This action permanently deletes your account and all associated
							data.
						</p>

						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="border border-red-500 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 text-sm"
						>
							Delete Account
						</button>
					</div>
				</section>
			</div>

			{/* DELETE CONFIRMATION MODAL */}
			{showDeleteConfirm && (
				<Modal
					onClose={() => {
						if (!deleting) setShowDeleteConfirm(false);
					}}
				>
					<ConfirmModal
						title="Delete Account?"
						message="This action will permanently delete your account. This cannot be undone."
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
