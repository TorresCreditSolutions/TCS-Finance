/* ======================================================
   TCS FINANCE
   SCRIPT PRINCIPAL
   VERSÃO DASHBOARD PRO
====================================================== */

console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  /* ======================================================
     SUPABASE
  ====================================================== */

  const supabase = window.supabase.createClient(
    "https://figkamlmpangolnasaby.supabase.co",
    "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL"
  );

  /* ======================================================
     ESTADO GLOBAL
  ====================================================== */

  let dados = [];

  let grafico = null;
  let graficoMensal = null;
  let graficoComparativo = null;

  let idEmEdicao = null;

  const LIMITE_FREE = 30;
  let planoUsuario = "FREE";

  /* ======================================================
     CATEGORIAS
  ====================================================== */

  const categoriasPorTipo = {

    Receita: [
      "Salário",
      "Renda Extra",
      "Mesada",
      "Freelance",
      "Vendas",
      "Outros"
    ],

    Despesa: [
      "Moradia",
      "Saúde",
      "Cartão de Crédito",
      "Alimentação",
      "Transporte",
      "Educação",
      "Empréstimos",
      "Compras diversas",
      "Lazer",
      "Outros"
    ],

    Investimento: [
      "Renda Fixa",
      "Ações",
      "Criptomoedas",
      "Outros"
    ]

  };

  /* ======================================================
     ELEMENTOS DO DOM
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

  const btnRelatorios = document.getElementById("btnRelatorios");
  const relatorios = document.getElementById("relatorios");

  const btnDashboard = document.getElementById("btnDashboard");
  const btnLancamentos = document.getElementById("btnLancamentos");
  /* ======================================================
   RELATÓRIOS
====================================================== */

if (btnRelatorios) {

    btnRelatorios.onclick = () => {

        dashboard.classList.add("hidden");
        lancamentos.classList.add("hidden");

        if (relatorios) {
            relatorios.classList.remove("hidden");
        }

        fecharMenuMobile();

        atualizarRelatorios();
    };

}

  const btnSalvar = document.getElementById("btnSalvar");

  const tipo = document.getElementById("tipo");
  const categoria = document.getElementById("categoria");
  const descricao = document.getElementById("descricao");
  const valor = document.getElementById("valor");
  const dataInput = document.getElementById("data");
  const status = document.getElementById("status");

  const filtroMes = document.getElementById("filtroMes");
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

  const dashboardPeriodo = document.getElementById("dashboardPeriodo");
  /* ======================================================
   ATUALIZAR RELATÓRIOS
====================================================== */

