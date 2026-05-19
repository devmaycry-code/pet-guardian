import { initialAppData } from '../mocks/data';
import { usePetStore } from '../features/pets/pet-store';
import type {
  Need,
  NeedPriority,
  NeedStatus,
  Organization,
  Pet,
  PetLetter,
  PetStatus,
  Report,
  ReportReason,
  TimelinePost,
  TrustLevel,
  User,
} from '../types/domain';

type ApiPet = {
  id: number | string;
  organization_id?: number | string | null;
  temporary_home_id?: number | string | null;
  name: string;
  slug: string;
  species: string;
  gender: string;
  age: string;
  size: string;
  status?: string | null;
  urgency_level?: string | null;
  story: string;
  rescue_story?: string | null;
  avatar?: string | null;
  city: string;
  state: string;
  verified?: boolean | null;
  followers_count?: number | null;
  sponsorships_count?: number | null;
  organization?: {
    id: number | string;
    name: string;
    slug: string;
    description?: string | null;
    city: string;
    state: string;
    verified?: boolean | null;
    trust_score?: number | null;
    transparency_score?: number | null;
  } | null;
  needs?: Array<{
    id: number | string;
    pet_id: number | string;
    title: string;
    description: string;
    type: string;
    goal_amount: number | string;
    current_amount: number | string;
    urgency_level?: string | null;
    status?: string | null;
    proof_required?: boolean | null;
  }>;
  timeline?: Array<{
    id: number | string;
    pet_id: number | string;
    title: string;
    content: string;
    type: string;
    image?: string | null;
    created_at: string;
  }>;
  letters?: Array<{
    id: number | string;
    pet_id?: number | string;
    title: string;
    content: string;
    created_at?: string;
  }>;
};

type ApiOrganization = {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  city: string;
  state: string;
  verified?: boolean | null;
  trust_score?: number | null;
  transparency_score?: number | null;
};

type ApiTransparencyRecord = {
  id: number | string;
  organization_id: number | string;
  pet_need_id?: number | string | null;
  pet_id?: number | string | null;
  title: string;
  description: string;
  amount: number | string;
  created_at?: string;
};

type ApiUser = {
  id: number | string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  verified_at?: string | null;
  trust_score?: number | null;
  organization_id?: number | string | null;
  temporary_home_id?: number | string | null;
  followed_pet_ids?: Array<number | string>;
  sponsored_pet_ids?: Array<number | string>;
};

const seedPetsBySlug = new Map(initialAppData.pets.map((pet) => [pet.slug, pet]));
const seedOrganizationsByName = new Map(
  initialAppData.organizations.map((organization) => [organization.name.toLowerCase(), organization]),
);

const petStatusMap: Record<string, PetStatus> = {
  available: 'available',
  adoption: 'adoption',
  treatment: 'treatment',
  urgent: 'urgent',
  temporary_home: 'temporary_home',
  adopted: 'adopted',
  memorial: 'memorial',
  AVAILABLE: 'available',
  SPONSORED: 'temporary_home',
  ADOPTED: 'adopted',
  MEMORIAL: 'memorial',
};

const urgencyMap: Record<string, NeedPriority> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const needStatusMap: Record<string, NeedStatus> = {
  open: 'open',
  partially_funded: 'partially_funded',
  funded: 'funded',
  accounting: 'accounting',
  completed: 'completed',
  OPEN: 'open',
  FUNDED: 'funded',
  PROOF_PENDING: 'accounting',
  CLOSED: 'completed',
};

const trustLevelFromApi = (verified?: boolean | null, score?: number | null): TrustLevel => {
  if (!verified) {
    return 'not_verified';
  }

  if ((score ?? 0) >= 95) {
    return 'veterinary_verified';
  }

  if ((score ?? 0) >= 85) {
    return 'verified';
  }

  if ((score ?? 0) >= 70) {
    return 'community_verified';
  }

  return 'pending';
};

