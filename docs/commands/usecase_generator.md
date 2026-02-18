# Documentação --- Generator de UseCases (`make:usecase`)

## Visão Geral

Este projeto possui um **Artisan Command customizado** para geração
automática de **UseCases**, seguindo princípios de **Clean
Architecture** e **DDD**.

O objetivo é:

-   Padronizar a criação de UseCases
-   Evitar código boilerplate repetitivo
-   Garantir organização por domínio
-   Permitir criação automática de CRUD UseCases

------------------------------------------------------------------------

## Conceito de UseCase

Um **UseCase representa uma única ação de negócio**, por exemplo:

-   CreateUser
-   UpdateUser
-   DeleteUser
-   GetUser
-   ListUsers

> Um UseCase **não é um Service CRUD**.\
> Um UseCase **orquestra regras de negócio e transações**.

------------------------------------------------------------------------

## Estrutura Gerada

### Exemplo de comando

``` bash
php artisan make:usecase User/CreateUser
```

### Resultado

    app/UseCases/User/CreateUserUseCase.php

``` php
namespace App\UseCases\User;

class CreateUserUseCase
{
    public function execute(array $data): void
    {
        //
    }
}
```

------------------------------------------------------------------------

## Flags Disponíveis

### --transaction

Envolve o método `execute()` dentro de uma transação de banco de dados.

``` bash
php artisan make:usecase User/CreateUser --transaction
```

``` php
use Illuminate\Support\Facades\DB;

public function execute(array $data): void
{
    DB::transaction(function () use ($data) {
        //
    });
}
```

------------------------------------------------------------------------

### --resource

Gera automaticamente **múltiplos UseCases CRUD**, um arquivo por ação.

``` bash
php artisan make:usecase User --resource
```

Arquivos gerados:

    app/UseCases/User/CreateUserUseCase.php
    app/UseCases/User/UpdateUserUseCase.php
    app/UseCases/User/DeleteUserUseCase.php
    app/UseCases/User/GetUserUseCase.php
    app/UseCases/User/ListUserUseCase.php

------------------------------------------------------------------------

### --resource --transaction

Gera CRUD UseCases com `DB::transaction` no método `execute()`.

``` bash
php artisan make:usecase User --resource --transaction
```

------------------------------------------------------------------------

## Stubs (Templates de Código)

Os arquivos são gerados a partir de **stubs**, localizados em:

    /stubs
    /stubs/usecases

### Exemplo de stub

``` php
<?php

namespace {{ namespace }};

use Illuminate\Support\Facades\DB;

class {{ class }}
{
    public function execute(array $data): void
    {
        {{ transaction }}
        //
        {{ endtransaction }}
    }
}
```

------------------------------------------------------------------------

## Padrão Arquitetural

### UseCase (Application Layer)

Responsável por:

-   Orquestrar regras de negócio
-   Definir boundary transacional
-   Chamar Services / Repositories

### Service (Infrastructure / Domain Service)

Responsável por:

-   CRUD
-   Integração com repositórios
-   Lógica técnica

------------------------------------------------------------------------

## Naming Convention

UseCases seguem o padrão:

    <Verb><Entity>UseCase

Exemplos:

-   CreateUserUseCase
-   UpdateOrderUseCase
-   DeleteInvoiceUseCase
-   ListProductsUseCase

------------------------------------------------------------------------

## Exemplo de Implementação Real

``` php
class CreateUserUseCase
{
    public function __construct(
        private UserService $service
    ) {}

    public function execute(CreateUserDTO $dto): User
    {
        return DB::transaction(fn () =>
            $this->service->create($dto->toArray())
        );
    }
}
```

------------------------------------------------------------------------

## Benefícios

-   Padronização arquitetural
-   Redução de boilerplate
-   Alta produtividade
-   Facilita Clean Architecture e DDD
-   Base para geração de DTOs, Services e Tests

------------------------------------------------------------------------

## Conclusão

O comando `make:usecase` garante organização, consistência e
produtividade, transformando padrões arquiteturais em **scaffolding
automatizado**.
