/* Conecta Elétron — aplicação acadêmica em JavaScript puro. */
(() => {
  let root = document.getElementById("auth-content"); const toast = document.getElementById("toast");
  const SESSION_KEY = "conecta-eletron-session";
  const areas = [
    ["Eletrônica Digital", "Lógica, sistemas numéricos e circuitos digitais."],
    ["Eletrônica Analógica", "Componentes, sinais e circuitos analógicos."],
    ["Sistemas Microprocessados", "Microcontroladores e sistemas embarcados."],
    ["Eletrônica de Potência", "Conversão e controle de energia elétrica."],
    ["Manutenção", "Diagnóstico e manutenção de equipamentos eletrônicos."]
  ];
  const labels = { student: "Estudante", teacher: "Professor", admin: "Administrador" };
  const $ = (s, scope = document) => scope.querySelector(s);
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function notify(message) { toast.textContent = message; toast.classList.add("show"); clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove("show"), 2600); }
  function currentUser() { const id = localStorage.getItem(SESSION_KEY); return AppStore.users().find(u => u.id === id) || null; }
  function setSession(user) { localStorage.setItem(SESSION_KEY, user.id); }
  function logout() { localStorage.removeItem(SESSION_KEY); renderLogin(); }
  function field(label, name, type = "text", placeholder = "") { return '<div class="field"><label for="' + name + '">' + label + '</label><input id="' + name + '" name="' + name + '" type="' + type + '" placeholder="' + placeholder + '" required></div>'; }
  function showError(message, ids = []) { const error = $("#form-error"); if (error) error.textContent = message; ids.forEach(id => $("#" + id)?.setAttribute("aria-invalid", "true")); if (ids[0]) $("#" + ids[0])?.focus(); }
  function clearError(form) { form.addEventListener("input", () => { $("#form-error", form).textContent = ""; form.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid")); }); }
  function passwordToggle(id) { const input = $("#" + id); if (!input) return; const wrap = document.createElement("div"); wrap.className = "password-control"; input.parentNode.insertBefore(wrap, input); wrap.append(input); const b = document.createElement("button"); b.type = "button"; b.className = "password-toggle"; b.textContent = "Mostrar"; wrap.append(b); b.addEventListener("click", () => { input.type = input.type === "password" ? "text" : "password"; b.textContent = input.type === "password" ? "Mostrar" : "Ocultar"; }); }
  function renderLogin() {
    const app = document.getElementById("app");
    app.className = "auth-layout";
    app.innerHTML = `<section class="brand-panel">
      <div class="brand-lockup"><span class="brand-symbol">CE</span><span>Conecta <strong>Elétron</strong></span></div>
      <div class="brand-copy"><span class="eyebrow">APRENDIZAGEM • TECNOLOGIA • PRÁTICA</span><h1>Conecte o conhecimento à prática.</h1><p>Explore a Eletrônica por meio de situações-problema e desenvolva suas habilidades com orientação formativa.</p></div>
      <div class="brand-foot">Educação tecnológica para todos.</div>
    </section><section class="auth-panel"><div class="auth-card"><div class="mobile-brand brand-lockup"><span class="brand-symbol">CE</span><span>Conecta <strong>Elétron</strong></span></div><div id="auth-content"></div></div></section>`;
    root = document.getElementById("auth-content");
    root.innerHTML = `<h2>Bem-vindo ao Conecta Elétron</h2><p class="subheading">Entre na plataforma para continuar sua jornada de aprendizagem.</p>
      <form id="login-form" novalidate>${field("E-mail", "email", "email", "seuemail@exemplo.com")}${field("Senha", "password", "password", "Digite sua senha")}<div id="form-error" class="error" role="alert"></div><button class="btn btn-primary" type="submit">Entrar na plataforma</button></form>
      <p class="auth-switch">Ainda não tem cadastro? <button class="text-button" id="show-register" type="button">Criar conta de estudante</button></p>
      <div class="demo-box"><strong>Acessos para demonstração</strong><br>Administrador: admin@conectaeletron.com / admin123<br>Professor: professor@conectaeletron.com / prof123<br>Estudante: estudante@conectaeletron.com / aluno123</div>`;
    passwordToggle("password"); const form = $("#login-form"); clearError(form);
    form.addEventListener("submit", e => { e.preventDefault(); const email = $("#email").value.trim().toLowerCase(), pass = $("#password").value; if (!email || !pass) { showError("Preencha e-mail e senha.", [!email ? "email" : "password"]); return; } const user = AppStore.userByEmail(email); if (!user || user.password !== pass) { showError("E-mail ou senha inválidos.", ["email", "password"]); return; } setSession(user); renderDashboard(); notify("Acesso realizado com sucesso."); });
    $("#show-register").onclick = renderRegister;
  }
  function renderRegister() {
    root.innerHTML = `<h2>Crie sua conta</h2><p class="subheading">O cadastro aberto é destinado aos estudantes. Professores são cadastrados pelo administrador.</p>
      <form id="register-form" novalidate>${field("Nome completo", "name", "text", "Seu nome")}${field("E-mail", "email", "email", "seuemail@exemplo.com")}${field("Instituição", "institution", "text", "Sua instituição")}${field("Senha", "password", "password", "Crie uma senha")}<div class="hint">A senha deve ter pelo menos 6 caracteres.</div><div id="form-error" class="error" role="alert"></div><button class="btn btn-primary" type="submit">Criar conta</button></form>
      <p class="auth-switch">Já possui cadastro? <button class="text-button" id="show-login" type="button">Voltar ao login</button></p>`;
    passwordToggle("password"); const form = $("#register-form"); clearError(form);
    form.addEventListener("submit", e => {
      e.preventDefault(); const name = $("#name").value.trim(), email = $("#email").value.trim().toLowerCase(), institution = $("#institution").value.trim(), password = $("#password").value;
      if (name.length < 3) { showError("Informe seu nome completo.", ["name"]); return; } if (!$("#email").checkValidity()) { showError("Informe um e-mail válido.", ["email"]); return; } if (!institution) { showError("Informe a instituição.", ["institution"]); return; } if (password.length < 6) { showError("A senha deve ter pelo menos 6 caracteres.", ["password"]); return; } if (AppStore.userByEmail(email)) { showError("Este e-mail já está cadastrado.", ["email"]); return; }
      const user = { id: crypto.randomUUID(), name, email, institution, password, role: "student" }; AppStore.addUser(user); setSession(user); renderDashboard(); notify("Cadastro realizado com sucesso.");
    });
    $("#show-login").onclick = renderLogin;
  }
  const destinations = {
    student: [["Áreas", "student-areas"], ["Desempenho", "student-results"]],
    teacher: [["Painel", "teacher-home"], ["Cadastrar questão", "question-form"], ["Gerenciar questões", "teacher-question-management"], ["Correção", "pending-list"], ["Estudantes", "teacher-students"]],
    admin: [["Painel", "admin-home"], ["Professores", "user-management"], ["Cadastrar professor", "teacher-form"]]
  };

  function shell(user, content) {
    const app = document.getElementById("app"); app.className = ""; app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand-inline"><span class="brand-symbol">CE</span><span>Conecta Elétron</span></div><nav class="main-nav" aria-label="Menu principal">${destinations[user.role].map(([label, id]) => `<button type="button" data-destination="${id}">${label}</button>`).join("")}</nav><div class="topbar-right">${avatar(user)}<span class="user-label">${esc(user.name)} · ${labels[user.role]}</span><button class="logout" id="my-account" type="button">Minha conta</button><button class="logout" id="logout" type="button">Sair</button></div></header><main class="dashboard">${content}</main></div>`; root = null;
    $("#logout").onclick = logout;
    $("#my-account").onclick = renderAccount;
    document.querySelectorAll(".table-wrap > table:not(.student-performance-table)").forEach(table => {
      table.classList.add("responsive-records");
      table.setAttribute("role", "table");
      for (const section of [table.tHead, ...table.tBodies]) {
        section.setAttribute("role", "rowgroup");
        for (const row of section.rows) {
          row.setAttribute("role", "row");
          for (const [index, cell] of Array.from(row.cells).entries()) {
            cell.setAttribute("role", cell.tagName === "TH" ? "columnheader" : "cell");
            if (cell.tagName === "TH" || cell.colSpan > 1) continue;
            const label = document.createElement("span");
            label.className = "record-label";
            label.setAttribute("aria-hidden", "true");
            label.textContent = table.tHead.rows[0].cells[index].textContent;
            cell.prepend(label);
          }
        }
      }
    });
    document.querySelectorAll("[data-destination]").forEach(button => button.onclick = () => {
      const id = button.dataset.destination;
      if (!document.getElementById(id)) renderDashboard();
      if (id === "user-management") {
        $("#user-role-filter").value = "teacher";
        $("#user-role-filter").dispatchEvent(new Event("change"));
      }
      const target = document.getElementById(id);
      target.setAttribute("tabindex", "-1");
      target.style.scrollMarginTop = ($(".topbar").offsetHeight + 16) + "px";
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start" });
    });
  }

  function avatar(user) {
    const initials = esc(user.name.slice(0, 2).toUpperCase());
    const photo = user.photo || "";
    return `<span class="avatar" aria-hidden="true">${/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(photo) ? `<img src="${esc(photo)}" alt="">` : initials}</span>`;
  }

  async function prepareProfilePhoto(file) {
    const image = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 256 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d", { alpha: false });
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.82);
    } finally { image.close(); }
  }

  function renderAccount() {
    const user = currentUser();
    if (!user) { renderLogin(); return; }
    shell(user, `
      <div class="welcome"><div><h1 id="account-title" tabindex="-1">Minha conta</h1><p>${esc(user.name)} · ${esc(user.email)}</p></div><button class="btn btn-outline" id="back-account" type="button">Voltar ao painel</button></div>
      <div class="account-grid">
        <section class="panel">
          <h2>Foto de perfil</h2>
          <div class="account-avatar">${avatar(user)}</div>
          <form id="photo-form">
            <div class="field"><label for="account-photo">Escolher foto</label><input id="account-photo" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="photo-hint"></div>
            <p class="hint" id="photo-hint">JPG, PNG ou WebP de até 5 MB.</p>
            <p class="error" id="photo-error" role="alert"></p>
            <div class="section-actions"><button class="btn btn-secondary" type="submit">Salvar foto</button>${user.photo ? '<button class="btn btn-outline" id="remove-photo" type="button">Remover foto</button>' : ""}</div>
          </form>
        </section>
        <section class="panel">
          <h2>Alterar senha</h2>
          <form id="password-form" novalidate>
            ${field("Senha atual", "account-current", "password")}
            ${field("Nova senha", "account-new", "password")}
            ${field("Confirme a nova senha", "account-confirm", "password")}
            <p class="hint">Use pelo menos 6 caracteres.</p>
            <div class="error" id="form-error" role="alert"></div>
            <button class="btn btn-secondary" type="submit">Salvar nova senha</button>
          </form>
        </section>
      </div>
    `);
    $("#account-title").focus();
    $("#back-account").onclick = renderDashboard;
    const passwordForm = $("#password-form");
    clearError(passwordForm);
    $("#account-current").autocomplete = "current-password";
    $("#account-new").autocomplete = "new-password";
    $("#account-confirm").autocomplete = "new-password";
    passwordForm.onsubmit = event => {
      event.preventDefault();
      const password = $("#account-new").value;
      if (password !== $("#account-confirm").value) {
        showError("As duas senhas precisam ser iguais.", ["account-confirm"]);
        return;
      }
      const result = AppStore.changeOwnPassword(user.id, $("#account-current").value, password);
      if (result === "password") { showError("A senha atual está incorreta.", ["account-current"]); return; }
      if (result === "invalid") { showError("Escolha uma senha diferente com pelo menos 6 caracteres.", ["account-new"]); return; }
      if (result === "session") { renderDashboard(); return; }
      if (result !== "saved") { showError("Não foi possível salvar a senha neste navegador."); return; }
      passwordForm.reset();
      notify("Senha atualizada.");
    };

    const photoForm = $("#photo-form");
    const photoInput = $("#account-photo");
    const photoError = $("#photo-error");
    const photoButtons = photoForm.querySelectorAll("button");
    photoInput.onchange = () => { photoError.textContent = ""; };
    function savePhoto(photo) {
      const result = AppStore.setOwnPhoto(user.id, photo);
      if (result === "session") { renderDashboard(); return; }
      if (result !== "saved") { photoError.textContent = "Não foi possível salvar a foto neste navegador."; return; }
      renderAccount();
      notify(photo ? "Foto atualizada." : "Foto removida.");
    }
    $("#remove-photo")?.addEventListener("click", () => savePhoto(null));
    photoForm.onsubmit = async event => {
      event.preventDefault();
      const file = photoInput.files[0];
      if (!file) { photoError.textContent = "Selecione uma foto."; photoInput.focus(); return; }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
        photoError.textContent = "Selecione um arquivo JPG, PNG ou WebP de até 5 MB.";
        return;
      }
      photoError.textContent = "";
      photoButtons.forEach(button => { button.disabled = true; });
      photoInput.disabled = true;
      try {
        const photo = await prepareProfilePhoto(file);
        if (photoForm.isConnected) savePhoto(photo);
      } catch {
        photoError.textContent = "Não foi possível abrir a imagem selecionada.";
      } finally {
        photoButtons.forEach(button => { button.disabled = false; });
        photoInput.disabled = false;
      }
    };
  }

  function studyUrl(value) {
    if (value === "materials/guia_portas_logicas.pdf") return value;
    if (!/^https?:\/\//i.test(value)) return "";
    try { return new URL(value).href; }
    catch { return ""; }
  }

  function studyLink(value) {
    const url = studyUrl(value);
    if (!url) return "";
    const label = url === "materials/guia_portas_logicas.pdf" ? "Abrir guia de portas lógicas (PDF)" : "Abrir link de estudo";
    return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }

  const documentTypes = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  };

  function materialLinks(question) {
    const link = studyLink(question?.material ?? "");
    const file = question?.materialDocument;
    const type = file && Object.hasOwn(documentTypes, file.extension) ? documentTypes[file.extension] : "";
    const attachment = type && typeof file.base64 === "string" && /^[A-Za-z0-9+/]+={0,2}$/.test(file.base64)
      ? `<a href="data:${type};base64,${file.base64}" download="${esc(file.name)}">Baixar ${esc(file.name)}</a>` : "";
    const contents = [link, attachment].filter(Boolean).join("");
    return contents ? `<div class="study-links">${contents}</div>` : "";
  }

  function documentField(prefix, attachment) {
    return `<div class="field">
      <label for="${prefix}-document">Anexar documento (opcional)</label>
      <input id="${prefix}-document" name="document" type="file" accept=".pdf,.docx" aria-describedby="${prefix}-document-hint">
      <small id="${prefix}-document-hint">PDF ou Word (.docx), até 1 MB por arquivo.</small>
    </div>${attachment ? `<label class="document-removal"><input type="checkbox" name="remove-document"> Remover anexo atual (${esc(attachment.name)})</label>` : ""}`;
  }

  async function readStudyDocument(file) {
    const extension = file.name.split(".").pop().toLowerCase();
    if (!Object.hasOwn(documentTypes, extension) || !file.size || file.size > 1024 * 1024) {
      throw new Error("Selecione um documento PDF ou DOCX de até 1 MB.");
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const signature = extension === "pdf" ? [37, 80, 68, 70, 45] : [80, 75, 3, 4];
    if (!signature.every((byte, index) => bytes[index] === byte)) {
      throw new Error("O conteúdo do arquivo não corresponde ao formato informado.");
    }
    if (extension === "docx") {
      const entries = new TextDecoder().decode(bytes);
      if (!entries.includes("[Content_Types].xml") || !entries.includes("word/document.xml")) {
        throw new Error("Selecione um documento do Word no formato DOCX.");
      }
    }
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 8192) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    }
    return { name: file.name, extension, base64: btoa(binary) };
  }
  function studentAnswers(user) { return AppStore.answers().filter(a => a.studentId === user.id); }

  function summarizePerformance(answers) {
    const summary = { correct: 0, incorrect: 0, pending: 0 };
    for (const answer of answers) {
      if (answer.status === "pending") summary.pending++;
      if (answer.status === "graded" && answer.correct === true) summary.correct++;
      if (answer.status === "graded" && answer.correct === false) summary.incorrect++;
    }
    const graded = summary.correct + summary.incorrect;
    return { ...summary, rate: graded ? Math.round(100 * summary.correct / graded) + "%" : "—" };
  }

  function studentPerformance(answers) {
    const total = summarizePerformance(answers);
    const cards = [
      ["Aproveitamento geral", total.rate],
      ["Acertos", total.correct],
      ["Erros", total.incorrect],
      ["Aguardando correção", total.pending]
    ];
    const areaRows = areas.map(([area]) => {
      const results = summarizePerformance(answers.filter(answer => answer.area === area));
      return `<tr><th scope="row">${esc(area)}</th><td>${results.correct}</td><td>${results.incorrect}</td><td>${results.pending}</td><td>${results.rate}</td></tr>`;
    }).join("");
    return `
      <h2>Meu desempenho</h2>
      <div class="grid-cards student-stats">${cards.map(([label, value]) => `<div class="stat-card"><small>${label}</small><strong>${value}</strong></div>`).join("")}</div>
      <p class="muted-note">O aproveitamento é calculado sobre as respostas corrigidas. O traço indica que ainda não há correções.</p>
      <h3>Desempenho por área</h3>
      <div class="table-wrap"><table class="student-performance-table">
        <thead><tr><th scope="col">Área</th><th scope="col">Acertos</th><th scope="col">Erros</th><th scope="col">Pendentes</th><th scope="col">Aproveitamento</th></tr></thead>
        <tbody>${areaRows}</tbody>
      </table></div>`;
  }

  function renderStudent(user) {
    const answers = studentAnswers(user);
    const cards = areas.map((a, i) => { const qs = AppStore.questions().filter(q => q.area === a[0] && q.active !== false), done = answers.filter(x => x.area === a[0] && qs.some(q => q.id === x.questionId)).length, pct = qs.length ? Math.round(done / qs.length * 100) : 0; return `<button class="area-card" type="button" data-area="${i}"><span>ÁREA 0${i + 1}</span><strong>${a[0]}</strong><span>${a[1]}</span><span class="muted-note">${done} de ${qs.length} questões respondidas · ${pct}%</span><span class="progress-track" role="progressbar" aria-label="Progresso em ${esc(a[0])}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></span></button>`; }).join("");
    const activeQuestions = AppStore.questions().filter(q => q.active !== false).length, completed = answers.length, pending = answers.filter(a => a.status === "pending").length, graded = answers.filter(a => a.status === "graded").length;
    const resultRows = answers.map(a => { const q = AppStore.questions().find(x => x.id === a.questionId); const material = a.status === "graded" && a.correct === false ? materialLinks(q) || esc(q?.material) : ""; return `<tr><td>${esc(a.area)}</td><td>${esc(a.questionPrompt || q?.prompt || "Questão indisponível")}</td><td>${a.status === "pending" ? "Aguardando correção" : a.correct ? "Correta" : "Incorreta"}</td><td>${a.status === "pending" ? "—" : esc(a.teacherFeedback || "Sem comentário do professor")}</td><td>${material || "—"}</td></tr>`; }).join("");
    shell(user, `<div class="welcome"><div><h1>Olá, ${esc(user.name.split(" ")[0])}!</h1><p>A Eletrônica está presente na comunicação, na indústria e em equipamentos do cotidiano. Praticar situações reais ajuda a desenvolver habilidades de diagnóstico e projeto.</p></div></div>
      <div class="grid-cards student-stats"><div class="stat-card"><small>Questões respondidas</small><strong>${completed}</strong></div><div class="stat-card"><small>Questões disponíveis</small><strong>${activeQuestions}</strong></div><div class="stat-card"><small>Aguardando correção</small><strong>${pending}</strong></div><div class="stat-card"><small>Corrigidas</small><strong>${graded}</strong></div></div>
      <div class="notice">Responda às questões em sequência. Depois de enviar uma resposta, não será possível retornar à questão anterior.</div>
      <section class="panel" id="student-areas"><h2>Áreas de conhecimento e progresso</h2><div class="area-grid">${cards}</div></section>
      <section class="panel" id="student-results">${studentPerformance(answers)}<h3>Histórico de respostas</h3><div class="table-wrap"><table><thead><tr><th>Área</th><th>Questão</th><th>Resultado</th><th>Devolutiva</th><th>Material formativo</th></tr></thead><tbody>${resultRows || '<tr><td colspan="5">Você ainda não respondeu questões.</td></tr>'}</tbody></table></div></section>`);
    document.querySelectorAll("[data-area]").forEach(b => b.onclick = () => renderAreaIntro(user, Number(b.dataset.area)));
  }
  function renderAreaIntro(user, index) {
    const [area, description] = areas[index];
    shell(user, `<section class="panel"><h1>${esc(area)}</h1><p>${esc(description)}</p><div class="section-actions"><button class="btn btn-secondary" id="start-questions" type="button">Iniciar questões</button><button class="btn btn-outline" id="areas" type="button">Voltar às áreas</button></div></section>`);
    $("#start-questions").onclick = () => startArea(user, area);
    $("#areas").onclick = () => renderStudent(user);
  }
  function startArea(user, area) {
    const qs = AppStore.questions().filter(q => q.area === area && q.active !== false);
    const done = studentAnswers(user).map(a => a.questionId);
    const next = qs.find(q => !done.includes(q.id));
    if (!next) {
      shell(user, `<section class="panel"><h1>${qs.length ? "Área concluída" : "Nenhuma questão disponível"}</h1><p>${esc(area)}</p><div class="section-actions"><button class="btn btn-secondary" id="areas" type="button">Voltar às áreas</button><button class="btn btn-outline" data-destination="student-results" type="button">Ver resultados</button></div></section>`);
      $("#areas").onclick = () => renderStudent(user);
      return;
    }
    renderQuestion(user, area, qs, next);
  }
  function renderQuestion(user, area, questions, q) {
    const count = studentAnswers(user).filter(a => a.area === area && questions.some(item => item.id === a.questionId)).length + 1;
    const options = q.type === "objective" ? (q.options || []).map((o, i) => `<label class="option-row"><input type="radio" name="answer" value="${i}" required><span>${String.fromCharCode(65 + i)}. ${esc(o)}</span></label>`).join("") : `<div class="field"><label for="written-answer">Sua resposta</label><textarea id="written-answer" rows="6" required placeholder="Escreva sua resposta..."></textarea></div>`;
    shell(user, `<div class="welcome"><div><h1>${esc(area)}</h1><p>Questão ${count} de ${questions.length}</p></div><button class="btn btn-outline" id="back-area" type="button">Voltar às áreas</button></div>
      <section class="panel"><div class="notice">Atenção: ao enviar, sua resposta será registrada e esta questão não poderá ser respondida novamente.</div><h2>${esc(q.prompt)}</h2><form id="answer-form">${options}<div id="form-error" class="error" role="alert"></div><button class="btn btn-primary" type="submit">Enviar resposta</button></form></section>`);
    $("#back-area").onclick = () => renderStudent(user);
    $("#answer-form").onsubmit = e => {
      e.preventDefault(); let response; if (q.type === "objective") { const selected = $('input[name="answer"]:checked'); if (!selected) { showError("Selecione uma alternativa."); return; } response = Number(selected.value); } else { response = $("#written-answer").value.trim(); if (!response) { showError("Escreva sua resposta antes de enviar.", ["written-answer"]); return; } }
      if (studentAnswers(user).some(a => a.questionId === q.id)) { notify("Esta questão já foi respondida."); renderStudent(user); return; }
      const answer = { id: crypto.randomUUID(), questionId: q.id, questionPrompt: q.prompt, questionType: q.type, questionOptions: q.options ? [...q.options] : null, questionAnswerModel: q.answerModel || null, studentId: user.id, studentName: user.name, area, response, status: q.type === "objective" ? "graded" : "pending", correct: q.type === "objective" ? response === Number(q.correctIndex) : null, createdAt: new Date().toISOString() };
      AppStore.addAnswer(answer);
      if (q.type === "objective") renderObjectiveFeedback(user, area, questions, q, answer); else renderWrittenFeedback(user, area);
    };
  }
  function renderObjectiveFeedback(user, area, questions, q, answer) {
    const feedback = q.feedback || "Revise o conteúdo desta questão e tente aplicar o conceito em outros exemplos.";
    const chosen = q.options?.[Number(answer.response)] || "Alternativa não encontrada";
    const correct = q.options?.[Number(q.correctIndex)] || "Alternativa não encontrada";
    const support = materialLinks(q) || esc(q.material);
    const material = !answer.correct && support ? `<div class="notice"><strong>Material para estudar</strong>${support}</div>` : "";
    shell(user, `<section class="panel"><h1>${answer.correct ? "Resposta correta!" : "Resposta incorreta"}</h1><p><strong>Sua resposta:</strong> ${esc(chosen)}</p>${answer.correct ? "" : `<p><strong>Alternativa correta:</strong> ${esc(correct)}</p>`}<p>${esc(feedback)}</p>${material}<button class="btn btn-primary" id="continue" type="button">Continuar</button></section>`);
    $("#continue").onclick = () => startArea(user, area);
  }
  function renderWrittenFeedback(user, area) {
    shell(user, `<section class="panel"><h1>Resposta enviada</h1><p>Sua resposta dissertativa foi encaminhada ao professor para correção. O resultado aparecerá no seu histórico.</p><button class="btn btn-primary" id="continue" type="button">Continuar nesta área</button><button class="btn btn-outline" id="areas" type="button">Voltar às áreas</button></section>`);
    $("#continue").onclick = () => startArea(user, area); $("#areas").onclick = () => renderStudent(user);
  }
  function renderStudentResults(teacher, studentId) {
    const student = AppStore.users().find(u => u.id === studentId && u.role === "student");
    if (!student) { notify("Estudante não encontrado."); renderTeacher(teacher); return; }
    const answers = AppStore.answers().filter(a => a.studentId === studentId);
    const graded = answers.filter(a => a.status === "graded");
    const correct = graded.filter(a => a.correct).length;
    const errors = graded.length - correct;
    const rows = answers.map(a => { const q = AppStore.questions().find(x => x.id === a.questionId); const response = (a.questionType || q?.type) === "objective" ? ((a.questionOptions || q?.options)?.[Number(a.response)] || "Alternativa indisponível") : a.response; return `<tr><td>${esc(a.area)}</td><td>${esc(a.questionPrompt || q?.prompt || "Questão indisponível")}</td><td>${esc(response)}</td><td>${a.status === "pending" ? "Aguardando correção" : a.correct ? "Correta" : "Incorreta"}</td><td>${a.createdAt ? new Date(a.createdAt).toLocaleString("pt-BR") : "—"}</td><td>${a.gradedAt ? new Date(a.gradedAt).toLocaleString("pt-BR") : "—"}</td><td>${esc(a.teacherFeedback || "—")}</td></tr>`; }).join("");
    shell(teacher, `<div class="welcome"><div><h1>Desempenho do estudante</h1><p>${esc(student.name)} · ${esc(student.institution)} · ${esc(student.email)}</p></div><div class="role-actions"><button class="btn btn-outline" id="back-teacher" type="button">Voltar ao painel</button></div></div>
      <div class="grid-cards"><div class="stat-card"><small>Questões realizadas</small><strong>${answers.length}</strong></div><div class="stat-card"><small>Acertos</small><strong>${correct}</strong></div><div class="stat-card"><small>Erros</small><strong>${errors}</strong></div></div>
      
      <section class="panel"><h2>Respostas do estudante</h2><div class="table-wrap"><table><thead><tr><th>Área</th><th>Questão</th><th>Resposta</th><th>Resultado</th><th>Enviada em</th><th>Corrigida em</th><th>Devolutiva</th></tr></thead><tbody>${rows || '<tr><td colspan="7">Este estudante ainda não respondeu questões.</td></tr>'}</tbody></table></div></section>`);
    $("#back-teacher").onclick = () => renderTeacher(teacher);
  }
  function openQuestionEditor(user, q, trigger) {
    const fixedMaterial = AppStore.hasFixedMaterial(q.id);
    const dialog = document.createElement("dialog");
    dialog.className = "profile-dialog question-dialog";
    dialog.setAttribute("aria-labelledby", "question-editor-title");
    const objective = q.type === "objective";
    dialog.innerHTML = `
      <form>
        <div class="question-dialog-body">
        <h2 id="question-editor-title">Editar questão</h2>
        <p>${esc(q.area)} · ${objective ? "Objetiva" : "Dissertativa"}</p>
        <div class="field"><label for="edit-prompt">Enunciado</label><textarea id="edit-prompt" name="prompt" rows="4" required autofocus>${esc(q.prompt)}</textarea></div>
        ${objective ? `<div class="form-row">${[0, 1, 2, 3].map(index => `
          <div class="field"><label for="edit-option-${index}">Alternativa ${"ABCD"[index]}</label><input id="edit-option-${index}" name="option-${index}" value="${esc(q.options?.[index])}" required></div>
        `).join("")}</div>
        <div class="field"><label for="edit-correct">Alternativa correta</label><select id="edit-correct" name="correct">${[0, 1, 2, 3].map(index => `<option value="${index}" ${index === Number(q.correctIndex) ? "selected" : ""}>${"ABCD"[index]}</option>`).join("")}</select></div>`
        : `<div class="field"><label for="edit-model">Resposta esperada</label><textarea id="edit-model" name="model" rows="3" required>${esc(q.answerModel)}</textarea></div>`}
        <div class="field">
          <label for="edit-material">${fixedMaterial ? "Link de estudo fixo" : "Link de estudo (opcional)"}</label>
          <input id="edit-material" name="material" value="${esc(q.material)}" ${fixedMaterial ? 'readonly aria-describedby="fixed-material-hint"' : ""}>
          ${fixedMaterial ? '<small id="fixed-material-hint">Este material faz parte da questão e permanece vinculado a ela.</small>' : ""}
        </div>
        ${documentField("edit", q.materialDocument)}
        <div class="error" id="question-editor-error" role="alert"></div>
        </div>
        <div class="profile-dialog-actions">
          <button class="btn btn-outline" id="cancel-question-edit" type="button">Cancelar</button>
          <button class="btn profile-dialog-confirm" type="submit">Salvar alterações</button>
        </div>
      </form>`;
    $(".dashboard").append(dialog);
    const form = $("form", dialog);
    const error = $("#question-editor-error", dialog);
    function showEditorError(input, message) {
      error.textContent = message;
      input.setAttribute("aria-invalid", "true");
      input.focus();
    }
    form.oninput = event => {
      event.target.removeAttribute("aria-invalid");
      error.textContent = "";
    };
    $("#cancel-question-edit", dialog).onclick = () => dialog.close();
    dialog.onclose = () => {
      dialog.remove();
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
    form.onsubmit = async event => {
      event.preventDefault();
      const fields = form.elements;
      const prompt = fields.namedItem("prompt");
      const material = fields.namedItem("material");
      const patch = { prompt: prompt.value.trim(), material: material.value.trim(), updatedAt: new Date().toISOString() };
      if (!patch.prompt) { showEditorError(prompt, "Informe o enunciado."); return; }
      if (patch.material && patch.material !== q.material && !studyUrl(patch.material)) {
        showEditorError(material, "Informe um link de estudo válido (HTTP ou HTTPS).");
        return;
      }
      if (objective) {
        const options = [0, 1, 2, 3].map(index => fields.namedItem("option-" + index));
        const empty = options.find(input => !input.value.trim());
        if (empty) { showEditorError(empty, "Preencha as quatro alternativas."); return; }
        patch.options = options.map(input => input.value.trim());
        patch.correctIndex = Number(fields.namedItem("correct").value);
      } else {
        const model = fields.namedItem("model");
        patch.answerModel = model.value.trim();
        if (!patch.answerModel) { showEditorError(model, "Informe a resposta esperada."); return; }
      }
      const fileInput = fields.namedItem("document");
      const file = fileInput.files[0];
      if (file) {
        const submit = $('button[type="submit"]', form);
        submit.disabled = true;
        try { patch.materialDocument = await readStudyDocument(file); }
        catch (error) { showEditorError(fileInput, error.message); return; }
        finally { submit.disabled = false; }
      } else if (fields.namedItem("remove-document")?.checked) {
        patch.materialDocument = null;
      }
      if (!dialog.open) return;
      const account = currentUser();
      if (account?.id !== user.id || account.role !== "teacher") { renderDashboard(); return; }
      if (!AppStore.updateQuestion(q.id, patch)) {
        error.textContent = "Não foi possível salvar. Verifique o espaço de armazenamento do navegador.";
        return;
      }
      dialog.close();
      renderTeacher(account);
      $(`[data-edit-question="${CSS.escape(q.id)}"]`)?.focus();
      notify("Questão atualizada.");
    };
    dialog.showModal();
  }

  function renderTeacher(user) {
    const students = AppStore.users().filter(u => u.role === "student"), questions = AppStore.questions(), answers = AppStore.answers();
    const areaOptions = areas.map(a => '<option value="' + esc(a[0]) + '">' + esc(a[0]) + '</option>').join("");
    const pending = answers.filter(a => a.status === "pending").sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
    shell(user, `<div class="welcome"><div><h1 id="teacher-home">Painel do Professor</h1><p>Cadastre questões, acompanhe estudantes e corrija respostas dissertativas.</p></div></div>
      <div class="grid-cards"><div class="stat-card"><small>Estudantes</small><strong>${students.length}</strong></div><div class="stat-card"><small>Questões ativas</small><strong>${questions.filter(q => q.active !== false).length}</strong></div><div class="stat-card"><small>Aguardando correção</small><strong>${pending.length}</strong></div></div>
      <section class="panel"><h2>Cadastrar questão</h2><form id="question-form" novalidate>
        <div class="form-row"><div class="field"><label for="question-area">Área</label><select id="question-area" required><option value="">Selecione</option>${areaOptions}</select></div><div class="field"><label for="question-type">Tipo</label><select id="question-type"><option value="objective">Objetiva</option><option value="written">Dissertativa</option></select></div></div>
        <div class="field"><label for="question-prompt">Enunciado</label><textarea id="question-prompt" rows="3" required></textarea></div>
        <div id="objective-fields"><div class="field"><label for="option-0">Alternativa A</label><input id="option-0"></div><div class="field"><label for="option-1">Alternativa B</label><input id="option-1"></div><div class="field"><label for="option-2">Alternativa C</label><input id="option-2"></div><div class="field"><label for="option-3">Alternativa D</label><input id="option-3"></div><div class="field"><label for="question-correct">Alternativa correta</label><select id="question-correct"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></div></div>
        <div class="field"><label for="question-material">Link de estudo (opcional)</label><input id="question-material" placeholder="https://…"></div>
        ${documentField("question")}
        <div id="model-field" hidden><div class="field"><label for="question-model">Resposta esperada (somente professor)</label><textarea id="question-model" rows="3"></textarea></div></div>
        <div id="form-error" class="error" role="alert"></div><button class="btn btn-primary" type="submit" style="width:auto">Salvar questão</button></form></section>
      <section class="panel" id="teacher-question-management"><h2>Gerenciar questões</h2><p class="muted-note">Questões desativadas deixam de aparecer para novos estudantes. O histórico de respostas é preservado.</p><div id="question-management">${questions.slice().sort((a, b) => a.area.localeCompare(b.area, "pt-BR")).map(q => `<article class="review-card"><div class="welcome"><div><strong>${esc(q.area)} · ${q.type === "objective" ? "Objetiva" : "Dissertativa"}</strong><p>${esc(q.prompt)}</p><span class="muted-note">${q.active === false ? "Desativada" : "Ativa"}</span></div><div class="review-actions"><button class="btn btn-outline" type="button" data-edit-question="${q.id}">Editar</button>${q.active === false ? `<button class="btn btn-secondary" type="button" data-reactivate-question="${q.id}">Reativar</button>` : `<button class="btn btn-outline" type="button" data-deactivate-question="${q.id}">Desativar</button>`}</div></div></article>`).join("") || '<p class="empty">Nenhuma questão cadastrada.</p>'}</div></section>
      <section class="panel"><div class="welcome"><h2>Respostas dissertativas pendentes</h2></div><div id="pending-list">${pending.map(a => { const q = questions.find(x => x.id === a.questionId); return `<article class="review-card" ><strong>${esc(a.studentName)} · ${esc(a.area)}</strong><p><small>Enviada em: ${a.createdAt ? new Date(a.createdAt).toLocaleString("pt-BR") : "Data não registrada"}</small></p><p>${esc(a.questionPrompt || q?.prompt || "Questão")}</p><blockquote>${esc(a.response)}</blockquote><details><summary>Consultar resposta esperada</summary><p>${esc(a.questionAnswerModel || q?.answerModel || "Não informada")}</p></details><div class="field"><label for="teacher-feedback-${a.id}">Devolutiva ao estudante (opcional)</label><textarea id="teacher-feedback-${a.id}" rows="2" placeholder="Oriente o estudante sobre a resposta..."></textarea></div><div class="review-actions"><button class="btn btn-secondary" data-grade="${a.id}" data-correct="true" type="button">Marcar correta</button><button class="btn btn-outline" data-grade="${a.id}" data-correct="false" type="button">Marcar incorreta</button></div></article>`; }).join("") || '<p class="empty">Nenhuma resposta aguardando correção.</p>'}</div></section>
      <section class="panel" id="teacher-students"><h2>Estudantes cadastrados</h2><div class="field"><label for="student-search">Buscar estudante por nome ou e-mail</label><input id="student-search" type="search" placeholder="Digite para filtrar"></div><div class="table-wrap"><table><thead><tr><th>Nome</th><th>Instituição</th><th>E-mail</th><th>Desempenho</th></tr></thead><tbody id="student-table-body">${students.map(s => `<tr data-student-row><td>${esc(s.name)}</td><td>${esc(s.institution)}</td><td>${esc(s.email)}</td><td><button class="text-button" type="button" data-student-results="${s.id}">Ver resultados</button></td></tr>`).join("") || '<tr><td colspan="4">Nenhum estudante cadastrado.</td></tr>'}</tbody></table></div></section>
      `);
    const type = $("#question-type"), objective = $("#objective-fields"), model = $("#model-field");
    function updateType() { const isObj = type.value === "objective"; objective.hidden = !isObj; model.hidden = isObj;[0, 1, 2, 3].forEach(i => $("#option-" + i).required = isObj); $("#question-model").required = !isObj; }
    type.onchange = updateType; updateType(); const form = $("#question-form"); clearError(form);
    form.onsubmit = async e => {
      e.preventDefault(); const area = $("#question-area").value, prompt = $("#question-prompt").value.trim(), kind = type.value; if (!area) { showError("Selecione uma área.", ["question-area"]); return; } if (!prompt) { showError("Digite o enunciado.", ["question-prompt"]); return; }
      const q = { id: crypto.randomUUID(), area, prompt, type: kind, material: $("#question-material").value.trim(), createdBy: user.id };
      if (q.material && !studyUrl(q.material)) { showError("Informe um link de estudo válido (HTTP ou HTTPS).", ["question-material"]); return; }
      if (kind === "objective") { const opts = [0, 1, 2, 3].map(i => $("#option-" + i).value.trim()); if (opts.some(x => !x)) { showError("Preencha as quatro alternativas.", ["option-0"]); return; } q.options = opts; q.correctIndex = Number($("#question-correct").value); q.answerModel = null; }
      else { q.answerModel = $("#question-model").value.trim(); if (!q.answerModel) { showError("Informe a resposta esperada.", ["question-model"]); return; } q.options = null; q.correctIndex = null; }
      const fileInput = $("#question-document");
      const file = fileInput.files[0];
      if (file) {
        const submit = $('button[type="submit"]', form);
        submit.disabled = true;
        try { q.materialDocument = await readStudyDocument(file); }
        catch (error) {
          if (form.isConnected) showError(error.message, ["question-document"]);
          return;
        } finally { submit.disabled = false; }
      }
      if (!form.isConnected) return;
      const account = currentUser();
      if (account?.id !== user.id || account.role !== "teacher") { renderDashboard(); return; }
      q.createdAt = new Date().toISOString();
      if (!AppStore.addQuestion(q)) {
        showError("Não foi possível salvar. Verifique o espaço de armazenamento do navegador.");
        return;
      }
      notify("Questão cadastrada.");
      renderTeacher(account);
    };
    document.querySelectorAll("[data-edit-question]").forEach(button => button.onclick = () => {
      const question = AppStore.questions().find(item => item.id === button.dataset.editQuestion);
      if (question) openQuestionEditor(user, question, button);
    });
    document.querySelectorAll("[data-deactivate-question]").forEach(button => button.onclick = () => { const q = AppStore.questions().find(item => item.id === button.dataset.deactivateQuestion); if (!q || !window.confirm("Desativar esta questão? O histórico dos estudantes será preservado.")) return; AppStore.deactivateQuestion(q.id); renderTeacher(currentUser()); notify("Questão desativada."); });
    document.querySelectorAll("[data-reactivate-question]").forEach(button => button.onclick = () => { const q = AppStore.questions().find(item => item.id === button.dataset.reactivateQuestion); if (!q) return; if (!AppStore.updateQuestion(q.id, { active: true })) { notify("Não foi possível reativar a questão."); return; } renderTeacher(currentUser()); notify("Questão reativada."); });
    $("#student-search").oninput = e => { const term = e.target.value.trim().toLocaleLowerCase("pt-BR"); document.querySelectorAll("[data-student-row]").forEach(row => { row.hidden = !row.textContent.toLocaleLowerCase("pt-BR").includes(term); }); };
    document.querySelectorAll("[data-grade]").forEach(button => button.onclick = () => { const correct = button.dataset.correct === "true"; const feedback = $("#teacher-feedback-" + button.dataset.grade)?.value.trim() || ""; AppStore.updateAnswer(button.dataset.grade, { status: "graded", correct, teacherFeedback: feedback, gradedBy: user.id, gradedAt: new Date().toISOString() }); renderTeacher(currentUser()); notify("Resposta corrigida e devolutiva registrada."); });
    document.querySelectorAll("[data-student-results]").forEach(button => button.onclick = () => renderStudentResults(user, button.dataset.studentResults));
  }
  function renderAdmin(user) {
    const users = AppStore.users();
    shell(user, `<div class="welcome"><div><h1 id="admin-home">Painel Administrativo</h1><p>Gerencie os usuários e cadastre professores.</p></div></div>
      <div class="grid-cards"><div class="stat-card"><small>Total de usuários</small><strong>${users.length}</strong></div><div class="stat-card"><small>Estudantes</small><strong>${users.filter(u => u.role === "student").length}</strong></div><div class="stat-card"><small>Professores</small><strong>${users.filter(u => u.role === "teacher").length}</strong></div><div class="stat-card"><small>Administradores</small><strong>${users.filter(u => u.role === "admin").length}</strong></div></div>
      <section class="panel"><h2>Cadastrar professor</h2><form id="teacher-form" novalidate><div class="form-row">${field("Nome completo", "teacher-name")}${field("E-mail", "teacher-email", "email")}</div><div class="form-row">${field("Instituição", "teacher-institution")}${field("Senha provisória", "teacher-password", "password")}</div><div id="form-error" class="error" role="alert"></div><button class="btn btn-primary" type="submit" style="width:auto">Cadastrar professor</button></form></section>
      <section class="panel" id="user-management"><div class="welcome"><h2>Usuários cadastrados</h2></div><div class="field"><label for="user-role-filter">Filtrar por perfil</label><select id="user-role-filter"><option value="">Todos</option><option value="teacher">Professores</option><option value="student">Estudantes</option><option value="admin">Administradores</option></select></div><div class="field"><label for="user-search">Buscar usuário por nome ou e-mail</label><input id="user-search" type="search" placeholder="Digite para filtrar"></div><div class="table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Instituição</th><th>Perfil</th><th>Gerenciar</th></tr></thead><tbody>${users.map(u => `<tr data-user-row data-role="${u.role}"><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.institution)}</td><td>${labels[u.role]}</td><td>${u.role === "admin" ? "Conta protegida" : `<select data-user-role="${u.id}" aria-label="Perfil de ${esc(u.name)}"><option value="student" ${u.role === "student" ? "selected" : ""}>Estudante</option><option value="teacher" ${u.role === "teacher" ? "selected" : ""}>Professor</option></select>`}</td></tr>`).join("")}</tbody></table></div></section>`);
    passwordToggle("teacher-password"); const form = $("#teacher-form"); clearError(form);
    function filterUsers() {
      const term = $("#user-search").value.trim().toLocaleLowerCase("pt-BR");
      const role = $("#user-role-filter").value;
      document.querySelectorAll("[data-user-row]").forEach(row => {
        row.hidden = Boolean(role && row.dataset.role !== role) || !row.textContent.toLocaleLowerCase("pt-BR").includes(term);
      });
    }
    $("#user-search").oninput = filterUsers;
    $("#user-role-filter").onchange = filterUsers;
    $(".dashboard").insertAdjacentHTML("beforeend", `
      <dialog class="profile-dialog" id="profile-dialog" aria-labelledby="profile-dialog-title" aria-describedby="profile-dialog-summary">
        <form method="dialog">
          <h2 id="profile-dialog-title">Alterar perfil</h2>
          <p id="profile-dialog-summary"><strong id="profile-dialog-name"></strong> passará de <strong id="profile-dialog-current"></strong> para <strong id="profile-dialog-next"></strong>.</p>
          <div class="profile-dialog-actions">
            <button class="btn btn-outline" type="submit" value="cancel" autofocus>Cancelar</button>
            <button class="btn profile-dialog-confirm" type="submit" value="confirm">Confirmar alteração</button>
          </div>
        </form>
      </dialog>
    `);
    const profileDialog = $("#profile-dialog");
    document.querySelectorAll("[data-user-role]").forEach(select => select.onchange = () => {
      const target = AppStore.users().find(item => item.id === select.dataset.userRole);
      if (!target || target.role === "admin") { renderAdmin(currentUser()); return; }
      const nextRole = select.value;
      select.value = target.role;
      if (nextRole === target.role) return;

      $("#profile-dialog-name").textContent = target.name;
      $("#profile-dialog-current").textContent = labels[target.role];
      $("#profile-dialog-next").textContent = labels[nextRole];
      profileDialog.returnValue = "";
      profileDialog.onclose = () => {
        if (profileDialog.returnValue !== "confirm") { select.focus({ preventScroll: true }); return; }
        const search = $("#user-search").value;
        const role = $("#user-role-filter").value;
        AppStore.updateUser(target.id, { role: nextRole });
        renderAdmin(currentUser());
        $("#user-search").value = search;
        const roleFilter = $("#user-role-filter");
        roleFilter.value = role;
        roleFilter.dispatchEvent(new Event("change"));
        const updatedSelect = $(`[data-user-role="${CSS.escape(target.id)}"]`);
        const focusTarget = updatedSelect && !updatedSelect.closest("tr").hidden ? updatedSelect : roleFilter;
        focusTarget.focus();
        notify("Perfil atualizado.");
      };
      profileDialog.showModal();
    });
    form.onsubmit = e => { e.preventDefault(); const name = $("#teacher-name").value.trim(), email = $("#teacher-email").value.trim().toLowerCase(), institution = $("#teacher-institution").value.trim(), password = $("#teacher-password").value; if (name.length < 3) { showError("Informe o nome completo.", ["teacher-name"]); return; } if (!$("#teacher-email").checkValidity()) { showError("Informe um e-mail válido.", ["teacher-email"]); return; } if (!institution) { showError("Informe a instituição.", ["teacher-institution"]); return; } if (password.length < 6) { showError("A senha deve ter pelo menos 6 caracteres.", ["teacher-password"]); return; } if (AppStore.userByEmail(email)) { showError("Este e-mail já está cadastrado.", ["teacher-email"]); return; } AppStore.addUser({ id: crypto.randomUUID(), name, email, institution, password, role: "teacher" }); renderAdmin(currentUser()); notify("Professor cadastrado."); };
  }
  function renderDashboard() { const user = currentUser(); if (!user) { renderLogin(); return; } if (user.role === "student") renderStudent(user); else if (user.role === "teacher") renderTeacher(user); else if (user.role === "admin") renderAdmin(user); else logout(); }
  if (currentUser()) renderDashboard(); else renderLogin();
})();
