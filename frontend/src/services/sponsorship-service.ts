import { usePetStore } from '../features/pets/pet-store';
import { mapRemoteDonation, mapRemoteOrganization, mapRemotePetToPet } from './api-mappers';
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
  payment_method: 'card' | 'pix';
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
  status: 'PENDING_CHECKOUT' | 'ACTIVE' | 'PAUSED' | 'PAYMENT_FAILED' | 'CANCELED';
  gateway?: 'stripe' | 'local' | null;
  gateway_status?: string | null;
  checkout_session_id?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  started_at?: string | null;
  next_billing_at?: string | null;
  last_billed_at?: string | null;
  paused_at?: string | null;
  canceled_at?: string | null;
  last_gateway_event_at?: string | null;
  pet?: Parameters<typeof mapRemotePetToPet>[0] | null;
  organization?: Parameters<typeof mapRemoteOrganization>[0] | null;
  donations?: ApiSupportDonation[];
};

export interface SupportCreationPayload {
  targetType: 'pet' | 'organization';
  targetId: string;
  monthlyAmount: number;
}

export interface SupportCreationResult {
  support: SupportView;
  checkoutUrl?: string | null;
}

export interface SupportView {
  id: string;
  userId: string;
  targetType: 'pet' | 'organization';
  targetId: string;
  petId?: string;
  organizationId?: string;
  gateway?: 'stripe' | 'local';
  gatewayStatus?: string | null;
  checkoutSessionId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  monthlyAmount: number;
  status: 'pending_checkout' | 'active' | 'paused' | 'payment_failed' | 'canceled';
  startedAt: string;
  nextBillingAt: string;
  lastBilledAt: string;
  pausedAt?: string | null;
  canceledAt?: string | null;
  lastGatewayEventAt?: string | null;
}

export interface SupportTransactionView {
  id: string;
  sponsorshipId: string;
  targetType: 'pet' | 'organization';
  targetId: string;
  petId?: string;
  organizationId?: string;
  amount: number;
  paymentMethod: 'card' | 'pix';
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
  paymentMethod: donation.payment_method,
  status: donation.status === 'PAID' ? 'confirmed' : 'pending',
  createdAt: donation.created_at ?? new Date().toISOString(),
});

const mapApiSponsorship = (support: ApiSponsorship): SupportView => ({
  id: String(support.id),
  userId: String(support.user_id),
  targetType: support.target_type,
  targetId: support.target_identifier,
  petId: support.pet_id ? String(support.pet_id) : undefined,
  organizationId: support.organization?.id ? String(support.organization.id) : undefined,
  gateway: support.gateway === 'stripe' ? 'stripe' : 'local',
  gatewayStatus: support.gateway_status ?? null,
  checkoutSessionId: support.checkout_session_id ?? null,
  stripeCustomerId: support.stripe_customer_id ?? null,
  stripeSubscriptionId: support.stripe_subscription_id ?? null,
  monthlyAmount: Number(support.monthly_amount),
  status:
    support.status === 'PENDING_CHECKOUT'
      ? 'pending_checkout'
      : support.status === 'PAUSED'
        ? 'paused'
        : support.status === 'PAYMENT_FAILED'
          ? 'payment_failed'
          : support.status === 'CANCELED'
            ? 'canceled'
            : 'active',
  startedAt: support.started_at ?? new Date().toISOString(),
  nextBillingAt: support.next_billing_at ?? new Date().toISOString(),
  lastBilledAt: support.last_billed_at ?? new Date().toISOString(),
  pausedAt: support.paused_at ?? null,
  canceledAt: support.canceled_at ?? null,
  lastGatewayEventAt: support.last_gateway_event_at ?? null,
});

export const sponsorshipService = {
  async createSupport(payload: SupportCreationPayload): Promise<SupportCreationResult> {
    const response = await http.post<
      ApiEnvelope<{ sponsorship?: ApiSponsorship; checkout_url?: string | null } | ApiSponsorship>
    >('/sponsorships/checkout', {
      ...(payload.targetType === 'pet'
        ? { pet_id: Number(payload.targetId) }
        : { organization_id: Number(payload.targetId) }),
      monthly_amount: payload.monthlyAmount,
    });

    const remoteResult = response.data?.result;
    const remoteSupport =
      remoteResult && 'sponsorship' in remoteResult ? remoteResult.sponsorship : remoteResult;
    const checkoutUrl =
      remoteResult && 'checkout_url' in remoteResult ? remoteResult.checkout_url : null;

    if (!remoteSupport || !('id' in remoteSupport)) {
      throw new Error('A API nao retornou o apoio criado.');
    }

    const mappedSupport = mapApiSponsorship(remoteSupport);
    usePetStore.getState().mergeRemoteSponsorships([mappedSupport]);
    if ('donations' in remoteSupport && remoteSupport.donations?.length) {
      usePetStore.getState().mergeRemoteSupportTransactions(
        remoteSupport.donations.map(mapApiDonation),
      );
    }

    return {
      support: mappedSupport,
      checkoutUrl: checkoutUrl ?? null,
    };
  },

  async pauseSupport(supportId: string) {
    await http.patch(`/sponsorships/${supportId}/pause`);
    return this.mySupports();
  },

  async resumeSupport(supportId: string) {
    await http.patch(`/sponsorships/${supportId}/resume`);
    return this.mySupports();
  },

  async cancelSupport(supportId: string) {
    await http.patch(`/sponsorships/${supportId}/cancel`);
    return this.mySupports();
  },

  async mySupports() {
    const response = await http.get<ApiEnvelope<ApiCollectionEnvelope<ApiSponsorship>>>(
      '/sponsorships/my',
    );
    const remoteSupports = response.data?.result?.data ?? [];
    const mappedSupports = remoteSupports.map(mapApiSponsorship);
    usePetStore.getState().mergeRemoteSponsorships(mappedSupports);
    return mappedSupports;
  },

  async myTransactions() {
    const response = await http.get<ApiEnvelope<ApiCollectionEnvelope<ApiSupportDonation>>>(
      '/donations/my',
    );
    const remoteTransactions = response.data?.result?.data ?? [];
    const mappedTransactions = remoteTransactions.map(mapApiDonation);
    usePetStore.getState().mergeRemoteSupportTransactions(mappedTransactions);
    usePetStore
      .getState()
      .mergeRemoteDonations(remoteTransactions.map((transaction) => mapRemoteDonation(transaction)));
    return mappedTransactions;
  },
};
