# Entrega técnica — Conecta Elétron

**Data da revisão:** 23/11/2026  
**Tipo de entrega:** protótipo acadêmico em HTML, CSS e JavaScript puro.  
**Revisão da entrega:** painéis autenticados reorganizados para ocupar a largura disponível, com grade responsiva para indicadores e áreas. A tela de login mantém o painel azul original. O cabeçalho autenticado possui estilo azul-marinho no CSS. A confirmação visual em diferentes navegadores e larguras continua sendo uma etapa manual.

## 1. Visão geral

O Conecta Elétron é uma aplicação demonstrativa de aprendizagem em Eletrônica. O projeto não utiliza framework, servidor de aplicação ou banco de dados remoto. A interface é executada no navegador e os dados ficam no `localStorage` do próprio navegador.

## 2. O que está implementado

### Estrutura e acesso
- Tela inicial de login com identidade visual do Conecta Elétron.
- Cadastro público de estudantes.
- Cadastro de professores pelo administrador.
- Login, logout e persistência da sessão após atualizar a página.
- Direcionamento por perfil: estudante, professor e administrador.
- Validação básica dos formulários, mensagens de erro e opção de mostrar/ocultar senha.

### Estudante
- Cinco áreas: Eletrônica Digital, Eletrônica Analógica, Sistemas Microprocessados, Eletrônica de Potência e Manutenção.
- Questões objetivas e dissertativas.
- Correção automática das objetivas, com feedback e material de apoio.
- Encaminhamento de dissertativas para correção manual.
- Histórico de respostas com status e devolutiva do professor.
- Impedimento de responder novamente uma questão já enviada.
- Indicadores gerais e progresso percentual por área, calculados sobre questões ativas e respostas do estudante.

### Professor
- Cadastro de questões objetivas e dissertativas por área.
- Quatro alternativas e gabarito nas questões objetivas.
- Resposta esperada nas questões dissertativas.
- Material de apoio associado à questão.
- Fila de respostas dissertativas pendentes, ordenada da mais antiga para a mais recente.
- Correção como correta/incorreta, com devolutiva textual opcional.
- Pesquisa de estudantes e consulta individual das respostas, status, datas e devolutivas.
- Listagem e edição de questões objetivas e dissertativas.
- Desativação e reativação de questões, preservando o histórico de respostas.

### Administrador
- Cadastro de professores.
- Listagem e pesquisa de usuários.
- Alteração de perfil entre estudante e professor, com confirmação.
- Proteção da conta administrativa contra alteração de perfil.

### Persistência
- Dados de usuários, questões e respostas no `localStorage`.
- Dados iniciais para demonstração.
- Recuperação quando o JSON salvo está corrompido ou quando a instalação antiga não possui questões.
- Modo em memória quando o armazenamento local está indisponível (nesse caso, alterações não persistem).

## 3. Estrutura de pastas

```text
Conecta Eletron/
├── css/
│   └── styles.css          # estilos e responsividade
├── docs/
│   ├── ANALISE-DE-ADERENCIA.md
│   ├── CONTINUIDADE.md
│   ├── ENTREGA-TRANSFERENCIA.md
│   ├── README.md
│   └── TESTES-MANUAIS.md
├── js/
│   ├── app.js              # interface, navegação e regras dos perfis
│   └── storage.js          # dados iniciais e persistência local
├── materials/
│   └── guia_portas_logicas.pdf
├── tests/
│   ├── storage.test.js     # testes automatizados do armazenamento
│   └── dashboard.test.js   # verificações estáticas dos fluxos do painel
└── index.html
```

## 4. Como executar

Requisitos: navegador atualizado e Node.js instalado apenas para executar os testes.

1. Extraia o ZIP.
2. Abra a pasta extraída no VS Code.
3. Inicie um servidor estático na raiz do projeto, por exemplo:

```powershell
python -m http.server 5500
```

4. Acesse http://localhost:5500

Também é possível usar a extensão Live Server do VS Code. Não é necessário instalar dependências npm.

## 5. Contas de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@conectaeletron.com | admin123 |
| Professor | professor@conectaeletron.com | prof123 |
| Estudante | estudante@conectaeletron.com | aluno123 |

As contas e senhas são fictícias e destinadas exclusivamente à demonstração.

## 6. Testes executados nesta revisão

Executados na pasta do projeto em 23/11/2026:

- `node tests/storage.test.js`: **11 testes aprovados**.
- `node tests/dashboard.test.js`: **11 verificações aprovadas**.
- `node --check js/app.js`: aprovado.
- `node --check js/storage.js`: aprovado.

A suíte de armazenamento imprime um aviso e uma pilha de erro ao testar intencionalmente a recuperação de JSON corrompido. Esse log é esperado; o teste termina aprovado.

**Limitação:** as 10 verificações de painel são verificações estáticas do código-fonte, não testes automatizados de interação real no navegador. Nesta revisão, `index.html`, `js/app.js` e `css/styles.css` responderam HTTP 200 pelo servidor local. A inspeção visual e os fluxos completos com cliques ainda precisam ser percorridos manualmente no navegador.

## 7. Pendências e pontos que o próximo membro deve conferir

1. **Validação funcional no navegador:** percorrer login, cadastro, sessão após F5, logout, três perfis, resolução de questão objetiva, envio de dissertativa, correção pelo professor e devolutiva no histórico.
2. **Validação administrativa:** cadastrar professor, pesquisar usuários, trocar perfil, cancelar a confirmação e verificar a proteção do administrador.
3. **Responsividade e acessibilidade:** testar larguras de celular e desktop, navegação por teclado, foco, contraste, mensagens e tabelas. As barras de progresso por área agora expõem `role=progressbar` e valores ARIA.
4. **Gerenciamento de questões:** já existe no painel do professor: editar enunciado, alternativas, gabarito, resposta esperada e material; desativar e reativar questões. A edição usa caixas de diálogo nativas do navegador. Percorrer manualmente todos os campos e confirmar a preservação do histórico.
5. **Indicadores de progresso:** já aparecem no painel do estudante, com totais gerais e percentual por área. O percentual considera somente questões ativas; questões desativadas deixam de compor o denominador.
6. **Revisão de conteúdo:** revisar enunciados e materiais de demonstração.
7. **Git:** esta pasta não contém repositório Git. Recomenda-se criar um repositório quando a equipe definir o local oficial.

## 8. Limitações conhecidas e segurança

- Não há backend, API, banco de dados remoto, sincronização entre computadores ou recuperação de senha por e-mail.
- Senhas ficam armazenadas em texto no armazenamento local. O controle de perfil é demonstrativo e pode ser manipulado pelo próprio usuário no navegador.
- Não usar dados pessoais, senhas reais ou informações institucionais sensíveis.
- O protótipo não está pronto para publicação como sistema real multiusuário.
- Exportação CSV não faz parte do escopo definido e não foi implementada.

## 9. Orientação para continuidade

Comece pela leitura deste documento, depois do [README](README.md) e do [roteiro de testes manuais](TESTES-MANUAIS.md). Antes de adicionar funcionalidades, valide o comportamento atual no navegador e confira os requisitos originais do projeto com a equipe. Atualize este documento e o [registro de continuidade](CONTINUIDADE.md) sempre que alterar funcionalidades ou testes.
