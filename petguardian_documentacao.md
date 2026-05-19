# PetGuardian — Plataforma Open Source de Apadrinhamento Virtual de Animais

## 1. Visão Geral

O **PetGuardian** é uma plataforma open source criada para ajudar animais de rua, ONGs, protetores independentes e lares temporários por meio de um modelo de **apadrinhamento virtual**.

A ideia principal é permitir que qualquer pessoa ajude um animal mesmo sem adotá-lo fisicamente. O usuário pode se tornar um **Pawdrinho** ou **Pawdrinha**, acompanhar a jornada do pet, contribuir com necessidades específicas, doar ração, ajudar em tratamentos, acompanhar vacinas, receber atualizações e criar um vínculo afetivo com o animal.

O sistema não deve ser apenas uma plataforma de doação. Ele deve funcionar como uma **rede de cuidado coletivo**, com foco em transparência, confiança, afeto e impacto real.

---

## 2. Propósito do Projeto

### 2.1 Problema

Muitas pessoas querem ajudar animais em situação de rua, mas não conseguem adotar por diversos motivos:

- moram em apartamento;
- já possuem outros animais;
- não têm autorização da família;
- não possuem tempo para cuidar;
- não conseguem assumir uma adoção definitiva;
- querem ajudar, mas não sabem onde doar com segurança.

Ao mesmo tempo, ONGs e protetores enfrentam dificuldades como:

- falta de recursos financeiros;
- dificuldade para divulgar animais;
- baixa confiança do público em campanhas de doação;
- falta de organização das necessidades dos pets;
- ausência de prestação de contas padronizada;
- risco de fraudes e perfis falsos.

### 2.2 Solução

O PetGuardian conecta pessoas dispostas a ajudar com animais cadastrados por ONGs, protetores e lares temporários verificados.

Cada animal possui um perfil público com:

- história;
- fotos e vídeos;
- necessidades;
- status de saúde;
- vacinas;
- campanhas;
- timeline de atualizações;
- lista de Pawdrinhos;
- prestação de contas;
- memorial, quando necessário.

---

## 3. Nome e Identidade

### 3.1 Nome Oficial

**PetGuardian**

O nome transmite proteção, responsabilidade, cuidado e confiança. Ele também é adequado para um projeto open source com potencial internacional.

### 3.2 Conceito Interno

O termo **Pawdrinho** será usado para representar o padrinho ou madrinha virtual de um pet.

Exemplos de uso:

- “Vire Pawdrinho da Luna.”
- “Este pet possui 8 Pawdrinhos.”
- “Seus Pawdrinhos ajudaram na cirurgia.”

### 3.3 Slogans Possíveis

- Nem todo mundo pode adotar. Mas todo mundo pode cuidar.
- Seja o guardião de uma patinha.
- Ajude um pet mesmo sem levar para casa.
- Toda patinha merece um guardião.
- Doar é bom. Acompanhar a transformação é melhor.

---

## 4. Objetivos do Sistema

### 4.1 Objetivo Principal

Criar uma plataforma segura, transparente e afetiva para permitir que pessoas ajudem animais de rua ou em lares temporários por meio de apadrinhamento virtual, doações direcionadas e acompanhamento da jornada do pet.

### 4.2 Objetivos Específicos

- Facilitar o cadastro de pets por ONGs, protetores e lares temporários.
- Permitir que usuários apadrinhem pets virtualmente.
- Organizar necessidades dos animais por prioridade.
- Permitir doações financeiras e doações de itens.
- Exibir prestação de contas pública.
- Reduzir fraudes por meio de validação, reputação e auditoria.
- Criar vínculo emocional entre usuário e pet.
- Permitir acompanhamento por timeline.
- Incentivar adoção responsável.
- Criar uma base open source reutilizável por comunidades e ONGs.

---

## 5. Perfis de Usuário

### 5.1 Visitante

Usuário não autenticado que pode:

- visualizar pets públicos;
- visualizar ONGs verificadas;
- acessar histórias;
- compartilhar perfis;
- iniciar cadastro.

### 5.2 Usuário/Pawdrinho

Usuário cadastrado que pode:

- seguir pets;
- apadrinhar pets;
- fazer doações;
- enviar presentes;
- acompanhar timelines;
- receber cartinhas;
- comentar atualizações, se permitido;
- denunciar irregularidades;
- visualizar seu histórico de impacto.

### 5.3 ONG

Organização responsável por pets. Pode:

