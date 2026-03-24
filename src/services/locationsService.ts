import api from './api';
import type { Location, LocationFormData, LocationStatus } from '@/types';

export interface GetLocationsParams {
  category?: string;
  status?: LocationStatus | '';
  _page?: number;
  _per_page?: number;  
  _sort?: string;    
}


interface V1Page {
  data: Location[];
  items: number; 
  pages: number;
  first: number;
  last: number;
  prev: number | null;
  next: number | null;
}

const locationsService = {

  getAll: async (params: GetLocationsParams = {}): Promise<{ data: Location[]; total: number }> => {
    const res = await api.get<Location[] | V1Page>('/locations', { params });

    if (res.data && !Array.isArray(res.data) && 'data' in res.data) {
      const envelope = res.data as V1Page;
      return { data: Array.isArray(envelope.data) ? envelope.data : [], total: envelope.items };
    }

    const arr = Array.isArray(res.data) ? (res.data as Location[]) : [];
    return { data: arr, total: arr.length };
  },

  getById: async (id: string): Promise<Location> => {
    
    const res = await api.get<Location>(`/locations/${id}`);
    const found = res.data;
    if (!found) throw new Error('Lieu introuvable.');
    return found;

  },

  create: async (data: LocationFormData): Promise<Location> => {
    const payload = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const res = await api.post<Location>('/locations', payload);
    return res.data;
  },

  update: async (id: number, data: Partial<LocationFormData>): Promise<Location> => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    const res = await api.patch<Location>(`/locations/${id}`, payload);
    return res.data;
  },

  toggleStatus: async (id: number, status: LocationStatus): Promise<Location> => {
    const res = await api.patch<Location>(`/locations/${id}`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/locations/${id}`);
  },
};

export default locationsService;
