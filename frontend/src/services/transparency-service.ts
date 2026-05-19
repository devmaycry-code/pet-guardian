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
    try {
      const response = await publicHttp.get<ApiEnvelope<{ data?: ApiTransparencyRecord[] }>>(
        '/transparency',
      );

      const records = (response.data?.result?.data ?? []).map((record) =>
        mapRemoteTransparencyRecord(record, new Map()),
      );

      usePetStore.getState().mergeRemoteTransparencyRecords(records);
      return records;
    } catch {
      return usePetStore.getState().transparencyRecords;
    }
  },
};
