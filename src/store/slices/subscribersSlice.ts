import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscribersService from '@/services/subscribersService';
import type { Subscriber, SubscribeFormData, SubscriberStatus } from '@/types';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchSubscribers = createAsyncThunk(
  'subscribers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await subscribersService.getAll();
    } catch {
      return rejectWithValue('Impossible de charger les abonnés.');
    }
  }
);

export const addSubscriber = createAsyncThunk(
  'subscribers/add',
  async (data: SubscribeFormData, { rejectWithValue }) => {
    try {
      const existing = await subscribersService.getByEmail(data.email);
      if (existing) {
        return rejectWithValue('Cette adresse email est déjà abonnée.');
      }
      return await subscribersService.subscribe(data);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        return rejectWithValue((err as Error).message);
      }
      return rejectWithValue("Erreur lors de l'inscription.");
    }
  }
);

export const toggleSubscriberStatus = createAsyncThunk(
  'subscribers/toggleStatus',
  async ({ id, status }: { id: number; status: SubscriberStatus }, { rejectWithValue }) => {
    try {
      return await subscribersService.toggleStatus(id, status);
    } catch {
      return rejectWithValue('Erreur lors du changement de statut.');
    }
  }
);

// ─── State ────────────────────────────────────────────────────────────────────

interface SubscribersState {
  items: Subscriber[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscribersState = {
  items: [],
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const subscribersSlice = createSlice({
  name: 'subscribers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(addSubscriber.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });

    builder
      .addCase(toggleSubscriberStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default subscribersSlice.reducer;
