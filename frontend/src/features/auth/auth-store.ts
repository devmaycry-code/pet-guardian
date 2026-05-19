import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../../types/domain';
import { initialAppData } from '../../mocks/data';

interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginAs: (userId: string) => void;
  setCurrentUser: (user: User | null) => void;
  setTokens: (tokens: { accessToken: string | null; refreshToken?: string | null }) => void;
  followPet: (petId: string) => void;
  unfollowPet: (petId: string) => void;
  clearSession: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      accessToken: null,
      refreshToken: null,
      loginAs: (userId) => {
        const user = initialAppData.users.find((entry) => entry.id === userId) ?? null;
        set({ currentUser: user, accessToken: null, refreshToken: null });
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken ?? null,
        }),
      clearSession: () =>
        set({
          currentUser: null,
          accessToken: null,
          refreshToken: null,
        }),
      logout: () =>
        set({
          currentUser: null,
          accessToken: null,
          refreshToken: null,
        }),
      followPet: (petId) =>
        set((state) => ({
          currentUser: state.currentUser
            ? {
                ...state.currentUser,
                followedPetIds: state.currentUser.followedPetIds.includes(petId)
                  ? state.currentUser.followedPetIds
                  : [...state.currentUser.followedPetIds, petId],
              }
            : null,
        })),
      unfollowPet: (petId) =>
        set((state) => ({
          currentUser: state.currentUser
            ? {
                ...state.currentUser,
                followedPetIds: state.currentUser.followedPetIds.filter((id) => id !== petId),
              }
            : null,
        })),
    }),
    {
      name: 'petguardian-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
