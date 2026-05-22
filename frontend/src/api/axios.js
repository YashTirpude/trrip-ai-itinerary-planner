import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 120000, // 2 min for AI generation
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    let message = "Something went wrong";

    // Gemini overload / quota issues
    if (err.response?.status === 429 || err.response?.status === 503) {
      message =
        "Our AI planner is experiencing high demand right now. Please try again shortly.";
    } else {
      message =
        err.response?.data?.message || err.message || "Something went wrong";
    }

    return Promise.reject(new Error(message));
  },
);

export default api;
