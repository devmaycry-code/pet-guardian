# Contratos API

Resposta de sucesso:

```json
{
  "title": "Success",
  "status": 200,
  "result": {}
}
```

Erro RFC7807:

```json
{
  "type": "about:blank",
  "title": "Validation Error",
  "status": 422,
  "detail": "The given data was invalid.",
  "errors": {}
}
```

Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/auth/me`.

Runtime: `GET /api/runtime`.

Pets: `GET /api/pets`, `GET /api/pets/{slug}`, `POST /api/pets`, `PUT /api/pets/{slug}`, `DELETE /api/pets/{slug}`.

Timeline: `GET /api/pets/{slug}/timeline`, `POST /api/pets/{slug}/timeline`.

Needs: `GET /api/pets/{slug}/needs`, `POST /api/pets/{slug}/needs`.

Transparency: `GET /api/transparency`, `GET /api/pets/{slug}/transparency`.

Organizations: `GET /api/organizations`, `GET /api/organizations/{slug}`.

Donations: `POST /api/donations`, `POST /api/donations/simulate`, `GET /api/donations/my`.

Sponsorships: `POST /api/sponsorships`, `POST /api/sponsorships/checkout`, `GET /api/sponsorships/my`, `PATCH /api/sponsorships/{id}/pause`, `PATCH /api/sponsorships/{id}/resume`, `PATCH /api/sponsorships/{id}/cancel`.

Reports: `POST /api/reports`, `GET /api/reports/my`.

Runtime: `GET /api/runtime`.

Apoio recorrente:

- `POST /api/donations/simulate`
- `POST /api/sponsorships/checkout`
- `POST /api/webhooks/stripe`
- `GET /api/sponsorships/my`
- `PATCH /api/sponsorships/{sponsorship}/pause`
- `PATCH /api/sponsorships/{sponsorship}/resume`
- `PATCH /api/sponsorships/{sponsorship}/cancel`

Swagger UI: `/docs/api`.

OpenAPI YAML: `/api/docs/openapi.yaml`.