- cadastrar animais;
- cadastrar necessidades;
- publicar atualizações;
- anexar comprovantes;
- criar campanhas;
- responder denúncias;
- solicitar verificação;
- gerenciar equipe.

### 5.4 Protetor Independente

Pessoa física que atua em resgates e cuidados. Pode:

- cadastrar pets;
- cadastrar necessidades;
- publicar atualizações;
- receber ajuda, após validação;
- prestar contas.

### 5.5 Lar Temporário

Pessoa ou família que abriga temporariamente animais. Pode:

- cadastrar disponibilidade;
- vincular pets acolhidos;
- atualizar rotina do pet;
- registrar necessidades;
- informar mudanças de status.

### 5.6 Veterinário Parceiro

Profissional ou clínica que pode:

- validar tratamentos;
- anexar laudos;
- confirmar vacinas;
- confirmar procedimentos;
- dar credibilidade a campanhas de saúde.

### 5.7 Administrador

Responsável pela governança da plataforma. Pode:

- validar ONGs;
- validar protetores;
- moderar denúncias;
- bloquear campanhas;
- revisar documentos;
- auditar movimentações;
- gerenciar configurações globais.

---

## 6. Conceitos Principais

## 6.1 Pet

Representa um animal cadastrado na plataforma.

Informações principais:

- nome;
- espécie;
- raça aproximada;
- porte;
- sexo;
- idade estimada;
- localização aproximada;
- história;
- status atual;
- fotos;
- vídeos;
- responsável atual;
- necessidades;
- padrinhos;
- timeline;
- prestação de contas.

### Status possíveis do pet

- Disponível para apadrinhamento;
- Disponível para adoção;
- Em tratamento;
- Caso urgente;
- Em lar temporário;
- Adotado;
- Não disponível;
- Falecido / Memorial.

---

## 6.2 Pawdrinho

É o usuário que apadrinha virtualmente um pet.

Tipos de vínculo:

- Apoio único;
- Apoio recorrente;
- Doação de item;
- Financiador de necessidade específica;
- Acompanhante da jornada.

---

## 6.3 Necessidade

Representa algo que o pet precisa.

Exemplos:

- ração;
- vacina;
- castração;
- cirurgia;
- consulta;
- medicamento;
- exame;
- banho;
- caminha;
- transporte;
- lar temporário;
- adoção.

Campos sugeridos:

- título;
- descrição;
- tipo;
- prioridade;
- valor estimado;
- valor arrecadado;
- status;
- comprovantes;
- data limite;
- responsável.

### Status de necessidade

- Aberta;
- Parcialmente atendida;
- Atendida;
- Em prestação de contas;
- Finalizada;
- Cancelada;
- Suspeita/Bloqueada.

---

## 6.4 Timeline do Pet

Registro público da jornada do animal.

Exemplos:

- “Luna foi resgatada hoje.”
- “Thor tomou a vacina V10.”
- “Mel ganhou uma caminha nova.”
- “Bob concluiu o tratamento.”
- “Nina foi adotada.”

A timeline deve aceitar:

- texto;
- imagem;
- vídeo;
- comprovante;
- marcação de necessidade atendida;
- atualização de saúde;
- cartinha automática.

---

## 6.5 Cartinha do Pet

Funcionalidade emocional do sistema.

A plataforma pode gerar mensagens simbólicas em nome do pet, sempre com tom respeitoso e sensível.

Exemplos de eventos que geram cartinha:

- novo Pawdrinho;
- meta concluída;
- vacina realizada;
- tratamento finalizado;
- adoção;
- aniversário estimado;
- despedida/memorial.

A cartinha não deve manipular emocionalmente o usuário. Deve ser acolhedora, verdadeira e conectada a um evento real.

Exemplo:

> Oi, Pawdrinho. Hoje eu consegui tomar minha vacina graças à ajuda de pessoas como você. Ainda não entendo tudo que aconteceu, mas sei que agora estou mais protegido. Obrigado por fazer parte da minha história.

---

## 6.6 Memorial do Pet

Quando um animal falece, o perfil não deve simplesmente desaparecer.

Ele pode ser transformado em memorial, contendo:

- história;
- fotos;
- timeline;
- pessoas que ajudaram;
- mensagens de despedida;
- destino de valores restantes;
- possibilidade de ajudar outro pet em homenagem.

Essa feature deve ser tratada com extremo respeito.

---

## 7. Funcionalidades do MVP

### 7.1 Cadastro e autenticação