const normalizePetId = (apiPetId: number | string): string => {
  const entry = usePetStore
    .getState()
    .pets.find((pet) => pet.remoteId === String(apiPetId) || pet.id === String(apiPetId));

  return entry?.id ?? String(apiPetId);
};

const buildDefaultPet = (pet: ApiPet): Pet => ({
  id: String(pet.id),
  remoteId: String(pet.id),
  slug: pet.slug,
  name: pet.name,
  species: pet.species.toLowerCase() === 'cat' ? 'cat' : 'dog',
  breed: 'SRD',
  size:
    pet.size.toLowerCase().includes('peq') || pet.size.toLowerCase().includes('small')
      ? 'small'
      : pet.size.toLowerCase().includes('gr') || pet.size.toLowerCase().includes('large')
        ? 'large'
        : 'medium',
  sex: pet.gender.toLowerCase().includes('f') ? 'female' : 'male',
  estimatedAge: pet.age,
  city: pet.city,
  state: pet.state,
  story: pet.story,
  summary: pet.rescue_story ?? pet.story,
  status: petStatusMap[pet.status ?? 'available'] ?? 'available',
  urgencyLevel: urgencyMap[pet.urgency_level ?? 'medium'] ?? 'medium',
  trustLevel: trustLevelFromApi(pet.verified, pet.organization?.trust_score),
  healthStatus: pet.rescue_story ?? pet.story,
  image:
    pet.avatar ??
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
  gallery: [
    pet.avatar ??
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
  ],
  organizationId: pet.organization_id ? String(pet.organization_id) : '',
  followerCount: 0,
  sponsorCount: pet.sponsorships_count ?? 0,
  vaccineRecords: [],
  highlight: false,
});

export const mapRemotePetToPet = (pet: ApiPet): Pet => {
  const seed = seedPetsBySlug.get(pet.slug);

  if (!seed) {
    return buildDefaultPet(pet);
  }

  return {
    ...seed,
    remoteId: String(pet.id),
    name: pet.name ?? seed.name,
    slug: pet.slug ?? seed.slug,
    species: pet.species.toLowerCase() === 'cat' ? 'cat' : 'dog',
    sex: pet.gender.toLowerCase().includes('f') ? 'female' : 'male',
    estimatedAge: pet.age ?? seed.estimatedAge,
    city: pet.city ?? seed.city,
    state: pet.state ?? seed.state,
    story: pet.story ?? seed.story,
    summary: pet.rescue_story ?? seed.summary,
    status: petStatusMap[pet.status ?? 'available'] ?? seed.status,
    urgencyLevel: urgencyMap[pet.urgency_level ?? 'medium'] ?? seed.urgencyLevel,
    trustLevel: trustLevelFromApi(pet.verified, pet.organization?.trust_score) ?? seed.trustLevel,
    healthStatus: pet.rescue_story ?? seed.healthStatus,
    image: pet.avatar ?? seed.image,
    gallery: seed.gallery.length ? seed.gallery : [pet.avatar ?? seed.image],
    organizationId: seed.organizationId || (pet.organization_id ? String(pet.organization_id) : ''),
    followerCount: pet.followers_count ?? seed.followerCount,
    sponsorCount: pet.sponsorships_count ?? seed.sponsorCount,
  };
};

export const mapRemoteOrganizations = (organizations: ApiOrganization[]): Organization[] =>
  organizations.map((organization) => {
    const seed = seedOrganizationsByName.get(organization.name.toLowerCase());

    return {
      id: String(organization.id),
      name: organization.name,
      kind: seed?.kind ?? 'ngo',
      description: organization.description ?? seed?.description ?? '',
      city: organization.city,
      state: organization.state,
      trustLevel: trustLevelFromApi(organization.verified, organization.trust_score),
      transparencyScore: organization.transparency_score ?? seed?.transparencyScore ?? 0,
      verifiedSince: seed?.verifiedSince ?? new Date().toISOString().slice(0, 10),
      petIds: seed?.petIds ?? [],
    };
  });

