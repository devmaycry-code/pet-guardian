import type { User, UserRole } from '../types/domain';

export const roleLabels: Record<UserRole, string> = {
  pawdrinho: 'Pawdrinho',
  ngo_manager: 'Gestor de ONG',
  temporary_home_manager: 'Responsavel por lar temporario',
};

export const roleCapabilities: Record<UserRole, string[]> = {
  pawdrinho: [
    'Ver toda a area publica',
    'Seguir pets para acompanhar a jornada',
    'Apadrinhar pets',
    'Acompanhar cartinhas, necessidades e timeline',
    'Enviar denuncias',
  ],
  ngo_manager: [
    'Ver toda a area publica',
    'Seguir pets e monitorar historias inspiradoras',
    'Acessar dashboard da propria ONG',
    'Cadastrar pets, necessidades e atualizacoes',
    'Acompanhar arrecadacao rastreada da propria operacao',
  ],
  temporary_home_manager: [
    'Ver toda a area publica',
    'Seguir pets e acompanhar jornadas de outros casos',
    'Acessar dashboard do proprio lar temporario',
    'Publicar rotina, necessidades e progresso dos pets acolhidos',
    'Enviar denuncias',
  ],
};

export const canAccessNgoDashboard = (user: User | null) =>
  user?.role === 'ngo_manager' || user?.role === 'temporary_home_manager';

export const canSponsorPets = (user: User | null) => user?.role === 'pawdrinho';

export const canFollowPets = (user: User | null) => Boolean(user);

export const canReport = () => true;