- Cadastro de usuários.
- Login.
- Recuperação de senha.
- Perfil do usuário.
- Tipo de conta: usuário comum, ONG, protetor, lar temporário.

### 7.2 Cadastro de organizações e responsáveis

- Cadastro de ONG.
- Cadastro de protetor independente.
- Cadastro de lar temporário.
- Envio de documentos para verificação.
- Status de verificação.

### 7.3 Cadastro de pets

- Criar pet.
- Editar pet.
- Adicionar fotos.
- Adicionar vídeo de validação.
- Definir status.
- Definir localização aproximada.
- Vincular responsável.

### 7.4 Perfil público do pet

- Dados principais.
- História.
- Fotos.
- Vídeos.
- Necessidades abertas.
- Pawdrinhos.
- Timeline.
- Botão para apadrinhar.
- Botão para doar.
- Botão para compartilhar.
- Botão para denunciar.

### 7.5 Necessidades

- Criar necessidade.
- Definir valor estimado.
- Definir prioridade.
- Receber apoio.
- Atualizar status.
- Anexar comprovantes.

### 7.6 Apadrinhamento

- Usuário pode virar Pawdrinho de um pet.
- Pode ser apoio simbólico ou financeiro.
- Pode acompanhar o pet sem doar imediatamente.
- Pode receber atualizações.

### 7.7 Doações

No MVP, pode começar com:

- registro manual de doação por PIX;
- upload de comprovante;
- confirmação manual pelo responsável ou administrador;
- histórico público da movimentação.

Em versão futura:

- gateway de pagamento;
- doação recorrente;
- split de pagamento;
- marketplace de itens.

### 7.8 Timeline

- Responsável publica atualizações.
- Atualizações ficam públicas.
- Algumas atualizações podem gerar cartinhas.
- Pawdrinhos recebem notificações.

### 7.9 Prestação de contas

- Cada necessidade pode receber comprovantes.
- Cada doação deve ter destino associado.
- Usuários conseguem ver o uso dos recursos.

### 7.10 Denúncias

Usuários podem denunciar:

- pet falso;
- imagem suspeita;
- campanha falsa;
- maus-tratos;
- ausência de prestação de contas;
- uso indevido de dinheiro;
- perfil duplicado.

---

## 8. Funcionalidades Futuras

- Doação recorrente.
- Integração com gateway de pagamento.
- Carteira protegida/escrow.
- Marketplace de ração e itens.
- Integração com clínicas veterinárias.
- Mapa de pets e ONGs.
- Aplicativo mobile.
- Sistema de missões coletivas.
- Ranking saudável de impacto.
- Retrospectiva anual do usuário.
- API pública para ONGs.
- Modo white-label para instituições.
- Inteligência artificial para moderação.
- Detecção de imagem gerada por IA.
- Sistema de reputação avançado.
- Verificação facial.
- Validação automática de documentos.

---

## 9. Antifraude e Segurança

A confiança é um dos pilares centrais do PetGuardian.

O sistema deve ser projetado para reduzir fraudes desde o início.

---

## 9.1 Riscos previstos

- Pet falso cadastrado com imagem gerada por IA.
- Pessoa criando campanha sem cuidar do animal.
- ONG falsa arrecadando dinheiro.
- Uso indevido das doações.
- Pet duplicado em várias campanhas.
- Comprovantes falsos.
- Campanhas emocionais manipulativas.
- Responsável que abandona a plataforma após receber doações.
- Dados falsos de vacinação ou tratamento.

---

## 9.2 Verificação de responsáveis

### ONG

Documentos possíveis:

- CNPJ;
- razão social;
- responsável legal;
- telefone;
- e-mail institucional;
- redes sociais;
- comprovante de endereço;
- histórico de atuação.

### Protetor independente

Dados possíveis:

- CPF;
- documento com foto;
- selfie;
- telefone verificado;
- comprovante de residência;
- redes sociais;
- referências.

### Lar temporário

Dados possíveis:

- documento;
- comprovante de endereço;
- capacidade de acolhimento;
- fotos do ambiente;
- cidade;
- contato.

---

## 9.3 Verificação do pet

Para reduzir risco de pets falsos:

- exigir múltiplas fotos;
- exigir vídeo curto;
- solicitar prova dinâmica em alguns casos;
- registrar data de cadastro;
- registrar localização aproximada;
- permitir validação por ONG, veterinário ou comunidade;
- analisar duplicidade de imagem;
- permitir denúncia de imagem suspeita.

