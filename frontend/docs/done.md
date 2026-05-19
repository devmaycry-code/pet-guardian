# Done

## Entregue no MVP frontend

- Aplicacao React + TypeScript + Vite criada em `frontend/`.
- Router configurado para area publica e dashboard de ONG.
- Design system leve com Tailwind v4 e identidade acolhedora.
- Dados do seed mantidos como fallback explicito para autenticacao demo e contingencia offline.
- Login demo com perfis pre-carregados e autenticacao real no backend.
- Fluxo de seguir pets com feed pessoal de acompanhamento.
- Apadrinhamento com persistencia na API e fallback local.
- Apoio recorrente com checkout Stripe, webhooks e historico de cobrancas.
- Banner de simulacao local de pagamentos e doacoes no app quando a flag esta ativa.
- Dashboard ONG com cadastro de pet, novas necessidades e atualizacoes persistidas em `localStorage` e tentativa de sincronizacao com a API.
- Paginas de transparencia e denuncias conectadas a API Laravel com fallback local.
- Suite de testes automatizados com Vitest para stores e fluxos de servicos principais.

## Proximos passos

Os proximos passos reais do frontend estao centralizados em [BACKLOG.md](../../BACKLOG.md).

- Refinar os fluxos administrativos de ONG e lar temporario.
- Reduzir a dependencia do seed/local nos fluxos que ainda operam como fallback.
- Estruturar melhor a prestacao de contas e os eventos financeiros.
