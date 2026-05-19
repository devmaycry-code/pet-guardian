import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { mapRemoteOrganization, mapRemotePetToPet } from './api-mappers';
import { http } from './http';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiCollectionEnvelope<T> = {
  data?: T[];
};

type ApiSupportDonation = {
  id: number | string;
  sponsorship_id?: number | string | null;
  target_type: 'pet' | 'organization';
  target_identifier: string;
  pet_id?: number | string | null;
  organization_id?: number | string | null;
  amount: number | string;
  payment_method: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  external_id?: string | null;
  created_at?: string | null;
};

type ApiSponsorship = {
  id: number | string;
  user_id: number | string;
  pet_id?: number | string | null;
  target_type: 'pet' | 'organization';
  target_identifier: string;
  monthly_amount: number | string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELED';
  started_at?: string | null;
  next_billing_at?: string | null;
  last_billed_at?: string | null;
  paused_at?: string | null;
  canceled_at?: string | null;
  pet?: Parameters<typeof mapRemotePetToPet>[0] | null;
  organization?: Parameters<typeof mapRemoteOrganization>[0] | null;
  donations?: ApiSupportDonation[];
};

export interface SupportCreationPayload {
  targetType: 'pet' | 'organization';
  targetId: string;
  monthlyAmount: number;
  sponsorName?: string;
}

export interface SupportView {
  id: string;
  userId: string;
  targetType: 'pet' | 'organization';
  targetId: string;
  petId?: string;
  organizationId?: string;
  monthlyAmount: number;
  status: 'active' | 'paused' | 'canceled';
  startedAt: string;
  nextBillingAt: string;
  lastBilledAt: string;
  pausedAt?: string | null;
  canceledAt?: string | null;
}

export interface SupportTransactionView {
  id: string;
  sponsorshipId: string;
  targetType: 'pet' | 'organization';
  targetId: string;
  petId?: string;
  organizationId?: string;
  amount: number;
  paymentMethod: 'card';
  status: 'confirmed' | 'pending';
  createdAt: string;
}

const mapApiDonation = (donation: ApiSupportDonation): SupportTransactionView => ({
  id: String(donation.id),
  sponsorshipId: donation.sponsorship_id ? String(donation.sponsorship_id) : '',
  targetType: donation.target_type,
  targetId: donation.target_identifier,
  petId: donation.pet_id ? String(donation.pet_id) : undefined,
  organizationId: donation.organization_id ? String(donation.organization_id) : undefined,
  amount: Number(donation.amount),
  paymentMethod: 'card' as const,
  status: donation.status === 'PAID' ? ('confirmed' as const) : ('pending' as const),
  createdAt: donation.created_at ?? new Date().toISOString(),
});

const mapApiSponsorship = (support: ApiSponsorship): SupportView => ({
  id: String(support.id),
  userId: String(support.user_id),
  targetType: support.target_type,
  targetId: support.target_identifier,
  petId: support.pet_id ? String(support.pet_id) : undefined,
  organizationId:
    support.organization?.id ? String(support.organization.id) : undefined,
  monthlyAmount: Number(support.monthly_amount),
  status:
    support.status === 'PAUSED'
      ? ('paused' as const)
      : support.status === 'CANCELED'
        ? ('canceled' as const)
        : ('active' as const),
  startedAt: support.started_at ?? new Date().toISOString(),
  nextBillingAt: support.next_billing_at ?? new Date().toISOString(),
  lastBilledAt: support.last_billed_at ?? new Date().toISOString(),
  pausedAt: support.paused_at ?? null,
  canceledAt: support.canceled_at ?? null,
});

const loadLocalFallback = () => {
  const state = usePetStore.getState();

  return {
    supports: state.sponsorships,
    transactions: state.supportTransactions,
  };
};

export const sponsorshipService = {
  async createSupport(payload: SupportCreationPayload) {
    const token = useAuthStore.getState().accessToken;
    const currentUser = useAuthStore.getState().currentUser;
    const targetId = payload.targetId;

    if (token) {
      try {
        const response = await http.post<ApiEnvelope<ApiSponsorship>>('/sponsorships', {
          ...(payload.targetType === 'pet'
            ? { pet_id: Number(targetId) }
            : { organization_id: Number(targetId) }),
          monthly_amount: payload.monthlyAmount,
        });

        const remoteSupport = response.data?.result;

        if (remoteSupport) {
          const mappedSupport = mapApiSponsorship(remoteSupport);
          usePetStore.getState().mergeRemoteSponsorships([mappedSupport]);
          if (remoteSupport.donations?.length) {
            usePetStore.getState().mergeRemoteSupportTransactions(
              remoteSupport.donations.map(mapApiDonation),
            );
          }

          return mappedSupport;
        }
      } catch {
        // Fall back to local state below.
      }
    }

    return usePetStore.getState().createLocalSupport({
      userId: currentUser?.id ?? 'local-user',
      sponsorName: payload.sponsorName ?? currentUser?.name ?? 'Sistema',
      targetType: payload.targetType,
      targetId,
      monthlyAmount: payload.monthlyAmount,
    });
  },

  async sponsorPet(petId: string, sponsorName: string) {
    await this.createSupport({
      targetType: 'pet',
      targetId: petId,
      monthlyAmount: 50,
      sponsorName,
    });

    return true;
  },

  async pauseSupport(supportId: string) {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      try {
        await http.patch(`/sponsorships/${supportId}/pause`);
      } catch {
        // Fall back to local state below.
      }
    }

    usePetStore.getState().pauseLocalSupport(supportId);
    return true;
  },

  async resumeSupport(supportId: string) {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      try {
        await http.patch(`/sponsorships/${supportId}/resume`);
      } catch {
        // Fall back to local state below.
      }
    }

    usePetStore.getState().resumeLocalSupport(supportId);
    return true;
  },

  async cancelSupport(supportId: string) {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      try {
        await http.patch(`/sponsorships/${supportId}/cancel`);
      } catch {
        // Fall back to local state below.
      }
    }

    usePetStore.getState().cancelLocalSupport(supportId);
    return true;
  },

  async mySupports() {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      try {
        const response = await http.get<ApiEnvelope<ApiCollectionEnvelope<ApiSponsorship>>>(
          '/sponsorships/my',
        );
        const remoteSupports = response.data?.result?.data ?? [];

        const mappedSupports = remoteSupports.map(mapApiSponsorship);
        usePetStore.getState().mergeRemoteSponsorships(mappedSupports);
        return mappedSupports;
      } catch {
        // Fall through to local state.
      }
    }

    return loadLocalFallback().supports;
  },

  async myTransactions() {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      try {
        const response = await http.get<ApiEnvelope<ApiCollectionEnvelope<ApiSupportDonation>>>(
          '/donations/my',
        );
        const remoteTransactions = response.data?.result?.data ?? [];

        const mappedTransactions = remoteTransactions.map(mapApiDonation);
        usePetStore.getState().mergeRemoteSupportTransactions(mappedTransactions);
        return mappedTransactions;
      } catch {
        // Fall through to local state.
      }
    }

    return loadLocalFallback().transactions;
  },
};
