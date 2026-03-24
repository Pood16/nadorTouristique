import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventsService from '@/services/eventsService';
import type { AppEvent, EventFormData, EventStatus } from '@/types';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await eventsService.getAll();
    } catch {
      return rejectWithValue('Impossible de charger les événements.');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/create',
  async (data: EventFormData, { rejectWithValue }) => {
    try {
      return await eventsService.create(data);
    } catch {
      return rejectWithValue("Erreur lors de la création de l'événement.");
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, data }: { id: number; data: Partial<EventFormData> }, { rejectWithValue }) => {
    try {
      return await eventsService.update(id, data);
    } catch {
      return rejectWithValue("Erreur lors de la mise à jour de l'événement.");
    }
  }
);

export const toggleEventStatus = createAsyncThunk(
  'events/toggleStatus',
  async ({ id, status }: { id: number; status: EventStatus }, { rejectWithValue }) => {
    try {
      return await eventsService.toggleStatus(id, status);
    } catch {
      return rejectWithValue('Erreur lors du changement de statut.');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await eventsService.delete(id);
      return id;
    } catch {
      return rejectWithValue("Erreur lors de la suppression de l'événement.");
    }
  }
);

// ─── State ────────────────────────────────────────────────────────────────────

interface EventsState {
  items: AppEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    builder.addCase(updateEvent.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    });

    builder.addCase(toggleEventStatus.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    });

    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
    });
  },
});

export default eventsSlice.reducer;
