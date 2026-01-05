console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  /* ================= SUPABASE ================= */
  const supabase = window.supabase.createClient(
    "https://figkamlmpangolnasaby.supabase.co",
    "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL"
  );

  /* ================= ESTADO ================= */
  let dados = [];
  let grafico = null;
  let graficoMensal = null;
  let idEmEdicao = null;

  const LIMITE_FREE = 30;
  let planoUsuario = "FREE";

  /* ================= CATEGORIAS ================= */
  const categoriasPorTipo = {
    Receita: ["Salário", "Renda Extra", "Mesada", "Freelance", "Vendas", "Outros"],
    Despesa: ["Moradia", "Saúde", "Cartão de Crédito", "Alimentação", "Transporte", "Compras diversas", "Lazer", "Outros"],
    Investimento: ["Renda Fixa", "Ações", "Criptomoedas", "Outros"]
  };

  /* ================= ELEMENTOS ================= */
  const loginContainer = document.getElementById("login-container");
  const app = document.getElementById("app");
  const dashboard = document.getElementById("dashboard");
  const lancamentos = document.getElementById("lancamentos");

  const nomeCliente = document.getElementById("nomeCliente");

  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const aceiteTermos = document.getElementById("aceiteTermos");

  const btnLogin = document.getElementById("btnLogin");
  const btnCadastro = document.getElementById("btnCadastro");
  const btnLogout = document.getElementById("btnLogout");
  const btnEsqueciSenha = document.getElementById("btnEsqueciSenha");

  const btnDashboard = document.getElementById("btnDashboard");
  const btnLancamentos = document.getElementById("btnLancamentos");
  const btnSalvar = document.getElementById("btnSalvar");

  const tipo = document.getElementById("tipo");
  const categoria = document.getElementById("categoria");
  const descricao = document.getElementById("descricao");
  const valor = document.getElementById("valor");
  const dataInput = document.getElementById("data");

  const filtroMes = document.getElementById("filtroMes");
  const filtroAno = document.getElementById("filtroAno");
  const btnLimparFiltro = document.getElementById("btnLimparFiltro");

  const totalReceitas = document.getElementById("totalReceitas");
  const totalDespesas = document.getElementById("totalDespesas");
  const totalInvestimentos = document.getElementById("totalInvestimentos");
  const saldo = document.getElementById("saldo");

  const lista = document.getElementById("listaLancamentos");
  const tipoGrafico = document.getElementById("tipoGrafico");
  tipoGrafico.onchange = atualizarDashboard;

  const btnMenu = document.getElementById("btnMenu");
  const sidebar = document.querySelector(".sidebar");

  /* ================= EVENT DELEGATION (BLINDADO) ================= */
  lista.addEventListener("click", (e) => {
  const btnEditar = e.target.closest(".btn-acao.editar");
  const btnExcluir = e.target.closest(".btn-acao.excluir");

  if (btnEditar) {
    const id = btnEditar.dataset.id; // UUID string
    editar(id);
  }

  if (btnExcluir) {
    const id = btnExcluir.dataset.id; // UUID string
    excluir(id);
  }
});


  /* ================= CATEGORIAS ================= */
  function popularCategorias(tipoSelecionado, categoriaSelecionada = "") {
    categoria.innerHTML = "<option value=''>Categoria</option>";
    if (!categoriasPorTipo[tipoSelecionado]) return;

    categoriasPorTipo[tipoSelecionado].forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      if (cat === categoriaSelecionada) option.selected = true;
      categoria.appendChild(option);
    });
  }

  tipo.onchange = () => popularCategorias(tipo.value);

  /* ================= AUTH ================= */
  btnLogin.onclick = async () => {
    if (!aceiteTermos.checked) return alert("Você precisa aceitar os termos.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: senhaInput.value
    });

    if (error) return alert(error.message);
    iniciarSessao(data.user);
  };

  btnCadastro.onclick = async () => {
    if (!aceiteTermos.checked) return alert("Você precisa aceitar os termos.");

    const { error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: senhaInput.value,
      options: { data: { nome: emailInput.value.split("@")[0] } }
    });

    if (error) return alert(error.message);
    alert("Conta criada! Confirme no email.");
  };

  btnEsqueciSenha.onclick = async (e) => {
    e.preventDefault();
    if (!emailInput.value) return alert("Informe o email.");
    await supabase.auth.resetPasswordForEmail(emailInput.value);
    alert("Email enviado.");
  };

  btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    app.classList.add("hidden");
    app.style.display = "none";
    loginContainer.style.display = "flex";
  };

  /* ================= CORE ================= */
  async function iniciarSessao(user) {
    console.log("USER LOGADO ID:", user.id);
    loginContainer.style.display = "none";
    app.style.display = "flex";
    app.classList.remove("hidden");

    dashboard.classList.remove("hidden");
    lancamentos.classList.add("hidden");

    nomeCliente.innerText = `Olá, ${user.user_metadata?.nome || user.email.split("@")[0]}!`;

    await carregarDados();
    atualizarDashboard();
    renderizarLista();
  }

  async function carregarDados() {
    const { data } = await supabase.from("lancamentos").select("*");
    dados = data || [];
  }

  /* ================= SALVAR / EDITAR ================= */
  btnSalvar.onclick = async () => {
  if (!tipo.value || !categoria.value || !valor.value || !dataInput.value)
    return alert("Preencha todos os campos.");

  if (planoUsuario === "FREE" && dados.length >= LIMITE_FREE && !idEmEdicao)
    return alert("Limite do plano gratuito atingido.");

  const user = (await supabase.auth.getUser()).data.user;

  if (idEmEdicao) {
    await supabase
      .from("lancamentos")
      .update({
        tipo: tipo.value,
        categoria: categoria.value,
        descricao: descricao.value,
        valor: Number(valor.value),
        data: dataInput.value
      })
      .eq("id", idEmEdicao);

    idEmEdicao = null;
  } else {
    await supabase.from("lancamentos").insert({
      user_id: user.id, // 🔥 ESSENCIAL PARA RLS
      tipo: tipo.value,
      categoria: categoria.value,
      descricao: descricao.value,
      valor: Number(valor.value),
      data: dataInput.value
    });
  }

  await carregarDados();
  atualizarDashboard();
  renderizarLista();
  limparFormulario();
};


  function limparFormulario() {
    tipo.value = "";
    categoria.innerHTML = "";
    descricao.value = "";
    valor.value = "";
    dataInput.value = "";
  }

  /* ================= FILTROS ================= */
  filtroMes.onchange = atualizarDashboard;
  if (filtroAno) filtroAno.onchange = atualizarDashboard;

  btnLimparFiltro.onclick = () => {
    filtroMes.value = "";
    if (filtroAno) filtroAno.value = "";
    atualizarDashboard();
  };

  /* ================= DASHBOARD ================= */
  function atualizarDashboard() {
    let filtrados = [...dados];

    if (filtroMes.value)
      filtrados = filtrados.filter(l => l.data.startsWith(filtroMes.value));
    if (filtroAno && filtroAno.value)
      filtrados = filtrados.filter(l => l.data.startsWith(filtroAno.value));

    let r = 0, d = 0, i = 0;
    filtrados.forEach(l => {
      if (l.tipo === "Receita") r += l.valor;
      if (l.tipo === "Despesa") d += l.valor;
      if (l.tipo === "Investimento") i += l.valor;
    });

    totalReceitas.innerText = `R$ ${r.toFixed(2)}`;
    totalDespesas.innerText = `R$ ${d.toFixed(2)}`;
    totalInvestimentos.innerText = `R$ ${i.toFixed(2)}`;
    saldo.innerText = `R$ ${(r - d).toFixed(2)}`;

    renderizarGrafico(r, d, i);
    renderizarGraficoMensal();
  }

  function renderizarGrafico(r, d, i) {
    if (grafico) grafico.destroy();
    grafico = new Chart(document.getElementById("grafico"), {
      type: "pie",
      data: {
        labels: ["Receitas", "Despesas", "Investimentos"],
        datasets: [{ data: [r, d, i] }]
      },
      options: { responsive: true }
    });
  }

  function renderizarGrafico(r, d, i) {
  if (grafico) grafico.destroy();

  let labels = [];
  let valores = [];

  if (tipoGrafico.value === "categoria") {
    const categorias = {};

    dados.forEach(l => {
      if (!categorias[l.categoria]) categorias[l.categoria] = 0;
      categorias[l.categoria] += l.valor;
    });

    labels = Object.keys(categorias);
    valores = Object.values(categorias);
  } else {
    labels = ["Receitas", "Despesas", "Investimentos"];
    valores = [r, d, i];
  }

  grafico = new Chart(document.getElementById("grafico"), {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: valores
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

  /* ================= LISTA ================= */
  function renderizarLista() {
    lista.innerHTML = "";
    dados.forEach(l => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="linha-info">
          <strong>${l.data}</strong> – ${l.tipo} • ${l.categoria} • R$ ${l.valor}
        </div>
        <div class="linha-acoes">
          <button type="button" class="btn-acao editar" data-id="${l.id}">✏️</button>
          <button type="button" class="btn-acao excluir" data-id="${l.id}">🗑</button>
        </div>
      `;
      lista.appendChild(li);
    });
  }

  /* ================= EDITAR ================= */
  window.editar = (id) => {
    const l = dados.find(d => d.id === id);
    if (!l) return;

    idEmEdicao = id;
    tipo.value = l.tipo;
    popularCategorias(l.tipo, l.categoria);
    descricao.value = l.descricao;
    valor.value = l.valor;
    dataInput.value = l.data;

    dashboard.classList.add("hidden");
    lancamentos.classList.remove("hidden");
  };

  /* ================= EXCLUIR ================= */
  window.excluir = async (id) => {
    if (!confirm("Excluir lançamento?")) return;

    const { error } = await supabase.from("lancamentos").delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir lançamento.");
      console.error(error);
      return;
    }

    await carregarDados();
    atualizarDashboard();
    renderizarLista();
  };

  /* ================= NAVEGAÇÃO ================= */
 btnDashboard.onclick = () => {
  dashboard.classList.remove("hidden");
  lancamentos.classList.add("hidden");
  sidebar.classList.remove("active"); // 🔥 fecha menu
};

btnLancamentos.onclick = () => {
  dashboard.classList.add("hidden");
  lancamentos.classList.remove("hidden");
  sidebar.classList.remove("active"); // 🔥 fecha menu
};

btnLogout.onclick = async () => {
  await supabase.auth.signOut();
  sidebar.classList.remove("active"); // 🔥 fecha menu
  app.classList.add("hidden");
  app.style.display = "none";
  loginContainer.style.display = "flex";
};

  /* ================= MENU ================= */
  if (btnMenu && sidebar) {
   btnMenu.onclick = () => 
  sidebar.classList.toggle("active");
};


});
