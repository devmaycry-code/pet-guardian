# MakeServiceCommand - Documentação de Uso

Este documento explica como utilizar o comando Artisan `make:service`,
como ele funciona e exemplos práticos de uso.

------------------------------------------------------------------------

## 📌 O que é o comando `make:service`

O comando `make:service` é um **comando customizado do Laravel Artisan**
que gera automaticamente classes de Service dentro do diretório:

    app/Services/

Ele serve para padronizar a criação da camada de serviço, evitando
código repetitivo (boilerplate) e mantendo a arquitetura organizada.

------------------------------------------------------------------------

## ⚙️ Como executar os comandos

### 1️⃣ Criar um Service básico

``` bash
php artisan make:service UserService
```

### Resultado gerado:

``` php
<?php

namespace App\Services;

class UserService
{
    public function __construct() {}
}
```

------------------------------------------------------------------------

### 2️⃣ Criar um Service com métodos CRUD (Resource)

``` bash
php artisan make:service UserService --resource
```

### Resultado gerado:

``` php
<?php

namespace App\Services;

class UserService
{
    public function __construct() {}

    public function listUsers(): array
    {
        return [];
    }

    public function createUser(array $data)
    {
        //
    }

    public function getUser(int $id)
    {
        //
    }

    public function updateUser(int $id, array $data)
    {
        //
    }

    public function deleteUser(int $id): void
    {
        //
    }
}
```

------------------------------------------------------------------------

## 🧠 O que cada comando faz

### 🔹 `make:service {name}`

Cria uma nova classe de Service vazia no diretório `app/Services`.

-   `{name}` → Nome da classe (ex: `UserService`)
-   Evita sobrescrever se o arquivo já existir
-   Cria automaticamente a pasta `Services` caso não exista

------------------------------------------------------------------------

### 🔹 `--resource`

Gera automaticamente métodos padrão de CRUD:

  Método               Função
  -------------------- -----------------
  `list<Entity>s()`    Lista registros
  `create<Entity>()`   Cria registro
  `get<Entity>()`      Busca por ID
  `update<Entity>()`   Atualiza
  `delete<Entity>()`   Remove

O nome da entidade é derivado removendo o sufixo `Service` do nome da
classe.

Exemplo:

    UserService → Entity = User

------------------------------------------------------------------------

## 📁 Estrutura gerada

    app/
     └── Services/
          └── UserService.php

------------------------------------------------------------------------

## 🚨 Regras e validações do comando

-   ❌ Não sobrescreve arquivos existentes
-   📂 Cria o diretório automaticamente
-   ✅ Retorna status SUCCESS ou FAILURE
-   💬 Exibe mensagens no terminal

------------------------------------------------------------------------

## 🧩 Por que usar Services

A camada de Service serve para:

-   Separar regras de negócio do Controller
-   Facilitar testes unitários
-   Aplicar Clean Architecture
-   Reduzir acoplamento
-   Melhorar manutenção

------------------------------------------------------------------------

## 🏗️ Boas práticas recomendadas

-   Criar Interfaces para Services
-   Usar Dependency Injection nos Controllers
-   Evitar lógica de negócio no Controller
-   Usar DTOs para entrada de dados
-   Criar testes unitários para cada Service

------------------------------------------------------------------------

## ✨ Exemplos reais de uso

``` bash
php artisan make:service OrderService --resource
php artisan make:service PaymentService
php artisan make:service AuthService --resource
```

------------------------------------------------------------------------

## 📌 Conclusão

O comando `make:service` é um **gerador de código para a camada de
Service**, aumentando produtividade, padronização e qualidade
arquitetural do projeto.

Ele segue o mesmo conceito dos generators nativos do Laravel, porém
aplicado à camada de negócio.

------------------------------------------------------------------------

## 📎 Observação

Este comando é ideal para projetos que seguem:

-   Clean Architecture
-   DDD
-   MVC com Service Layer
-   Hexagonal Architecture

------------------------------------------------------------------------
