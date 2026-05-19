import type { Need, Organization, Pet, PetLetter, TransparencyRecord } from '../types/domain';
import {
  mapRemoteNeed,
  mapRemoteOrganization,
  mapRemotePetLetter,
  mapRemotePetToPet,
  mapRemoteTransparencyRecord,
} from './api-mappers';
import { publicHttp } from './http';
import { usePetStore } from '../features/pets/pet-store';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiCollection<T> = {
  data?: T[];
};

type ApiPet = Parameters<typeof mapRemotePetToPet>[0];
type ApiOrganization = Parameters<typeof mapRemoteOrganization>[0];
type ApiTransparencyRecord = Parameters<typeof mapRemoteTransparencyRecord>[0];
type ApiNeed = Parameters<typeof mapRemoteNeed>[0];
type ApiLetter = Parameters<typeof mapRemotePetLetter>[0];

const readCollection = <T,>(payload: ApiEnvelope<ApiCollection<T>> | undefined): T[] =>
  payload?.result?.data ?? [];

export interface PublicCatalog {
  pets: Pet[];
  organizations: Organization[];
  needs: Need[];
  petLetters: PetLetter[];
  transparencyRecords: TransparencyRecord[];
}

export const publicCatalogService = {
  async sync(): Promise<PublicCatalog> {
    const [petsResponse, organizationsResponse, transparencyResponse] = await Promise.all([
      publicHttp.get<ApiEnvelope<ApiCollection<ApiPet>>>('/pets'),
      publicHttp.get<ApiEnvelope<ApiCollection<ApiOrganization>>>('/organizations'),
      publicHttp.get<ApiEnvelope<ApiCollection<ApiTransparencyRecord>>>('/transparency'),
    ]);

    const petsPayload = readCollection(petsResponse.data);
    const pets = petsPayload.map((pet) => mapRemotePetToPet(pet));
    const organizations = readCollection(organizationsResponse.data).map((organization) =>
      mapRemoteOrganization(organization),
    );
    const needs = petsPayload.flatMap((pet) =>
      (pet.needs ?? []).map((need) => ({
        ...mapRemoteNeed(need as ApiNeed),
        petId: String(pet.id),
      })),
    );
    const petLetters = petsPayload.flatMap((pet) =>
      (pet.letters ?? []).map((letter) => ({
        ...mapRemotePetLetter(letter as ApiLetter),
        petId: String(pet.id),
      })),
    );
    const transparencyRecords = readCollection(transparencyResponse.data).map((record) =>
      mapRemoteTransparencyRecord(record, new Map()),
    );

    usePetStore.getState().mergeRemotePets(pets);
    usePetStore.getState().mergeRemoteOrganizations(organizations);
    usePetStore.getState().mergeRemoteNeeds(needs);
    usePetStore.getState().mergeRemotePetLetters(petLetters);
    usePetStore.getState().mergeRemoteTransparencyRecords(transparencyRecords);

    return {
      pets,
      organizations,
      needs,
      petLetters,
      transparencyRecords,
    };
  },
};
