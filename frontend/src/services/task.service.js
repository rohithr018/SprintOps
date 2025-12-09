import api from "./api/axiosInstance";

export default {
	getTasks: (sprintId) => api.get(`/sprints/${sprintId}/tasks`),
	createTask: (sprintId, payload) =>
		api.post(`/sprints/${sprintId}/tasks`, payload),
	getTask: (sprintId, taskId) =>
		api.get(`/sprints/${sprintId}/tasks/${taskId}`),
	updateTask: (sprintId, taskId, payload) =>
		api.put(`/sprints/${sprintId}/tasks/${taskId}`, payload),
	deleteTask: (sprintId, taskId) =>
		api.delete(`/sprints/${sprintId}/tasks/${taskId}`),

	// logs
	addLog: (sprintId, taskId, payload) =>
		api.post(`/sprints/${sprintId}/tasks/${taskId}/logs`, payload),
	getLogs: (sprintId, taskId) =>
		api.get(`/sprints/${sprintId}/tasks/${taskId}/logs`),
};
