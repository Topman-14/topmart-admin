import { create } from 'zustand';

interface useDevModeStore{
    isDev: boolean;
    setDev: (value: boolean) => void;
}
export const useDevMode = create<useDevModeStore>((set) => ({
    isDev: false,
    setDev: (value) => set({ isDev: value }),
}));