### Prova dinâmica

Exemplo:

> Grave um vídeo curto mostrando o pet e falando a frase exibida na tela: “Hoje é 11/05/2026 e este é o Thor no PetGuardian.”

Essa estratégia reduz uso de imagens antigas, roubadas ou geradas por IA.

---

## 9.4 Selo de Confiança

O sistema pode ter selos como:

- Não verificado;
- Verificação pendente;
- Verificado pela comunidade;
- Verificado pelo PetGuardian;
- Verificado por veterinário;
- Em análise;
- Suspenso.

---

## 9.5 Score de Transparência

Cada ONG ou responsável pode possuir um score baseado em:

- tempo de conta;
- número de pets cadastrados;
- frequência de atualizações;
- percentual de necessidades com prestação de contas;
- denúncias recebidas;
- denúncias confirmadas;
- validações externas;
- avaliações dos Pawdrinhos.

---

## 9.6 Bloqueios automáticos

O sistema pode bloquear ou limitar arrecadações quando:

- há muitas denúncias;
- não há atualização há muitos dias;
- não existe prestação de contas pendente;
- o responsável não concluiu verificação;
- há suspeita de imagem falsa;
- uma campanha urgente não foi validada.

---

## 10. Regras de Negócio

### 10.1 Cadastro de pet

- Um pet deve estar vinculado a um responsável.
- Um pet pode estar vinculado a uma ONG, protetor ou lar temporário.
- Pets de responsáveis não verificados podem ter arrecadação limitada.
- Pets com denúncias graves devem ficar em análise.
- Pets falecidos não podem receber novas doações, exceto ações de memorial configuradas.

### 10.2 Necessidades

- Toda necessidade deve pertencer a um pet.
- Toda necessidade deve ter tipo, descrição e status.
- Necessidades financeiras devem ter valor estimado.
- Uma necessidade atendida deve exigir prestação de contas.
- Necessidades suspeitas podem ser bloqueadas.

### 10.3 Doações

- Toda doação deve estar vinculada a uma necessidade, pet ou campanha.
- Doações para necessidades específicas devem ser usadas naquela finalidade.
- O responsável deve prestar contas após uso do recurso.
- Doações não confirmadas não devem contar como arrecadação final.
- Doações canceladas devem manter histórico de auditoria.

### 10.4 Apadrinhamento

- Um usuário pode apadrinhar vários pets.
- Um pet pode ter vários Pawdrinhos.
- O apadrinhamento pode existir mesmo sem doação financeira.
- Pawdrinhos recebem atualizações do pet.

### 10.5 Timeline

- Atualizações devem estar vinculadas a um pet.
- Atualizações sensíveis podem exigir moderação.
- Atualizações com comprovantes devem manter anexos.
- Cartinhas automáticas devem ser baseadas em eventos reais.

### 10.6 Denúncias

- Qualquer usuário autenticado pode denunciar.
- Denúncias devem ter motivo.
- Denúncias graves podem ocultar temporariamente campanhas.
- Administradores devem registrar decisão da análise.

---

## 11. Modelo de Dados Inicial

## 11.1 Tabelas principais

### users

- id
- name
- email
- password
- phone
- avatar
- type
- status
- email_verified_at
- created_at
- updated_at

### profiles

- id
- user_id
- document_type
- document_number
- bio
- city
- state
- country
- address_reference
- verification_status
- transparency_score
- created_at
- updated_at

### organizations

- id
- owner_user_id
- name
- legal_name
- document_number
- description
- phone
- email
- website
- city
- state
- verification_status
- transparency_score
- created_at
- updated_at

### temporary_homes

- id
- user_id
- title
- description
- capacity
- current_animals
- accepts_dogs
- accepts_cats
- accepts_special_needs
- city
- state
- verification_status
- created_at
- updated_at

### pets

- id
- responsible_type
- responsible_id
- name
- slug
- species
- breed
- size
- sex
- estimated_age
- description
- story
- status
- health_status
- city
- state
- is_verified
- verification_status
- transparency_status
- created_at
- updated_at

### pet_media

- id
- pet_id
- type
- path
- caption
- is_validation_media
- metadata
- created_at
- updated_at

### pet_needs

- id
- pet_id
- title
- description
- type
- priority
- estimated_amount
- collected_amount
- status
- due_date
- created_by
- created_at
- updated_at

### sponsorships

- id
- pet_id
- user_id
- type
- status
- started_at
- ended_at
- created_at
- updated_at

