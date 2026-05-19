import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialAppData } from '../../mocks/data';
import type {
  AppDataState,
  Need,
  Organization,
  Pet,
  Report,
  Sponsorship,
  SupportTransaction,
  TimelinePost,
  TransparencyRecord,
} from '../../types/domain';
import { slugify } from '../../utils/format';

interface CreatePetPayload {
  name: string;
  species: 'dog' | 'cat';
  city: string;
  state: string;
  summary: string;
  story: string;
  organizationId: string;
}

interface CreateNeedPayload {
  petId: string;
  title: string;
  description: string;
  estimatedAmount: number;
}

interface CreateTimelinePayload {
  petId: string;
  title: string;
  content: string;
}

interface PetStoreState extends AppDataState {
  sponsorPet: (petId: string, sponsorName: string) => void;
  followPet: (petId: string) => void;
  unfollowPet: (petId: string) => void;
  addReport: (report: Omit<Report, 'id' | 'status' | 'createdAt'>) => void;
  mergeRemotePets: (pets: Pet[]) => void;
  mergeRemoteOrganizations: (organizations: Organization[]) => void;
  mergeRemoteNeeds: (needs: Need[]) => void;
  mergeRemoteTimelinePosts: (timelinePosts: TimelinePost[]) => void;
  mergeRemoteTransparencyRecords: (records: TransparencyRecord[]) => void;
  mergeRemoteSponsorships: (sponsorships: Sponsorship[]) => void;
  mergeRemoteSupportTransactions: (transactions: SupportTransaction[]) => void;
  createLocalSupport: (payload: {
    userId: string;
    sponsorName: string;
    targetType: 'pet' | 'organization';
    targetId: string;
    monthlyAmount: number;
  }) => Sponsorship;
  pauseLocalSupport: (supportId: string) => void;
  resumeLocalSupport: (supportId: string) => void;
  cancelLocalSupport: (supportId: string) => void;
  createPet: (payload: CreatePetPayload) => Pet;
  addNeed: (payload: CreateNeedPayload) => Need;
  addTimelinePost: (payload: CreateTimelinePayload) => TimelinePost;
  resetData: () => void;
}

const cloneInitialData = (): AppDataState => structuredClone(initialAppData);

