# Resumo de Implementacao

## Visao Geral

O PetGuardian foi evoluido para um MVP mais consistente de rede social de pets, com foco institucional, fluxo API-first, apoio recorrente e operacao via Docker com nomes padronizados.

## O Que Foi Feito

### Produto e Documentacao

- Reposicionamento do produto como uma rede social de pets administrada por tutores, lares temporarios e ONGs.
- Separacao clara entre:
  - perfil do pet, com dados do animal;
  - perfil institucional da ONG, com os pets sob cuidado.
- Inclusao e documentacao de:
  - carteira de vacinacao;
  - linha do tempo do pet;
  - arvore genealogica/relacoes do pet.
- Atualizacao da narrativa para refletir:
  - descoberta publica;
  - acompanhamento social;
  - transparencia;
  - apoio recorrente;
  - denuncia;
  - prestacao de contas.

### Backend

- Integração do apoio recorrente para pet ou ONG.
- Suporte a:
  - criar apoio;
  - pausar;
  - retomar;
  - cancelar;
  - listar apoios do usuario;
  - listar cobranças/transactions.
- Inclusao de processamento mensal via command/job:
  - `support:process-recurring-charges`.
- Ajuste dos modelos e recursos para refletir:
  - `target_type`;
  - `target_identifier`;
  - `next_billing_at`;
  - `last_billed_at`;
  - `paused_at`;
  - `canceled_at`.
- Compatibilidade do fluxo legado de doacao avulsa com os novos campos.
- Suporte a apoio recorrente para ONG sem depender de `pet_id`.
- Ajuste do schema para permitir:
  - `sponsorships.pet_id` nullable;
  - `donations.pet_id` nullable.
- Atualizacao da exibicao publica de organizacoes para incluir pets vinculados.

### Frontend

- O app passou a iniciar sincronizando catalogo publico e restaurando sessao antes de liberar a navegacao.
- O fluxo ficou mais API-first:
  - pets;
  - organizacoes;
  - transparencia;
  - timeline;
  - cartinhas;
  - vacinas;
  - denuncia;
  - apoio recorrente.
- Criacao de pagina institucional de ONG.
- Criacao da pagina de apoios recorrentes.
- Ajustes de navegação para:
  - pet -> ONG;
  - ONG -> pets;
  - pet -> apoios;
  - ONG -> apoios.
- Fallback local preservado apenas como contingencia.

### Infraestrutura

- Padronizacao dos nomes dos containers para `pet-guardian-*`.
- Nome do projeto Docker Compose alterado para `pet-guardian`.
- Redis do host movido de `6379` para `6380` para evitar conflito local.
- Stack Docker reiniciada com sucesso.

### Qualidade e Validacao

- `npm run lint` passou no frontend.
- `npm run build` passou no frontend.
- `npm test` passou no frontend.
- `docker compose exec app php artisan test --filter=SupportFlowsApiTest` passou no backend.

## Estado Atual

Hoje o sistema funciona assim:

- A API e a fonte principal de verdade.
- O frontend usa o backend para login, catalogo, perfil, transparencia, apoio e fluxos protegidos.
- O store local ainda existe como cache e fallback.
- O suporte recorrente ja esta pronto para uso funcional e pode ser expandido para integrações reais de pagamento no futuro.

## Observacoes

- O runner do Vitest foi adaptado para rodar corretamente neste ambiente Windows e no sandbox do projeto.
- A documenatacao do produto ficou alinhada com a narrativa institucional e com o comportamento atual das telas.

