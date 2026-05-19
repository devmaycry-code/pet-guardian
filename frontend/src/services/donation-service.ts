import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { http } from './http';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiDonation = {
  id: number | string;
  pet_id?: number | string | null;
  pet_need_id?: number | string | null;
  sponsorship_id?: number | string | null;
  amount: number | string;
  payment_method: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  external_id?: string | null;
  gateway_event_id?: string | null;
  created_at?: string | null;
};

const mapDonation = (donation: ApiDonation) => ({
  id: String(donation.id),
  petId: donation.pet_id ? String(donation.pet_id) : '',
  needId: donation.pet_need_id ? String(donation.pet_need_id) : undefined,
  donorName: 'Simulacao',
  amount: Number(donation.amount),
  type: 'symbolic' as const,
  status: donation.status === 'PAID' ? ('confirmed' as const) : ('pending' as const),
  createdAt: donation.created_at ?? new Date().toISOString(),
});

export const donationService = {
  async simulateDonation(payload: { petId: string; amount: number }) {
    const token = useAuthStore.getState().accessToken;
    const localDonation = {
      id: `donation-${crypto.randomUUID()}`,
      petId: payload.petId,
      donorName: 'Simulacao',
      amount: payload.amount,
      type: 'symbolic' as const,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    if (!token) {
      usePetStore.getState().mergeRemoteDonations([localDonation]);
      return localDonation;
    }

    try {
      const response = await http.post<ApiEnvelope<ApiDonation>>('/donations/simulate', {
        pet_id: Number(payload.petId),
        amount: payload.amount,
        payment_method: 'simulation_card',
      });

      const donation = response.data?.result;

      if (donation) {
        const mapped = mapDonation(donation);
        usePetStore.getState().mergeRemoteDonations([mapped]);
        return mapped;
      }
    } catch {
      // Fall back to local simulation below.
    }

    usePetStore.getState().mergeRemoteDonations([localDonation]);
    return localDonation;
  },
};
