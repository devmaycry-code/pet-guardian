import { usePetStore } from '../features/pets/pet-store';
import { mapRemoteOrganization, mapRemotePetToPet } from './api-mappers';
import { publicHttp } from './http';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiOrganization = Parameters<typeof mapRemoteOrganization>[0] & {
  pets?: Array<Parameters<typeof mapRemotePetToPet>[0]>;
};

export interface OrganizationProfileData {
  organization: ReturnType<typeof mapRemoteOrganization>;
  pets: ReturnType<typeof mapRemotePetToPet>[];
}

export const organizationsService = {
  async show(identifier: string): Promise<OrganizationProfileData | null> {
    const localOrganization = usePetStore
      .getState()
      .organizations.find((entry) => entry.id === identifier) ?? null;

    try {
      const response = await publicHttp.get<ApiEnvelope<ApiOrganization>>(
        `/organizations/${identifier}`,
      );
      const remoteOrganization = response.data?.result;

      if (!remoteOrganization) {
        if (!localOrganization) {
          return null;
        }

        return {
          organization: localOrganization,
          pets: usePetStore.getState().pets.filter((pet) => pet.organizationId === localOrganization.id),
        };
      }

      const mappedOrganization = mapRemoteOrganization(remoteOrganization);
      const mappedPets = (remoteOrganization.pets ?? []).map((pet) => mapRemotePetToPet(pet));

      usePetStore.getState().mergeRemoteOrganizations([mappedOrganization]);
      usePetStore.getState().mergeRemotePets(mappedPets);

      return {
        organization: mappedOrganization,
        pets: mappedPets,
      };
    } catch {
      if (!localOrganization) {
        return null;
      }

      return {
        organization: localOrganization,
        pets: usePetStore.getState().pets.filter((pet) => pet.organizationId === localOrganization.id),
      };
    }
  },
};
