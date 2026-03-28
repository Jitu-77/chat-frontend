import api from "./axios";

export const apiService = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    try {
      const res = await api.get(url, { params });
      return res.data;
    } catch (error: any) {
      return error;
    }
  },

  post: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const res = await api.post(url, data);
      return res.data;
    } catch (error: any) {
      return error;
    }
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const res = await api.put(url, data);
      return res.data;
    } catch (error: any) {
      return error;
    }
  },

  delete: async <T>(url: string): Promise<T> => {
    try {
      const res = await api.delete(url);
      return res.data;
    } catch (error: any) {
      return error;
    }
  },
};
