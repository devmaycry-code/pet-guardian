# PetGuardian

PetGuardian e uma plataforma open source para ajudar animais de rua, ONGs, protetores e lares temporarios por meio de acompanhamento publico, transparencia e apadrinhamento virtual.

O objetivo do sistema e permitir que uma pessoa acompanhe a jornada de um pet, siga atualizacoes como em uma rede social de cuidado e, quando quiser, transforme esse vinculo em apoio direto como Pawdrinho.

## Estrutura

O projeto esta organizado como monorepo:

- `frontend/`: aplicacao React, TypeScript, Vite, Tailwind e dados mockados do MVP.
- `api/`: API Laravel 12 com PostgreSQL, Redis, Horizon e JWT.
- `frontend/docs/`: documentacao SDD do frontend.
- `api/docs/`: documentacao SDD da API.

## Estado Atual

Frontend:

- Home publica.
- Listagem e perfil completo de pets.
- Timeline, necessidades, cartinhas, vacinas e transparencia por pet.
- Fluxo de seguir pets.
- Feed pessoal de pets seguidos.
- Login demo com autenticacao real no backend.
- Dashboard com persistencia local e tentativa de sincronizacao com a API.
- Paginas publicas de transparencia e denuncias.
- Apoio recorrente por pet ou ONG com painel de controle, Stripe Checkout e historico.
- Simulacao local de doacoes com banner explicito e teste de pagamentos em ambiente seguro.
- Perfil institucional da ONG com lista dos pets sob cuidado.

API:

- Docker com nginx, PHP-FPM, PostgreSQL, Redis e Horizon.
- JWT com `tymon/jwt-auth` e rota de refresh.
- CRUD base de pets.
- Timeline, necessidades, doacoes, sponsorships, organizacoes, denuncias e transparencia.
- Apoio recorrente por pet ou ONG com Stripe Checkout, webhooks e conciliacao local.
- Simulacao local de doacoes com runtime flag e bloqueio fora de local/dev.
- Upload real de imagens de pet com armazenamento e otimização em segundo plano.
- Migrations, seeders e testes.
- Swagger UI inicial.

## Resumo De Implementacao

O detalhamento completo das entregas recentes esta em [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md).

Em termos práticos, o projeto hoje esta assim:

- Frontend e API funcionam em modo API-first nos fluxos principais.
- O seed/local ficou como fallback e cache.
- O apoio recorrente passou a suportar pet ou ONG.
- O apoio recorrente agora usa Stripe Checkout, webhooks e status de conciliacao.
- O modo de simulacao local ficou disponivel para doacoes de teste.
- O perfil da ONG mostra os pets sob sua responsabilidade.
- O Docker Compose foi padronizado com o projeto `pet-guardian`.

## Rodando O Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite abre a aplicacao em uma porta local como:

```text
http://localhost:5173
```

## Rodando A API

```bash
cd api
docker compose up -d --build
docker run --rm -v "${PWD}:/var/www/html" -w /var/www/html petguardian-app composer install --prefer-dist --no-interaction --no-progress
docker compose up -d app horizon
docker compose exec app php artisan migrate:fresh --seed --force
```

API:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/docs/api
```

Endpoint de smoke test:

```text
http://localhost:8080/api/pets
```

## Containers

- `pet-guardian-server`: nginx.
- `pet-guardian-api`: Laravel/PHP-FPM.
- `pet-guardian-worker`: Horizon.
- `pet-guardian-database`: PostgreSQL.
- `pet-guardian-cache`: Redis.

## Validacao

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

API:

```bash
cd api
docker compose exec app php artisan test
docker compose exec app composer audit --format=plain
docker compose exec app vendor/bin/pint --test
```

## Conceitos Principais

- `Seguir pet`: acompanhar a jornada do animal sem necessariamente apadrinhar.
- `Apadrinhar`: apoiar o pet de forma ativa, simbolica ou financeira.
- `ONG ou lar temporario`: responsavel por cadastrar pets, necessidades e atualizacoes.
- `Transparencia`: registros publicos de uso de recursos, necessidades e sinais de verificacao.
- `Denuncia`: canal para sinalizar suspeita de fraude, abuso ou informacao inconsistente.

## Documentacao

Raiz:

- `CHANGELOG.md`
- `IMPLEMENTATION_SUMMARY.md`
- `BACKLOG.md`

Frontend SDD:

- `frontend/docs/product.md`
- `frontend/docs/personas.md`
- `frontend/docs/requirements.md`
- `frontend/docs/user-flows.md`
- `frontend/docs/ui-guidelines.md`
- `frontend/docs/domain-model.md`
- `frontend/docs/tasks.md`
- `frontend/docs/done.md`

API SDD:

- `api/docs/product.md`
- `api/docs/architecture.md`
- `api/docs/requirements.md`
- `api/docs/domain-model.md`
- `api/docs/api-contracts.md`
- `api/docs/antifraud.md`
- `api/docs/security.md`
- `api/docs/tasks.md`
- `api/docs/done.md`
- `api/docs/openapi.yaml`

## Changelog E Regra De Commit

- O changelog formal deste repositorio fica em [CHANGELOG.md](CHANGELOG.md).
- Quando o usuario pedir para commitar, atualize o `CHANGELOG.md` antes de fazer o commit.
