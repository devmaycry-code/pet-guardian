import { usePetStore } from '../features/pets/pet-store';
import {
  mapRemoteOrganization,
  mapRemotePetToPet,
  mapRemoteTransparencyRecord,
} from './api-mappers';
import { publicHttp } from './http';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiCollection<T> = {
  data?: T[];
};

type ApiPet = Parameters<typeof mapRemotePetToPet>[0];
type ApiOrganization = Parameters<typeof mapRemoteOrganization>[0];
type ApiTransparencyRecord = Parameters<typeof mapRemoteTransparencyRecord>[0];

const readCollection = <T,>(payload: ApiEnvelope<ApiCollection<T>> | undefined): T[] =>
  payload?.result?.data ?? [];

export const publicCatalogService = {
  async sync() {
    try {
      const [petsResponse, organizationsResponse, transparencyResponse] = await Promise.all([
        publicHttp.get<ApiEnvelope<ApiCollection<ApiPet>>>('/pets'),
        publicHttp.get<ApiEnvelope<ApiCollection<ApiOrganization>>>('/organizations'),
        publicHttp.get<ApiEnvelope<ApiCollection<ApiTransparencyRecord>>>('/transparency'),
      ]);

      const pets = readCollection(petsResponse.data).map((pet) => mapRemotePetToPet(pet));
      const organizations = readCollection(organizationsResponse.data).map((organization) =>
        mapRemoteOrganization(organization),
      );
      const transparencyRecords = readCollection(transparencyResponse.data).map((record) =>
        mapRemoteTransparencyRecord(record, new Map()),
      );

      usePetStore.getState().mergeRemotePets(pets);
      usePetStore.getState().mergeRemoteOrganizations(organizations);
      usePetStore.getState().mergeRemoteTransparencyRecords(transparencyRecords);
    } catch {
      // Public data stays on the local seed when the API is unavailable.
    }
  },
};
