/* Persistência local para demonstração acadêmica. Não substitui autenticação de produção. */
(() => {
  const KEY = "conecta-eletron-v1";
  const SESSION_KEY = "conecta-eletron-session";
  const seed = {
    users: [
      {id:"u-admin",name:"Administrador",email:"admin@conectaeletron.com",institution:"Conecta Elétron",password:"admin123",role:"admin"},
      {id:"u-prof",name:"Professora Cíntia",email:"professor@conectaeletron.com",institution:"UCSAL",password:"prof123",role:"teacher"},
      {id:"u-student",name:"Gabrielle Santos",email:"estudante@conectaeletron.com",institution:"UCSAL",password:"aluno123",role:"student"}
    ],
    questions: [
      {id:"q-demo-01",area:"Eletrônica Digital",type:"objective",prompt:"Uma porta lógica AND possui entradas A = 1 e B = 0. Qual é o valor da saída?",options:["1 — nível lógico alto","0 — nível lógico baixo","A saída alterna entre 0 e 1","Não é possível determinar"],correctIndex:1,feedback:"A porta AND só produz saída 1 quando todas as entradas são 1. Como uma das entradas é 0, a saída também é 0.",material:"Revise a tabela-verdade da porta lógica AND.",createdBy:"u-prof"},
      {id:"q-demo-02",area:"Eletrônica Analógica",type:"objective",prompt:"Qual grandeza elétrica é medida em ohms (Ω)?",options:["Tensão elétrica","Corrente elétrica","Resistência elétrica","Potência elétrica"],correctIndex:2,feedback:"O ohm (Ω) é a unidade de medida da resistência elétrica.",material:"Estude as grandezas elétricas e a Lei de Ohm.",createdBy:"u-prof"},
      {id:"q-demo-03",area:"Sistemas Microprocessados",type:"objective",prompt:"Qual alternativa descreve melhor um microcontrolador?",options:["Um componente que integra processador, memória e periféricos","Um resistor de potência variável","Um dispositivo usado somente para amplificar áudio","Uma fonte que converte corrente alternada em contínua"],correctIndex:0,feedback:"O microcontrolador reúne CPU, memória e periféricos em um único circuito integrado.",material:"Revise a arquitetura básica de microcontroladores.",createdBy:"u-prof"},
      {id:"q-demo-04",area:"Eletrônica de Potência",type:"objective",prompt:"Qual é a função básica de um retificador?",options:["Converter corrente contínua em alternada","Converter corrente alternada em contínua","Armazenar dados digitais","Amplificar sinais de áudio"],correctIndex:1,feedback:"O retificador utiliza diodos para converter corrente alternada em corrente contínua pulsante.",material:"Estude circuitos retificadores com diodos.",createdBy:"u-prof"},
      {id:"q-demo-05",area:"Manutenção",type:"objective",prompt:"Antes de abrir um equipamento eletrônico para manutenção, qual deve ser uma das primeiras medidas?",options:["Aumentar a tensão de alimentação","Desconectar a alimentação e verificar condições de segurança","Retirar todos os componentes da placa","Ligar o equipamento sem a carcaça"],correctIndex:1,feedback:"Desenergizar o equipamento e verificar os procedimentos de segurança reduz riscos de choque e danos.",material:"Consulte os procedimentos de segurança para manutenção eletrônica.",createdBy:"u-prof"},
      {id:"q-demo-06",area:"Eletrônica Digital",type:"written",prompt:"Explique, com suas palavras, por que a saída de uma porta AND é 0 quando A = 1 e B = 0.",answerModel:"A porta AND só apresenta saída 1 quando todas as entradas são 1. Como B está em 0, a condição não é atendida e a saída permanece em 0.",feedback:"Explique a condição necessária para a saída da porta AND assumir nível lógico alto.",material:"Revise a tabela-verdade da porta lógica AND.",createdBy:"u-prof"}
    ],
    answers: []
  };
  const demoLessons = [
    ["porta-and", "Uma prensa didática só pode liberar um aviso de operação quando a proteção estiver fechada (A) e o botão de partida estiver pressionado (B). Neste instante, A = 1 e B = 0. Qual é a saída da porta AND que controla o aviso?"],
    ["lei-de-ohm", "Ao consultar a ficha de um sensor, uma técnica encontra a especificação de 220 Ω entre dois terminais. Qual grandeza elétrica a ficha está indicando?"],
    ["microcontroladores", "Uma equipe projeta um controlador de irrigação que lê um sensor, executa um programa e aciona uma saída. Qual alternativa descreve o microcontrolador que pode reunir essas funções?"],
    ["retificadores", "Uma fonte de bancada recebe tensão alternada de um transformador e precisa alimentar um circuito em corrente contínua. Qual é a função do estágio retificador?"],
    ["manutencao", "Um equipamento apresentou falha intermitente e será encaminhado para inspeção da placa. Antes de abrir o gabinete, qual deve ser uma das primeiras medidas?"],
    ["porta-and", "Em uma esteira didática, A = 1 indica que há uma peça e B = 1 indica que a área está livre. O sinal de avanço é a saída A AND B. Explique por que a esteira não deve avançar quando A = 1 e B = 0."]
  ];
  const demoMaterialOverrides = {
    "q-demo-01": "materials/guia_portas_logicas.pdf",
    "q-demo-02": "https://www.youtube.com/watch?v=qQCEnluIids",
    "q-demo-03": "https://www.youtube.com/watch?v=YvuzPfLWHCE",
    "q-demo-04": "https://www.youtube.com/watch?v=8ghQla9n4pE",
    "q-demo-05": "https://www.youtube.com/watch?v=vsEseS0v4ek",
    "q-demo-06": "https://www.youtube.com/watch?v=aYVz0l3ZMWc&t=128s"
  };
  const retiredMaterialLinks = new Map();
  const demoUpdates = new Map(seed.questions.map((question,index)=>{
    const [topic,prompt]=demoLessons[index];
    const legacyPrompt=question.prompt;
    question.material=demoMaterialOverrides[question.id];
    const oldLink="material-formativo.html#"+topic;
    if(!retiredMaterialLinks.has(oldLink))retiredMaterialLinks.set(oldLink,question.material);
    question.prompt=prompt;
    return [question.id,{legacyPrompt,prompt}];
  }));

  function migrateQuestion(question,answers){
    const material=Object.hasOwn(demoMaterialOverrides,question.id)
      ?demoMaterialOverrides[question.id]
      :retiredMaterialLinks.get(question.material);
    if(material)question.material=material;
    const update=demoUpdates.get(question.id);
    if(!update)return;
    if(question.prompt===update.legacyPrompt&&!answers.some(answer=>answer.questionId===question.id)){
      question.prompt=update.prompt;
    }
  }
  function safePersist(value) {
    try { localStorage.setItem(KEY, JSON.stringify(value)); return true; }
    catch (error) { console.error("Não foi possível salvar os dados locais.", error); return false; }
  }
  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) { safePersist(seed); return structuredClone(seed); }
      const data = JSON.parse(saved);
      const valid = data && typeof data === "object" && !Array.isArray(data);
      const recovered = {
        users: valid && Array.isArray(data.users) ? data.users.filter(u => u && typeof u.id === "string" && typeof u.email === "string" && ["admin","teacher","student"].includes(u.role)) : structuredClone(seed.users),
        questions: valid && Array.isArray(data.questions) && data.questions.length ? data.questions.filter(q => q && typeof q.id === "string" && typeof q.prompt === "string" && typeof q.area === "string") : structuredClone(seed.questions),
        answers: valid && Array.isArray(data.answers) ? data.answers.filter(a => a && typeof a.id === "string" && typeof a.studentId === "string") : []
      };
      if (!recovered.users.length) recovered.users = structuredClone(seed.users);
      if (!recovered.questions.length) recovered.questions = structuredClone(seed.questions);
      recovered.questions.forEach(question=>migrateQuestion(question,recovered.answers));
      safePersist(recovered);
      return recovered;
    } catch (error) {
      console.warn("Dados locais inválidos; a demonstração foi restaurada.", error);
      safePersist(seed);
      return structuredClone(seed);
    }
  }
  let state = load();
  function persist(){ return safePersist(state); }

  function updateOwnAccount(expectedId, change){
    try {
      if(localStorage.getItem(SESSION_KEY)!==expectedId)return "session";
      const latest=JSON.parse(localStorage.getItem(KEY));
      const user=latest?.users.find(item=>item.id===expectedId);
      if(!user)return "session";
      const error=change(user);
      if(error)return error;
      if(!safePersist(latest))return "storage";
      state=latest;
      return "saved";
    } catch {
      return "storage";
    }
  }

  window.AppStore = {
    all(){ return structuredClone(state); },
    users(){ return structuredClone(state.users); },
    questions(){ return structuredClone(state.questions); },
    answers(){ return structuredClone(state.answers); },
    userByEmail(email){ return state.users.find(u=>u.email.toLowerCase()===email.toLowerCase())||null; },
    addUser(user){ state.users.push(user); persist(); return user; },
    updateUser(id,patch){ const item=state.users.find(u=>u.id===id); if(!item)return false; Object.assign(item,patch); persist(); return true; },
    changeOwnPassword(expectedId,currentPassword,newPassword){
      return updateOwnAccount(expectedId,user=>{
        if(user.password!==currentPassword)return "password";
        if(typeof newPassword!=="string"||newPassword.trim().length<6||newPassword===currentPassword)return "invalid";
        user.password=newPassword;
      });
    },
    setOwnPhoto(expectedId,photo){
      return updateOwnAccount(expectedId,user=>{
        if(photo!==null&&(typeof photo!=="string"||photo.length>100000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(photo)))return "invalid";
        if(photo===null)delete user.photo;
        else user.photo=photo;
      });
    },
    addQuestion(question){
      state.questions.push({...question,active:question.active!==false});
      if(persist())return true;
      state.questions.pop();
      return false;
    },
    updateQuestion(id,patch){
      const index=state.questions.findIndex(q=>q.id===id);
      if(index===-1)return false;
      const previous=state.questions[index];
      state.questions[index]={...previous,...patch};
      if(Object.hasOwn(demoMaterialOverrides,id)){
        state.questions[index].material=demoMaterialOverrides[id];
      }
      if(persist())return true;
      state.questions[index]=previous;
      return false;
    },
    hasFixedMaterial(id){ return Object.hasOwn(demoMaterialOverrides,id); },
    deactivateQuestion(id){ const item=state.questions.find(q=>q.id===id); if(!item)return false; item.active=false; persist(); return true; },
    addAnswer(answer){ state.answers.push(answer); persist(); },
    updateAnswer(id,patch){ const item=state.answers.find(a=>a.id===id); if(!item)return false; Object.assign(item,patch); persist(); return true; },
    reset(){ state=structuredClone(seed); persist(); }
  };
})();