export const mapRemoteOrganization = (organization: ApiOrganization): Organization =>
  mapRemoteOrganizations([organization])[0];

export const mapRemoteTransparencyRecord = (
  record: ApiTransparencyRecord,
  needLookup: Map<string, string>,
): { id: string; petId: string; needId?: string; title: string; description: string; amountUsed: number; date: string } => {
  const needId = record.pet_need_id ? String(record.pet_need_id) : undefined;
  const petId = record.pet_id ? String(record.pet_id) : (needId && needLookup.get(needId)) || '';

  return {
    id: String(record.id),
    petId,
    needId,
    title: record.title,
    description: record.description,
    amountUsed: Number(record.amount),
    date: record.created_at ?? new Date().toISOString(),
  };
};

export const mapApiUserToLocalUser = (user: ApiUser, fallback: User | null): User => {
  const base = fallback ?? initialAppData.users[0];

  return {
    ...base,
    id: String(user.id),
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? base.avatar,
    city: user.city ?? base.city,
    state: user.state ?? base.state,
    organizationId: user.organization_id ? String(user.organization_id) : base.organizationId,
    temporaryHomeId: user.temporary_home_id ? String(user.temporary_home_id) : base.temporaryHomeId,
    followedPetIds: user.followed_pet_ids
      ? user.followed_pet_ids.map((id) => normalizePetId(id))
      : base.followedPetIds,
    sponsoredPetIds: user.sponsored_pet_ids
      ? user.sponsored_pet_ids.map((id) => normalizePetId(id))
      : base.sponsoredPetIds,
  };
};

export const collectNeedPetLookup = (pets: Pet[], needs: Need[]): Map<string, string> => {
  const petLookup = new Map<string, string>();

  needs.forEach((need) => {
    const pet = pets.find((entry) => entry.id === need.petId);
    if (pet) {
      petLookup.set(need.id, pet.id);
    }
  });

  return petLookup;
};

export const mapRemoteTimelinePost = (post: {
  id: number | string;
  pet_id: number | string;
  title: string;
  content: string;
  type: string;
  created_at: string;
  image?: string | null;
}): TimelinePost => ({
  id: String(post.id),
  petId: String(post.pet_id),
  title: post.title,
  content: post.content,
  type: 'milestone',
  createdAt: post.created_at,
});

export const mapRemotePetLetter = (letter: {
  id: number | string;
  pet_id?: number | string | null;
  title: string;
  content: string;
  created_at?: string | null;
}): PetLetter => ({
  id: String(letter.id),
  petId: letter.pet_id ? String(letter.pet_id) : '',
  title: letter.title,
  content: letter.content,
  eventType: 'milestone',
  createdAt: letter.created_at ?? new Date().toISOString(),
});

export const mapRemoteNeed = (need: {
  id: number | string;
  pet_id: number | string;
  title: string;
  description: string;
  type: string;
  goal_amount: number | string;
  current_amount: number | string;
  urgency_level?: string | null;
  status?: string | null;
  proof_required?: boolean | null;
}): Need => ({
  id: String(need.id),
  petId: String(need.pet_id),
  title: need.title,
  description: need.description,
  type: 'care',
  priority: urgencyMap[need.urgency_level ?? 'medium'] ?? 'medium',
  estimatedAmount: Number(need.goal_amount),
  collectedAmount: Number(need.current_amount),
  status: needStatusMap[need.status ?? 'open'] ?? 'open',
  dueDate: new Date().toISOString(),
});

export const mapRemoteReport = (report: {
  id: number | string;
  petId?: string;
  reason: string;
  description: string;
  status?: string | null;
  created_at?: string;
}): Report => ({
  id: String(report.id),
  petId: report.petId,
  reporterName: 'Sistema',
  reason: report.reason as ReportReason,
  description: report.description,
  status: 'reviewing',
  createdAt: report.created_at ?? new Date().toISOString(),
});
