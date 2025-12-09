import api from "./api/axiosInstance";

export default {
	getGlobalAnalytics: () => api.get("/analytics/global"),
	getSprintAnalytics: (id) => api.get(`/analytics/sprint/${id}`),
};