function atualizarRelatorios() {

    const filtrados = obterDadosFiltrados();

    let receita = 0;
    let despesa = 0;
    let investimento = 0;

    filtrados.forEach(l => {

        const valorLancamento =
            Number(l.valor) || 0;

        if (l.tipo === "Receita") {
            receita += valorLancamento;
        }

        if (l.tipo === "Despesa") {
            despesa += valorLancamento;
        }

        if (l.tipo === "Investimento") {
            investimento += valorLancamento;
        }

    });

    const saldoAtual =
        receita - despesa;

    const elementos = {

        relatorioReceitas:
            formatarMoeda(receita),

        relatorioDespesas:
            formatarMoeda(despesa),

        relatorioInvestimentos:
            formatarMoeda(investimento),

        relatorioSaldo:
            formatarMoeda(saldoAtual),

        relatorioResumoReceitas:
            formatarMoeda(receita),

        relatorioResumoDespesas:
            formatarMoeda(despesa),

        relatorioResumoInvestimentos:
            formatarMoeda(investimento),

        relatorioResumoSaldo:
            formatarMoeda(saldoAtual),

        relatorioPeriodo:
            formatarPeriodo(
                filtroMes?.value || ""
            )

    };

    Object.entries(elementos).forEach(
        ([id, valor]) => {

            const elemento =
                document.getElementById(id);

            if (elemento) {
                elemento.innerText = valor;
            }

        }
    );
}

  /* ======================================================
     FORMATAÇÃO
  ====================================================== */

  function formatarMoeda(valorNumerico) {

    const numero = Number(valorNumerico) || 0;

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  }

  function formatarNumero(valorNumerico) {

    const numero = Number(valorNumerico) || 0;

    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  }

  function formatarData(data) {

    if (!data) return "";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  }

  function obterMesAtual() {

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes = String(agora.getMonth() + 1).padStart(2, "0");

    return `${ano}-${mes}`;

  }

  function formatarPeriodo(mes) {

    if (!mes) return "Todos os períodos";

    const partes = mes.split("-");

    if (partes.length !== 2) return mes;

    const ano = Number(partes[0]);

    const numeroMes = Number(partes[1]);

    const data = new Date(ano, numeroMes - 1, 1);

    return data.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric"
    });

  }

  /* ======================================================
     MENU MOBILE
  ====================================================== */

  if (sidebar) {
    sidebar.classList.remove("active");
  }

  if (menuOverlay) {
    menuOverlay.classList.add("hidden");
  }

  function fecharMenuMobile() {

    if (sidebar) {
      sidebar.classList.remove("active");
    }

    if (menuOverlay) {
      menuOverlay.classList.add("hidden");
    }

  }

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

      fecharMenuMobile();

    };

  }

  /* ======================================================
     NAVEGAÇÃO
  ====================================================== */

 if (btnDashboard) {

    btnDashboard.onclick = () => {

        dashboard.classList.remove("hidden");

        lancamentos.classList.add("hidden");

        if (relatorios) {
            relatorios.classList.add("hidden");
        }

        fecharMenuMobile();

        atualizarDashboard();
    };

}

  if (btnLancamentos) {

    btnLancamentos.onclick = () => {

        dashboard.classList.add("hidden");

        lancamentos.classList.remove("hidden");

        if (relatorios) {
            relatorios.classList.add("hidden");
        }

        fecharMenuMobile();

        renderizarLista();
    };

}

  /* ======================================================
     LOGOUT
  ====================================================== */

  async function fazerLogout() {

    await supabase.auth.signOut();

    if (app) {

      app.classList.add("hidden");

      app.style.display = "none";

    }

    if (loginContainer) {

      loginContainer.style.display = "flex";

    }

  }

  if (btnLogoutTop) {

    btnLogoutTop.onclick = async () => {

      await fazerLogout();

    };

  }

  if (btnLogout) {

    btnLogout.onclick = async () => {

      fecharMenuMobile();

      await fazerLogout();

    };

  }

  /* ======================================================
     CATEGORIAS
  ====================================================== */

  function popularCategorias(
    tipoSelecionado,
    categoriaSelecionada = ""
  ) {

    if (!categoria) return;

    categoria.innerHTML =
      "<option value=''>Categoria</option>";

    if (!categoriasPorTipo[tipoSelecionado]) {

      return;

    }

    categoriasPorTipo[tipoSelecionado].forEach(cat => {

      const option = document.createElement("option");

      option.value = cat;

      option.textContent = cat;

      if (cat === categoriaSelecionada) {

        option.selected = true;

      }

      categoria.appendChild(option);

    });

  }

  if (tipo) {

    tipo.onchange = () => {

      popularCategorias(tipo.value);

    };

  }

  /* ======================================================
     LOGIN
  ====================================================== */

  if (btnLogin) {

    btnLogin.onclick = async () => {

      if (!aceiteTermos.checked) {

        alert("Você precisa aceitar os termos.");

        return;

      }

      if (!emailInput.value || !senhaInput.value) {

        alert("Informe seu email e senha.");

        return;

      }

      const { data, error } =
        await supabase.auth.signInWithPassword({

          email: emailInput.value.trim(),

          password: senhaInput.value

        });

      if (error) {

        alert(error.message);

        return;

      }

      await iniciarSessao(data.user);

    };

  }

  /* ======================================================
     CADASTRO
  ====================================================== */

  if (btnCadastro) {

    btnCadastro.onclick = async () => {

      if (!aceiteTermos.checked) {

        alert("Você precisa aceitar os termos.");

        return;

      }

      if (!emailInput.value || !senhaInput.value) {

        alert("Informe email e senha.");

        return;

      }

      if (senhaInput.value.length < 6) {

        alert("A senha deve possuir pelo menos 6 caracteres.");

        return;

      }

      const { error } =
        await supabase.auth.signUp({

          email: emailInput.value.trim(),

          password: senhaInput.value,

          options: {

            data: {

              nome:
                emailInput.value
                  .split("@")[0]

            }

          }

        });

      if (error) {

        alert(error.message);

        return;

      }

      alert(
        "Conta criada com sucesso! Confirme seu email para continuar."
      );

    };

  }

  /* ======================================================
     INICIAR SESSÃO
  ====================================================== */

  async function iniciarSessao(user) {

    if (!user) return;

    const topbarUser =
      document.getElementById("topbarUser");

    const topbarPlano =
      document.getElementById("topbarPlano");

    const nomeUsuario =
      user.user_metadata?.nome ||
      user.email?.split("@")[0] ||
      "Usuário";

    if (topbarUser) {

      topbarUser.innerText = nomeUsuario;

    }

    if (topbarPlano) {

      topbarPlano.innerText = planoUsuario;

    }

    if (loginContainer) {

      loginContainer.style.display = "none";

    }

    if (app) {

      app.style.display = "flex";

      app.classList.remove("hidden");

    }

    if (dashboard) {

      dashboard.classList.remove("hidden");

    }

    if (lancamentos) {

      lancamentos.classList.add("hidden");

    }

    if (nomeCliente) {

      nomeCliente.innerText =
        `Olá, ${nomeUsuario}!`;

    }

    /* Define mês atual somente se não houver filtro */

    if (filtroMes && !filtroMes.value) {

      filtroMes.value = obterMesAtual();

    }

    atualizarPeriodoDashboard();

    await carregarDados();

    atualizarDashboard();

    renderizarLista();

  }

  /* ======================================================
     CARREGAR DADOS
  ====================================================== */

  async function carregarDados() {

    try {

      const {
        data,
        error
      } = await supabase
        .from("lancamentos")
        .select("*")
        .order("data", {
          ascending: false
        });

      if (error) {

        console.error(
          "Erro ao carregar lançamentos:",
          error
        );

        alert(
          "Não foi possível carregar seus lançamentos."
        );

        dados = [];

        return;

      }

      dados = data || [];

    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar dados:",
        erro
      );

      dados = [];

    }

  }

  /* ======================================================
     SALVAR LANÇAMENTO
  ====================================================== */

  if (btnSalvar) {

    btnSalvar.onclick = async () => {

      if (
        !tipo.value ||
        !categoria.value ||
        !valor.value ||
        !dataInput.value
      ) {

        alert(
          "Preencha tipo, categoria, valor e data."
        );

        return;

      }

      const valorNumerico =
        Number(
          String(valor.value)
            .replace(",", ".")
        );

      if (
        !Number.isFinite(valorNumerico) ||
        valorNumerico <= 0
      ) {

        alert("Informe um valor válido.");

        return;

      }

      if (
        planoUsuario === "FREE" &&
        dados.length >= LIMITE_FREE &&
        !idEmEdicao
      ) {

        alert(
          "Limite do plano gratuito atingido."
        );

        return;

      }

      try {

        const {
          data: userData,
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !userData?.user) {

          alert(
            "Sua sessão expirou. Faça login novamente."
          );

          return;

        }

        let erroOperacao = null;

        if (idEmEdicao) {

          const resultado =
            await supabase
              .from("lancamentos")
              .update({

                tipo: tipo.value,

                categoria: categoria.value,

                descricao:
                  descricao.value.trim(),

                valor: valorNumerico,

                data: dataInput.value,

                status: status?.value || "Pago"

              })
              .eq("id", idEmEdicao);

          erroOperacao = resultado.error;

        } else {

          const resultado =
            await supabase
              .from("lancamentos")
              .insert({

                user_id:
                  userData.user.id,

                tipo: tipo.value,

                categoria: categoria.value,

                descricao:
                  descricao.value.trim(),

                valor: valorNumerico,

                data: dataInput.value,

                 status: status?.value || "Pago"

              });

          erroOperacao = resultado.error;

        }

        if (erroOperacao) {

          console.error(
            "Erro ao salvar:",
            erroOperacao
          );

          alert(
            "Não foi possível salvar o lançamento."
          );

          return;

        }

        idEmEdicao = null;

        await carregarDados();

        atualizarDashboard();

        renderizarLista();

        limparFormulario();

        alert("Lançamento salvo com sucesso!");

      } catch (erro) {

        console.error(
          "Erro inesperado:",
          erro
        );

        alert(
          "Ocorreu um erro ao salvar o lançamento."
        );

      }

    };

  }

  /* ======================================================
     LIMPAR FORMULÁRIO
  ====================================================== */

  function limparFormulario() {

    idEmEdicao = null;

    if (tipo) {

      tipo.value = "";

    }

    if (categoria) {

      categoria.innerHTML =
        "<option value=''>Categoria</option>";

    }

    if (descricao) {

      descricao.value = "";

    }

    if (valor) {

      valor.value = "";

    }

    if (dataInput) {

      dataInput.value = "";

    }

    if (status) {

      status.value = "Pago";

    }

    if (btnSalvar) {

      btnSalvar.innerText = "Salvar";

    }

  }

  /* ======================================================
     FILTRO
  ====================================================== */

  function obterDadosFiltrados() {

    let filtrados = [...dados];

    if (filtroMes && filtroMes.value) {

      filtrados =
        filtrados.filter(l => {

          if (!l.data) return false;

          return l.data.startsWith(
            filtroMes.value
          );

        });

    }

    return filtrados;

  }

  if (filtroMes) {

    filtroMes.addEventListener(
      "change",
      () => {

        atualizarPeriodoDashboard();

        atualizarDashboard();

      }
    );

  }

  if (btnLimparFiltro) {

    btnLimparFiltro.onclick = () => {

      filtroMes.value = "";

      atualizarPeriodoDashboard();

      atualizarDashboard();

    };

  }

  /* ======================================================
     PERÍODO DO DASHBOARD
  ====================================================== */

  function atualizarPeriodoDashboard() {

    if (!dashboardPeriodo) return;

    dashboardPeriodo.innerText =
      formatarPeriodo(
        filtroMes?.value || ""
      );

  }

  /* ======================================================
     DASHBOARD
  ====================================================== */

  function atualizarDashboard() {

    const filtrados =
      obterDadosFiltrados();

    let receita = 0;
    let despesa = 0;
    let investimento = 0;

    filtrados.forEach(l => {

      const valorLancamento =
        Number(l.valor) || 0;

      if (l.tipo === "Receita") {

        receita += valorLancamento;

      }

      if (l.tipo === "Despesa") {

        despesa += valorLancamento;

      }

      if (l.tipo === "Investimento") {

        investimento += valorLancamento;

      }

    });

    const saldoAtual =
      receita - despesa;

    if (totalReceitas) {

      totalReceitas.innerText =
        formatarMoeda(receita);

    }

    if (totalDespesas) {

      totalDespesas.innerText =
        formatarMoeda(despesa);

    }

    if (totalInvestimentos) {

      totalInvestimentos.innerText =
        formatarMoeda(investimento);

    }

    if (saldo) {

      saldo.innerText =
        formatarMoeda(saldoAtual);

    }

    atualizarPeriodoDashboard();

    renderizarAlertas(filtrados);

    renderizarGrafico(
      filtrados,
      receita,
      despesa,
      investimento
    );

    renderizarGraficoMensal(
      filtrados
    );

    // renderizarGraficoComparativo(filtrados);
    renderizarGraficoComparativo(
      filtrados
    );

  }

  /* ======================================================
     ALERTAS
  ====================================================== */

  function renderizarAlertas(dadosFiltrados) {

    const container =
      document.getElementById(
        "alertasInteligentes"
      );

    if (!container) return;

    container.innerHTML = "";

    let receita = 0;
    let despesa = 0;
    let investimento = 0;

    dadosFiltrados.forEach(l => {

      const valorLancamento =
        Number(l.valor) || 0;

      if (l.tipo === "Receita") {

        receita += valorLancamento;

      }

      if (l.tipo === "Despesa") {

        despesa += valorLancamento;

      }

      if (l.tipo === "Investimento") {

        investimento += valorLancamento;

      }

    });

    const saldoAtual =
      receita - despesa;

    const percentualDespesa =
      receita > 0
        ? (despesa / receita) * 100
        : 0;

    function criarAlerta(
      texto,
      classe
    ) {

      const div =
        document.createElement("div");

      div.className =
        `alerta ${classe}`;

      div.innerText = texto;

      container.appendChild(div);

    }

    if (saldoAtual < 0) {

      criarAlerta(
        "🔴 Seu saldo está negativo. Atenção imediata ao controle de despesas.",
        "vermelho"
      );

    }

    if (
      despesa > receita &&
      receita > 0
    ) {

      criarAlerta(
        "⚠️ Suas despesas estão maiores que suas receitas neste período.",
        "amarelo"
      );

    }

    if (
      percentualDespesa > 70 &&
      percentualDespesa <= 90 &&
      despesa <= receita
    ) {

      criarAlerta(
        `🟡 Você está comprometendo ${percentualDespesa.toFixed(0)}% da sua receita com despesas. O ideal é manter abaixo de 70%.`,
        "amarelo"
      );

    }

    if (
      percentualDespesa > 90 &&
      receita > 0
    ) {

      criarAlerta(
        `🔥 Alerta crítico: ${percentualDespesa.toFixed(0)}% da sua receita está comprometida com despesas.`,
        "vermelho"
      );

    }

    if (
      investimento === 0 &&
      receita > 0
    ) {

      criarAlerta(
        "💡 Nenhum investimento identificado neste período. Considere investir parte da sua renda.",
        "azul"
      );

    }

    if (
      receita === 0 &&
      despesa === 0 &&
      investimento === 0
    ) {

      criarAlerta(
        "ℹ️ Nenhum lançamento encontrado neste período.",
        "azul"
      );

    }

    if (
      saldoAtual > 0 &&
      receita > 0 &&
      percentualDespesa < 60
    ) {

      criarAlerta(
        "✅ Sua saúde financeira está equilibrada neste período.",
        "verde"
      );

    }

  }

  /* ======================================================
     GRÁFICO PRINCIPAL
  ====================================================== */

  function renderizarGrafico(
    dadosFiltrados,
    receita,
    despesa,
    investimento
  ) {

    const canvas =
      document.getElementById(
        "grafico"
      );

    if (!canvas) return;

    if (grafico) {

      grafico.destroy();

      grafico = null;

    }

    let labels = [];
    let valores = [];

    if (
      tipoGrafico &&
      tipoGrafico.value === "categoria"
    ) {

      const categorias = {};

      dadosFiltrados.forEach(l => {

        const nomeCategoria =
          l.categoria ||
          "Sem categoria";

        categorias[nomeCategoria] =
          (categorias[nomeCategoria] || 0) +
          (Number(l.valor) || 0);

      });

      labels =
        Object.keys(categorias);

      valores =
        Object.values(categorias);

    } else {

      labels = [
        "Receitas",
        "Despesas",
        "Investimentos"
      ];

      valores = [
        receita,
        despesa,
        investimento
      ];

    }

    grafico =
      new Chart(
        canvas,
        {

          type: "pie",

          data: {

            labels,

            datasets: [
              {

                data: valores,

                borderWidth: 2

              }
            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                position: "bottom"

              }

            }

          }

        }
      );

  }

  /* ======================================================
     GRÁFICO MENSAL
  ====================================================== */

  function renderizarGraficoMensal(
    dadosFiltrados
  ) {

    const canvas =
      document.getElementById(
        "graficoMensal"
      );

    if (!canvas) return;

    if (graficoMensal) {

      graficoMensal.destroy();

      graficoMensal = null;

    }

    const resumo = {};

    dadosFiltrados.forEach(l => {

      if (!l.data) return;

      const mes =
        l.data.slice(0, 7);

      if (!resumo[mes]) {

        resumo[mes] = {

          receita: 0,

          despesa: 0

        };

      }

      const valorLancamento =
        Number(l.valor) || 0;

      if (
        l.tipo === "Receita"
      ) {

        resumo[mes].receita +=
          valorLancamento;

      }

      if (
        l.tipo === "Despesa"
      ) {

        resumo[mes].despesa +=
          valorLancamento;

      }

    });

    const labels =
      Object.keys(resumo).sort();

    const receitas =
      labels.map(
        m => resumo[m].receita
      );

    const despesas =
      labels.map(
        m => resumo[m].despesa
      );

    if (labels.length === 0) {

      return;

    }

    graficoMensal =
      new Chart(
        canvas,
        {

          type: "bar",

          data: {

            labels,

            datasets: [

              {

                label: "Receitas",

                data: receitas,

                borderWidth: 1

              },

              {

                label: "Despesas",

                data: despesas,

                borderWidth: 1

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                position: "bottom"

              }

            },

            scales: {

              y: {

                beginAtZero: true

              }

            }

          }

        }

      );

  }

 /* ======================================================
   GRÁFICO COMPARATIVO
   Receita x Despesa
====================================================== */

