import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { apiConfig } from '@/config/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.rest.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error)
);

export { apiClient };
