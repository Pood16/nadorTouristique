import api from './api';
import type { Subscriber, SubscribeFormData, SubscriberStatus } from '@/types';

const subscribersService = {
  getAll: async (): Promise<Subscriber[]> => {
    const res = await api.get<Subscriber[]>('/subscribers');
    return res.data;
  },

  getByEmail: async (email: string): Promise<Subscriber | null> => {
    const res = await api.get<Subscriber[]>('/subscribers', { params: { email } });
    return res.data[0] ?? null;
  },

  subscribe: async (data: SubscribeFormData): Promise<Subscriber> => {
    const payload: Omit<Subscriber, 'id'> = {
      ...data,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };
    const res = await api.post<Subscriber>('/subscribers', payload);
    return res.data;
  },

  toggleStatus: async (id: number, status: SubscriberStatus): Promise<Subscriber> => {
    const res = await api.patch<Subscriber>(`/subscribers/${id}`, { status });
    return res.data;
  },
};

export default subscribersService;
