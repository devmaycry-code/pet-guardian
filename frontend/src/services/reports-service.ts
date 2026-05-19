import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import type { ReportReason } from '../types/domain';
import { petsService } from './pets-service';
import { http } from './http';

export const reportsService = {
  async create(payload: {
    petId?: string;
    reporterName: string;
    reason: ReportReason;
    description: string;
  }) {
    const token = useAuthStore.getState().accessToken;
    const pet = payload.petId
      ? usePetStore
          .getState()
          .pets.find((entry) => entry.id === payload.petId || entry.remoteId === payload.petId)
      : null;
    const remotePet = token && pet ? await petsService.show(pet.slug) : null;

    if (token && (pet?.remoteId || remotePet?.remoteId)) {
      try {
        await http.post(
          '/reports',
          {
            target_type: 'pet',
            target_id: Number(pet?.remoteId ?? remotePet?.remoteId),
            reason: payload.reason,
            description: payload.description,
          },
        );
      } catch {
        // The local fallback below preserves the MVP flow when the API rejects the payload.
      }
    }

    usePetStore.getState().addReport(payload);
    return true;
  },
};
