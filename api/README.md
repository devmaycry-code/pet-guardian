# PetGuardian API

API Laravel do PetGuardian, plataforma open source para apoiar animais de rua por meio de perfis publicos, acompanhamento social, necessidades rastreaveis, apadrinhamento virtual, transparencia e denuncias.

## Stack

- PHP 8.3
- Laravel 12
- PostgreSQL 16
- Redis 7
- Laravel Horizon
- `tymon/jwt-auth`
- PHPUnit
- Laravel Pint
- Docker Compose

## Arquitetura

O backend segue a separacao:

```text
Route -> Controller -> Form Request -> Service -> Model -> Resource
```

Controllers tratam HTTP. Form Requests validam entrada e autorizacao inicial. Services concentram regras de negocio. Models cuidam de persistencia e relacionamentos. Resources padronizam saida. Policies definem quem pode executar acoes protegidas.

## Autenticacao

A API usa JWT com `tymon/jwt-auth`.

- Access token curto: `JWT_TTL=30`
- Janela longa de refresh: `JWT_REFRESH_TTL=43200`
- Blacklist habilitada: `JWT_BLACKLIST_ENABLED=true`
- `401`: token ausente, invalido ou expirado
- `403`: usuario autenticado sem permissao

Fluxo esperado no frontend:

1. Chamar `POST /api/auth/login`.
2. Usar `Authorization: Bearer <token>`.
3. Ao receber `401` com `code: token_expired`, chamar `POST /api/auth/refresh` com o token antigo no bearer.
4. Se o refresh falhar, encerrar sessao.

## Rodando Com Docker

Na pasta `api/`:

```bash
docker compose up -d --build
docker run --rm -v "${PWD}:/var/www/html" -w /var/www/html petguardian-app composer install --prefer-dist --no-interaction --no-progress
docker compose up -d app horizon
docker compose exec app php artisan migrate:fresh --seed --force
```

A API fica disponivel em:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/docs/api
```

OpenAPI YAML:

```text
http://localhost:8080/api/docs/openapi.yaml
```

## Containers E Imagens

- `pet-guardian-server`: nginx, exposto em `8080:80`
- `pet-guardian-api`: PHP-FPM/Laravel
- `pet-guardian-worker`: Horizon
- `pet-guardian-database`: PostgreSQL
- `pet-guardian-cache`: Redis

Imagens locais:

- `pet-guardian-server`
- `petguardian-app`
- `pet-guardian-worker`
- `pet-guardian-database`
- `pet-guardian-cache`

## Endpoints Principais

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Pets:

- `GET /api/pets`
- `GET /api/pets/{slug}`
- `POST /api/pets`
- `PUT /api/pets/{slug}`
- `DELETE /api/pets/{slug}`

Relacionados:

- `GET /api/pets/{slug}/timeline`
- `POST /api/pets/{slug}/timeline`
- `GET /api/pets/{slug}/needs`
- `POST /api/pets/{slug}/needs`
- `POST /api/donations`
- `POST /api/donations/simulate`
- `GET /api/donations/my`
- `POST /api/sponsorships`
- `POST /api/sponsorships/checkout`
- `GET /api/sponsorships/my`
- `GET /api/runtime`
- `GET /api/organizations`
- `GET /api/organizations/{slug}`
- `POST /api/reports`
- `GET /api/transparency`
- `GET /api/pets/{slug}/transparency`
- `POST /api/webhooks/stripe`

## Dados Seedados

O seeder cria:

- 8 pets
- 3 ONGs
- 2 lares temporarios
- 10 necessidades
- 10 posts de timeline
- 6 cartinhas
- 5 registros de transparencia
- usuarios mockados para admin, ONG, lar temporario e usuario comum

Credenciais locais:

```text
admin@petguardian.local / password
ong@petguardian.local / password
lar@petguardian.local / password
user@petguardian.local / password
```

## Validacao

Dentro do Docker:

```bash
docker compose exec app php artisan test
docker compose exec app composer audit --format=plain
docker compose exec app vendor/bin/pint --test
```

Ultima validacao executada:

```text
Suite principal validada + StripeGatewayApiTest
composer audit: no security vulnerability advisories found
GET http://localhost:8080/api/pets: 200
```

## Resumo De Entregas Recentes

- Apoio recorrente com destino para pet ou ONG, usando Stripe Checkout, webhooks e reconciliacao local.
- Simulacao local de doacoes com bloqueio por ambiente e aviso exposto para a interface.
- Campos de apoio e doacao ajustados para suportar ONG sem `pet_id` obrigatorio.
- Perfil institucional de ONG retornando os pets sob cuidado.
- Nomes dos containers padronizados para `pet-guardian-*`.
- Redis exposto no host pela porta `6380` para evitar conflito local.

## Proximos Passos

O backlog vivo do projeto fica em [../BACKLOG.md](../BACKLOG.md).

## Documentacao SDD

Os documentos ficam em `api/docs/`:

- `product.md`
- `architecture.md`
- `requirements.md`
- `domain-model.md`
- `api-contracts.md`
- `antifraud.md`
- `security.md`
- `tasks.md`
- `done.md`
- `openapi.yaml`
