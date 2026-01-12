/* ======================================================
   🔒 BLOCO PROTEGIDO – NÃO MEXER
   BOOTSTRAP / INICIALIZAÇÃO DO SCRIPT
====================================================== */
console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     SUPABASE / CLIENTE / SESSÃO
  ====================================================== */
  const supabase = window.supabase.createClient(
    "https://figkamlmpangolnasaby.supabase.co",
    "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL"
  );

  const { data: sessionData } = await supabase.auth.getSession();

  if (sessionData?.session?.user) {
    window.__USER_SESSION__ = sessionData.session.user;
  }

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     ESTADO GLOBAL DO SISTEMA
  ====================================================== */
  let dados = [];
  let grafico = null;
  let graficoMensal = null;
  let idEmEdicao = null;

  const LIMITE_FREE = 15;
  let planoUsuario = "FREE";
  const planoLabel = document.getElementById("planoUsuario");
if (planoLabel) {
  planoLabel.innerText = `Plano ${planoUsuario}`;
}


  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     CATEGORIAS POR TIPO
  ====================================================== */
  const categoriasPorTipo = {
    Receita: ["Salário", "Renda Extra", "Mesada", "Freelance", "Vendas", "Outros"],
    Despesa: ["Moradia", "Saúde", "Cartão de Crédito", "Alimentação", "Transporte", "Educação", "Empréstimos", "Compras diversas", "Lazer", "Outros"],
    Investimento: ["Renda Fixa", "Ações", "Criptomoedas", "Outros"]
  };

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     REFERÊNCIAS DE ELEMENTOS DO DOM
  ====================================================== */
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
  const btnLogoutTop = document.getElementById("btnLogoutTop");
  const btnLogout = document.getElementById("btnLogout");

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     LOGOUT TOPBAR
  ====================================================== */
  if (btnLogoutTop) {
    btnLogoutTop.onclick = async () => {
      await supabase.auth.signOut();
      app.classList.add("hidden");
      app.style.display = "none";
      loginContainer.style.display = "flex";
    };
  }

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

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     ESTADO INICIAL MENU MOBILE
  ====================================================== */
  if (sidebar) sidebar.classList.remove("active");
  if (menuOverlay) menuOverlay.classList.add("hidden");

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     GRÁFICOS / FILTROS
  ====================================================== */
  if (!tipoGrafico.value) tipoGrafico.value = "geral";

  ["change", "input"].forEach(evt => {
    tipoGrafico.addEventListener(evt, atualizarDashboard);

    ["change", "input"].forEach(evt => {
      filtroMes.addEventListener(evt, atualizarDashboard);
      filtroAno.addEventListener(evt, atualizarDashboard);
    });
  });

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     EVENT DELEGATION LISTA
  ====================================================== */
  lista.addEventListener("click", (e) => {
    const btnEditar = e.target.closest(".btn-acao.editar");
    const btnExcluir = e.target.closest(".btn-acao.excluir");

    if (btnEditar) editar(btnEditar.dataset.id);
    if (btnExcluir) excluir(btnExcluir.dataset.id);
  });

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     CATEGORIAS
  ====================================================== */
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

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     AUTH / LOGIN / CADASTRO
  ====================================================== */
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

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     CORE DA APLICAÇÃO
  ====================================================== */
  async function iniciarSessao(user) {
    
    const topbarUser = document.getElementById("topbarUser");
    const topbarPlano = document.getElementById("topbarPlano");
    const role = user.user_metadata?.role || "user";
const plano = user.user_metadata?.plano || "FREE";

const isAdmin = role === "admin";
window.__IS_ADMIN__ = isAdmin;

planoUsuario = plano;

    if (topbarUser) {
      topbarUser.innerText = user.user_metadata?.nome || user.email.split("@")[0];
    }

    if (topbarPlano) {
      topbarPlano.innerText = planoUsuario;
    }

    loginContainer.style.display = "none";
    app.style.display = "flex";
    app.classList.remove("hidden");

    dashboard.classList.remove("hidden");
    lancamentos.classList.add("hidden");

    nomeCliente.innerText = `Olá, ${user.user_metadata?.nome || user.email.split("@")[0]}!`;

    await carregarDados();
    atualizarDashboard();
    renderizarLista();

    aplicarModoAdmin(isAdmin);
  }

  async function carregarDados() {
    const { data } = await supabase.from("lancamentos").select("*");
    dados = data || [];

    setTimeout(() => {
      if (typeof carregarRadarB3 === "function") {
        carregarRadarB3();
      }
    }, 400);
  }

  /* ======================================================
     🧩 BLOCO EXTENSÍVEL (NÃO QUEBRAR)
     LANÇAMENTOS / SALVAR / EDITAR
  ====================================================== */
  btnSalvar.onclick = async () => {
    if (!tipo.value || !categoria.value || !valor.value || !dataInput.value)
      return alert("Preencha todos os campos.");

    if (planoUsuario === "FREE" && dados.length >= LIMITE_FREE && !idEmEdicao)
      return alert("Limite do plano gratuito atingido.");

    const user = (await supabase.auth.getUser()).data.user;

    if (idEmEdicao) {
      await supabase.from("lancamentos").update({
        tipo: tipo.value,
        categoria: categoria.value,
        descricao: descricao.value,
        valor: Number(valor.value),
        data: dataInput.value
      }).eq("id", idEmEdicao);

      idEmEdicao = null;
    } else {
      await supabase.from("lancamentos").insert({
        user_id: user.id,
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

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     DASHBOARD / GRÁFICOS
  ====================================================== */
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

    let labels = [];
    let valores = [];

    if (tipoGrafico.value === "categoria") {
      const categorias = {};
      dados.forEach(l => {
        categorias[l.categoria] = (categorias[l.categoria] || 0) + l.valor;
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
        datasets: [{ data: valores }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  function renderizarGraficoMensal() {
    if (graficoMensal) graficoMensal.destroy();

    const resumo = {};
    dados.forEach(l => {
      const m = l.data.slice(0, 7);
      resumo[m] = resumo[m] || { r: 0, d: 0 };
      if (l.tipo === "Receita") resumo[m].r += l.valor;
      if (l.tipo === "Despesa") resumo[m].d += l.valor;
    });

    graficoMensal = new Chart(document.getElementById("graficoMensal"), {
      type: "bar",
      data: {
        labels: Object.keys(resumo),
        datasets: [
          { label: "Receitas", data: Object.values(resumo).map(v => v.r) },
          { label: "Despesas", data: Object.values(resumo).map(v => v.d) }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     LISTA / EDITAR / EXCLUIR
  ====================================================== */
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

  function editar(id) {
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
  }

  async function excluir(id) {
    if (!confirm("Excluir lançamento?")) return;

    const { error } = await supabase.from("lancamentos").delete().eq("id", id);
    if (error) return alert("Erro ao excluir lançamento.");

    await carregarDados();
    atualizarDashboard();
    renderizarLista();
  }

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     MENU MOBILE / NAVEGAÇÃO
  ====================================================== */
  if (btnMenu && sidebar && menuOverlay) {
    btnMenu.onclick = () => {
      const aberto = sidebar.classList.contains("active");

      if (aberto) {
        sidebar.classList.remove("active");
        menuOverlay.classList.add("hidden");
      } else {
        sidebar.classList.add("active");
        menuOverlay.classList.remove("hidden");
      }
    };

    menuOverlay.onclick = () => {
      sidebar.classList.remove("active");
      menuOverlay.classList.add("hidden");
    };
  }

  function fecharMenuMobile() {
    sidebar.classList.remove("active");
    menuOverlay.classList.add("hidden");
  }

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
    app.classList.add("hidden");
    app.style.display = "none";
    loginContainer.style.display = "flex";
  };

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     EXPORTAÇÃO PDF
  ====================================================== */
  const btnExportarPdf = document.getElementById("btnExportarPdf");

  if (btnExportarPdf) {
    btnExportarPdf.onclick = () => {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("Biblioteca de PDF não carregada.");
        return;
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();

      pdf.setFontSize(14);
      pdf.text("TCS Finance – Extrato Financeiro", 10, 10);

      let y = 20;
      dados.forEach(l => {
        pdf.setFontSize(10);
        pdf.text(
          `${l.data} | ${l.tipo} | ${l.categoria} | R$ ${Number(l.valor).toFixed(2)}`,
          10,
          y
        );
        y += 6;

        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
      });

      pdf.save("extrato-financeiro.pdf");
    };
  }

  /* ======================================================
     🔒 BLOCO PROTEGIDO – NÃO MEXER
     AUTO LOGIN FINAL
  ====================================================== */
  /* ======================================================
   🛡️ BLOCO ADMIN – PAINEL ADMINISTRATIVO
   (ACRÉSCIMO – NÃO REMOVE NADA EXISTENTE)
====================================================== */

async function carregarUsuariosAdmin() {
  if (!window.__IS_ADMIN__) return;

  const { data, error } = await supabase
    .from("user_plans")
    .select("user_id, plano");

  if (error) {
    console.error(error);
    alert("Erro ao carregar usuários");
    return;
  }

  const tbody = document.getElementById("listaUsuariosAdmin");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.user_id}</td>
      <td>${u.plano}</td>
      <td>
        <button onclick="alterarPlano('${u.user_id}', 'PRO')">PRO</button>
        <button onclick="alterarPlano('${u.user_id}', 'FREE')">FREE</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function alterarPlano(userId, plano) {
  const { error } = await supabase
    .from("user_plans")
    .upsert({
      user_id: userId,
      plano: plano,
      updated_at: new Date()
    });

  if (error) {
    console.error(error);
    alert("Erro ao alterar plano");
    return;
  }

  alert("Plano atualizado com sucesso");
  carregarUsuariosAdmin();
}

  if (window.__USER_SESSION__) {
    iniciarSessao(window.__USER_SESSION__);
  }
  
function aplicarModoAdmin(isAdmin) {
  document.body.classList.toggle("modo-admin", isAdmin);
  if (isAdmin) {
  carregarUsuariosAdmin();
}

  const adminOnlyElements = document.querySelectorAll("[data-admin-only]");
  adminOnlyElements.forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });
}


});
