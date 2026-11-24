const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const source = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");
const compactSource = source.replace(/\s/g, "");
const includes = value => compactSource.includes(value.replace(/\s/g, ""));
const checks = [
  ["fluxo de acesso direciona cada perfil ao painel correspondente", () => {
    for (const role of ["student","teacher","admin"]) assert.ok(includes(`user.role==="${role}"`));
  }],
  ["estudante acessa as cinco áreas e responde em sequência", () => {
    for (const area of ["Eletrônica Digital","Eletrônica Analógica","Sistemas Microprocessados","Eletrônica de Potência","Manutenção"]) assert.ok(includes(area));
    assert.ok(includes("const next=qs.find(q=>!done.includes(q.id))"));
    assert.ok(includes("AppStore.addAnswer(answer)"));
  }],
  ["questões objetivas recebem correção imediata e feedback formativo", () => {
    assert.ok(includes("response===Number(q.correctIndex)"));
    assert.ok(includes("renderObjectiveFeedback(user,area,questions,q,answer)"));
    assert.ok(includes("Abrir link de estudo"));
  }],
  ["respostas dissertativas aguardam correção manual do professor", () => {
    assert.ok(includes('status:q.type==="objective"?"graded":"pending"'));
    assert.ok(includes('filter(a=>a.status==="pending")'));
    assert.ok(includes("Marcar correta"));
    assert.ok(includes("Marcar incorreta"));
    assert.ok(includes("teacher-feedback-${a.id}"));
    assert.ok(includes("teacherFeedback:feedback,gradedBy:user.id"));
  }],
  ["professor cadastra questões e associa material formativo", () => {
    assert.ok(includes('id="question-area"'));
    assert.ok(includes('id="question-material"'));
    assert.ok(includes("AppStore.addQuestion(q)"));
    assert.ok(includes('documentField("question")'));
    assert.ok(includes('documentField("edit", q.materialDocument)'));
    assert.ok(includes('download="${esc(file.name)}"'));
  }],
  ["professor pesquisa estudantes e consulta resultados individuais", () => {
    assert.ok(includes('id="student-search"'));
    assert.ok(includes("data-student-results"));
    assert.ok(includes("renderStudentResults(user,button.dataset.studentResults)"));
  }],
  ["administrador cadastra professores e gerencia perfis", () => {
    assert.ok(includes('id="teacher-form"'));
    assert.ok(includes("data-user-role"));
    assert.ok(includes("profileDialog.showModal()"));
    assert.ok(includes('profileDialog.returnValue!=="confirm"'));
    assert.ok(includes('target.role==="admin"'));
  }],
  ["professor edita, desativa e reativa questões sem excluir registros", () => {
    assert.ok(includes("data-edit-question"));
    assert.ok(includes("openQuestionEditor(user,question,button)"));
    assert.ok(includes('$("#cancel-question-edit",dialog).onclick=()=>dialog.close()'));
    assert.doesNotMatch(source, /window\.prompt\(/);
    assert.ok(includes("AppStore.updateQuestion(q.id,patch)"));
    assert.ok(includes("data-deactivate-question"));
    assert.ok(includes("AppStore.deactivateQuestion(q.id)"));
    assert.ok(includes("data-reactivate-question"));
    assert.ok(includes("AppStore.updateQuestion(q.id,{active:true})"));
  }],
  ["estudante visualiza progresso individual por área e resumo geral", () => {
    assert.ok(includes('aria-valuenow="${pct}"'));
    assert.ok(includes("student-stats"));
    assert.ok(includes("Questões respondidas"));
  }],
  ["textos da interface estão acentuados e barras de progresso são acessíveis", () => {
    assert.ok(includes("Questão cadastrada."));
    assert.ok(includes("Questões realizadas"));
    assert.ok(includes('role="progressbar"'));
    assert.ok(includes("aria-valuenow=\"${pct}\""));
    assert.doesNotMatch(source, /Quest\?o|Quest\?es/);
  }],
  ["aplicação não contém exportação CSV", () => {
    assert.doesNotMatch(source, /downloadCsv|text\/csv|Exportar CSV|\.csv/i);
  }]
];
let failed = 0;
for (const [name, test] of checks) {
  try { test(); console.log("OK - " + name); }
  catch (error) { failed++; console.error("FALHOU - " + name + ": " + error.message); }
}
if (failed) process.exitCode = 1;
else console.log("\\n" + checks.length + " verificações de escopo aprovadas.");
