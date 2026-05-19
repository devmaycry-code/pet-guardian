# PetGuardian Frontend Prompt (SDD)

## Objetivo

Você é um engenheiro frontend sênior especialista em React, TypeScript, arquitetura frontend, UX emocional e Spec-Driven Development.

Crie o frontend do sistema **PetGuardian**, uma plataforma open source para ajudar animais de rua, ONGs e lares temporários por meio de apadrinhamento virtual.

O objetivo do sistema é permitir que pessoas se tornem Pawdrinhos de pets cadastrados por ONGs, lares temporários ou protetores verificados.

O frontend inicialmente deve funcionar com dados mockados.

---

# Stack obrigatória

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Zustand ou Context API
- Axios preparado para API futura
- ESLint
- Prettier

---

# Regra principal

Usar Spec-Driven Development (SDD).

Antes de implementar telas:

Criar:

/docs
- product.md
- personas.md
- requirements.md
- user-flows.md
- ui-guidelines.md
- domain-model.md
- tasks.md
- done.md

---

# MVP obrigatório

- Home pública
- Listagem de pets
- Perfil público do pet
- Timeline do pet
- Necessidades do pet
- Cartinhas do pet
- Dashboard ONG
- Página de transparência
- Página de denúncias
- Sistema mockado de Pawdrinhos
- Login fake/mock

---

# Estrutura sugerida

src/
  app/
  components/
  features/
  mocks/
  services/
  pages/
  types/
  utils/

---

# Páginas obrigatórias

## Home

- Hero emocional
- CTA “Vire um Pawdrinho”
- Pets em destaque
- Necessidades urgentes
- ONGs verificadas
- Cartinhas dos pets
- Explicação de antifraude

## Pets

- Grid de pets
- Busca
- Filtros
- Status
- Urgência

## Perfil do pet

- Foto
- História
- Necessidades
- Timeline
- Cartinhas
- Pawdrinhos
- Transparência
- Vacinas
- Botão denúncia

## Dashboard ONG

- Resumo
- Lista pets
- Cadastro pet
- Atualizações
- Necessidades

---

# Dados mockados

Criar:

- 8 pets
- 3 ONGs
- 2 lares temporários
- 10 necessidades
- 10 posts timeline
- 6 cartinhas
- 5 registros transparência

---

# Tipos obrigatórios

- Pet
- User
- Organization
- Donation
- Need
- TimelinePost
- PetLetter
- TrustLevel
- Report

Evitar any.

---

# UX

O sistema deve transmitir:

- confiança
- acolhimento
- transparência
- esperança

Evitar aparência fria de fintech.

---

# Cores

- creme claro
- laranja suave
- verde esperança
- azul claro
- cinza neutro

---

# Regras

- Mobile first
- Componentização
- Código limpo
- Sem backend real
- Services fake usando Promise
- Preparar para futura API Laravel

---

# Critérios de aceite

- npm install funciona
- npm run dev funciona
- Rotas funcionando
- Layout responsivo
- Perfil do pet completo
- Dashboard ONG funcional
- tasks.md atualizado
- done.md atualizado

---

# Fluxo de desenvolvimento

1. Setup
2. Docs SDD
3. Estrutura
4. Types
5. Mocks
6. Services
7. Layout
8. Páginas públicas
9. Perfil pet
10. Dashboard
11. Transparência
12. Responsividade
13. Atualização tasks/done

