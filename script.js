console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  /* ================= SUPABASE ================= */
  const supabase = window.supabase.createClient(
    "https://figkamlmpangolnasaby.supabase.co",
    "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL"
  );

  /* ================= AUTO LOGIN (RESTORE SESSION) ================= */
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session?.user) {
    window.__USER_SESSION__ = sessionData.session.user;
  }

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

  const btnMenu = document.getElementById("btnMenu");
  const sidebar = document.querySelector(".sidebar");
  const menuOverlay = document.getElementById("menuOverlay");

  /* ================= ESTADO INICIAL MENU ================= */
  sidebar?.classList.remove("active");
  menuOverlay?.classList.add("hidden");

  /* ================= FILTROS (PATCH APLICADO) ================= */
  ["change", "input"].forEach(evt => {
    filtroMes?.addEventListener(evt, atualizarDashboard);
    filtroAno?.addEventListener(evt, atualizarDashboard);
  });

  /* ================= GRÁFICO – MOBILE SAFE ================= */
  if (!tipoGrafico.value) tipoGrafico.value = "resumo";
  ["change", "input"].forEach(evt => {
    tipoGrafico.addEventListener(evt, atualizarDashboard);
  });

  /* ================= EVENT DELEGATION LISTA ================= */
  lista.addEventListener("click", (e) => {
    const btnEditar = e.target.closest(".btn-acao.editar");
    const btnExcluir = e.target.closest(".btn-acao.excluir");
    if (btnEditar) editar(btnEditar.dataset.id);
    if (btnExcluir) excluir(btnExcluir.dataset.id);
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

  /* ================= CORE ================= */
  async function iniciarSessao(user) {
    loginContainer.style.display = "none";
    app.style.display = "flex";
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

  /* ================= DASHBOARD ================= */
  function atualizarDashboard() {
    let filtrados = [...dados];
    if (filtroMes.value) filtrados = filtrados.filter(l => l.data.startsWith(filtroMes.value));
    if (filtroAno?.value) filtrados = filtrados.filter(l => l.data.startsWith(filtroAno.value));

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

  /* ================= MENU MOBILE ================= */
  function fecharMenuMobile() {
    sidebar.classList.remove("active");
    menuOverlay.classList.add("hidden");
  }

  btnMenu.onclick = () => {
    sidebar.classList.toggle("active");
    menuOverlay.classList.toggle("hidden");
  };

  menuOverlay.onclick = fecharMenuMobile;
  window.addEventListener("resize", fecharMenuMobile);
  window.addEventListener("orientationchange", fecharMenuMobile);

  btnDashboard.onclick = () => {
    dashboard.classList.remove("hidden");
    lancamentos.classList.add("hidden");
    fecharMenuMobile();
  };

  btnLancamentos.onclick = () => {
    dashboard.classList.add("hidden");
    lancamentos.classList.remove("hidden");
    fecharMenuMobile();
  };

  btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    fecharMenuMobile();
    app.style.display = "none";
    loginContainer.style.display = "flex";
  };

  /* ================= EXPORTAR PDF ================= */
  const btnExportarPdf = document.getElementById("btnExportarPdf");
  if (btnExportarPdf) {
    btnExportarPdf.onclick = () => {
      if (!window.jspdf?.jsPDF) return alert("jsPDF não carregado.");
      const pdf = new window.jspdf.jsPDF();
      pdf.text("TCS Finance – Extrato Financeiro", 10, 10);
      let y = 20;
      dados.forEach(l => {
        pdf.text(`${l.data} | ${l.tipo} | ${l.categoria} | R$ ${l.valor}`, 10, y);
        y += 6;
        if (y > 280) { pdf.addPage(); y = 20; }
      });
      pdf.save("extrato-financeiro.pdf");
    };
  }

  if (window.__USER_SESSION__) iniciarSessao(window.__USER_SESSION__);

});