### donations

- id
- donor_user_id
- pet_id
- pet_need_id
- amount
- type
- payment_method
- status
- transaction_reference
- proof_file
- confirmed_at
- created_at
- updated_at

### accountability_records

- id
- pet_id
- pet_need_id
- donation_id
- title
- description
- amount_used
- proof_file
- status
- reviewed_by
- reviewed_at
- created_at
- updated_at

### timeline_posts

- id
- pet_id
- author_user_id
- type
- title
- content
- visibility
- metadata
- created_at
- updated_at

### pet_letters

- id
- pet_id
- user_id
- timeline_post_id
- event_type
- title
- content
- created_at
- updated_at

### reports

- id
- reporter_user_id
- reportable_type
- reportable_id
- reason
- description
- status
- reviewed_by
- reviewed_at
- resolution
- created_at
- updated_at

### verification_requests

- id
- user_id
- verifiable_type
- verifiable_id
- status
- submitted_data
- reviewed_by
- reviewed_at
- rejection_reason
- created_at
- updated_at

### audit_logs

- id
- user_id
- action
- auditable_type
- auditable_id
- old_values
- new_values
- ip_address
- user_agent
- created_at

---

## 12. Stack Tecnológica

## 12.1 Backend

- Laravel
- PostgreSQL
- Redis
- Laravel Horizon
- Laravel Sanctum
- Laravel Queue
- Laravel Storage
- Pest ou PHPUnit
- Docker

### Responsabilidades do backend

- API REST;
- autenticação;
- regras de negócio;
- validações;
- antifraude;
- gestão de arquivos;
- pagamentos futuros;
- auditoria;
- notificações;
- jobs assíncronos.

---

## 12.2 Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- React Hook Form
- Zod
- Zustand ou Context API

### Responsabilidades do frontend

- interface pública;
- dashboard do usuário;
- dashboard de ONG/protetor;
- cadastro de pets;
- timeline;
- doações;
- prestação de contas;
- moderação administrativa;
- experiência emocional do Pawdrinho.

---

## 12.3 Banco de Dados

- PostgreSQL

Motivos:

- robustez;
- bom suporte a JSONB;
- ótimo para auditoria;
- bom para buscas futuras;
- confiável para dados relacionais;
- adequado para crescimento do projeto.

---

## 13. Arquitetura Recomendada

## 13.1 Backend Laravel

Sugestão de organização:

```txt
app/
  Domain/
    Pets/
    Sponsorships/
    Donations/
    Organizations/
    Verification/
    Reports/
  UseCases/
    Pets/
    Donations/
    Sponsorships/
    Verification/
  Services/
    Pets/
    Donations/
    AntiFraud/
    Letters/
    Notifications/
  Http/
    Controllers/
    Requests/
    Resources/
  Models/
  Jobs/
  Policies/
  Events/
  Listeners/
```

### Camadas

- Controller: recebe requisição, valida autorização e chama UseCase.
- FormRequest: valida dados de entrada.
- UseCase: orquestra fluxos e transações.
- Service: regras de negócio específicas.
- Model: persistência e relacionamentos.
- Policy: autorização.
- Job: processamento assíncrono.

---

## 13.2 Frontend React

Sugestão de organização:

```txt
src/
  app/
  modules/
    pets/
    sponsorships/
    donations/
    organizations/
    auth/
    dashboard/
    reports/
  shared/
    components/
    hooks/
    services/
    types/
    utils/
  routes/
```

### Padrão por módulo

```txt
modules/pets/
  components/
  pages/
  services/
  hooks/
  schemas/
  types/
```

---

## 14. API Inicial

### Auth

- POST /api/register
- POST /api/login
- POST /api/logout
- GET /api/me

### Pets

- GET /api/pets
- GET /api/pets/{slug}
- POST /api/pets
- PUT /api/pets/{id}
- DELETE /api/pets/{id}
- POST /api/pets/{id}/media
- POST /api/pets/{id}/validation-video

### Necessidades

- GET /api/pets/{id}/needs
- POST /api/pets/{id}/needs
- PUT /api/pet-needs/{id}
- POST /api/pet-needs/{id}/finish
- POST /api/pet-needs/{id}/accountability

### Apadrinhamento

- POST /api/pets/{id}/sponsor
- DELETE /api/pets/{id}/sponsor
- GET /api/me/sponsorships

### Doações

