import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppDataState,
  Donation,
  Need,
  Organization,
  Pet,
  Report,
  Sponsorship,
  SupportTransaction,
  TimelinePost,
  TransparencyRecord,
} from '../../types/domain';

interface PetStoreState extends AppDataState {
  followPet: (petId: string) => void;
  unfollowPet: (petId: string) => void;
  mergeRemotePets: (pets: Pet[]) => void;
  mergeRemoteOrganizations: (organizations: Organization[]) => void;
  mergeRemoteNeeds: (needs: Need[]) => void;
  mergeRemoteTimelinePosts: (timelinePosts: TimelinePost[]) => void;
  mergeRemotePetLetters: (petLetters: AppDataState['petLetters']) => void;
  mergeRemoteTransparencyRecords: (records: TransparencyRecord[]) => void;
  mergeRemoteSponsorships: (sponsorships: Sponsorship[]) => void;
  mergeRemoteSupportTransactions: (transactions: SupportTransaction[]) => void;
  mergeRemoteDonations: (donations: Donation[]) => void;
  mergeRemoteReports: (reports: Report[]) => void;
  clearCatalog: () => void;
}

const emptyState = (): AppDataState => ({
  users: [],
  organizations: [],
  pets: [],
  needs: [],
  timelinePosts: [],
  petLetters: [],
  donations: [],
  sponsorships: [],
  supportTransactions: [],
  transparencyRecords: [],
  reports: [],
});

const mergeById = <T extends { id: string }>(current: T[], incoming: T[]): T[] => {
  const next = [...current];

  incoming.forEach((entry) => {
    const index = next.findIndex((candidate) => candidate.id === entry.id);

    if (index >= 0) {
      next[index] = {
        ...next[index],
        ...entry,
      };
      return;
    }

    next.unshift(entry);
  });

  return next;
};

export const usePetStore = create<PetStoreState>()(
  persist(
    (set) => ({
      ...emptyState(),
      followPet: (petId) =>
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === petId ? { ...pet, followerCount: pet.followerCount + 1 } : pet,
          ),
        })),
      unfollowPet: (petId) =>
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === petId
              ? { ...pet, followerCount: Math.max(0, pet.followerCount - 1) }
              : pet,
          ),
        })),
      mergeRemotePets: (remotePets) =>
        set((state) => ({
          pets: mergeById(
            state.pets,
            remotePets.map((remotePet) => {
              const existingPet = state.pets.find(
                (pet) => pet.slug === remotePet.slug || pet.remoteId === remotePet.remoteId,
              );

              if (!existingPet) {
                return remotePet;
              }

              return {
                ...existingPet,
                ...remotePet,
                id: existingPet.id,
              };
            }),
          ),
        })),
      mergeRemoteOrganizations: (remoteOrganizations) =>
        set((state) => ({
          organizations: mergeById(state.organizations, remoteOrganizations),
        })),
      mergeRemoteNeeds: (remoteNeeds) =>
        set((state) => ({
          needs: mergeById(state.needs, remoteNeeds),
        })),
      mergeRemoteTimelinePosts: (remoteTimelinePosts) =>
        set((state) => ({
          timelinePosts: mergeById(state.timelinePosts, remoteTimelinePosts),
        })),
      mergeRemotePetLetters: (remotePetLetters) =>
        set((state) => ({
          petLetters: mergeById(state.petLetters, remotePetLetters),
        })),
      mergeRemoteTransparencyRecords: (remoteRecords) =>
        set((state) => ({
          transparencyRecords: mergeById(state.transparencyRecords, remoteRecords),
        })),
      mergeRemoteSponsorships: (remoteSponsorships) =>
        set((state) => ({
          sponsorships: mergeById(state.sponsorships, remoteSponsorships),
        })),
      mergeRemoteSupportTransactions: (remoteTransactions) =>
        set((state) => ({
          supportTransactions: mergeById(state.supportTransactions, remoteTransactions),
        })),
      mergeRemoteDonations: (remoteDonations) =>
        set((state) => ({
          donations: mergeById(state.donations, remoteDonations),
        })),
      mergeRemoteReports: (remoteReports) =>
        set((state) => ({
          reports: mergeById(state.reports, remoteReports),
        })),
      clearCatalog: () => set(emptyState()),
    }),
    {
      name: 'petguardian-data',
      partialize: (state) => ({
        users: state.users,
        organizations: state.organizations,
        pets: state.pets,
        needs: state.needs,
        timelinePosts: state.timelinePosts,
        petLetters: state.petLetters,
        donations: state.donations,
        sponsorships: state.sponsorships,
        supportTransactions: state.supportTransactions,
        transparencyRecords: state.transparencyRecords,
        reports: state.reports,
      }),
    },
  ),
);
