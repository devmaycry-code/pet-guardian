# Arquitetura

Padrao principal: Controller -> Service -> Model.

Controllers tratam HTTP, validacao via Form Requests e resources. Services concentram regras de negocio. Models representam persistencia e relacionamentos. Policies decidem quem pode criar, atualizar ou operar recursos sensiveis.

Infraestrutura planejada: Laravel 12, PHP 8.3, PostgreSQL, Redis, Horizon, queues, storage local com migracao futura para S3/MinIO.
