import api from "./api/axiosInstance";

export default {
	login: (payload) => api.post("/auth/login", payload),
	register: (payload) => api.post("/auth/register", payload),
};