function renderizarGraficoComparativo() {

  const canvas = document.getElementById("graficoComparativo");

  if (!canvas) return;

  // Destrói o gráfico anterior completamente
  if (graficoComparativo) {
    try {
      graficoComparativo.destroy();
    } catch (e) {
      console.warn("Erro ao destruir gráfico comparativo:", e);
    }

    graficoComparativo = null;
  }

  const dadosPorMes = {};

  dados.forEach(l => {

    if (!l.data) return;

    const mes = l.data.slice(0, 7);

    if (!dadosPorMes[mes]) {
      dadosPorMes[mes] = {
        receita: 0,
        despesa: 0
      };
    }

    const valorNumerico = Number(l.valor) || 0;

    if (l.tipo === "Receita") {
      dadosPorMes[mes].receita += valorNumerico;
    }

    if (l.tipo === "Despesa") {
      dadosPorMes[mes].despesa += valorNumerico;
    }

  });

  const labels = Object.keys(dadosPorMes).sort();

  // Se não houver dados, não cria o gráfico
  if (labels.length === 0) {
    canvas.style.display = "none";
    return;
  }

  canvas.style.display = "block";

  const receitas = labels.map(mes => dadosPorMes[mes].receita);
  const despesas = labels.map(mes => dadosPorMes[mes].despesa);

  // Define tamanho físico fixo do canvas
  canvas.width = 1200;
  canvas.height = 320;

  graficoComparativo = new Chart(canvas, {

    type: "line",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Receitas",
          data: receitas,

          borderWidth: 3,
          tension: 0.25,

          pointRadius: 4,
          pointHoverRadius: 6,

          fill: false
        },

        {
          label: "Despesas",
          data: despesas,

          borderWidth: 3,
          tension: 0.25,

          pointRadius: 4,
          pointHoverRadius: 6,

          fill: false
        }
      ]
    },

    options: {

      // IMPORTANTE:
      // desliga o redimensionamento automático
      responsive: false,

      maintainAspectRatio: false,

      animation: false,

      resizeDelay: 0,

      plugins: {
        legend: {
          position: "bottom"
        },

        tooltip: {
          enabled: true
        }
      },

      scales: {

        x: {
          display: true
        },

        y: {
          beginAtZero: true,

          ticks: {
            callback: function(value) {
              return Number(value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              });
            }
          }
        }

      }
    }

  });

}
  /* ======================================================
     MUDANÇA DO TIPO DE GRÁFICO
  ====================================================== */

  if (tipoGrafico) {

    tipoGrafico.addEventListener(
      "change",
      () => {

        atualizarDashboard();

      }
    );

  }

  /* ======================================================
     LISTA DE LANÇAMENTOS
  ====================================================== */

  function renderizarLista() {

    if (!lista) return;

    lista.innerHTML = "";

    if (dados.length === 0) {

      const vazio =
        document.createElement("li");

      vazio.innerHTML =
        "<div class='linha-info'>Nenhum lançamento cadastrado.</div>";

      lista.appendChild(vazio);

      return;

    }

    dados.forEach(l => {

      const li =
        document.createElement("li");

      const valorFormatado =
        formatarMoeda(l.valor);

      li.innerHTML = `

        <div class="linha-info">

          <strong>
            ${formatarData(l.data)}
          </strong>

          –
          ${l.tipo}

          •
          ${l.categoria || "Sem categoria"}

          •
          ${valorFormatado}

          ${
            l.descricao
              ? ` • ${l.descricao}`
              : ""
          }
          <span class="status-lancamento ${
            (l.status || "Pago") === "Pago"
              ? "status-pago"
              : "status-aberto"
          }">
            ${l.status || "Pago"}
          </span>
        </div>

        <div class="linha-acoes">

          <button
            type="button"
            class="btn-acao editar"
            data-id="${l.id}"
            title="Editar"
          >
            ✏️
          </button>

          <button
            type="button"
            class="btn-acao excluir"
            data-id="${l.id}"
            title="Excluir"
          >
            🗑
          </button>

        </div>

      `;

      lista.appendChild(li);

    });

  }

  /* ======================================================
     EVENTOS DA LISTA
  ====================================================== */

  if (lista) {

    lista.addEventListener(
      "click",
      event => {

        const btnEditar =
          event.target.closest(
            ".btn-acao.editar"
          );

        const btnExcluir =
          event.target.closest(
            ".btn-acao.excluir"
          );

        if (btnEditar) {

          editar(
            btnEditar.dataset.id
          );

        }

        if (btnExcluir) {

          excluir(
            btnExcluir.dataset.id
          );

        }

      }
    );

  }

  /* ======================================================
     EDITAR
  ====================================================== */

  function editar(id) {

    const lancamento =
      dados.find(
        d => String(d.id) === String(id)
      );

    if (!lancamento) {

      alert(
        "Lançamento não encontrado."
      );

      return;

    }

    idEmEdicao =
      lancamento.id;

    if (tipo) {

      tipo.value =
        lancamento.tipo;

    }

    popularCategorias(
      lancamento.tipo,
      lancamento.categoria
    );

    if (descricao) {

      descricao.value =
        lancamento.descricao || "";

    }

    if (valor) {

      valor.value =
        lancamento.valor;

    }

    if (dataInput) {

      dataInput.value =
        lancamento.data;

    }

    if (status) {

      status.value =
        lancamento.status || "Pago";

    }

    if (btnSalvar) {

      btnSalvar.innerText =
        "Atualizar lançamento";

    }

    dashboard.classList.add(
      "hidden"
    );

    lancamentos.classList.remove(
      "hidden"
    );

    fecharMenuMobile();

  }

  /* ======================================================
     EXCLUIR
  ====================================================== */

  async function excluir(id) {

    const confirmar =
      confirm(
        "Tem certeza que deseja excluir este lançamento?"
      );

    if (!confirmar) return;

    try {

      const {
        error
      } =
        await supabase
          .from("lancamentos")
          .delete()
          .eq("id", id);

      if (error) {

        console.error(
          "Erro ao excluir:",
          error
        );

        alert(
          "Erro ao excluir lançamento."
        );

        return;

      }

      await carregarDados();

      atualizarDashboard();

      renderizarLista();

      alert(
        "Lançamento excluído com sucesso!"
      );

    } catch (erro) {

      console.error(
        "Erro inesperado:",
        erro
      );

      alert(
        "Ocorreu um erro ao excluir."
      );

    }

  }

  /* ======================================================
     EXPORTAÇÃO PDF
  ====================================================== */

  const btnExportarPdf =
    document.getElementById(
      "btnExportarPdf"
    );

  if (btnExportarPdf) {

    btnExportarPdf.onclick = () => {

      if (
        !window.jspdf ||
        !window.jspdf.jsPDF
      ) {

        alert(
          "Biblioteca de PDF não carregada."
        );

        return;

      }

      const {
        jsPDF
      } = window.jspdf;

      const pdf =
        new jsPDF();

      pdf.setFontSize(16);

      pdf.text(
        "TCS Finance – Extrato Financeiro",
        10,
        15
      );

      pdf.setFontSize(10);

      pdf.text(
        `Período: ${
          formatarPeriodo(
            filtroMes?.value || ""
          )
        }`,
        10,
        23
      );

      let y = 35;

      dados.forEach(l => {

        const linha =
          `${formatarData(l.data)} | ` +
          `${l.tipo} | ` +
          `${l.categoria || ""} | ` +
          `${formatarMoeda(l.valor)} | ` +
          `${l.status || "Pago"}`;

        pdf.text(
          linha,
          10,
          y
        );

        y += 7;

        if (y > 280) {

          pdf.addPage();

          y = 20;

        }

      });

      pdf.save(
        "extrato-financeiro.pdf"
      );

    };

  }

  /* ======================================================
     FILTRO INICIAL
  ====================================================== */

  if (filtroMes) {

    filtroMes.value =
      obterMesAtual();

  }

  atualizarPeriodoDashboard();

  /* ======================================================
     SESSÃO EXISTENTE
  ====================================================== */

  try {

    const {
      data: sessionData
    } =
      await supabase.auth.getSession();

    const usuario =
      sessionData?.session?.user;

    if (usuario) {

      window.__USER_SESSION__ =
        usuario;

      await iniciarSessao(
        usuario
      );

    }

  } catch (erro) {

    console.error(
      "Erro ao recuperar sessão:",
      erro
    );

  }

});
/* =========================================================
   TCS FINANCE - MENU MOBILE
   ========================================================= */

