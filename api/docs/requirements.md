# Requisitos

- Autenticacao JWT com `tymon/jwt-auth`.
- Access token curto (`JWT_TTL=30`) e refresh longo (`JWT_REFRESH_TTL=43200`).
- CRUD de pets protegido para ADMIN, ONG e lar temporario.
- Listagem publica de pets, ONGs, necessidades, timeline e transparencia.
- Doacoes preferencialmente vinculadas a necessidades.
- Apoio recorrente com Stripe Checkout, webhooks e conciliacao local.
- Simulacao de doacoes em ambiente local com Stripe Test Mode e aviso explicito na interface.
- Denuncias autenticadas.
- Pets falecidos viram memorial e nao devem ser apagados.
