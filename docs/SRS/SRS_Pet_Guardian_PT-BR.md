# Especificação de Requisitos de Software (SRS)

## Sistema: Pet Guardian

------------------------------------------------------------------------

# 1. Introdução

## 1.1 Propósito

Este documento descreve os requisitos funcionais e não funcionais do
sistema **Pet Guardian**, uma plataforma digital para adoção virtual
e real de pets, acompanhamento de saúde, doações e gamificação.

------------------------------------------------------------------------

## 1.2 Escopo do Sistema

O Pet Guardian conecta padrinhos, tutores, ONGs e lares temporários
para promover adoção e acompanhamento da vida do animal.

Funcionalidades principais: - Cadastro de pets - Adoção virtual e real -
Carteira de saúde do pet - Registro de doações e presentes - Gráficos e
relatórios - Gamificação (Pet Life Score)

------------------------------------------------------------------------

## 1.3 Definições e Acrônimos

  Termo      Descrição
  ---------- -------------------------------
  PLS        Pet Life Score
  ONG        Organização Não Governamental
  Tutor      Responsável legal pelo pet
  Padrinho   Apoiador virtual
  MVP        Minimum Viable Product

------------------------------------------------------------------------

# 2. Visão Geral do Sistema

## 2.1 Módulos

-   Autenticação e Identidade
-   Gestão de Pets
-   Adoção Virtual
-   Adoção Real
-   Saúde e Histórico
-   Doações
-   Gamificação (PLS)
-   Relatórios
-   Administração

------------------------------------------------------------------------

## 2.2 Perfis de Usuário

### Padrinho

-   Visualiza pets
-   Apadrinha pets
-   Faz doações
-   Acompanha saúde

### Tutor

-   Administra perfil do pet
-   Registra saúde
-   Publica atualizações

### ONG / Lar Temporário

-   Cadastra pets
-   Atualiza status de adoção

### Administrador

-   Modera usuários e pets
-   Acessa relatórios globais

------------------------------------------------------------------------

# 3. Requisitos Funcionais

## 3.1 Cadastro e Autenticação

-   RF-01: Cadastro de usuários
-   RF-02: Login seguro (JWT / OAuth)
-   RF-03: Perfis de acesso

## 3.2 Gestão de Pets

-   RF-04: Cadastro de pets
-   RF-05: Edição e remoção
-   RF-06: Perfil público do pet
-   RF-07: Origem do pet (ONG, Lar Temporário, Tutor)

## 3.3 Adoção Virtual

-   RF-08: Apadrinhar pet
-   RF-09: Cancelar apadrinhamento
-   RF-10: Listar padrinhos ativos

## 3.4 Adoção Real

-   RF-11: Registrar adoção real
-   RF-12: Definir tutor
-   RF-13: Upload de contrato

## 3.5 Carteira de Saúde

-   RF-14: Registro de métricas biométricas
-   RF-15: Registro de vacinas
-   RF-16: Registro de eventos clínicos
-   RF-17: Histórico imutável

## 3.6 Doações e Presentes

-   RF-18: Registro de doações
-   RF-19: Registro de presentes
-   RF-20: Histórico financeiro

## 3.7 Pet Life Score (PLS)

-   RF-21: Cálculo automático
-   RF-22: Componentes saúde, cuidado e comunidade
-   RF-23: Snapshots históricos
-   RF-24: Conquistas e níveis

## 3.8 Relatórios

-   RF-25: Gráfico de peso
-   RF-26: Gráfico de doações
-   RF-27: Exportação PDF

## 3.9 Timeline Social

-   RF-28: Postagens do pet
-   RF-29: Comentários e reações

------------------------------------------------------------------------

# 4. Requisitos Não Funcionais

## 4.1 Performance

-   RNF-01: Suportar 10.000 usuários simultâneos
-   RNF-02: Resposta \< 500ms

## 4.2 Segurança

-   RNF-03: HTTPS obrigatório
-   RNF-04: Criptografia de dados sensíveis
-   RNF-05: a definir (Ex.: RBAC)

## 4.3 Privacidade (LGPD)

-   RNF-06: Consentimento de dados
-   RNF-07: Anonimização
-   RNF-08: Logs de auditoria

## 4.4 Usabilidade

-   RNF-09: Interface responsiva
-   RNF-10: UX gamificada

## 4.5 Escalabilidade

-   RNF-11: Arquitetura modular
-   RNF-12: Processamento assíncrono

------------------------------------------------------------------------

# 5. Modelo de Dados (Resumo)

Entidades principais: - User - Pet - Sponsorship - RealAdoption -
PetMetric - PetVaccine - PetHealthEvent - PetDonation - PetGift -
PetScoreSnapshot

------------------------------------------------------------------------

# 6. Restrições

-   Backend: Laravel
-   Frontend: Blade
-   Banco: MySQL
-   Armazenamento: Local / S3 compatível

------------------------------------------------------------------------

# 7. Casos de Uso

## UC-01: Cadastrar Pet

Ator: ONG/Tutor

## UC-02: Apadrinhar Pet

Ator: Padrinho

## UC-03: Registrar Saúde

Ator: Tutor

## UC-04: Calcular PLS

Ator: Sistema

------------------------------------------------------------------------

# 8. Roadmap

## Fase 1

-   Cadastro de pets
-   Adoção virtual
-   Timeline

## Fase 2

-   Carteira de saúde
-   Doações recorrentes

## Fase 3

-   PLS completo
-   IA e gamificação

------------------------------------------------------------------------

# 9. Fórmula PLS

    PLS = (HealthScore * 0.5) + (CareScore * 0.3) + (CommunityScore * 0.2)

------------------------------------------------------------------------

# 10. Tecnologias

-   Laravel, Blade, Mysql, Redis, Docker, S3
