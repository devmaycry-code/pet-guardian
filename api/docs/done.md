# Done

Implementado nesta fase:

- Estrutura Controller -> Service -> Model.
- Autenticacao JWT com refresh.
- Rotas publicas e protegidas do MVP backend.
- Dados seedados para pets, ONGs, lares, timeline, necessidades, cartinhas e transparencia.
- Base antifraude, trust score, policies e jobs futuros.
- Docker inicial para ambiente local.
- Horizon instalado para filas Redis.
- Swagger UI simples em `/docs/api` com spec em `/api/docs/openapi.yaml`.
- Suite de testes expandida cobrindo auth, pets, denuncias e fluxos de apoio financeiro.
- Checkout recorrente real com Stripe, webhooks e conciliacao de apoio.
- Endpoint de runtime e simulacao local de doacoes com bloqueio por ambiente.

## Proximos passos

Os proximos passos do backend estao centralizados em [BACKLOG.md](../../BACKLOG.md).

- Refinar conciliacao e prestacao de contas por apoio.
- Evoluir fluxos administrativos de ONG e lar temporario.
- Reduzir dependencia do seed/local onde ainda houver fallback de operacao.
