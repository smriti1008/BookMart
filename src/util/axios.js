import axios from "axios";
import store from "../store";
import { authActions } from "../store/auth";
import { clearAuthStorage } from "./storage";

// Determine base URL: use env variable, or fallback based on environment
const getBaseURL = () => {
  // Check for environment variables first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback: localhost for dev, vercel for prod
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api/v1";
  }
  
  return "https://book-store-exv9.vercel.app/api/v1";
};

const baseURL = getBaseURL();

console.log("🌐 Frontend API Configuration:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  finalBaseURL: baseURL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

// In production, enforce HTTPS to ensure cookies with SameSite=None; Secure are sent
if (import.meta.env.PROD && !baseURL.startsWith("https://")) {
  console.warn("VITE_API_BASE_URL is not HTTPS in production. Update it to an https:// URL to send secure cookies.");
}

const api = axios.create({
  baseURL,
  withCredentials: true, // send HttpOnly cookie automatically
});

// ✅ Response interceptor to handle authentication errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle 401 (Unauthorized) and 403 (Forbidden) - token issues
    if (response?.status === 401 || response?.status === 403) {
      const errorCode = response?.data?.code;
      const url = error.config?.url || '';
      
      // Don't logout for login/signup endpoints (expected failures during authentication)
      const isLoginOrSignup = url.includes('/sign-in') || url.includes('/signup');
      
      // For all other endpoints (including /get-user-information), logout on auth errors
      // Also logout if it's a token expiration/invalid token error
      if (!isLoginOrSignup) {
        const shouldLogout = 
          errorCode === 'TOKEN_EXPIRED' || 
          errorCode === 'INVALID_TOKEN' || 
          errorCode === 'NO_TOKEN' ||
          errorCode === 'TOKEN_ERROR' ||
          (!errorCode && (response?.status === 401 || response?.status === 403));
        
        if (shouldLogout) {
          console.log("🔒 Authentication error detected, clearing auth state:", errorCode || response?.status);
          
          // Clear all storage (localStorage + sessionStorage)
          clearAuthStorage();
          
          // Clear Redux auth state
          store.dispatch(authActions.logout());
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
