import api from "./api/axiosInstance";

export default {
	exportPDF: (sprintId) =>
		api.get(`/export/${sprintId}/pdf`, { responseType: "blob" }),
	exportMarkdown: (sprintId) =>
		api.get(`/export/${sprintId}/md`, { responseType: "blob" }),
	exportText: (sprintId) =>
		api.get(`/export/${sprintId}/txt`, { responseType: "blob" }),
};
