import api from "./api/axiosInstance";

export default {
	getPRs: (sprintId) => api.get(`/sprints/${sprintId}/prs`),
	createPR: (sprintId, payload) =>
		api.post(`/sprints/${sprintId}/prs`, payload),
	getPR: (sprintId, id) => api.get(`/sprints/${sprintId}/prs/${id}`),
	updatePR: (sprintId, id, payload) =>
		api.put(`/sprints/${sprintId}/prs/${id}`, payload),
	deletePR: (sprintId, id) => api.delete(`/sprints/${sprintId}/prs/${id}`),
};