export const usePetStore = create<PetStoreState>()(
  persist(
    (set) => ({
      ...cloneInitialData(),
      sponsorPet: (petId, sponsorName) =>
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === petId ? { ...pet, sponsorCount: pet.sponsorCount + 1 } : pet,
          ),
          petLetters: [
            {
              id: `letter-${crypto.randomUUID()}`,
              petId,
              title: 'Chegou um novo Pawdrinho',
              content: `${sponsorName} acabou de se juntar a rede de cuidado deste pet.`,
              eventType: 'new_sponsor',
              createdAt: new Date().toISOString(),
            },
            ...state.petLetters,
          ],
        })),
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
        set((state) => {
          const nextPets = [...state.pets];
          const nextOrganizations = [...state.organizations];

          remotePets.forEach((remotePet) => {
            const index = nextPets.findIndex(
              (pet) => pet.slug === remotePet.slug || pet.remoteId === remotePet.remoteId,
            );

            if (index >= 0) {
              nextPets[index] = {
                ...nextPets[index],
                ...remotePet,
                id: nextPets[index].id,
                remoteId: remotePet.remoteId ?? nextPets[index].remoteId,
                gallery: nextPets[index].gallery.length ? nextPets[index].gallery : remotePet.gallery,
                followerCount: remotePet.followerCount ?? nextPets[index].followerCount,
                sponsorCount: remotePet.sponsorCount ?? nextPets[index].sponsorCount,
                vaccineRecords: nextPets[index].vaccineRecords,
                highlight: nextPets[index].highlight,
              };
              return;
            }

            nextPets.unshift(remotePet);
            const organizationIndex = nextOrganizations.findIndex(
              (organization) => organization.id === remotePet.organizationId,
            );

            if (
              organizationIndex >= 0 &&
              !nextOrganizations[organizationIndex].petIds.includes(remotePet.id)
            ) {
              nextOrganizations[organizationIndex] = {
                ...nextOrganizations[organizationIndex],
                petIds: [remotePet.id, ...nextOrganizations[organizationIndex].petIds],
              };
            }
          });

          return { pets: nextPets, organizations: nextOrganizations };
        }),
      mergeRemoteOrganizations: (remoteOrganizations) =>
        set((state) => {
          const nextOrganizations = [...state.organizations];

          remoteOrganizations.forEach((remoteOrganization) => {
            const index = nextOrganizations.findIndex(
              (organization) => organization.id === remoteOrganization.id,
            );

            if (index >= 0) {
              nextOrganizations[index] = {
                ...nextOrganizations[index],
                ...remoteOrganization,
                petIds: nextOrganizations[index].petIds,
              };
              return;
            }

            nextOrganizations.push(remoteOrganization);
          });

          return { organizations: nextOrganizations };
        }),
      mergeRemoteNeeds: (remoteNeeds) =>
        set((state) => {
          const nextNeeds = [...state.needs];

          remoteNeeds.forEach((remoteNeed) => {
            const index = nextNeeds.findIndex((need) => need.id === remoteNeed.id);

            if (index >= 0) {
              nextNeeds[index] = {
                ...nextNeeds[index],
                ...remoteNeed,
              };
              return;
            }

            nextNeeds.unshift(remoteNeed);
          });

          return { needs: nextNeeds };
        }),
      mergeRemoteTimelinePosts: (remoteTimelinePosts) =>
        set((state) => {
          const nextTimelinePosts = [...state.timelinePosts];

          remoteTimelinePosts.forEach((remoteTimelinePost) => {
            const index = nextTimelinePosts.findIndex((post) => post.id === remoteTimelinePost.id);

            if (index >= 0) {
              nextTimelinePosts[index] = {
                ...nextTimelinePosts[index],
                ...remoteTimelinePost,
              };
              return;
            }

            nextTimelinePosts.unshift(remoteTimelinePost);
          });

          return { timelinePosts: nextTimelinePosts };
        }),
      mergeRemoteTransparencyRecords: (remoteRecords) =>
        set((state) => {
          const nextRecords = [...state.transparencyRecords];

          remoteRecords.forEach((remoteRecord) => {
            const index = nextRecords.findIndex((record) => record.id === remoteRecord.id);

            if (index >= 0) {
              nextRecords[index] = {
                ...nextRecords[index],
                ...remoteRecord,
              };
              return;
            }

            nextRecords.unshift(remoteRecord);
          });

          return { transparencyRecords: nextRecords };
        }),
      mergeRemoteSponsorships: (remoteSponsorships) =>
        set((state) => {
          const nextSponsorships = [...state.sponsorships];

          remoteSponsorships.forEach((remoteSponsorship) => {
            const index = nextSponsorships.findIndex((sponsorship) => sponsorship.id === remoteSponsorship.id);

            if (index >= 0) {
              nextSponsorships[index] = {
                ...nextSponsorships[index],
                ...remoteSponsorship,
              };
              return;
            }

            nextSponsorships.unshift(remoteSponsorship);
          });

          return { sponsorships: nextSponsorships };
        }),
      mergeRemoteSupportTransactions: (remoteTransactions) =>
        set((state) => {
          const nextTransactions = [...state.supportTransactions];

          remoteTransactions.forEach((remoteTransaction) => {
            const index = nextTransactions.findIndex((transaction) => transaction.id === remoteTransaction.id);

            if (index >= 0) {
              nextTransactions[index] = {
                ...nextTransactions[index],
                ...remoteTransaction,
              };
              return;
            }

            nextTransactions.unshift(remoteTransaction);
          });

          return { supportTransactions: nextTransactions };
        }),
      createLocalSupport: (payload) => {
        const now = new Date().toISOString();
        const support: Sponsorship = {
          id: `support-${crypto.randomUUID()}`,
          userId: payload.userId,
          targetType: payload.targetType,
          targetId: payload.targetId,
          petId: payload.targetType === 'pet' ? payload.targetId : undefined,
          organizationId: payload.targetType === 'organization' ? payload.targetId : undefined,
          monthlyAmount: payload.monthlyAmount,
          status: 'active',
          startedAt: now,
          nextBillingAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastBilledAt: now,
        };

        set((state) => ({
          sponsorships: [support, ...state.sponsorships],
          supportTransactions: [
            {
              id: `charge-${crypto.randomUUID()}`,
              sponsorshipId: support.id,
              targetType: support.targetType,
              targetId: support.targetId,
              petId: support.petId,
              organizationId: support.organizationId,
              amount: support.monthlyAmount,
              paymentMethod: 'card',
              status: 'confirmed',
              createdAt: now,
            },
            ...state.supportTransactions,
          ],
          pets:
            support.targetType === 'pet'
              ? state.pets.map((pet) =>
                  pet.id === support.targetId ? { ...pet, sponsorCount: pet.sponsorCount + 1 } : pet,
                )
              : state.pets,
          petLetters:
            support.targetType === 'pet'
              ? [
                  {
                    id: `letter-${crypto.randomUUID()}`,
                    petId: support.targetId,
                    title: 'Chegou um novo apoio recorrente',
                    content: `${payload.sponsorName} ativou um apoio mensal para este pet.`,
                    eventType: 'new_sponsor',
                    createdAt: now,
                  },
                  ...state.petLetters,
                ]
              : state.petLetters,
        }));

        return support;
      },
      pauseLocalSupport: (supportId) =>
        set((state) => ({
          sponsorships: state.sponsorships.map((support) =>
            support.id === supportId
              ? { ...support, status: 'paused', pausedAt: new Date().toISOString() }
              : support,
          ),
        })),
      resumeLocalSupport: (supportId) =>
        set((state) => ({
          sponsorships: state.sponsorships.map((support) =>
            support.id === supportId
              ? {
                  ...support,
                  status: 'active',
                  pausedAt: null,
                  nextBillingAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                }
              : support,
          ),
        })),
      cancelLocalSupport: (supportId) =>
        set((state) => ({
          sponsorships: state.sponsorships.map((support) =>
            support.id === supportId
              ? { ...support, status: 'canceled', canceledAt: new Date().toISOString() }
              : support,
          ),
        })),
      addReport: (report) =>
        set((state) => ({
          reports: [
            {
              ...report,
              id: `report-${crypto.randomUUID()}`,
              status: 'submitted',
              createdAt: new Date().toISOString(),
            },
            ...state.reports,
          ],
        })),
      createPet: (payload) => {
        const newPet: Pet = {
          id: `pet-${crypto.randomUUID()}`,
          slug: slugify(payload.name),
          remoteId: undefined,
          name: payload.name,
          species: payload.species,
          breed: 'SRD',
          size: 'medium',
          sex: 'female',
          estimatedAge: 'idade nao informada',
          city: payload.city,
          state: payload.state,
          story: payload.story,
          summary: payload.summary,
          status: 'available',
          urgencyLevel: 'medium',
          trustLevel: 'pending',
          healthStatus: 'Aguardando avaliacao inicial.',
          image:
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
          ],
          organizationId: payload.organizationId,
          followerCount: 0,
          sponsorCount: 0,
          vaccineRecords: [],
          highlight: false,
        };

        set((state) => ({
          pets: [newPet, ...state.pets],
          organizations: state.organizations.map((org) =>
            org.id === payload.organizationId
              ? { ...org, petIds: [newPet.id, ...org.petIds] }
              : org,
          ),
        }));

        return newPet;
      },
      addNeed: (payload) => {
        const newNeed: Need = {
          id: `need-${crypto.randomUUID()}`,
          petId: payload.petId,
          title: payload.title,
          description: payload.description,
          type: 'care',
          priority: 'high',
          estimatedAmount: payload.estimatedAmount,
          collectedAmount: 0,
          status: 'open',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        set((state) => ({
          needs: [newNeed, ...state.needs],
        }));

        return newNeed;
      },
      addTimelinePost: (payload) => {
        const newPost: TimelinePost = {
          id: `post-${crypto.randomUUID()}`,
          petId: payload.petId,
          title: payload.title,
          content: payload.content,
          type: 'milestone',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          timelinePosts: [newPost, ...state.timelinePosts],
        }));

        return newPost;
      },
      resetData: () => set(cloneInitialData()),
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
