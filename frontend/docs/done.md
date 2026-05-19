# Done

## Entregue no MVP frontend

- Aplicacao React + TypeScript + Vite criada em `frontend/`.
- Router configurado para area publica e dashboard de ONG.
- Design system leve com Tailwind v4 e identidade acolhedora.
- Dados do seed mantidos como fallback explicito para autenticacao demo e contingencia offline.
- Login demo com perfis pre-carregados e autenticacao real no backend.
- Fluxo de seguir pets com feed pessoal de acompanhamento.
- Apadrinhamento com persistencia na API e fallback local.
- Dashboard ONG com cadastro de pet, novas necessidades e atualizacoes persistidas em `localStorage` e tentativa de sincronizacao com a API.
- Paginas de transparencia e denuncias conectadas a API Laravel com fallback local.
- Suite de testes automatizados com Vitest para stores e fluxos de servicos principais.

## Pendencias conscientes

- Algumas telas ainda dependem do seed como cache e fallback em cenarios de erro.
- Upload real de arquivos.
- Pagamentos reais.
- Refinamento dos fluxos administrativos.
