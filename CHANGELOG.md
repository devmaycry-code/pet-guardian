# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- Rede social de pets com perfil institucional de ONG e perfil individual do pet.
- Carteira de vacinacao, linha do tempo e arvore genealogica no perfil do pet.
- Apoio recorrente por pet ou ONG, com valor mensal, pausa, retomada e cancelamento.
- Pagina institucional de ONG com a lista de pets sob cuidado.
- Pagina de apoios recorrentes com historico de cobrancas e controle do apoio.
- Upload real de imagem de pet no dashboard com armazenamento publico e otimizacao em job.
- Runner de testes programatico no frontend para contornar o problema de resolucao do Vitest no Windows.

### Changed
- Frontend passou a operar em modo API-first nos fluxos principais.
- Seed/local ficou como cache e fallback explicito.
- Projeto Docker Compose foi padronizado para `pet-guardian`.
- Containers foram renomeados para `pet-guardian-*`.
- Redis do host foi movido de `6379` para `6380` para evitar conflito local.
- Documentacao do produto foi alinhada com a narrativa institucional e com a separacao entre pet e ONG.

### Fixed
- Apoio recorrente agora aceita ONG sem depender de `pet_id` obrigatorio.
- Doacao avulsa passou a registrar os novos campos de destino sem quebrar o schema.
- Processamento mensal de apoio recorrente passou a usar a comparacao correta de enum/status.
- Frontend ajustado para consumir colecoes da API sem depender de fallback indevido quando a resposta vem vazia.
- Runner de testes do frontend passou a executar corretamente neste ambiente Windows/sandbox.

## Maintenance Rule

Quando o usuario pedir para commitar, atualize este `CHANGELOG.md` antes do commit.

