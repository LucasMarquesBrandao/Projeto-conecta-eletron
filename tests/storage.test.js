const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "storage.js"), "utf8");

function createStore(initialValue = null) {
  const data = new Map();
  if (initialValue !== null) data.set("conecta-eletron-v1", initialValue);
  const localStorage = {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); }
  };
  const context = { localStorage, structuredClone, window: {}, console };
  vm.runInNewContext(source, context, { filename: "storage.js" });
  return { store: context.window.AppStore, data };
}

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("OK - " + name); }
  catch (error) { console.error("FALHOU - " + name); throw error; }
}

const { store, data } = createStore();

test("migra links da página de estudo antiga em questões personalizadas", () => {
  const { store, data } = createStore();
  store.addQuestion({
    id: "custom-study", area: "Eletrônica Digital", prompt: "Portas lógicas",
    type: "objective", material: "material-formativo.html#porta-and"
  });
  const reopened = createStore(data.get("conecta-eletron-v1")).store;
  const question = reopened.questions().find(item => item.id === "custom-study");
  assert.equal(question.material, "materials/guia_portas_logicas.pdf");
  assert.equal(reopened.hasFixedMaterial(question.id), false);
});

test("mantém os seis materiais fixos vinculados às questões de demonstração", () => {
  const { store, data } = createStore();
  const materials = [
    ["q-demo-01", "materials/guia_portas_logicas.pdf"],
    ["q-demo-02", "https://www.youtube.com/watch?v=qQCEnluIids"],
    ["q-demo-03", "https://www.youtube.com/watch?v=YvuzPfLWHCE"],
    ["q-demo-04", "https://www.youtube.com/watch?v=8ghQla9n4pE"],
    ["q-demo-05", "https://www.youtube.com/watch?v=vsEseS0v4ek"],
    ["q-demo-06", "https://www.youtube.com/watch?v=aYVz0l3ZMWc&t=128s"]
  ];
  for (const [id, material] of materials) {
    assert.equal(store.hasFixedMaterial(id), true);
    assert.equal(store.updateQuestion(id, { prompt: "Novo enunciado", material: "" }), true);
    assert.equal(store.questions().find(question => question.id === id).material, material);
  }
  const previous = JSON.parse(data.get("conecta-eletron-v1"));
  for (const [id] of materials) {
    previous.questions.find(question => question.id === id).material = "https://example.com/";
  }
  const reopened = createStore(JSON.stringify(previous)).store;
  for (const [id, material] of materials) {
    const question = reopened.questions().find(question => question.id === id);
    assert.equal(question.material, material);
    assert.equal(question.prompt, "Novo enunciado");
  }
  assert.equal(reopened.hasFixedMaterial("questao-personalizada"), false);
});

test("mantém anexos de estudo ao recarregar e permite removê-los na edição", () => {
  const { store, data } = createStore();
  const materialDocument = { name: "aula.pdf", extension: "pdf", base64: "JVBERi0=" };
  assert.equal(store.addQuestion({
    id: "question-with-document", area: "Manutenção", prompt: "Exemplo",
    type: "written", materialDocument
  }), true);
  const reopened = createStore(data.get("conecta-eletron-v1")).store;
  const question = () => reopened.questions().find(item => item.id === "question-with-document");
  assert.deepEqual(question().materialDocument, materialDocument);
  assert.equal(reopened.updateQuestion(question().id, { prompt: "Novo enunciado" }), true);
  assert.deepEqual(question().materialDocument, materialDocument);
  assert.equal(reopened.updateQuestion(question().id, { materialDocument: null }), true);
  assert.equal(question().materialDocument, null);
});

test("permite a cada perfil alterar somente a própria senha com a senha atual", () => {
  const { store, data } = createStore();
  for (const account of store.users()) {
    const other = store.users().find(user => user.id !== account.id);
    data.set("conecta-eletron-session", account.id);
    assert.equal(store.changeOwnPassword(other.id, other.password, "nova123"), "session");
    assert.equal(store.changeOwnPassword(account.id, "incorreta", "nova123"), "password");
    assert.equal(store.changeOwnPassword(account.id, account.password, "123"), "invalid");
    assert.equal(store.changeOwnPassword(account.id, account.password, "nova123"), "saved");
    const reloaded = createStore(data.get("conecta-eletron-v1")).store;
    assert.equal(reloaded.userByEmail(account.email).password, "nova123");
    assert.equal(reloaded.userByEmail(other.email).password, other.password);
  }
});

test("isola a foto por sessão e permite remover a foto da própria conta", () => {
  const { store, data } = createStore();
  const photo = "data:image/jpeg;base64,AAAA";
  data.set("conecta-eletron-session", "u-student");
  assert.equal(store.setOwnPhoto("u-admin", photo), "session");
  assert.equal(store.setOwnPhoto("u-student", "https://example.com/photo.jpg"), "invalid");
  assert.equal(store.setOwnPhoto("u-student", photo), "saved");
  const reloaded = createStore(data.get("conecta-eletron-v1")).store;
  assert.equal(reloaded.users().find(user => user.id === "u-student").photo, photo);
  assert.equal(reloaded.users().find(user => user.id === "u-admin").photo, undefined);
  data.delete("conecta-eletron-session");
  assert.equal(store.setOwnPhoto("u-student", null), "session");
  data.set("conecta-eletron-session", "u-student");
  assert.equal(store.setOwnPhoto("u-student", null), "saved");
  assert.equal(store.users().find(user => user.id === "u-student").photo, undefined);
});

