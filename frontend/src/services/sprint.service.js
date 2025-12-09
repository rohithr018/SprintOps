import api from "./api/axiosInstance";

export default {
	getSprints: async () => {
		const res = await api.get("/sprints");
		return res.data.data;
	},

	createSprint: async (payload) => {
		const res = await api.post("/sprints", payload);
		return res.data.data;
	},

	getSprint: async (id) => {
		const res = await api.get(`/sprints/${id}`);
		return res.data.data;
	},

	updateSprint: async (id, payload) => {
		const res = await api.put(`/sprints/${id}`, payload);
		return res.data.data;
	},

	deleteSprint: async (id) => {
		const res = await api.delete(`/sprints/${id}`);
		return res.data.data;
	},
};
