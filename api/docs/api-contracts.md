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

Pets: `GET /api/pets`, `GET /api/pets/{slug}`, `POST /api/pets`, `PUT /api/pets/{slug}`, `DELETE /api/pets/{slug}`.

Relacionados: timeline, needs, donations, sponsorships, organizations, reports e transparency.

Swagger UI: `/docs/api`.

OpenAPI YAML: `/api/docs/openapi.yaml`.
