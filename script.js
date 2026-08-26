/* =========================================================
   TCS FINANCE
   SCRIPT.JS — VERSÃO SEM RECORRÊNCIAS
   25/08/2026
   =========================================================
   Recursos:
   - Login / sessão persistente / logout
   - Cadastro / recuperação de senha
   - Lançamentos: Receita, Despesa, Investimento
   - Categorias por tipo
   - Tipos de investimento detalhados por categoria
   - Editar / excluir lançamentos
   - Filtro mensal
   - Dashboard financeiro
   - Gastos por categoria
   - Investimentos por categoria
   - Gráficos Chart.js
   - Alertas financeiros
   - Exportação PDF
   - Compatível com o HTML atual
   - NÃO usa lancamentos_recorrentes
   ========================================================= */

console.log("TCS Finance: carregando Script.js...");

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     CONFIGURAÇÃO
     ========================================================= */

  const SUPABASE_URL = "https://figkamlmpangolnasaby.supabase.co";
  const SUPABASE_KEY = "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL";

  const LIMITE_FREE = 30;
  const $ = (id) => document.getElementById(id);

  let supabaseClient = null;
  let usuarioAtual = null;
  let dados = [];
  let categoriasFinanceiras = [];
  let idEmEdicao = null;

  let grafico = null;
  let graficoMensal = null;
  let graficoComparativo = null;

  let inicializando = false;
  let sessaoPronta = false;

  /* =========================================================
     ELEMENTOS
     ========================================================= */

  const loginContainer = $("login-container");
  const app = $("app");
  const dashboard = $("dashboard");
  const lancamentos = $("lancamentos");
  const relatorios = $("relatorios");
  const contas = $("contas");
  const categoriasView = $("categorias");

  const emailInput = $("email");
  const senhaInput = $("senha");
  const aceiteTermos = $("aceiteTermos");

  const btnLogin = $("btnLogin");
  const btnCadastro = $("btnCadastro");
  const btnEsqueciSenha = $("btnEsqueciSenha");
  const btnLogout = $("btnLogout");
  const btnLogoutTop = $("btnLogoutTop");

  const btnDashboard = $("btnDashboard");
  const btnLancamentos = $("btnLancamentos");
  const btnRelatorios = $("btnRelatorios");
  const btnContas = $("btnContas");

  const btnSalvar = $("btnSalvar");
  const tipo = $("tipo");
  const categoria = $("categoria");
  const descricao = $("descricao");
  const valor = $("valor");
  const dataInput = $("data");
  const lista = $("listaLancamentos");

  const filtroMes = $("filtroMes");
  const btnLimparFiltro = $("btnLimparFiltro");
  const dashboardPeriodo = $("dashboardPeriodo");
  const tipoGrafico = $("tipoGrafico");

  const totalReceitas = $("totalReceitas");
  const totalDespesas = $("totalDespesas");
  const totalInvestimentos = $("totalInvestimentos");
  const saldo = $("saldo");

  const nomeCliente = $("nomeCliente");
  const topbarUser = $("topbarUser");
  const topbarPlano = $("topbarPlano");
  const planoUsuario = $("planoUsuario");

  const btnExportarPdf = $("btnExportarPdf");

  const btnMenu = $("btnMenu");
  const sidebar = document.querySelector(".sidebar");
  const menuOverlay = $("menuOverlay");

  /* =========================================================
     CATEGORIAS PADRÃO LOCAIS
     =========================================================
     Importante:
     Não gravamos automaticamente essas categorias no banco.
     Isso evita quebrar instalações antigas com CHECK/FK diferentes.
     O lançamento grava o NOME da categoria na coluna "categoria".
     ========================================================= */

  const categoriasPadrao = {
    Receita: [
      "Salário",
      "Renda Extra",
      "Freelance",
      "Vendas",
      "Comissões",
      "Benefícios",
      "Aluguéis",
      "Dividendos",
      "Juros",
      "Reembolsos",
      "Outras Receitas"
    ],

    Despesa: [
      "Moradia",
      "Alimentação",
      "Transporte",
      "Saúde",
      "Educação",
      "Lazer",
      "Compras",
      "Cartão de Crédito",
      "Contas",
      "Impostos",
      "Empréstimos",
      "Seguros",
      "Assinaturas",
      "Viagens",
      "Pets",
      "Compras diversas",
      "Outras Despesas"
    ],

    Investimento: [
      "Tesouro Direto",
      "CDB",
      "LCI/LCA",
      "Ações",
      "FIIs",
      "ETFs",
      "Criptomoedas",
      "Previdência",
      "Poupança",
      "Renda Fixa",
      "Outros Investimentos"
    ]
  };

  /* =========================================================
     UTILITÁRIOS
     ========================================================= */

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      };
      return map[char];
    });
  }

  function normalizarTipo(value) {
    const texto = String(value ?? "").trim().toLowerCase();

    if (texto === "receita") return "Receita";
    if (texto === "despesa") return "Despesa";
    if (texto === "investimento") return "Investimento";

    return String(value ?? "");
  }

  function numero(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    let texto = String(value ?? "").trim();

    if (!texto) return 0;

    /*
      Aceita:
      1234.56
      1234,56
      1.234,56
    */
    if (texto.includes(",")) {
      texto = texto.replace(/\./g, "").replace(",", ".");
    }

    const n = Number(texto);
    return Number.isFinite(n) ? n : 0;
  }

  function formatarMoeda(value) {
    return numero(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function formatarNumero(value) {
    return numero(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatarData(value) {
    if (!value) return "";

    const texto = String(value).slice(0, 10);
    const partes = texto.split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return texto;
  }

  function obterDataHoje() {
    const hoje = new Date();

    return [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, "0"),
      String(hoje.getDate()).padStart(2, "0")
    ].join("-");
  }

  function obterMesAtual() {
    const hoje = new Date();

    return [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, "0")
    ].join("-");
  }

  function formatarPeriodo(value) {
    if (!value) return "Todos os períodos";

    const partes = String(value).split("-");

    if (partes.length !== 2) return value;

    const data = new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      1
    );

    return data.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric"
    });
  }

  function obterNomeCategoriaDoSelect() {
    if (!categoria) return "";

    const option = categoria.options[categoria.selectedIndex];

    return (
      option?.dataset?.nome ||
      option?.textContent ||
      categoria.value ||
      ""
    ).trim();
  }

  function mostrarErroSupabase(prefixo, error) {
    console.error(prefixo, error);

    const mensagem = error?.message || "Erro desconhecido.";

    alert(`${prefixo}\n\n${mensagem}`);
  }

  /* =========================================================
     VISUAL
     ========================================================= */

  function mostrarLogin() {
    if (app) {
      app.classList.add("hidden");
      app.style.display = "none";
    }

    if (loginContainer) {
      loginContainer.classList.remove("hidden");
      loginContainer.style.display = "flex";
    }
  }

  function mostrarApp() {
    if (loginContainer) {
      loginContainer.classList.add("hidden");
      loginContainer.style.display = "none";
    }

    if (app) {
      app.classList.remove("hidden");
      app.style.display = "flex";
    }
  }

  function mostrarTela(tela) {
    [
      dashboard,
      lancamentos,
      relatorios,
      contas,
      categoriasView
    ].forEach((elemento) => {
      if (elemento) elemento.classList.add("hidden");
    });

    if (tela) tela.classList.remove("hidden");

    fecharMenuMobile();
  }

  function ativarMenu(botao) {
    document
      .querySelectorAll(".sidebar .nav-item, .sidebar button")
      .forEach((elemento) => elemento.classList.remove("active"));

    if (botao) botao.classList.add("active");
  }

  function fecharMenuMobile() {
    if (sidebar) sidebar.classList.remove("active");
    if (menuOverlay) menuOverlay.classList.add("hidden");
  }

  /* =========================================================
     SUPABASE
     ========================================================= */

  function inicializarSupabase() {
    if (
      !window.supabase ||
      typeof window.supabase.createClient !== "function"
    ) {
      console.error("Supabase JS não encontrado.");
      alert(
        "O Supabase não foi carregado. Verifique se o script do Supabase está no HTML antes do script.js."
      );
      return false;
    }

    try {
      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );

      console.log("Supabase inicializado.");
      return true;
    } catch (error) {
      console.error("Erro ao inicializar Supabase:", error);
      alert("Não foi possível inicializar o sistema.");
      return false;
    }
  }

  async function obterUsuarioAtual() {
    if (!supabaseClient) return null;

    try {
      const { data, error } = await supabaseClient.auth.getUser();

      if (error) {
        console.warn("getUser:", error.message);
        return null;
      }

      return data?.user || null;
    } catch (error) {
      console.error("Erro getUser:", error);
      return null;
    }
  }

  /* =========================================================
     CATEGORIAS
     ========================================================= */

  async function carregarCategoriasFinanceiras() {
    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      categoriasFinanceiras = [];
      return;
    }

    /*
      Tentamos buscar as categorias já existentes.
      Se a tabela não existir ou estiver incompatível,
      o sistema continua funcionando com as categorias locais.
    */

    try {
      const resultado = await supabaseClient
        .from("categorias_financeiras")
        .select("id,nome,tipo,ativa")
        .eq("user_id", user.id)
        .eq("ativa", true)
        .order("nome", { ascending: true });

      if (!resultado.error && Array.isArray(resultado.data)) {
        categoriasFinanceiras = resultado.data;
        return;
      }

      console.warn(
        "Tabela categorias_financeiras indisponível. Usando categorias locais."
      );
    } catch (error) {
      console.warn("Erro ao consultar categorias:", error);
    }

    categoriasFinanceiras = [];
  }

  function obterCategoriasParaTipo(tipoSelecionado) {
    const tipoNormalizado = normalizarTipo(tipoSelecionado);

    const categoriasDoBanco = categoriasFinanceiras
      .filter(
        (item) =>
          normalizarTipo(item.tipo) === tipoNormalizado &&
          item.nome
      )
      .map((item) => ({
        id: item.id,
        nome: item.nome
      }));

    if (categoriasDoBanco.length) {
      return categoriasDoBanco;
    }

    return (categoriasPadrao[tipoNormalizado] || []).map((nome) => ({
      id: nome,
      nome
    }));
  }

  function atualizarSelectCategorias(
    tipoSelecionado = "",
    categoriaSelecionada = ""
  ) {
    if (!categoria) return;

    categoria.innerHTML =
      "<option value=''>Selecione uma categoria</option>";

    if (!tipoSelecionado) {
      categoria.disabled = true;
      return;
    }

    categoria.disabled = false;

    const listaCategorias =
      obterCategoriasParaTipo(tipoSelecionado);

    listaCategorias.forEach((item) => {
      const option = document.createElement("option");

      /*
        O valor é o ID somente quando a categoria veio do banco.
        Porém o texto/nome é o que será salvo em lancamentos.
      */
      option.value = item.id ?? item.nome;
      option.textContent = item.nome;
      option.dataset.nome = item.nome;

      if (
        String(categoriaSelecionada) === String(item.id) ||
        String(categoriaSelecionada) === String(item.nome)
      ) {
        option.selected = true;
      }

      categoria.appendChild(option);
    });
  }

  if (tipo) {
    tipo.addEventListener("change", () => {
      atualizarSelectCategorias(tipo.value);
    });
  }

  /* =========================================================
     LANÇAMENTOS — CARREGAR
     ========================================================= */

  async function carregarDados() {
    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      dados = [];
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from("lancamentos")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false });

      if (error) {
        console.error("Erro ao carregar lançamentos:", error);
        dados = [];
        return;
      }

      dados = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro inesperado ao carregar lançamentos:", error);
      dados = [];
    }
  }

  /* =========================================================
     LANÇAMENTOS — LIMPAR
     ========================================================= */

  function limparFormulario() {
    idEmEdicao = null;

    if (tipo) tipo.value = "";

    if (categoria) {
      categoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";
      categoria.disabled = true;
    }

    if (descricao) descricao.value = "";
    if (valor) valor.value = "";
    if (dataInput) dataInput.value = obterDataHoje();

    if (btnSalvar) btnSalvar.innerText = "Salvar";
  }

  /* =========================================================
     LANÇAMENTOS — SALVAR / EDITAR
     ========================================================= */

  async function salvarLancamento() {
    if (!supabaseClient) {
      alert("Sistema ainda não inicializado.");
      return;
    }

    if (
      !tipo?.value ||
      !categoria?.value ||
      !valor?.value ||
      !dataInput?.value
    ) {
      alert("Preencha tipo, categoria, valor e data.");
      return;
    }

    const valorNumerico = numero(valor.value);

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    if (
      usuarioAtual?.user_metadata?.plano?.toUpperCase?.() === "FREE" &&
      dados.length >= LIMITE_FREE &&
      !idEmEdicao
    ) {
      alert(
        `O plano gratuito permite até ${LIMITE_FREE} lançamentos.`
      );
      return;
    }

    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      alert("Sua sessão expirou. Faça login novamente.");
      mostrarLogin();
      return;
    }

    const nomeCategoria = obterNomeCategoriaDoSelect();

    const registro = {
      tipo: normalizarTipo(tipo.value),
      categoria: nomeCategoria,
      descricao: descricao?.value?.trim() || "",
      valor: valorNumerico,
      data: dataInput.value
    };

    try {
      let resultado;

      if (idEmEdicao) {
        resultado = await supabaseClient
          .from("lancamentos")
          .update(registro)
          .eq("id", idEmEdicao)
          .eq("user_id", user.id);
      } else {
        resultado = await supabaseClient
          .from("lancamentos")
          .insert({
            user_id: user.id,
            ...registro
          });
      }

      if (resultado.error) {
        mostrarErroSupabase(
          "Não foi possível salvar o lançamento.",
          resultado.error
        );
        return;
      }

      limparFormulario();
      await carregarDados();
      atualizarDashboard();
      renderizarLista();

      alert(
        idEmEdicao
          ? "Lançamento atualizado com sucesso!"
          : "Lançamento salvo com sucesso!"
      );
    } catch (error) {
      console.error("Salvar lançamento:", error);
      alert("Ocorreu um erro ao salvar o lançamento.");
    }
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarLancamento);
  }

  /* =========================================================
     FILTRO
     ========================================================= */

  function obterDadosFiltrados() {
    if (!filtroMes?.value) {
      return [...dados];
    }

    return dados.filter((item) =>
      String(item.data || "").startsWith(filtroMes.value)
    );
  }

  /* =========================================================
     RESUMOS
     ========================================================= */

  function calcularResumo(registros) {
    const resumo = {
      receita: 0,
      despesa: 0,
      investimento: 0
    };

    registros.forEach((item) => {
      const valorItem = numero(item.valor);
      const tipoItem = normalizarTipo(item.tipo);

      if (tipoItem === "Receita") resumo.receita += valorItem;
      if (tipoItem === "Despesa") resumo.despesa += valorItem;
      if (tipoItem === "Investimento") resumo.investimento += valorItem;
    });

    resumo.saldo = resumo.receita - resumo.despesa;

    return resumo;
  }

  function agruparPorCategoria(registros, tipoDesejado) {
    const mapa = {};

    registros.forEach((item) => {
      if (normalizarTipo(item.tipo) !== tipoDesejado) return;

      const nome =
        String(item.categoria || "Sem categoria").trim() ||
        "Sem categoria";

      mapa[nome] = (mapa[nome] || 0) + numero(item.valor);
    });

    return Object.entries(mapa)
      .sort((a, b) => b[1] - a[1])
      .map(([categoriaNome, total]) => ({
        categoria: categoriaNome,
        total
      }));
  }

  function agruparPorMes(registros) {
    const mapa = {};

    registros.forEach((item) => {
      const mes = String(item.data || "").slice(0, 7);

      if (!mes) return;

      if (!mapa[mes]) {
        mapa[mes] = {
          receita: 0,
          despesa: 0,
          investimento: 0
        };
      }

      const tipoItem = normalizarTipo(item.tipo);
      const valorItem = numero(item.valor);

      if (tipoItem === "Receita") mapa[mes].receita += valorItem;
      if (tipoItem === "Despesa") mapa[mes].despesa += valorItem;
      if (tipoItem === "Investimento") {
        mapa[mes].investimento += valorItem;
      }
    });

    return mapa;
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */

  function atualizarPeriodoDashboard() {
    if (dashboardPeriodo) {
      dashboardPeriodo.innerText = formatarPeriodo(
        filtroMes?.value || ""
      );
    }
  }

  function destruirGrafico(referencia) {
    if (referencia) {
      try {
        referencia.destroy();
      } catch (_) {}
    }
  }

  function atualizarDashboard() {
    const filtrados = obterDadosFiltrados();
    const resumo = calcularResumo(filtrados);

    if (totalReceitas) {
      totalReceitas.innerText = formatarMoeda(resumo.receita);
    }

    if (totalDespesas) {
      totalDespesas.innerText = formatarMoeda(resumo.despesa);
    }

    if (totalInvestimentos) {
      totalInvestimentos.innerText =
        formatarMoeda(resumo.investimento);
    }

    if (saldo) {
      saldo.innerText = formatarMoeda(resumo.saldo);
    }

    atualizarPeriodoDashboard();

    renderizarGrafico(
      filtrados,
      resumo.receita,
      resumo.despesa,
      resumo.investimento
    );

    renderizarGraficoMensal(filtrados);
    renderizarGraficoComparativo(filtrados);
    renderizarAnaliseCategorias(filtrados);
    renderizarAlertas(filtrados);
    atualizarRelatorios();
  }

  /* =========================================================
     GRÁFICO PRINCIPAL
     ========================================================= */

  function renderizarGrafico(
    filtrados,
    receita,
    despesa,
    investimento
  ) {
    const canvas = $("grafico");

    if (!canvas || !window.Chart) return;

    destruirGrafico(grafico);

    const modo = tipoGrafico?.value || "geral";

    let labels = [];
    let valores = [];

    if (modo === "categoria") {
      const despesas = agruparPorCategoria(
        filtrados,
        "Despesa"
      );

      const investimentos = agruparPorCategoria(
        filtrados,
        "Investimento"
      );

      const receitas = agruparPorCategoria(
        filtrados,
        "Receita"
      );

      const todos = [
        ...despesas.map((x) => ({
          label: `Despesa • ${x.categoria}`,
          total: x.total
        })),
        ...investimentos.map((x) => ({
          label: `Investimento • ${x.categoria}`,
          total: x.total
        })),
        ...receitas.map((x) => ({
          label: `Receita • ${x.categoria}`,
          total: x.total
        }))
      ].sort((a, b) => b.total - a.total);

      labels = todos.map((x) => x.label);
      valores = todos.map((x) => x.total);
    } else {
      labels = ["Receitas", "Despesas", "Investimentos"];
      valores = [receita, despesa, investimento];
    }

    grafico = new Chart(canvas, {
      type: "doughnut",
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  }

  /* =========================================================
     GRÁFICO MENSAL
     ========================================================= */

  function renderizarGraficoMensal(filtrados) {
    const canvas = $("graficoMensal");

    if (!canvas || !window.Chart) return;

    destruirGrafico(graficoMensal);

    const mapa = agruparPorMes(filtrados);
    const labels = Object.keys(mapa).sort();

    if (!labels.length) return;

    graficoMensal = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Receitas",
            data: labels.map((mes) => mapa[mes].receita)
          },
          {
            label: "Despesas",
            data: labels.map((mes) => mapa[mes].despesa)
          },
          {
            label: "Investimentos",
            data: labels.map((mes) => mapa[mes].investimento)
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
    });
  }

  /* =========================================================
     GRÁFICO COMPARATIVO
     ========================================================= */

  function renderizarGraficoComparativo(filtrados) {
    const canvas = $("graficoComparativo");

    if (!canvas || !window.Chart) return;

    destruirGrafico(graficoComparativo);

    const mapa = agruparPorMes(filtrados);
    const labels = Object.keys(mapa).sort();

    if (!labels.length) return;

    graficoComparativo = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Receitas",
            data: labels.map((mes) => mapa[mes].receita),
            tension: 0.25,
            borderWidth: 3
          },
          {
            label: "Despesas",
            data: labels.map((mes) => mapa[mes].despesa),
            tension: 0.25,
            borderWidth: 3
          },
          {
            label: "Investimentos",
            data: labels.map((mes) => mapa[mes].investimento),
            tension: 0.25,
            borderWidth: 3
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
    });
  }

  /* =========================================================
     ANÁLISE DE CATEGORIAS
     =========================================================
     Criada dinamicamente para não exigir alteração imediata
     no HTML atual.
     ========================================================= */

  function renderizarAnaliseCategorias(registros) {
    if (!dashboard) return;

    let bloco = $("analiseCategoriasTCS");

    if (!bloco) {
      bloco = document.createElement("div");
      bloco.id = "analiseCategoriasTCS";
      bloco.className = "grafico-box";
      dashboard.appendChild(bloco);
    }

    const despesas = agruparPorCategoria(registros, "Despesa");
    const investimentos = agruparPorCategoria(
      registros,
      "Investimento"
    );

    const totalDespesas = despesas.reduce(
      (soma, item) => soma + item.total,
      0
    );

    const totalInvestimentos = investimentos.reduce(
      (soma, item) => soma + item.total,
      0
    );

    const topDespesas = despesas.slice(0, 5);
    const topInvestimentos = investimentos.slice(0, 5);

    const montarLista = (lista, total) => {
      if (!lista.length) {
        return "<p>Nenhum lançamento no período.</p>";
      }

      return `
        <div class="tcs-analise-lista">
          ${lista
            .map((item, index) => {
              const percentual =
                total > 0
                  ? (item.total / total) * 100
                  : 0;

              return `
                <div class="tcs-analise-item">
                  <div>
                    <strong>${index + 1}. ${escapeHtml(
                item.categoria
              )}</strong>
                    <small>${percentual.toFixed(
                      1
                    )}% do total</small>
                  </div>
                  <strong>${formatarMoeda(
                    item.total
                  )}</strong>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    };

    bloco.innerHTML = `
      <div class="grafico-header">
        <div>
          <h3>Onde seu dinheiro está indo</h3>
          <p>Principais categorias de despesas e investimentos no período.</p>
        </div>
      </div>

      <div style="
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
        gap:20px;
      ">
        <div>
          <h4>🔴 Maiores despesas</h4>
          ${montarLista(topDespesas, totalDespesas)}
        </div>

        <div>
          <h4>🟢 Maiores investimentos</h4>
          ${montarLista(
            topInvestimentos,
            totalInvestimentos
          )}
        </div>
      </div>
    `;
  }

  /* =========================================================
     ALERTAS
     ========================================================= */

  function renderizarAlertas(registros) {
    const container = $("alertasInteligentes");

    if (!container) return;

    const resumo = calcularResumo(registros);
    const alertas = [];

    if (resumo.saldo < 0) {
      alertas.push(
        "🔴 Seu saldo está negativo neste período."
      );
    }

    if (
      resumo.receita > 0 &&
      resumo.despesa > resumo.receita
    ) {
      alertas.push(
        "⚠️ Suas despesas estão maiores que suas receitas."
      );
    } else if (resumo.receita > 0) {
      const percentual =
        (resumo.despesa / resumo.receita) * 100;

      if (percentual > 70) {
        alertas.push(
          `🟡 Suas despesas consomem ${percentual.toFixed(
            0
          )}% das receitas.`
        );
      }
    }

    if (
      resumo.receita > 0 &&
      resumo.investimento === 0
    ) {
      alertas.push(
        "💡 Não há investimentos registrados neste período."
      );
    }

    if (!alertas.length) {
      alertas.push(
        "✅ Nenhum alerta crítico identificado neste período."
      );
    }

    container.innerHTML = alertas
      .map(
        (texto) =>
          `<div class="alerta">${escapeHtml(texto)}</div>`
      )
      .join("");
  }

  /* =========================================================
     LISTA / EXTRATO
     ========================================================= */

  function renderizarLista() {
    if (!lista) return;

    lista.innerHTML = "";

    const filtrados = obterDadosFiltrados();

    if (!filtrados.length) {
      lista.innerHTML =
        "<li>Nenhum lançamento encontrado para o período.</li>";
      return;
    }

    filtrados.forEach((item) => {
      const li = document.createElement("li");

      const tipoItem = normalizarTipo(item.tipo);

      li.innerHTML = `
        <div>
          <strong>
            ${escapeHtml(
              item.descricao ||
                item.categoria ||
                "Sem descrição"
            )}
          </strong>

          <small>
            ${escapeHtml(tipoItem)}
            •
            ${escapeHtml(
              item.categoria || "Sem categoria"
            )}
            •
            ${formatarData(item.data)}
          </small>
        </div>

        <div>
          <strong>${formatarMoeda(item.valor)}</strong>

          <button
            type="button"
            data-acao="editar"
            data-id="${escapeHtml(item.id)}"
            title="Editar"
          >
            ✏️
          </button>

          <button
            type="button"
            data-acao="excluir"
            data-id="${escapeHtml(item.id)}"
            title="Excluir"
          >
            🗑️
          </button>
        </div>
      `;

      lista.appendChild(li);
    });
  }

  async function editarLancamento(id) {
    const item = dados.find(
      (registro) => String(registro.id) === String(id)
    );

    if (!item) {
      alert("Lançamento não encontrado.");
      return;
    }

    idEmEdicao = item.id;

    if (tipo) {
      tipo.value = normalizarTipo(item.tipo);
    }

    atualizarSelectCategorias(
      tipo?.value || "",
      item.categoria
    );

    if (descricao) {
      descricao.value = item.descricao || "";
    }

    if (valor) {
      valor.value = formatarNumero(item.valor);
    }

    if (dataInput) {
      dataInput.value = String(item.data || "").slice(0, 10);
    }

    if (btnSalvar) {
      btnSalvar.innerText = "Atualizar";
    }

    mostrarTela(lancamentos);
    fecharMenuMobile();
  }

  async function excluirLancamento(id) {
    if (!confirm("Tem certeza que deseja excluir este lançamento?")) {
      return;
    }

    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      mostrarLogin();
      return;
    }

    try {
      const { error } = await supabaseClient
        .from("lancamentos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        mostrarErroSupabase(
          "Não foi possível excluir o lançamento.",
          error
        );
        return;
      }

      await carregarDados();
      atualizarDashboard();
      renderizarLista();
    } catch (error) {
      console.error("Excluir lançamento:", error);
      alert("Ocorreu um erro ao excluir.");
    }
  }

  if (lista) {
    lista.addEventListener("click", (event) => {
      const botao = event.target.closest(
        "button[data-acao]"
      );

      if (!botao) return;

      const id = botao.dataset.id;

      if (botao.dataset.acao === "editar") {
        editarLancamento(id);
      }

      if (botao.dataset.acao === "excluir") {
        excluirLancamento(id);
      }
    });
  }

  /* =========================================================
     RELATÓRIOS
     ========================================================= */

  function atualizarRelatorios() {
    const registros = obterDadosFiltrados();
    const resumo = calcularResumo(registros);

    const campos = {
      relatorioReceitas: formatarMoeda(resumo.receita),
      relatorioDespesas: formatarMoeda(resumo.despesa),
      relatorioInvestimentos: formatarMoeda(
        resumo.investimento
      ),
      relatorioSaldo: formatarMoeda(resumo.saldo),
      relatorioResumoReceitas: formatarMoeda(
        resumo.receita
      ),
      relatorioResumoDespesas: formatarMoeda(
        resumo.despesa
      ),
      relatorioResumoInvestimentos: formatarMoeda(
        resumo.investimento
      ),
      relatorioResumoSaldo: formatarMoeda(
        resumo.saldo
      ),
      relatorioPeriodo: formatarPeriodo(
        filtroMes?.value || ""
      )
    };

    Object.entries(campos).forEach(([id, texto]) => {
      const elemento = $(id);
      if (elemento) elemento.innerText = texto;
    });
  }

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */

  if (btnDashboard) {
    btnDashboard.addEventListener("click", () => {
      mostrarTela(dashboard);
      ativarMenu(btnDashboard);
      atualizarDashboard();
    });
  }

  if (btnLancamentos) {
    btnLancamentos.addEventListener("click", () => {
      mostrarTela(lancamentos);
      ativarMenu(btnLancamentos);
      renderizarLista();
    });
  }

  if (btnRelatorios) {
    btnRelatorios.addEventListener("click", () => {
      mostrarTela(relatorios);
      ativarMenu(btnRelatorios);
      atualizarRelatorios();
    });
  }

  if (btnContas) {
    btnContas.addEventListener("click", () => {
      mostrarTela(contas);
      ativarMenu(btnContas);
    });
  }

  /* =========================================================
     FILTROS
     ========================================================= */

  if (filtroMes) {
    filtroMes.value = obterMesAtual();

    filtroMes.addEventListener("change", () => {
      atualizarPeriodoDashboard();
      atualizarDashboard();
      renderizarLista();
    });
  }

  if (btnLimparFiltro) {
    btnLimparFiltro.addEventListener("click", () => {
      if (filtroMes) filtroMes.value = "";

      atualizarPeriodoDashboard();
      atualizarDashboard();
      renderizarLista();
    });
  }

  if (tipoGrafico) {
    tipoGrafico.addEventListener("change", () => {
      atualizarDashboard();
    });
  }

  /* =========================================================
     MENU MOBILE
     ========================================================= */

  if (btnMenu) {
    btnMenu.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("active");
      if (menuOverlay) menuOverlay.classList.toggle("hidden");
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", fecharMenuMobile);
  }

  /* =========================================================
     LOGOUT
     ========================================================= */

  async function fazerLogout() {
    try {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
    } catch (error) {
      console.error("Logout:", error);
    }

    usuarioAtual = null;
    dados = [];
    categoriasFinanceiras = [];
    idEmEdicao = null;
    sessaoPronta = false;

    mostrarLogin();
  }

  if (btnLogoutTop) {
    btnLogoutTop.addEventListener("click", fazerLogout);
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", fazerLogout);
  }

  /* =========================================================
     SESSÃO
     ========================================================= */

  async function iniciarSessao(user) {
    if (!user) return;

    /*
      Evita que SIGNED_IN + login manual façam várias
      inicializações simultâneas.
    */
    if (sessaoPronta && usuarioAtual?.id === user.id) {
      return;
    }

    usuarioAtual = user;
    sessaoPronta = true;

    const nome =
      user.user_metadata?.nome ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Usuário";

    if (topbarUser) topbarUser.innerText = nome;
    if (topbarPlano) topbarPlano.innerText = "FREE";
    if (planoUsuario) planoUsuario.innerText = "Plano Free";
    if (nomeCliente) nomeCliente.innerText = `Olá, ${nome}!`;

    mostrarApp();
    mostrarTela(dashboard);
    ativarMenu(btnDashboard);

    if (filtroMes && !filtroMes.value) {
      filtroMes.value = obterMesAtual();
    }

    atualizarPeriodoDashboard();

    await carregarCategoriasFinanceiras();
    atualizarSelectCategorias(tipo?.value || "");
    await carregarDados();

    atualizarDashboard();
    renderizarLista();
  }

  /* =========================================================
     LOGIN
     ========================================================= */

  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      if (!supabaseClient) {
        alert("Sistema ainda não inicializado.");
        return;
      }

      const email = emailInput?.value?.trim() || "";
      const senha = senhaInput?.value || "";

      if (!email || !senha) {
        alert("Informe email e senha.");
        return;
      }

      btnLogin.disabled = true;
      const textoOriginal = btnLogin.innerText;
      btnLogin.innerText = "Entrando...";

      try {
        const { data, error } =
          await supabaseClient.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: senha
          });

        if (error) {
          console.error("Erro de login:", error);
          alert(
            `Não foi possível entrar.\n\n${error.message}`
          );
          return;
        }

        if (!data?.user) {
          alert(
            "O Supabase não retornou um usuário válido."
          );
          return;
        }

        /*
          Em algumas configurações o SIGNED_IN dispara
          imediatamente; chamamos também aqui para garantir
          que a interface seja aberta sem depender do callback.
        */
        await iniciarSessao(data.user);
      } catch (error) {
        console.error("LOGIN:", error);
        alert(
          "Não foi possível realizar o login. Verifique sua conexão, email e senha."
        );
      } finally {
        btnLogin.disabled = false;
        btnLogin.innerText = textoOriginal;
      }
    });
  }

  /* =========================================================
     CADASTRO
     ========================================================= */

  if (btnCadastro) {
    btnCadastro.addEventListener("click", async () => {
      if (!supabaseClient) {
        alert("Sistema ainda não inicializado.");
        return;
      }

      if (aceiteTermos && !aceiteTermos.checked) {
        alert("Você precisa aceitar os termos.");
        return;
      }

      const email = emailInput?.value?.trim() || "";
      const senha = senhaInput?.value || "";

      if (!email || !senha) {
        alert("Informe email e senha.");
        return;
      }

      if (senha.length < 6) {
        alert("A senha deve possuir pelo menos 6 caracteres.");
        return;
      }

      btnCadastro.disabled = true;
      const textoOriginal = btnCadastro.innerText;
      btnCadastro.innerText = "Criando...";

      try {
        const { data, error } =
          await supabaseClient.auth.signUp({
            email,
            password: senha,
            options: {
              data: {
                nome: email.split("@")[0]
              }
            }
          });

        if (error) {
          console.error("Cadastro:", error);
          alert(
            `Não foi possível criar a conta.\n\n${error.message}`
          );
          return;
        }

        if (data?.session && data?.user) {
          await iniciarSessao(data.user);
          return;
        }

        alert(
          "Conta criada com sucesso! Verifique seu email para confirmar o cadastro."
        );
      } catch (error) {
        console.error("CADASTRO:", error);
        alert("Não foi possível criar a conta.");
      } finally {
        btnCadastro.disabled = false;
        btnCadastro.innerText = textoOriginal;
      }
    });
  }

  /* =========================================================
     RECUPERAÇÃO DE SENHA
     ========================================================= */

  if (btnEsqueciSenha) {
    btnEsqueciSenha.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!supabaseClient) {
        alert("Sistema ainda não inicializado.");
        return;
      }

      const email = emailInput?.value?.trim() || "";

      if (!email) {
        alert("Informe seu email primeiro.");
        return;
      }

      try {
        const { error } =
          await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
              redirectTo:
                window.location.origin +
                window.location.pathname
            }
          );

        if (error) {
          alert(
            `Não foi possível enviar a recuperação.\n\n${error.message}`
          );
          return;
        }

        alert(
          "Enviamos as instruções de recuperação para seu email."
        );
      } catch (error) {
        console.error("Recuperação:", error);
        alert(
          "Não foi possível enviar o email de recuperação."
        );
      }
    });
  }

  /* =========================================================
     EXPORTAÇÃO PDF
     ========================================================= */

  if (btnExportarPdf) {
    btnExportarPdf.addEventListener("click", () => {
      try {
        if (
          !window.jspdf ||
          typeof window.jspdf.jsPDF !== "function"
        ) {
          alert(
            "A biblioteca de PDF não foi carregada."
          );
          return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const registros = obterDadosFiltrados();
        const resumo = calcularResumo(registros);

        pdf.setFontSize(16);
        pdf.text(
          "TCS Finance - Extrato Financeiro",
          10,
          15
        );

        pdf.setFontSize(10);
        pdf.text(
          `Período: ${formatarPeriodo(
            filtroMes?.value || ""
          )}`,
          10,
          23
        );

        pdf.text(
          `Receitas: ${formatarMoeda(resumo.receita)}`,
          10,
          31
        );

        pdf.text(
          `Despesas: ${formatarMoeda(resumo.despesa)}`,
          10,
          38
        );

        pdf.text(
          `Investimentos: ${formatarMoeda(
            resumo.investimento
          )}`,
          10,
          45
        );

        pdf.text(
          `Saldo: ${formatarMoeda(resumo.saldo)}`,
          10,
          52
        );

        let y = 65;

        registros.forEach((item) => {
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }

          const linha =
            `${formatarData(item.data)} | ` +
            `${normalizarTipo(item.tipo)} | ` +
            `${item.categoria || ""} | ` +
            `${item.descricao || ""} | ` +
            `${formatarMoeda(item.valor)}`;

          pdf.text(
            linha.substring(0, 105),
            10,
            y
          );

          y += 7;
        });

        pdf.save("TCS-Finance-Extrato.pdf");
      } catch (error) {
        console.error("PDF:", error);
        alert("Não foi possível gerar o PDF.");
      }
    });
  }

  /* =========================================================
     AUTH STATE
     ========================================================= */

  function configurarAuth() {
    if (!supabaseClient) return;

    supabaseClient.auth.onAuthStateChange(
      (evento, session) => {
        console.log(
          "Auth event:",
          evento
        );

        if (
          evento === "SIGNED_IN" &&
          session?.user
        ) {
          /*
            Não fazemos chamadas pesadas diretamente dentro
            do callback do Supabase. Isso evita deadlocks.
          */
          setTimeout(() => {
            iniciarSessao(session.user);
          }, 0);
        }

        if (
          evento === "TOKEN_REFRESHED" &&
          session?.user
        ) {
          usuarioAtual = session.user;
        }

        if (evento === "SIGNED_OUT") {
          usuarioAtual = null;
          sessaoPronta = false;
          dados = [];
          mostrarLogin();
        }
      }
    );
  }

  /* =========================================================
     INICIALIZAÇÃO
     ========================================================= */

  (async function iniciarSistema() {
    if (inicializando) return;
    inicializando = true;

    console.log(
      "TCS Finance — inicializando versão sem recorrências."
    );

    const ok = inicializarSupabase();

    if (!ok) {
      mostrarLogin();
      inicializando = false;
      return;
    }

    fecharMenuMobile();
    mostrarLogin();

    if (filtroMes) {
      filtroMes.value = obterMesAtual();
    }

    if (dataInput) {
      dataInput.value = obterDataHoje();
    }

    if (categoria) {
      categoria.disabled = true;
    }

    if (tipoGrafico && !tipoGrafico.value) {
      tipoGrafico.value = "geral";
    }

    atualizarPeriodoDashboard();
    configurarAuth();

    try {
      /*
        getSession recupera a sessão salva pelo Supabase.
        Isso é o que mantém o usuário logado ao recarregar
        a página.
      */
      const {
        data,
        error
      } = await supabaseClient.auth.getSession();

      if (error) {
        console.warn(
          "Erro ao recuperar sessão:",
          error.message
        );
      }

      if (data?.session?.user) {
        console.log(
          "Sessão existente encontrada."
        );

        await iniciarSessao(
          data.session.user
        );
      } else {
        console.log(
          "Nenhuma sessão existente."
        );

        mostrarLogin();
      }
    } catch (error) {
      console.error(
        "Erro na recuperação da sessão:",
        error
      );

      mostrarLogin();
    }

    console.log(
      "TCS Finance: inicialização concluída."
    );

    inicializando = false;
  })();
});