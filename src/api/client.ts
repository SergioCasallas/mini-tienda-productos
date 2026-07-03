import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

export interface ApiError {
  message: string;
  status?: number;
  isNetworkError: boolean;
}

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const formattedError: ApiError = {
      message: error.message || 'Something went wrong',
      status: error.response?.status,
      isNetworkError: !error.response,
    };

    if (error.response?.data && (error.response.data as any).message) {
      formattedError.message = (error.response.data as any).message;
    }

    return Promise.reject(formattedError);
  }
);
