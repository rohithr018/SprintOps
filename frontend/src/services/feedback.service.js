import api from "./api/axiosInstance";

export default {
	getFeedback: (sprintId) => api.get(`/sprints/${sprintId}/feedback`),
	createFeedback: (sprintId, payload) =>
		api.post(`/sprints/${sprintId}/feedback`, payload),
	getOne: (sprintId, id) => api.get(`/sprints/${sprintId}/feedback/${id}`),
	updateFeedback: (sprintId, id, payload) =>
		api.put(`/sprints/${sprintId}/feedback/${id}`, payload),
	deleteFeedback: (sprintId, id) =>
		api.delete(`/sprints/${sprintId}/feedback/${id}`),
};
