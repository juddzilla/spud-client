import { create } from 'zustand';

export const useHomeStore = create((set) => ({
    item: null,
    setItem: (item) => set(() => ({ item })),
    reset: () => set({ item: null }),
}))