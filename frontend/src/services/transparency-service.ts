import { usePetStore } from '../features/pets/pet-store';
import type { TransparencyRecord } from '../types/domain';
import { mapRemoteTransparencyRecord } from './api-mappers';
import { publicHttp } from './http';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiTransparencyRecord = Parameters<typeof mapRemoteTransparencyRecord>[0];

export const transparencyService = {
  async list(): Promise<TransparencyRecord[]> {
    const response = await publicHttp.get<ApiEnvelope<ApiTransparencyRecord[]>>('/transparency');
    const records = (response.data?.result ?? []).map((record) =>
      mapRemoteTransparencyRecord(record, new Map()),
    );

    usePetStore.getState().mergeRemoteTransparencyRecords(records);
    return records;
  },
};