test("inicializa as três contas de demonstração", () => {
  assert.equal(store.users().length, 3);
  assert.equal(store.questions().length, 6);
  assert.equal(new Set(store.questions().map(q => q.area)).size, 5);
  assert.equal(store.userByEmail("ADMIN@CONECTAELETRON.COM").role, "admin");
  assert.equal(store.userByEmail("professor@conectaeletron.com").role, "teacher");
  assert.equal(store.userByEmail("estudante@conectaeletron.com").role, "student");
});

test("retorna cópias para impedir alteração acidental do estado", () => {
  const users = store.users();
  users[0].name = "Alterado fora da store";
  assert.notEqual(store.users()[0].name, "Alterado fora da store");
});

test("cadastra usuário e persiste no armazenamento", () => {
  store.addUser({ id: "test-user", name: "Pessoa Teste", email: "pessoa@teste.com", institution: "Escola", password: "123456", role: "student" });
  assert.equal(store.userByEmail("pessoa@teste.com").id, "test-user");
  assert.ok(data.has("conecta-eletron-v1"));
});

test("altera perfil do usuário e preserva conta inexistente", () => {
  assert.equal(store.updateUser("test-user", { role: "teacher" }), true);
  assert.equal(store.userByEmail("pessoa@teste.com").role, "teacher");
  assert.equal(store.updateUser("nao-existe", { role: "admin" }), false);
});

test("cadastra questão objetiva", () => {
  const before = store.questions().length;
  store.addQuestion({ id: "q1", area: "Eletrônica Digital", type: "objective", prompt: "Teste", options: ["A", "B"], correctIndex: 1 });
  assert.equal(store.questions().length, before + 1);
  assert.equal(store.questions().find(q => q.id === "q1").correctIndex, 1);
});

test("edita e desativa questão sem remover respostas vinculadas", () => {
  store.addAnswer({ id: "history-q1", questionId: "q1", studentId: "test-user", response: 1, status: "graded", correct: true });
  assert.equal(store.updateQuestion("q1", { prompt: "Enunciado revisado" }), true);
  assert.equal(store.questions().find(q => q.id === "q1").prompt, "Enunciado revisado");
  assert.equal(store.deactivateQuestion("q1"), true);
  assert.equal(store.questions().find(q => q.id === "q1").active, false);
  assert.equal(store.updateQuestion("q1", { active: true }), true);
  assert.equal(store.questions().find(q => q.id === "q1").active, true);
  assert.equal(store.answers().some(a => a.id === "history-q1" && a.questionId === "q1"), true);
  assert.equal(store.deactivateQuestion("nao-existe"), false);
});

test("registra resposta e permite atualizar correção", () => {
  store.addAnswer({ id: "a1", questionId: "q1", studentId: "test-user", status: "pending", correct: null });
  assert.equal(store.answers().find(a => a.id === "a1").status, "pending");
  assert.equal(store.updateAnswer("a1", { status: "graded", correct: true, teacherFeedback: "Boa explicação; revise apenas a unidade." }), true);
  assert.equal(store.answers().find(a => a.id === "a1").correct, true);
  assert.equal(store.answers().find(a => a.id === "a1").teacherFeedback, "Boa explicação; revise apenas a unidade.");
  assert.equal(store.updateAnswer("inexistente", { correct: false }), false);
});

test("reset restaura os dados iniciais", () => {
  store.reset();
  assert.equal(store.users().length, 3);
  assert.equal(store.questions().length, 6);
  assert.equal(store.answers().length, 0);
});

test("recupera dados iniciais quando o JSON salvo está corrompido e regrava o armazenamento", () => {
  const recovered = createStore("{json-invalido");
  assert.equal(recovered.store.users().length, 3);
  assert.equal(recovered.store.questions().length, 6);
  const persisted = JSON.parse(recovered.data.get("conecta-eletron-v1"));
  assert.equal(persisted.users.length, 3);
  assert.equal(persisted.questions.length, 6);
});

test("continua carregando em modo local quando o armazenamento está indisponível", () => {
  const context = { localStorage: { getItem(){ throw new Error("bloqueado"); }, setItem(){ throw new Error("bloqueado"); } }, structuredClone, window: {}, console: {warn(){},error(){}} };
  vm.runInNewContext(source, context, { filename: "storage.js" });
  assert.equal(context.window.AppStore.users().length, 3);
  assert.doesNotThrow(() => context.window.AppStore.addAnswer({id:"offline-answer",studentId:"u-student"}));
});

test("recupera questões de demonstração em uma instalação anterior sem questões", () => {
  const previous = createStore(JSON.stringify({ users: [], questions: [], answers: [] })).store;
  assert.equal(previous.questions().length, 6);
});

console.log("\n" + passed + " testes passaram.");
