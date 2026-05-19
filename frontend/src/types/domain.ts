export type TrustLevel =
  | 'not_verified'
  | 'pending'
  | 'community_verified'
  | 'verified'
  | 'veterinary_verified'
  | 'under_review'
  | 'suspended';

export type OrganizationKind = 'ngo' | 'temporary_home';

export type UserRole = 'pawdrinho' | 'ngo_manager' | 'temporary_home_manager';
export type SupportTargetType = 'pet' | 'organization';
export type SupportStatus = 'pending_checkout' | 'active' | 'paused' | 'payment_failed' | 'canceled';

export type PetStatus =
  | 'available'
  | 'adoption'
  | 'treatment'
  | 'urgent'
  | 'temporary_home'
  | 'adopted'
  | 'memorial';

export type NeedPriority = 'low' | 'medium' | 'high' | 'critical';

export type NeedStatus =
  | 'open'
  | 'partially_funded'
  | 'funded'
  | 'accounting'
  | 'completed';

export type NeedType =
  | 'food'
  | 'surgery'
  | 'medicine'
  | 'vaccine'
  | 'exam'
  | 'transport'
  | 'shelter'
  | 'care';

export type TimelinePostType =
  | 'rescue'
  | 'health'
  | 'milestone'
  | 'need'
  | 'adoption'
  | 'letter';

export type ReportReason =
  | 'fake_pet'
  | 'suspicious_image'
  | 'fake_campaign'
  | 'mistreatment'
  | 'missing_accountability'
  | 'misuse_of_money'
  | 'duplicate_profile';

export interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  status: 'done' | 'scheduled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  city: string;
  state: string;
  followedPetIds: string[];
  sponsoredPetIds: string[];
  organizationId?: string;
  temporaryHomeId?: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  kind: OrganizationKind;
  description: string;
  city: string;
  state: string;
  trustLevel: TrustLevel;
  transparencyScore: number;
  verifiedSince: string;
  petIds: string[];
}

export interface Need {
  id: string;
  petId: string;
  title: string;
  description: string;
  type: NeedType;
  priority: NeedPriority;
  estimatedAmount: number;
  collectedAmount: number;
  status: NeedStatus;
  dueDate: string;
}

export interface TimelinePost {
  id: string;
  petId: string;
  title: string;
  content: string;
  type: TimelinePostType;
  createdAt: string;
}

export interface PetLetter {
  id: string;
  petId: string;
  title: string;
  content: string;
  eventType: 'new_sponsor' | 'vaccine' | 'milestone' | 'adoption';
  createdAt: string;
}

export interface Donation {
  id: string;
  petId: string;
  needId?: string;
  donorName: string;
  amount: number;
  type: 'pix' | 'item' | 'symbolic' | 'card';
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface Sponsorship {
  id: string;
  userId: string;
  targetType: SupportTargetType;
  targetId: string;
  petId?: string;
  organizationId?: string;
  gateway?: 'stripe' | 'local';
  gatewayStatus?: string | null;
  checkoutSessionId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  monthlyAmount: number;
  status: SupportStatus;
  startedAt: string;
  nextBillingAt: string;
  lastBilledAt: string;
  pausedAt?: string | null;
  canceledAt?: string | null;
  lastGatewayEventAt?: string | null;
}

export interface SupportTransaction {
  id: string;
  sponsorshipId: string;
  targetType: SupportTargetType;
  targetId: string;
  petId?: string;
  organizationId?: string;
  amount: number;
  paymentMethod: 'card' | 'pix';
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface TransparencyRecord {
  id: string;
  petId: string;
  needId?: string;
  title: string;
  description: string;
  amountUsed: number;
  date: string;
}

export interface Report {
  id: string;
  petId?: string;
  reporterName: string;
  reason: ReportReason;
  description: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Pet {
  id: string;
  remoteId?: string;
  slug: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  size: 'small' | 'medium' | 'large';
  sex: 'female' | 'male';
  estimatedAge: string;
  city: string;
  state: string;
  story: string;
  summary: string;
  status: PetStatus;
  urgencyLevel: NeedPriority;
  trustLevel: TrustLevel;
  healthStatus: string;
  image: string;
  gallery: string[];
  organizationId: string;
  followerCount: number;
  sponsorCount: number;
  vaccineRecords: VaccineRecord[];
  highlight: boolean;
}

export interface AppDataState {
  users: User[];
  organizations: Organization[];
  pets: Pet[];
  needs: Need[];
  timelinePosts: TimelinePost[];
  petLetters: PetLetter[];
  donations: Donation[];
  sponsorships: Sponsorship[];
  supportTransactions: SupportTransaction[];
  transparencyRecords: TransparencyRecord[];
  reports: Report[];
}
