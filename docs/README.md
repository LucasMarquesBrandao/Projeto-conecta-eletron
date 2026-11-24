# Conecta Elétron

Protótipo acadêmico desenvolvido exclusivamente com HTML5, CSS3 e JavaScript puro, sem frameworks ou bibliotecas externas.

## Executar localmente
1. Abra esta pasta no VS Code.
2. Abra `index.html` com Live Server, ou execute no PowerShell:
   `python -m http.server 5500`
3. Acesse http://localhost:5500

## Hospedagem na Discloud

Selecione o subdomínio `conectaeletron` no painel da Discloud e importe a branch `main` pelo GitHub ou envie `conectaeletron-discloud.zip`. Quando o subdomínio estiver ativo, o endereço será `https://conectaeletron.discloud.app`. A Discloud exige plano Platinum ou superior e pelo menos 512 MB de RAM para sites.

Para gerar novamente o pacote após alterações, execute na raiz do projeto:

```powershell
python -m zipfile -c conectaeletron-discloud.zip discloud.config index.html css js materials
```

## Contas de demonstração
- Administrador: admin@conectaeletron.com / admin123
- Professor: professor@conectaeletron.com / prof123
- Estudante: estudante@conectaeletron.com / aluno123

## Funcionalidades do escopo

### Estudante
- Cadastro com nome, e-mail, instituição e senha.
- Login e acesso ao painel do estudante.
- Seleção entre as cinco áreas de conteúdo definidas para o protótipo.
- Introdução à área selecionada antes do início das questões e acesso ao histórico pelo menu superior.
- Resolução sequencial das questões, sem retornar às questões já enviadas.
- Correção imediata das questões objetivas.
- Feedback e acesso ao material formativo associado quando a resposta objetiva estiver incorreta.
- Envio de respostas dissertativas para correção manual do professor.
- Acesso ao material formativo no histórico após uma resposta dissertativa ser marcada como incorreta.
- Consulta ao histórico e aos resultados das respostas.
- Indicadores gerais e percentual de conclusão por área, considerando as questões ativas.

### Professor
- Cadastro de questões objetivas e dissertativas por área.
- Associação de link de estudo ou anexo PDF/DOCX de até 1 MB às questões. O estudante abre links em outra aba e baixa os documentos após um erro. As questões iniciais têm materiais fixos em PDF ou no YouTube.
- Cadastro de resposta-modelo para questões dissertativas.
- Consulta e correção manual das respostas dissertativas como correta ou incorreta.
- Pesquisa de estudantes por nome ou e-mail.
- Consulta aos resultados individuais dos estudantes.
- Edição de enunciado, alternativas, gabarito, resposta esperada e material de apoio das questões.
- Desativação e reativação de questões, sem apagar respostas ou histórico já registrado.

### Administrador
- Cadastro de perfis de professores.
- Consulta e pesquisa dos usuários cadastrados.
- Filtro por perfil e acesso à lista de professores pelo menu superior.
- Gerenciamento do perfil de usuário entre estudante e professor.
- Proteção da conta administrativa contra alteração de perfil.

## Minha conta

Estudantes, professores e administradores podem acessar **Minha conta** pelo cabeçalho para alterar a própria senha ou adicionar, substituir e remover sua foto. A troca de senha exige a senha atual e a confirmação da nova. A foto aparece no cabeçalho e fica no mesmo navegador que armazena a conta.

## Persistência e limitações
Os dados são armazenados no `localStorage` do navegador. Isso permite demonstrar os fluxos acadêmicos sem backend, mas não sincroniza informações entre computadores ou navegadores.

Este protótipo não oferece autenticação segura: as credenciais e os dados ficam no armazenamento local do navegador. Não utilizar dados ou senhas reais.

## Testes
Com Node.js instalado, execute no PowerShell:

```powershell
node tests/storage.test.js
node tests/dashboard.test.js
node --check js/app.js
node --check js/storage.js
```

A suíte de armazenamento verifica inicialização, cadastro, atualização e recuperação dos dados locais. A suíte de painel verifica os fluxos e funcionalidades descritos no escopo. Os testes automatizados não substituem a validação manual no navegador.

## Limites conhecidos
- Não há servidor de aplicação nem banco de dados remoto.
- Os dados ficam restritos ao navegador e ao perfil local utilizados.
- Não há recuperação de senha ou envio de e-mail.
- A aplicação é um protótipo acadêmico e não deve ser utilizada com dados pessoais reais.

## Transferência para outro desenvolvedor
Consulte a [entrega técnica](ENTREGA-TRANSFERENCIA.md) para a estrutura do projeto e as orientações de transferência.

- [Análise de aderência ao escopo](ANALISE-DE-ADERENCIA.md)
- [Manual do sistema com telas de computador e celular](MANUAL-DO-SISTEMA.md)
- [Diagrama de classes UML](DIAGRAMA-DE-CLASSES.md)
- [Roteiro de testes manuais](TESTES-MANUAIS.md)
- [Registro de continuidade](CONTINUIDADE.md)
