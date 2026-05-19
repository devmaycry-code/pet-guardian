# Requirements

## Funcionais

- Exibir home publica com destaques, antifraude e CTA principal.
- Listar pets com busca e filtros.
- Exibir perfil completo do pet com historia, carteira de vacinacao, linha do tempo, arvore genealogica, necessidades, cartinhas, transparencia e denuncia.
- Exibir perfil publico da ONG com dados institucionais e lista dos pets que ela cuida.
- Permitir seguir pets sem apadrinhar, como em uma rede social.
- Permitir apadrinhamento com persistencia na API e fallback local.
- Permitir login demo com autenticacao real no backend.
- Exibir pagina pessoal com pets seguidos e feed de atualizacoes.
- Exibir dashboard de ONG, lar temporario ou tutor responsavel com resumo, pets, cadastro, atualizacoes e necessidades, com sincronizacao opcional com a API.
- Exibir pagina publica de transparencia com leitura direta da API e fallback local.
- Exibir pagina de denuncias com envio para a API quando houver sessao.

## Nao funcionais

- Mobile first.
- API-first com fallback local explicito.
- Tipagem estrita em TypeScript.
- Preparado para degradacao graciosa quando a API falhar.
- `npm install`, `npm run dev` e `npm run build` devem funcionar.
