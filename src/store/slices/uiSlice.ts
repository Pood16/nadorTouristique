import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ConfirmModal {
  open: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  variant: 'danger' | 'warning';
}

interface UiState {
  sidebarOpen: boolean;
  confirmModal: ConfirmModal;
}

const initialState: UiState = {
  sidebarOpen: true,
  confirmModal: {
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'danger',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openConfirmModal: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
      }>
    ) => {
      state.confirmModal = {
        open: true,
        title: action.payload.title,
        message: action.payload.message,
        onConfirm: action.payload.onConfirm,
        variant: action.payload.variant ?? 'danger',
      };
    },
    closeConfirmModal: (state) => {
      state.confirmModal = initialState.confirmModal;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, openConfirmModal, closeConfirmModal } = uiSlice.actions;
export default uiSlice.reducer;
