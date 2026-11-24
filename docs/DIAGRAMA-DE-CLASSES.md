# Diagrama de classes do Conecta Elétron

O diagrama UML representa o modelo lógico do protótipo. Usuários, questões e respostas são objetos JavaScript persistidos no `localStorage`. As classes do diagrama descrevem esses objetos e suas relações.

```mermaid
classDiagram
    direction LR

    class Usuario {
        String id
        String name
        String email
        String institution
        String password
        Perfil role
        String photo
    }

    class Perfil {
        <<enumeration>>
        student
        teacher
        admin
    }

    class Sessao {
        String userId
    }

    class Questao {
        String id
        Area area
        TipoQuestao type
        String prompt
        String[] options
        Number correctIndex
        String answerModel
        String feedback
        String material
        String createdBy
        Boolean active
        String createdAt
        String updatedAt
    }

    class Area {
        <<enumeration>>
        ELETRONICA_DIGITAL
        ELETRONICA_ANALOGICA
        SISTEMAS_MICROPROCESSADOS
        ELETRONICA_DE_POTENCIA
        MANUTENCAO
    }

    class TipoQuestao {
        <<enumeration>>
        objective
        written
    }

    class DocumentoFormativo {
        String name
        String extension
        String base64
    }

    class Resposta {
        String id
        String questionId
        String studentId
        String studentName
        Area area
        String questionPrompt
        TipoQuestao questionType
        String[] questionOptions
        String questionAnswerModel
        StringOuNumero response
        StatusResposta status
        Boolean correct
        String createdAt
        String gradedBy
        String gradedAt
        String teacherFeedback
    }

    class StatusResposta {
        <<enumeration>>
        pending
        graded
    }

    class AppStore {
        +users() Usuario[]
        +questions() Questao[]
        +answers() Resposta[]
        +addUser(usuario)
        +updateUser(id, alteracoes)
        +changeOwnPassword(id, atual, nova)
        +setOwnPhoto(id, foto)
        +addQuestion(questao)
        +updateQuestion(id, alteracoes)
        +deactivateQuestion(id)
        +hasFixedMaterial(id)
        +addAnswer(resposta)
        +updateAnswer(id, alteracoes)
    }

    Usuario ..> Perfil : tem um perfil
    Sessao "0..1" --> "1" Usuario : identifica
    Usuario "1" --> "0..*" Questao : cadastra como professor
    Usuario "1" --> "0..*" Resposta : envia como estudante
    Usuario "0..1" --> "0..*" Resposta : corrige como professor
    Questao "1" --> "0..*" Resposta : recebe
    Questao "1" *-- "0..1" DocumentoFormativo : inclui anexo
    Questao ..> Area : pertence a
    Questao ..> TipoQuestao : tem tipo
    Resposta ..> StatusResposta : tem estado
    AppStore ..> Usuario : persiste
    AppStore ..> Questao : persiste
    AppStore ..> Resposta : persiste
    AppStore ..> Sessao : verifica conta ativa
```

## Regras representadas

- **Usuário e sessão.** Cada conta tem um perfil. A sessão local guarda o identificador da conta ativa e é usada em **Minha conta** para vincular a troca de senha ou foto ao próprio usuário. A foto é opcional.
- **Questão.** Toda questão pertence a uma área e identifica seu autor em `createdBy`. A objetiva tem quatro alternativas e gabarito. A dissertativa tem uma resposta-modelo. O enunciado, o tipo e os campos próprios do tipo são usados no envio e na correção.
- **Material formativo.** `material` guarda um link e `materialDocument` guarda o anexo opcional, representado pela composição com **DocumentoFormativo**. Os dois podem coexistir. Nas questões de demonstração, o **AppStore** mantém os links fixos pelo identificador da questão.
- **Resposta.** Cada envio referencia uma questão e a conta do estudante. O procedimento de envio impede uma segunda resposta do mesmo estudante à mesma questão. `response` guarda o índice numérico da alternativa ou o texto da dissertativa. Os campos copiados da questão preservam o contexto da resposta se o professor editar o enunciado, as alternativas ou a resposta-modelo.
- **Correção.** A objetiva recebe `graded` e `correct` no envio. A dissertativa começa com `pending` e `correct` nulo. A correção manual registra o professor, a data, o resultado e uma devolutiva opcional.
- **Desempenho.** Os painéis calculam os indicadores a partir das respostas. O aproveitamento considera acertos e erros já corrigidos.

## Arquivos de referência

- [Persistência e operações do AppStore](../js/storage.js)
- [Sessão, envio e correção na interface](../js/app.js)
- [Manual do sistema](MANUAL-DO-SISTEMA.md)
