# PetGuardian Backend API Prompt (Laravel + PostgreSQL)

# Objetivo

Você é um arquiteto backend sênior especialista em Laravel, PostgreSQL, APIs RESTful, arquitetura limpa e Spec-Driven Development (SDD).

Crie a API do sistema **PetGuardian**, uma plataforma open source para ajudar animais de rua, ONGs e lares temporários através de apadrinhamento virtual.

O backend deve ser construído com foco em:

- escalabilidade
- segurança
- antifraude
- transparência
- arquitetura limpa
- auditabilidade
- experiência emocional/humana

---

# Stack obrigatória

- PHP 8.3+
- Laravel 12
- PostgreSQL
- Redis
- Laravel Horizon
- Queue Jobs
- Docker
- PHPUnit/Pest
- Laravel Pint
- JWT ou Sanctum
- Storage local inicialmente
- Estrutura preparada para S3 futuramente

---

# Regra principal

Usar Spec-Driven Development (SDD).

Antes de implementar:

Criar:

/docs
- product.md
- architecture.md
- requirements.md
- domain-model.md
- api-contracts.md
- antifraud.md
- security.md
- tasks.md
- done.md

---

# Objetivo do sistema

O sistema permite:

- cadastro de ONGs
- cadastro de lares temporários
- cadastro de pets
- timeline do pet
- necessidades do pet
- doações
- apadrinhamento virtual
- cartinhas do pet
- transparência
- denúncias
- antifraude
- memorial do pet

---

# Conceito principal

Usuários podem virar “Pawdrinhos”.

O pet continua:
- na ONG
- no lar temporário
- aguardando adoção

Mas o usuário pode:
- doar
- acompanhar
- financiar necessidades
- receber atualizações
- acompanhar evolução

---

# Arquitetura obrigatória

Usar:

Controller -> Service -> Model

Separar claramente:

- regras de negócio
- persistência
- autenticação
- antifraude
- auditoria
- transparência

---

# Estrutura sugerida

app/
  Http/
    Controllers/
    Requests/
    Resources/

   Services/
    Pet/
    Organization/
    Donation/
    Sponsorship/
    Timeline/
    Reports/
    Auth/ 
    Pet/
    Donation/
    Trust/
    Fraud/
    Timeline/

  Models/

  Policies/

  Exceptions/

  Jobs/

  Events/

  Listeners/

  Helpers/

  DTOs/

  Enums/

  Traits/

docs/

tests/

---

# Banco de dados

Usar PostgreSQL.

Criar migrations completas.

---

# Entidades principais

## users

- id
- name
- email
- password
- role
- avatar
- bio
- city
- state
- verified_at
- trust_score
- created_at

---

## organizations

- id
- user_id
- name
- slug
- description
- cnpj
- phone
- email
- website
- city
- state
- verified
- trust_score
- transparency_score
- created_at

---

## temporary_homes

- id
- user_id
- description
- capacity
- available_slots
- city
- state
- verified
- trust_score

---

## pets

- id
- organization_id
- temporary_home_id
- name
- slug
- species
- gender
- age
- size
- status
- urgency_level
- story
- rescue_story
- avatar
- city
- state
- adopted_at
- memorial_at
- verified
- created_at

---

## pet_images

- id
- pet_id
- path
- is_main

---

## pet_videos

- id
- pet_id
- path
- verified

---

## pet_needs

- id
- pet_id
- title
- description
- type
- goal_amount
- current_amount
- urgency_level
- status
- proof_required

---

## donations

- id
- user_id
- pet_id
- pet_need_id
- amount
- payment_method
- status
- external_id
- created_at

---

## sponsorships

- id
- user_id
- pet_id
- monthly_amount
- status
- started_at

---

## timeline_posts

- id
- pet_id
- user_id
- title
- content
- type
- image
- created_at

---

## pet_letters

- id
- pet_id
- title
- content
- generated_by_ai
- created_at

---

## reports

