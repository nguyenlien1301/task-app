import axios from "axios";
// Vì lê trình duyệt sẽ ko biết là chạy port nào nên cần
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