(function () {

    function iniciarMenuMobile() {

        const btnMenu = document.getElementById("btnMenu");

        if (!btnMenu) {
            console.warn("TCS Finance: #btnMenu não encontrado.");
            return;
        }

        /*
         * Procura a sidebar existente.
         * Mantém compatibilidade com diferentes versões
         * do layout.
         */
        const sidebar =
            document.getElementById("sidebar") ||
            document.querySelector(".sidebar") ||
            document.querySelector("aside");

        if (!sidebar) {
            console.warn("TCS Finance: sidebar não encontrada.");
            return;
        }


        /* Cria overlay se ainda não existir */
        let overlay = document.getElementById("mobileOverlay");

        if (!overlay) {

            overlay = document.createElement("div");

            overlay.id = "mobileOverlay";

            document.body.appendChild(overlay);
        }


        /* Abre menu */
        function abrirMenu() {

            sidebar.classList.add("mobile-open");

            document.body.classList.add("menu-open");

            btnMenu.setAttribute("aria-expanded", "true");

            document.body.style.overflow = "hidden";
        }


        /* Fecha menu */
        function fecharMenu() {

            sidebar.classList.remove("mobile-open");

            document.body.classList.remove("menu-open");

            btnMenu.setAttribute("aria-expanded", "false");

            document.body.style.overflow = "";
        }


        /* Botão hamburger */
        btnMenu.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const aberto =
                document.body.classList.contains("menu-open");

            if (aberto) {
                fecharMenu();
            } else {
                abrirMenu();
            }

        });


        /* Clicar fora fecha */
        overlay.addEventListener("click", function () {
            fecharMenu();
        });


        /* Clicar em um link do menu fecha no celular */
        sidebar.addEventListener("click", function (event) {

            const link = event.target.closest("a, button");

            if (!link) return;

            if (window.innerWidth <= 768) {

                /*
                 * Pequeno atraso para não interferir
                 * na navegação existente.
                 */
                setTimeout(function () {
                    fecharMenu();
                }, 50);

            }

        });


        /* ESC fecha */
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                fecharMenu();
            }

        });


        /* Ao voltar para desktop */
        window.addEventListener("resize", function () {

            if (window.innerWidth > 768) {
                fecharMenu();
            }

        });

    }


    /*
     * Garante que o DOM esteja carregado.
     */
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarMenuMobile
        );

    } else {

        iniciarMenuMobile();

    }

})();