- id
- reporter_user_id
- target_type
- target_id
- reason
- description
- status
- resolved_at

---

## transparency_records

- id
- organization_id
- pet_need_id
- title
- description
- amount
- proof_file
- created_at

---

# Sistema antifraude

Criar documentação e estrutura preparada para:

- verificação de ONGs
- verificação facial futura
- detecção de IA futura
- vídeos obrigatórios
- score de confiança
- auditoria
- denúncias
- prestação de contas
- bloqueio de arrecadação

---

# Roles

Criar enum de roles:

- ADMIN
- ONG
- TEMPORARY_HOME
- USER
- VETERINARIAN

---

# API padrão

Usar padrão:

## Sucesso

{
  "title": "Success",
  "status": 200,
  "result": {}
}

## Erro RFC7807

{
  "type": "about:blank",
  "title": "Validation Error",
  "status": 422,
  "detail": "The given data was invalid.",
  "errors": {}
}

---

# Endpoints obrigatórios

## Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

---

## Pets

GET /api/pets
GET /api/pets/{id}
POST /api/pets
PUT /api/pets/{id}
DELETE /api/pets/{id}

---

## Timeline

GET /api/pets/{id}/timeline
POST /api/pets/{id}/timeline

---

## Needs

GET /api/pets/{id}/needs
POST /api/pets/{id}/needs

---

## Donations

POST /api/donations
GET /api/donations/my

---

## Sponsorships

POST /api/sponsorships
GET /api/sponsorships/my

---

## Organizations

GET /api/organizations
GET /api/organizations/{id}

---

## Reports

POST /api/reports

---

## Transparency

GET /api/transparency
GET /api/pets/{id}/transparency

---

# Regras importantes

## Necessidades

Doações devem preferencialmente ser vinculadas a necessidades específicas.

---

## Prestação de contas

Necessidades concluídas devem aceitar:
- comprovantes
- notas
- imagens
- descrição

---

## Memorial

Pets falecidos não devem ser deletados.

Devem virar memorial.

---

# Uploads

Inicialmente:
- storage local

Preparar arquitetura para:
- S3
- MinIO

---

# Jobs

Criar jobs para:

- geração de cartinhas
- envio de e-mail
- notificações
- auditoria
- score de confiança

---

# Cartinhas do pet

Criar estrutura para mensagens emocionais:

- “Obrigado pela minha vacina”
- “Hoje consegui brincar novamente”
- “Minha cirurgia foi marcada”

Não integrar IA agora.
Apenas deixar preparado.

---

# Testes

Criar:

- Feature tests
- Unit tests
- Authentication tests
- Validation tests

Usar Pest ou PHPUnit.

---

# Docker

Criar:

- app
- nginx
- postgres
- redis

docker-compose completo.

---

# Segurança

Implementar:

- rate limiting
- policies
- form requests
- validação
- autenticação
- proteção uploads

---
---

# Critérios de aceite

API estará aceitável quando:

- docker-compose up funciona
- migrations funcionam
- seeders funcionam
- autenticação funciona
- CRUD pets funciona
- timeline funciona
- necessidades funciona
- estrutura antifraude existe
- documentação existe
- tests executam
- Swagger funciona

---

# Fluxo de desenvolvimento

1. Setup Laravel
2. Docker
3. PostgreSQL
4. Redis
5. Estrutura SDD
6. Migrations
7. Models
8. Requests
9.  Services
10. Policies
11. Controllers
12. API Resources
13. Swagger
14. Tests
15. Horizon
16. Finalização docs

---

# Observações finais

Priorize:

- clareza
- arquitetura limpa
- escalabilidade
- segurança
- transparência

O sistema deve parecer:
- humano
- confiável
- auditável

Evitar:
- lógica em controllers
- código gigante
- regras espalhadas
- acoplamento excessivo

A API deve estar preparada para:
- mobile
- frontend React
- múltiplas ONGs
- expansão internacional
- antifraude avançado futuro
