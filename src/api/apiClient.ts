import axios, { type AxiosError, type AxiosInstance } from 'axios';

const API_BASE_URL = '/api';

export interface ApiError {
  status: number;
  message: string;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ??
        error.message ??
        'Error al comunicarse con el servidor',
    };
    return Promise.reject(apiError);
  },
);