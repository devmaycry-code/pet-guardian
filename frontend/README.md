# PetGuardian Frontend

Frontend do PetGuardian, uma rede social de pets administrada por tutores, lares temporarios e ONGs, para acompanhar e ajudar pets cadastrados por responsaveis verificados.

Esta aplicacao usa a API Laravel para autenticacao e para os fluxos que precisam de persistencia real quando ha sessao ativa.

## Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Zustand
- Axios configurado para a API Laravel
- ESLint
- Prettier

## Como Rodar

```bash
npm install
npm run dev
```

Scripts disponiveis:

```bash
npm run dev
npm run build
npm run lint
npm run format
```

## Rotas

- `/`: home publica.
- `/pets`: listagem de pets com busca e filtros.
- `/pets/:slug`: perfil publico do pet com carteira de vacinacao, linha do tempo e arvore genealogica.
- `/following`: feed pessoal dos pets seguidos.
- `/transparency`: transparencia publica.
- `/reports`: denuncias.
- `/login`: login demo.
- `/ngo/dashboard`: dashboard de ONG ou lar temporario com fallback local.

## O Que Ja Funciona

- Catalogo publico API-first com fallback local explicito quando a API nao responde.
- Login demo com perfis pre-carregados e autenticacao real no backend.
- Controle de visibilidade por perfil.
- Seguir e deixar de seguir pets como em uma rede social.
- Feed com atualizacoes dos pets seguidos.
- Apadrinhamento com tentativa de persistencia na API e fallback local.
- Dashboard de administracao para ONG, lar temporario ou tutor responsavel, com persistencia local e tentativa de sincronizacao com a API.
- Upload real de imagens de pet no dashboard, com envio multipart e otimizacao em segundo plano no backend.
- Persistencia local via `localStorage` para o estado base do app.

## Estrutura De Perfil

- Perfil do pet: mostra apenas os dados do pet, sua jornada, vacinas, arvore genealogica e relacoes publicas.
- Perfil da ONG: mostra a identidade da organizacao e os pets sob seus cuidados, funcionando como a vitrine institucional da rede.

## Fallback Explicitado

O seed/local continua existindo, mas agora como contingencia e cache do frontend:

- Home e catalogo publico: usam API como fonte principal e voltam ao seed se a API falhar.
- Perfil do pet: usa dados remotos do pet, carteira de vacinacao, timeline, arvore genealogica, cartinhas e transparencia quando disponiveis; caso contrario, usa o cache local.
- Transparencia publica: tenta a API e cai para o store local.
- Feed de pets seguidos: tenta montar as timelines a partir da API e usa o feed local se necessario.
- Auth demo: os perfis pre-carregados continuam no seed para simular selecao de perfil.
- Dashboard ONG, lar temporario e tutor responsavel: escreve na API quando possivel e ainda mantem o fallback local para operacao no MVP.

## Perfis Mockados

- Pawdrinho: pode seguir pets, apadrinhar e denunciar.
- Gestor de ONG: pode acessar a area gestora da propria organizacao.
- Responsavel por lar temporario: pode acessar a area gestora do proprio lar.
- Visitante: pode navegar pela area publica e iniciar login demo.

## Estrutura

```txt
src/
  app/
  components/
  features/
  mocks/
  pages/
  services/
  types/
  utils/
```

## Services De Integracao

Os services usam `Promise` e pequenos delays artificiais para simular latencia e manter fallback local quando a API nao responde:

- `auth-service.ts`
- `pets-service.ts`
- `follow-service.ts`
- `sponsorship-service.ts`
- `reports-service.ts`
- `dashboard-service.ts`
- `http.ts`

`http.ts` ja possui Axios configurado com `VITE_API_BASE_URL` e usa `http://localhost:8080/api` por padrao.

## Documentacao SDD

A especificacao do frontend fica em `docs/`:

- `product.md`
- `personas.md`
- `requirements.md`
- `user-flows.md`
- `ui-guidelines.md`
- `domain-model.md`
- `tasks.md`
- `done.md`

## Limitacoes Atuais

- O seed ainda e necessario como fallback e cache para alguns fluxos.
- Nao ha pagamento real.
- Alguns fluxos administrativos ainda usam fallback local.

## Resumo De Entregas Recentes

- O frontend passou a usar a API como fonte principal nos fluxos publicos e autenticados.
- Existe pagina institucional de ONG separada do perfil do pet.
- O fluxo de apoio recorrente agora permite apoiar pet ou ONG, com pausa, retomada e cancelamento.
- O perfil do pet exibe carteira de vacinacao, linha do tempo, cartinhas e transparencia como blocos separados.
- O upload de imagem do pet funciona com envio multipart para a API.
- O runner de testes foi ajustado para executar corretamente neste ambiente Windows.
