import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";


const API = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const PUBLIC_ENDPOINTS = ["/taskit/users/login", "/taskit/users/register"];

// Helper to safely get user from localStorage
const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
   try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublic = PUBLIC_ENDPOINTS.some((ep) =>
      config.url?.includes(ep)
    );

    if (!isPublic) {
      const token = getStoredUser()?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        console.warn("Session expired. Redirecting to login.");

        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Set or remove token manually
export const setAuthToken = (token: string | null) => {
   if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;