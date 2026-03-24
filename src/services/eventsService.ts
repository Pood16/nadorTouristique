import api from './api';
import type { AppEvent, EventFormData, EventStatus } from '@/types';

const eventsService = {
  getAll: async (): Promise<AppEvent[]> => {
    const res = await api.get<AppEvent[]>('/events');
    return res.data;
  },

  create: async (data: EventFormData): Promise<AppEvent> => {
    const payload = { ...data, createdAt: new Date().toISOString() };
    const res = await api.post<AppEvent>('/events', payload);
    return res.data;
  },

  update: async (id: number, data: Partial<EventFormData>): Promise<AppEvent> => {
    const res = await api.patch<AppEvent>(`/events/${id}`, data);
    return res.data;
  },

  toggleStatus: async (id: number, status: EventStatus): Promise<AppEvent> => {
    const res = await api.patch<AppEvent>(`/events/${id}`, { status });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

export default eventsService;
