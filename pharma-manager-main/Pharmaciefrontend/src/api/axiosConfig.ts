import axios from "axios";

const API_URL_BASE = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL:  API_URL_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach access token ─────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// ── Response interceptor — silent token refresh on 401 ────────
let isRefreshing = false;
// Queue of requests that arrived while a refresh was in progress
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];
 
function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}
 
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
 
    // Only attempt refresh for 401 errors that haven't been retried yet
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
 
    if (isRefreshing) {
      // Another refresh is already in progress — queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }
 
    originalRequest._retry = true;
    isRefreshing = true;
 
    const refreshToken = localStorage.getItem("refresh_token");
 
    if (!refreshToken) {
      // No refresh token — force logout
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }
 
    try {
      const { data } = await axios.post(`${API_URL_BASE}/token/refresh/`, {
        refresh: refreshToken,
      });
 
      localStorage.setItem("access_token", data.access);
      // If ROTATE_REFRESH_TOKENS=True Django returns a new refresh too
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }
 
      axiosInstance.defaults.headers.Authorization = `Bearer ${data.access}`;
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      processQueue(null, data.access);
 
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
 
function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export default axiosInstance;