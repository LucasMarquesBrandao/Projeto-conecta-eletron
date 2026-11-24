# Manual de uso do Conecta Elétron

O Conecta Elétron é um protótipo web para a prática de Eletrônica. Este manual acompanha as telas do sistema no navegador, em computador e celular, e descreve as ações disponíveis para estudantes, professores e administradores.

Para abrir o protótipo localmente, inicie o servidor na raiz do projeto com `python -m http.server 5500` e acesse `http://localhost:5500`. As contas de demonstração estão no [README](README.md#contas-de-demonstração).

Os dados são salvos no navegador. Para demonstrar um fluxo entre estudante e professor, use o mesmo navegador e endereço e alterne as contas com **Sair**. Os materiais externos precisam de conexão à internet.

## Navegação no computador e no celular

A aplicação oferece os mesmos fluxos nas duas larguras. No computador, as listas e históricos são apresentados em tabelas. No celular, os históricos, a lista de estudantes e o gerenciamento de usuários apresentam os registros em cartões. No modal de edição de questões, os campos podem ser rolados com os botões de ação visíveis.

[Ir para Acesso](#acesso) · [Estudante](#estudante) · [Minha conta](#minha-conta) · [Professor](#professor) · [Administrador](#administrador)

## Acesso

### Entrar no sistema

Na tela de login, informe o e-mail e a senha da conta. O sistema abre o painel de estudante, professor ou administrador conforme o perfil cadastrado.

**Computador**

![Entrar no sistema no computador](capturas/01-login.png)

**Celular**

![Entrar no sistema no celular](capturas/mobile/01-login.png)

### Criar uma conta de estudante

Na tela de login, selecione **Criar conta de estudante**. Informe nome completo, e-mail, instituição e uma senha com pelo menos seis caracteres. Ao concluir o cadastro, o sistema abre o painel do estudante.

**Computador**

![Criar uma conta de estudante no computador](capturas/02-cadastro-estudante.png)

**Celular**

![Criar uma conta de estudante no celular](capturas/mobile/02-cadastro-estudante.png)

## Estudante

### Painel e seleção de área

O painel apresenta o total de respostas, as questões disponíveis e as correções pendentes. Cada cartão de área mostra o progresso nas questões ativas. Selecione uma das cinco áreas ou use **Desempenho** no menu para consultar seus resultados.

**Computador**

![Painel e seleção de área no computador](capturas/03-painel-estudante.png)

**Celular**

![Painel e seleção de área no celular](capturas/mobile/03-painel-estudante.png)

### Introdução à área

Após escolher uma área, leia a descrição e selecione **Iniciar questões**. Se já houver respostas registradas, o sistema abre a próxima questão disponível daquela área.

**Computador**

![Introdução à área no computador](capturas/04-introducao-area.png)

**Celular**

![Introdução à área no celular](capturas/mobile/04-introducao-area.png)

### Responder a uma questão objetiva

Selecione uma alternativa e clique em **Enviar resposta**. A correção é imediata. O envio registra a resposta e encerra a tentativa daquela questão.

**Computador**

![Responder a uma questão objetiva no computador](capturas/05-questao-objetiva.png)

**Celular**

![Responder a uma questão objetiva no celular](capturas/mobile/05-questao-objetiva.png)

### Revisar um erro e abrir o material de estudo

O feedback mostra a alternativa selecionada, a correta e a orientação de estudo. Abra o link em outra aba ou baixe o documento, quando disponível. A captura mostra o Guia de Portas Lógicas em PDF. Selecione **Continuar** para seguir.

**Computador**

![Revisar um erro e abrir o material de estudo no computador](capturas/06-feedback-incorreto-material.png)

**Celular**

![Revisar um erro e abrir o material de estudo no celular](capturas/mobile/06-feedback-incorreto.png)

### Responder a uma questão dissertativa

Escreva sua resposta no campo de texto e selecione **Enviar resposta**. O professor recebe o texto para avaliar.

**Computador**

![Responder a uma questão dissertativa no computador](capturas/07-questao-dissertativa.png)

**Celular**

![Responder a uma questão dissertativa no celular](capturas/mobile/07-questao-dissertativa.png)

### Confirmar o envio da dissertativa

A confirmação informa que a resposta foi encaminhada ao professor. Você pode continuar na área ou voltar à seleção. O resultado aparecerá em **Desempenho**.

**Computador**

![Confirmar o envio da dissertativa no computador](capturas/08-envio-dissertativa.png)

**Celular**

![Confirmar o envio da dissertativa no celular](capturas/mobile/08-envio-dissertativa.png)

### Consultar respostas pendentes

Na seção **Meu desempenho**, consulte os acertos, erros, pendências e aproveitamento por área. Respostas com status **Aguardando correção** aparecem no histórico e ficam fora do cálculo de aproveitamento até serem avaliadas.

**Computador**

![Consultar respostas pendentes no computador](capturas/09-desempenho-aguardando-correcao.png)

**Celular**

![Consultar respostas pendentes no celular](capturas/mobile/09-desempenho-pendente.png)

### Conferir uma resposta correta

O sistema confirma o acerto da objetiva e mostra a alternativa escolhida. Selecione **Continuar** para abrir a próxima questão ou a conclusão da área.

**Computador**

![Conferir uma resposta correta no computador](capturas/10-feedback-correto.png)

**Celular**

![Conferir uma resposta correta no celular](capturas/mobile/10-feedback-correto.png)

### Concluir uma área

Quando todas as questões ativas da área tiverem sido respondidas, a tela **Área concluída** oferece atalhos para escolher outra área ou consultar os resultados.

**Computador**

![Concluir uma área no computador](capturas/11-area-concluida.png)

**Celular**

![Concluir uma área no celular](capturas/mobile/11-area-concluida.png)

### Consultar resultados após a correção

O histórico da própria conta mostra a situação de cada resposta, a devolutiva do professor e o material associado quando o resultado for incorreto e houver material cadastrado. O aproveitamento é a proporção de acertos entre as respostas corrigidas.

**Computador**

![Consultar resultados após a correção no computador](capturas/21-desempenho-estudante-corrigido.png)

**Celular**

![Consultar resultados após a correção no celular](capturas/mobile/22-desempenho-corrigido.png)

## Minha conta

### Alterar senha e foto de perfil

Em qualquer perfil, abra **Minha conta** no cabeçalho. Para alterar a senha, informe a atual, digite a nova e repita-a no campo de confirmação. Para atualizar a foto, escolha um JPG, PNG ou WebP de até 5 MB e selecione **Salvar foto**. A foto pode ser removida na mesma tela. As alterações se aplicam à conta da sessão atual.

**Computador**

![Alterar senha e foto de perfil no computador](capturas/12-minha-conta.png)

**Celular**

![Alterar senha e foto de perfil no celular](capturas/mobile/12-minha-conta.png)

## Professor

### Painel do professor

O painel mostra o total de estudantes, questões ativas e respostas aguardando correção. Use o menu superior para ir ao cadastro, ao gerenciamento, à fila de correção ou à lista de estudantes.

**Computador**

![Painel do professor no computador](capturas/13-painel-professor.png)

**Celular**

![Painel do professor no celular](capturas/mobile/13-painel-professor.png)

### Cadastrar questão objetiva

Selecione a área e o tipo **Objetiva**. Preencha o enunciado, as quatro alternativas e o gabarito. Você pode incluir um link de estudo, anexar um PDF ou DOCX de até 1 MB ou usar os dois recursos. Selecione **Salvar questão**.

**Computador**

![Cadastrar questão objetiva no computador](capturas/14-cadastro-questao-objetiva.png)

**Celular**

![Cadastrar questão objetiva no celular](capturas/mobile/14-cadastro-objetiva.png)

### Cadastrar questão dissertativa

Selecione a área e o tipo **Dissertativa**. Informe o enunciado e a resposta esperada, usada como referência na correção. O material formativo é opcional e pode ser associado no próprio formulário.

**Computador**

![Cadastrar questão dissertativa no computador](capturas/15-cadastro-questao-dissertativa.png)

**Celular**

![Cadastrar questão dissertativa no celular](capturas/mobile/15-cadastro-dissertativa.png)

### Gerenciar questões

Confira a área, o tipo e a situação de cada questão. Use **Editar** para abrir o formulário, **Desativar** para retirá-la das atividades ou **Reativar** para disponibilizá-la novamente. Desativar preserva o histórico de respostas.

**Computador**

![Gerenciar questões no computador](capturas/16-gerenciar-questoes.png)

**Celular**

![Gerenciar questões no celular](capturas/mobile/16-gerenciar-questoes.png)

### Editar uma questão objetiva

O modal abre com o enunciado, as alternativas, o gabarito e o material já preenchidos. Os links fixos das questões de demonstração aparecem como somente leitura. Selecione **Salvar alterações** para aplicar a edição ou **Cancelar** para sair.

**Computador**

![Editar uma questão objetiva no computador](capturas/17-editar-questao.png)

**Celular**

![Editar uma questão objetiva no celular](capturas/mobile/17-editar-objetiva.png)

### Editar uma questão dissertativa

O modal da dissertativa permite ajustar o enunciado e a resposta esperada. Também permite substituir ou remover anexos complementares. Os links fixos permanecem associados à questão.

**Celular**

![Editar uma questão dissertativa no celular](capturas/mobile/18-editar-dissertativa.png)

### Corrigir respostas dissertativas

Abra **Correção** para ver as respostas pendentes. Leia o texto do estudante e consulte a resposta esperada. Escreva uma devolutiva, se desejar, e selecione **Marcar correta** ou **Marcar incorreta**. A avaliação aparece no histórico do estudante.

**Computador**

![Corrigir respostas dissertativas no computador](capturas/18-correcao-manual.png)

**Celular**

![Corrigir respostas dissertativas no celular](capturas/mobile/19-correcao-manual.png)

### Localizar um estudante

Em **Estudantes**, pesquise pelo nome ou e-mail e selecione **Ver resultados** na conta desejada. No celular, cada estudante aparece em um cartão com os campos identificados.

**Computador**

![Localizar um estudante no computador](capturas/19-lista-estudantes.png)

**Celular**

![Localizar um estudante no celular](capturas/mobile/20-lista-estudantes.png)

### Consultar o resultado individual

A consulta apresenta nome, instituição, e-mail, quantidade de questões realizadas, acertos e erros. O histórico mostra as respostas, o resultado, as datas disponíveis e a devolutiva do professor.

**Computador**

![Consultar o resultado individual no computador](capturas/20-resultado-individual-professor.png)

**Celular**

![Consultar o resultado individual no celular](capturas/mobile/21-resultado-individual.png)

## Administrador

### Painel administrativo

O painel reúne os totais de usuários por perfil. O menu leva ao cadastro de professores e à lista de usuários filtrada para mostrar professores.

**Computador**

![Painel administrativo no computador](capturas/22-painel-administrativo.png)

**Celular**

![Painel administrativo no celular](capturas/mobile/23-painel-administrativo.png)

### Cadastrar professor

Em **Cadastrar professor**, informe nome completo, e-mail, instituição e senha provisória. Depois de salvar, o professor pode entrar com a conta criada e alterar sua senha em **Minha conta**.

**Computador**

![Cadastrar professor no computador](capturas/23-cadastro-professor.png)

**Celular**

![Cadastrar professor no celular](capturas/mobile/24-cadastro-professor.png)

### Pesquisar e filtrar usuários

Em **Usuários cadastrados**, combine a busca por nome ou e-mail com o filtro de perfil. A coluna **Gerenciar** permite alterar perfis de estudante e professor. A conta de administrador aparece protegida.

**Computador**

![Pesquisar e filtrar usuários no computador](capturas/24-gerenciar-professores.png)

**Celular**

![Pesquisar e filtrar usuários no celular](capturas/mobile/25-gerenciar-professores.png)

### Confirmar a troca de perfil

Ao selecionar um novo perfil, confira no modal o nome da pessoa, o perfil atual e o novo. Selecione **Confirmar alteração** para salvar ou **Cancelar** para manter o perfil atual.

**Computador**

![Confirmar a troca de perfil no computador](capturas/25-confirmar-troca-de-perfil.png)

**Celular**

![Confirmar a troca de perfil no celular](capturas/mobile/26-confirmar-troca-perfil.png)
