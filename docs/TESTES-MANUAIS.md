# Roteiro de testes manuais — Conecta Elétron

Use as contas de demonstração do README. Faça os testes no mesmo navegador para que os dados locais sejam compartilhados.

## 1. Acesso e cadastro
- [ ] Entrar com cada uma das três contas de demonstração.
- [ ] Confirmar que estudante, professor e administrador recebem seus respectivos painéis.
- [ ] Tentar acessar com senha incorreta e conferir a mensagem.
- [ ] Criar um estudante com nome, e-mail, instituição e senha válidos.
- [ ] Tentar cadastrar novamente o mesmo e-mail.
- [ ] Testar e-mail inválido e senha com menos de seis caracteres.
- [ ] Mostrar e ocultar a senha.
- [ ] Sair, entrar novamente e atualizar a página durante a sessão.

## 2. Estudante
- [ ] Confirmar que as cinco áreas de conteúdo aparecem.
- [ ] Abrir uma área sem questões e conferir a mensagem informativa.
- [ ] Responder uma questão objetiva corretamente e conferir a correção imediata.
- [ ] Responder uma questão objetiva incorretamente e conferir feedback e material formativo.
- [ ] Abrir o material formativo e confirmar que ele abre em outra página quando for um link.
- [ ] Responder uma questão dissertativa e confirmar o status de aguardando correção.
- [ ] Voltar às áreas e retornar à área anterior; confirmar que a questão já respondida não se repete.
- [ ] Consultar o histórico e os resultados.
- [ ] Conferir os totais gerais e o percentual de progresso em cada área.
- [ ] Responder questões e confirmar que os indicadores são atualizados ao retornar ao painel.

## 3. Professor
- [ ] Cadastrar uma questão objetiva com área, enunciado, quatro alternativas, resposta correta e material formativo.
- [ ] Cadastrar uma questão dissertativa com área, enunciado, resposta-modelo e material formativo.
- [ ] Tentar salvar questões sem área ou enunciado.
- [ ] Tentar salvar questão objetiva sem todas as alternativas.
- [ ] Tentar salvar questão dissertativa sem resposta-modelo.
- [ ] Confirmar que as questões cadastradas aparecem para estudantes na área correspondente.
- [ ] Conferir a fila de respostas dissertativas pendentes.
- [ ] Consultar a resposta-modelo e marcar uma resposta como correta.
- [ ] Marcar outra resposta como incorreta.
- [ ] Confirmar que a situação atualizada aparece no histórico do estudante.
- [ ] Pesquisar estudantes por nome e e-mail.
- [ ] Abrir os resultados individuais e conferir respostas, status e datas.

## 4. Gerenciamento de questões pelo professor
- [ ] Conferir a listagem de questões ativas e desativadas.
- [ ] Editar enunciado e material de apoio de uma questão.
- [ ] Editar as quatro alternativas e o gabarito de uma questão objetiva.
- [ ] Editar a resposta esperada de uma questão dissertativa.
- [ ] Desativar uma questão e confirmar que ela deixa de aparecer para novos estudantes.
- [ ] Reativar a questão e confirmar que volta a aparecer.
- [ ] Confirmar que respostas e histórico anteriores permanecem preservados após edição e desativação.

## 5. Administrador
- [ ] Cadastrar um professor com dados válidos.
- [ ] Tentar cadastrar novamente um e-mail já utilizado.
- [ ] Confirmar que o professor aparece na lista e consegue entrar.
- [ ] Pesquisar usuários por nome e e-mail.
- [ ] Alterar o perfil de um estudante para professor, confirmando a ação.
- [ ] Alterar o perfil de um professor para estudante.
- [ ] Cancelar uma alteração de perfil e conferir que nada muda.
- [ ] Confirmar que a conta administrativa não permite alteração de perfil.

## 6. Interface e responsividade
- [ ] Conferir se o cabeçalho dos painéis autenticados aparece em azul-marinho, com logo, usuário e botão de saída legíveis. A regra CSS foi adicionada, mas a última captura ainda mostrou o cabeçalho branco; investigar cache/especificidade se persistir.
- [ ] Conferir a tela de login em desktop e celular.
- [ ] Conferir a nova distribuição em largura ampla nos painéis de estudante, professor e administrador.
- [ ] Conferir painéis, formulários, tabelas, botões e mensagens.
- [ ] Verificar se textos e tabelas não ultrapassam a largura da tela.
- [ ] Testar rolagem vertical e horizontal quando necessária.
- [ ] Confirmar que os botões executam a ação indicada e que não existem controles de exportação CSV.

## Resultado

**Observação da revisão de 23/11/2026:** os controles de edição/desativação/reativação de questões e os indicadores de progresso por área já estão presentes no código. Os itens abaixo continuam pendentes de execução manual no navegador, não de implementação.

Registre os itens que falharem e a mensagem apresentada. Os testes automatizados podem ser executados com `node tests/storage.test.js` e `node tests/dashboard.test.js`.