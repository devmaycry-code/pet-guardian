import type {
  NeedPriority,
  NeedStatus,
  PetStatus,
  TrustLevel,
} from '../types/domain';

export const trustLabels: Record<TrustLevel, string> = {
  not_verified: 'Nao verificado',
  pending: 'Verificacao pendente',
  community_verified: 'Verificado pela comunidade',
  verified: 'Verificado pelo PetGuardian',
  veterinary_verified: 'Verificado por veterinario',
  under_review: 'Em analise',
  suspended: 'Suspenso',
};

export const petStatusLabels: Record<PetStatus, string> = {
  available: 'Disponivel para apadrinhamento',
  adoption: 'Disponivel para adocao',
  treatment: 'Em tratamento',
  urgent: 'Caso urgente',
  temporary_home: 'Em lar temporario',
  adopted: 'Adotado',
  memorial: 'Memorial',
};

export const needPriorityLabels: Record<NeedPriority, string> = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
  critical: 'Critica',
};

export const needStatusLabels: Record<NeedStatus, string> = {
  open: 'Aberta',
  partially_funded: 'Parcialmente atendida',
  funded: 'Atendida',
  accounting: 'Em prestacao de contas',
  completed: 'Finalizada',
};
