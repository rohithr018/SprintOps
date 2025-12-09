import api from "./api/axiosInstance";

export default {
	list: () => api.get("/users"),
	create: (payload) => api.post("/users", payload),

	get: (id) => api.get(`/users/${id}`),

	update: (id, payload) => api.put(`/users/${id}`, payload),

	remove: (id) => api.delete(`/users/${id}`),
};
