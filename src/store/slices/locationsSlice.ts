import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import locationsService, { type GetLocationsParams } from '@/services/locationsService';
import type { Location, LocationFormData, LocationStatus, LocationFilters, PaginationState } from '@/types';



export const fetchLocations = createAsyncThunk(
  'locations/fetchAll',
  async (params: GetLocationsParams, { rejectWithValue }) => {
    try {
      return await locationsService.getAll(params);
    } catch (err) {
      return rejectWithValue('Impossible de charger les lieux.');
    }
  }
);

export const fetchLocationById = createAsyncThunk(
  'locations/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await locationsService.getById(id);
    } catch {
      return rejectWithValue('Lieu introuvable.');
    }
  }
);

export const createLocation = createAsyncThunk(
  'locations/create',
  async (data: LocationFormData, { rejectWithValue }) => {
    try {
      return await locationsService.create(data);
    } catch {
      return rejectWithValue('Erreur lors de la création du lieu.');
    }
  }
);

export const updateLocation = createAsyncThunk(
  'locations/update',
  async ({ id, data }: { id: number; data: Partial<LocationFormData> }, { rejectWithValue }) => {
    try {
      return await locationsService.update(id, data);
    } catch {
      return rejectWithValue('Erreur lors de la mise à jour du lieu.');
    }
  }
);

export const toggleLocationStatus = createAsyncThunk(
  'locations/toggleStatus',
  async ({ id, status }: { id: string; status: LocationStatus }, { rejectWithValue }) => {
    try {
      return await locationsService.toggleStatus(id, status);
    } catch {
      return rejectWithValue('Erreur lors du changement de statut.');
    }
  }
);

export const deleteLocation = createAsyncThunk(
  'locations/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await locationsService.delete(id);
      return id;
    } catch {
      return rejectWithValue('Erreur lors de la suppression du lieu.');
    }
  }
);


interface LocationsState {
  items: Location[];
  currentLocation: Location | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  filters: LocationFilters;
}

const initialState: LocationsState = {
  items: [],
  currentLocation: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 12, total: 0 },
  filters: {
    search: '',
    categories: [],
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<LocationFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentLocation: (state) => {
      state.currentLocation = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchById
    builder
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // create
    builder
      .addCase(createLocation.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });

    // update
    builder
      .addCase(updateLocation.fulfilled, (state, action) => {
        const idx = state.items.findIndex((l) => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentLocation?.id === action.payload.id) {
          state.currentLocation = action.payload;
        }
      });

    // toggleStatus
    builder
      .addCase(toggleLocationStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((l) => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });

    // delete
    builder
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload);
      });
  },
});

export const { setFilters, resetFilters, setPage, clearCurrentLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
