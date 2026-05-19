# Domain Model

## Entidades centrais

- `Pet`: identidade, historia, status, carteira de vacinacao, arvore genealogica, vinculo com responsavel, transparencia, feed e base de seguidores.
- `Organization`: ONG ou lar temporario responsavel pelos pets, com perfil publico e lista de pets vinculados.
- `User`: visitante autenticado, Pawdrinho, tutor, responsavel por lar temporario ou representante de ONG, com pets seguidos e pets apadrinhados.
- `Need`: necessidade ligada a um pet com prioridade, progresso e status.
- `TimelinePost`: atualizacao publica da jornada do pet em ordem cronologica.
- `PetLetter`: mensagem simbolica ligada a um evento real.
- `Donation`: registro de apoio financeiro ou de item.
- `Report`: denuncia sobre pet, campanha ou organizacao.

## Relacoes

- Um pet pertence a uma organizacao ou lar temporario.
- Uma organizacao tem um perfil publico com a relacao dos pets sob seus cuidados.
- Um pet possui varias necessidades, posts de timeline, cartinhas e registros de vacina.
- Um pet pode ter vinculos genealogicos com outros pets para representar origem, crias ou relacoes familiares relevantes.
- Um pet pode ter varios seguidores sem que isso implique ajuda financeira.
- Um pet pode ter varios Pawdrinhos.
- Registros de transparencia se ligam a pets e necessidades.