- POST /api/donations
- GET /api/me/donations
- GET /api/pets/{id}/donations
- POST /api/donations/{id}/confirm

### Timeline

- GET /api/pets/{id}/timeline
- POST /api/pets/{id}/timeline
- POST /api/timeline/{id}/letter

### Organizações

- POST /api/organizations
- GET /api/organizations/{id}
- PUT /api/organizations/{id}
- POST /api/organizations/{id}/verification-request

### Denúncias

- POST /api/reports
- GET /api/admin/reports
- POST /api/admin/reports/{id}/review

### Admin

- GET /api/admin/dashboard
- GET /api/admin/verification-requests
- POST /api/admin/verification-requests/{id}/approve
- POST /api/admin/verification-requests/{id}/reject

---

## 15. Telas do Frontend

## 15.1 Área pública

- Home
- Lista de pets
- Perfil do pet
- Lista de ONGs
- Página institucional
- Página open source/contribuição
- Login
- Cadastro

## 15.2 Área do usuário

- Dashboard
- Meus pets apadrinhados
- Minhas doações
- Minhas cartinhas
- Meu impacto
- Configurações

## 15.3 Área da ONG/protetor

- Dashboard
- Meus pets
- Cadastrar pet
- Necessidades
- Doações recebidas
- Prestação de contas
- Timeline
- Solicitação de verificação

## 15.4 Área administrativa

- Dashboard geral
- Verificações pendentes
- Denúncias
- Pets suspeitos
- Usuários
- Organizações
- Auditoria

---

## 16. Design e Experiência

## 16.1 Direção visual

O sistema deve transmitir:

- acolhimento;
- confiança;
- cuidado;
- transparência;
- esperança.

Evitar aparência de sistema frio ou excessivamente corporativo.

## 16.2 Cores sugeridas

- Creme claro para fundo.
- Laranja suave para ações principais.
- Verde para sucesso e cuidado.
- Azul suave para confiança.
- Cinza quente para textos secundários.

## 16.3 Tom de comunicação

- humano;
- acolhedor;
- transparente;
- respeitoso;
- sem exagero emocional;
- sem manipulação.

---

## 17. Roadmap

## Fase 1 — MVP

- Autenticação.
- Cadastro de usuários.
- Cadastro de ONG/protetor.
- Cadastro de pets.
- Perfil público do pet.
- Cadastro de necessidades.
- Apadrinhamento simples.
- Doação manual via PIX.
- Timeline.
- Prestação de contas.
- Denúncias.
- Admin básico.

## Fase 2 — Confiança e comunidade

- Verificação avançada.
- Score de transparência.
- Cartinhas automáticas.
- Notificações.
- Memorial.
- Relatórios públicos.
- Auditoria mais completa.

## Fase 3 — Escala

- Gateway de pagamento.
- Doação recorrente.
- Marketplace de itens.
- Mapa de pets.
- Integração com veterinários.
- Aplicativo mobile.
- API pública.

## Fase 4 — Inteligência e prevenção

- Detecção de imagem suspeita.
- Análise antifraude com IA.
- Comparação de imagens duplicadas.
- Classificação de risco.
- Moderação assistida.

---

## 18. Princípios do Projeto Open Source

- Código aberto.
- Documentação clara.
- Fácil instalação local.
- Docker desde o início.
- Boas práticas de segurança.
- Testes automatizados.
- Licença permissiva.
- API documentada.
- Comunidade de contribuição.
- Foco social acima de lucro.

---

## 19. Possível Monetização Ética

O projeto pode ser gratuito e open source, mas ainda assim sustentável.

Possibilidades:

- contribuição opcional na doação;
- patrocínio de empresas pet;
- planos para grandes ONGs;
- hospedagem gerenciada;
- marketplace com parceiros;
- selo verificado com análise manual;
- campanhas patrocinadas, com transparência;
- apoio institucional.

A monetização nunca deve prejudicar a visibilidade de pets urgentes ou favorecer injustamente quem paga.

---

## 20. Diferencial do PetGuardian

O PetGuardian não é apenas um sistema para arrecadar dinheiro.

Ele une:

- tecnologia;
- transparência;
- prestação de contas;
- comunidade;
- vínculo emocional;
- proteção animal.

A plataforma transforma uma doação isolada em uma jornada acompanhada.

O usuário não apenas doa. Ele participa da história do pet.

---

## 21. Frase Guia

> O PetGuardian existe para que qualquer pessoa possa proteger uma vida, mesmo que não possa levar essa vida para casa.

