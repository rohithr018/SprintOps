import axios from "axios";
import { getToken } from "../../utils/tokenGetter";

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
	baseURL: baseURL,
});

api.interceptors.request.use((config) => {
	const token = getToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default api;
