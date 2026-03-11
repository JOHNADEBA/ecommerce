import { useAuth } from "@clerk/nextjs";
import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
});

export const useApi = () => {
  const { getToken } = useAuth();

  const request = async <T = any>(
    method: "get" | "post" | "patch" | "delete",
    url: string,
    data?: any,
    options?: { requireAuth?: boolean; headers?: Record<string, string> },
  ): Promise<T> => {
    try {
      const headers: Record<string, string> = { ...options?.headers };

      // Add auth token if required
      if (options?.requireAuth !== false) {
        const token = await getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      // Don't set Content-Type for FormData - let browser set it with boundary
      if (data instanceof FormData) {
        // Remove any manually set Content-Type
        delete headers["Content-Type"];
      }

      const config: AxiosRequestConfig = {
        method,
        url,
        data,
        headers,
      };

      const response = await apiClient.request(config);
      return response.data;
    } catch (error: any) {
      console.error(
        `API Error (${method.toUpperCase()} ${url}):`,
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  return {
    public: {
      get: <T = any>(url: string) =>
        request<T>("get", url, undefined, { requireAuth: false }),
    },
    auth: {
      get: <T = any>(url: string) => request<T>("get", url),
      post: <T = any>(
        url: string,
        data?: any,
        options?: { headers?: Record<string, string> },
      ) => request<T>("post", url, data, options),
      patch: <T = any>(
        url: string,
        data?: any,
        options?: { headers?: Record<string, string> },
      ) => request<T>("patch", url, data, options),
      delete: <T = any>(url: string) => request<T>("delete", url),
    },
  };
};
