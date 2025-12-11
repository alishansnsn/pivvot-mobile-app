import { create } from 'zustand';

export interface UserState {
    profileImage: string;
    name: string;
    handle: string;
    businessName: string;
    businessAddress: string;
    businessLogo: string | null;

    setProfileImage: (uri: string) => void;
    updateProfile: (name: string, handle: string) => void;
    updateBusinessInfo: (info: Partial<{ businessName: string; businessAddress: string; businessLogo: string | null }>) => void;
}

export const useUserStore = create<UserState>((set) => ({
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    name: "Ali Shan",
    handle: "@alishansn",
    businessName: "Pylon Dev",
    businessAddress: "123 Tech Street, Silicon Valley, CA",
    businessLogo: null,

    setProfileImage: (uri) => set({ profileImage: uri }),
    updateProfile: (name, handle) => set({ name, handle }),
    updateBusinessInfo: (info) => set((state) => ({ ...state, ...info })),
}));
