import axios from "axios";

// In docker-compose, set REACT_APP_API_URL to the backend container's exposed URL,
// e.g. http://localhost:8000 (browser calls go through the host, not the docker network)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

export const getTasks = () => api.get("/tasks");
export const createTask = (task) => api.post("/tasks", task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
