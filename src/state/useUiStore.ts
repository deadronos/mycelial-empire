import { create } from "zustand";

export type ToastIntent = "info" | "success" | "error";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  intent: ToastIntent;
  createdAt: number;
}

interface UiState {
  dialogs: {
    settingsOpen: boolean;
  };
  autosave: {
    enabled: boolean;
    intervalMs: number;
    lastSavedAt?: number;
  };
  importBuffer: string;
  devtools: {
    showGridOverlay: boolean;
  };
  toasts: ToastMessage[];
  setSettingsOpen: (open: boolean) => void;
  setAutosaveEnabled: (enabled: boolean) => void;
  setAutosaveInterval: (milliseconds: number) => void;
  setImportBuffer: (value: string) => void;
  pushToast: (toast: Omit<ToastMessage, "id" | "createdAt">) => string;
  dismissToast: (id: string) => void;
  markAutosaved: () => void;
  toggleGridOverlay: () => void;
}

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

export const useUiStore = create<UiState>((set) => ({
  dialogs: {
    settingsOpen: false,
  },
  autosave: {
    enabled: true,
    intervalMs: 30_000,
    lastSavedAt: undefined,
  },
  importBuffer: "",
  devtools: {
    showGridOverlay: false,
  },
  toasts: [],
  setSettingsOpen: (settingsOpen) => set((state) => ({ dialogs: { ...state.dialogs, settingsOpen } })),
  setAutosaveEnabled: (enabled) => set((state) => ({ autosave: { ...state.autosave, enabled } })),
  setAutosaveInterval: (intervalMs) =>
    set((state) => ({ autosave: { ...state.autosave, intervalMs } })),
  setImportBuffer: (importBuffer) => set(() => ({ importBuffer })),
  pushToast: ({ title, description, intent }) => {
    const id = createId();
    const toast: ToastMessage = {
      id,
      title,
      description,
      intent,
      createdAt: Date.now(),
    };

    set((state) => ({ toasts: [...state.toasts, toast] }));
    return id;
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  markAutosaved: () =>
    set((state) => ({ autosave: { ...state.autosave, lastSavedAt: Date.now() } })),
  toggleGridOverlay: () =>
    set((state) => ({ devtools: { ...state.devtools, showGridOverlay: !state.devtools.showGridOverlay } })),
}));
