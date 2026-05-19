import { usePetStore } from '../features/pets/pet-store';
import type {
  Donation,
  Need,
  NeedPriority,
  NeedStatus,
  Organization,
  Pet,
  PetLetter,
  Report,
  ReportReason,
  TimelinePost,
  TrustLevel,
  User,
  UserRole,
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
  organization?: ApiOrganization | null;
  needs?: ApiNeed[];
  timeline?: ApiTimelinePost[];
  letters?: ApiLetter[];
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
  organization_id?: number | string;
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

type ApiNeed = {
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
};

type ApiTimelinePost = {
  id: number | string;
  pet_id: number | string;
  title: string;
  content: string;
  type: string;
  created_at: string;
  image?: string | null;
};

type ApiLetter = {
  id: number | string;
  pet_id?: number | string | null;
  title: string;
  content: string;
  created_at?: string | null;
};

type ApiDonation = {
  id: number | string;
  pet_id?: number | string | null;
  pet_need_id?: number | string | null;
  amount: number | string;
  payment_method?: string | null;
  status?: string | null;
  created_at?: string | null;
};

const imageFallback =
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80';

const petStatusMap: Record<string, Pet['status']> = {
  AVAILABLE: 'available',
  ADOPTED: 'adopted',
  MEMORIAL: 'memorial',
  SPONSORED: 'temporary_home',
  adoption: 'adoption',
  adopted: 'adopted',
  available: 'available',
  memorial: 'memorial',
  temporary_home: 'temporary_home',
  treatment: 'treatment',
  urgent: 'urgent',
};

const urgencyMap: Record<string, NeedPriority> = {
  CRITICAL: 'critical',
  HIGH: 'high',
  LOW: 'low',
  MEDIUM: 'medium',
  critical: 'critical',
  high: 'high',
  low: 'low',
  medium: 'medium',
};

const needStatusMap: Record<string, NeedStatus> = {
  CLOSED: 'completed',
  FUNDED: 'funded',
  OPEN: 'open',
  PROOF_PENDING: 'accounting',
  completed: 'completed',
  funded: 'funded',
  open: 'open',
  partially_funded: 'partially_funded',
};

const roleMap: Record<string, UserRole> = {
  ONG: 'ngo_manager',
  TEMPORARY_HOME: 'temporary_home_manager',
  USER: 'pawdrinho',
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
  const targetId = String(apiPetId);
  const entry = usePetStore
    .getState()
    .pets.find((pet) => pet.remoteId === targetId || pet.id === targetId);

  return entry?.id ?? targetId;
};

const resolveOrganizationId = (pet: ApiPet): string => {
  if (pet.organization_id) {
    return String(pet.organization_id);
  }

  if (pet.organization?.id) {
    return String(pet.organization.id);
  }

  return '';
};

export const mapRemotePetToPet = (pet: ApiPet): Pet => ({
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
  status: petStatusMap[pet.status ?? 'AVAILABLE'] ?? 'available',
  urgencyLevel: urgencyMap[pet.urgency_level ?? 'MEDIUM'] ?? 'medium',
  trustLevel: trustLevelFromApi(pet.verified, pet.organization?.trust_score),
  healthStatus: pet.rescue_story ?? pet.story,
  image: pet.avatar ?? imageFallback,
  gallery: [pet.avatar ?? imageFallback],
  organizationId: resolveOrganizationId(pet),
  followerCount: pet.followers_count ?? 0,
  sponsorCount: pet.sponsorships_count ?? 0,
  vaccineRecords: [],
  highlight: false,
});

export const mapRemoteOrganizations = (organizations: ApiOrganization[]): Organization[] =>
  organizations.map((organization) => ({
    id: String(organization.id),
    slug: organization.slug,
    name: organization.name,
    kind: 'ngo',
    description: organization.description ?? '',
    city: organization.city,
    state: organization.state,
    trustLevel: trustLevelFromApi(organization.verified, organization.trust_score),
    transparencyScore: organization.transparency_score ?? 0,
    verifiedSince: '',
    petIds: [],
  }));

export const mapRemoteOrganization = (organization: ApiOrganization): Organization =>
  mapRemoteOrganizations([organization])[0];

export const mapRemoteTransparencyRecord = (
  record: ApiTransparencyRecord,
  needLookup: Map<string, string>,
): {
  id: string;
  petId: string;
  needId?: string;
  title: string;
  description: string;
  amountUsed: number;
  date: string;
} => {
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
  const baseFollowedPetIds = fallback?.followedPetIds ?? [];
  const baseSponsoredPetIds = fallback?.sponsoredPetIds ?? [];

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? user.name.slice(0, 2).toUpperCase(),
    role: roleMap[user.role] ?? fallback?.role ?? 'pawdrinho',
    city: user.city ?? fallback?.city ?? '',
    state: user.state ?? fallback?.state ?? '',
    organizationId: user.organization_id ? String(user.organization_id) : fallback?.organizationId,
    temporaryHomeId: user.temporary_home_id
      ? String(user.temporary_home_id)
      : fallback?.temporaryHomeId,
    followedPetIds: user.followed_pet_ids
      ? user.followed_pet_ids.map((id) => normalizePetId(id))
      : baseFollowedPetIds,
    sponsoredPetIds: user.sponsored_pet_ids
      ? user.sponsored_pet_ids.map((id) => normalizePetId(id))
      : baseSponsoredPetIds,
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

export const mapRemoteTimelinePost = (post: ApiTimelinePost): TimelinePost => ({
  id: String(post.id),
  petId: String(post.pet_id),
  title: post.title,
  content: post.content,
  type: 'milestone',
  createdAt: post.created_at,
});

export const mapRemotePetLetter = (letter: ApiLetter): PetLetter => ({
  id: String(letter.id),
  petId: letter.pet_id ? String(letter.pet_id) : '',
  title: letter.title,
  content: letter.content,
  eventType: 'milestone',
  createdAt: letter.created_at ?? new Date().toISOString(),
});

export const mapRemoteNeed = (need: ApiNeed): Need => ({
  id: String(need.id),
  petId: String(need.pet_id),
  title: need.title,
  description: need.description,
  type: 'care',
  priority: urgencyMap[need.urgency_level ?? 'MEDIUM'] ?? 'medium',
  estimatedAmount: Number(need.goal_amount),
  collectedAmount: Number(need.current_amount),
  status:
    Number(need.current_amount) > 0 &&
    Number(need.current_amount) < Number(need.goal_amount) &&
    (needStatusMap[need.status ?? 'OPEN'] ?? 'open') === 'open'
      ? 'partially_funded'
      : needStatusMap[need.status ?? 'OPEN'] ?? 'open',
  dueDate: new Date().toISOString(),
});

export const mapRemoteReport = (report: {
  id: number | string;
  target_id?: number | string | null;
  reason: string;
  description: string;
  status?: string | null;
  created_at?: string;
}): Report => ({
  id: String(report.id),
  petId: report.target_id ? String(report.target_id) : undefined,
  reporterName: 'Usuario autenticado',
  reason: report.reason as ReportReason,
  description: report.description,
  status:
    report.status === 'REVIEWING'
      ? 'reviewing'
      : report.status === 'RESOLVED'
        ? 'resolved'
        : report.status === 'DISMISSED'
          ? 'dismissed'
          : 'open',
  createdAt: report.created_at ?? new Date().toISOString(),
});

export const mapRemoteDonation = (donation: ApiDonation): Donation => ({
  id: String(donation.id),
  petId: donation.pet_id ? String(donation.pet_id) : '',
  needId: donation.pet_need_id ? String(donation.pet_need_id) : undefined,
  donorName: 'Usuario autenticado',
  amount: Number(donation.amount),
  type: donation.payment_method === 'pix' ? 'pix' : 'card',
  status: donation.status === 'PAID' ? 'confirmed' : 'pending',
  createdAt: donation.created_at ?? new Date().toISOString(),
});
