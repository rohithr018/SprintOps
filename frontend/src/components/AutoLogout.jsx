import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userslice";
import { jwtDecode } from "jwt-decode";

export default function AutoLogout() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.user.token);

	useEffect(() => {
		if (!token) return;

		let decoded;
		try {
			decoded = jwtDecode(token);
		} catch (err) {
			console.error("Failed to decode token:", err);
			dispatch(logout());
			return;
		}

		const exp = decoded?.exp;
		if (!exp) {
			dispatch(logout());
			return;
		}

		const now = Date.now() / 1000;
		const remaining = (exp - now) * 1000;

		if (remaining <= 0) {
			dispatch(logout());
			return;
		}

		const timeout = setTimeout(() => {
			dispatch(logout());
		}, remaining);

		return () => clearTimeout(timeout);
	}, [token, dispatch]);

	return null;
}
