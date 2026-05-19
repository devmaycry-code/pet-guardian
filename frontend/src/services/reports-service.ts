import { usePetStore } from '../features/pets/pet-store';
import type { ReportReason } from '../types/domain';
import { mapRemoteReport } from './api-mappers';
import { http } from './http';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiReport = Parameters<typeof mapRemoteReport>[0];

export const reportsService = {
  async create(payload: {
    petId?: string;
    reason: ReportReason;
    description: string;
  }) {
    if (!payload.petId) {
      throw new Error('Pet relacionado e obrigatorio para enviar a denuncia.');
    }

    const pet = usePetStore
      .getState()
      .pets.find((entry) => entry.id === payload.petId || entry.remoteId === payload.petId);

    if (!pet?.remoteId) {
      throw new Error('Pet selecionado ainda nao foi sincronizado com a API.');
    }

    const response = await http.post<ApiEnvelope<ApiReport>>('/reports', {
      target_type: 'pet',
      target_id: Number(pet.remoteId),
      reason: payload.reason,
      description: payload.description,
    });

    const remoteReport = response.data?.result;
    if (!remoteReport) {
      throw new Error('A API nao retornou a denuncia criada.');
    }

    const report = mapRemoteReport(remoteReport);
    usePetStore.getState().mergeRemoteReports([report]);
    return report;
  },

  async my() {
    const response = await http.get<ApiEnvelope<ApiReport[]>>('/reports/my');
    const reports = (response.data?.result ?? []).map((report) => mapRemoteReport(report));

    usePetStore.getState().mergeRemoteReports(reports);
    return reports;
  },
};
