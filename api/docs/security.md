# Seguranca

- JWT por `tymon/jwt-auth`.
- Access token curto e refresh token por janela longa com blacklist habilitada.
- 401 representa token ausente, invalido ou expirado.
- 403 representa usuario autenticado sem permissao.
- Rate limit em login, registro e refresh.
- Policies para operacoes de gestao.
- Form Requests para validacao.
- Upload local inicialmente, com arquitetura preparada para S3/MinIO.
