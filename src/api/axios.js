import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://192.168.12.215:8000/api",
  // Live
  baseURL: "http://13.60.188.147/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const publicPaths = [/^\/products/, /^\/categories-products/];
    const cfg = error.config || {};
    const skip = cfg.skipAuthRedirect;
    const status = error.response?.status;
    if (status === 401 && !skip) {
      const isPublic = publicPaths.some((r) => r.test(cfg.url || ""));
      if (!isPublic) {
        // optional: redirect or logout
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
