// src/stores/useUIStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  rightDockOpen: boolean;
  openDock: () => void;
  closeDock: () => void;
  toggleDock: () => void;
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      rightDockOpen: false,
      openDock: () => set({ rightDockOpen: true }),
      closeDock: () => set({ rightDockOpen: false }),
      toggleDock: () => set((s) => ({ rightDockOpen: !s.rightDockOpen })),
      sidebarOpen: false,
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { 
      name: "ui-store",
      partialize: (state) => ({ rightDockOpen: state.rightDockOpen }) // sidebarOpen은 persist에서 제외
    }
  )
);
