import axios from 'axios';
import type { AuthResponse, LoginCredentials } from '@/types';

const DUMMYJSON_URL = import.meta.env.VITE_DUMMYJSON;

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await axios.post<AuthResponse>(DUMMYJSON_URL, credentials);
    return res.data;
  },
};

export default authService;
