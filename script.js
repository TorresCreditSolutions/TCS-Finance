/* =========================================================
   TCS FINANCE
   SCRIPT.JS COMPLETO / ESTÁVEL
   =========================================================

   PRINCIPAIS CORREÇÕES:
   - Inicialização segura do Supabase
   - Login e sessão persistente
   - Logout
   - Cadastro
   - Lançamentos
   - Dashboard
   - Gráficos
   - Relatórios
   - Recorrências
   - Categorias de recorrência
   - Editar / excluir / pausar / reativar
   - Filtros
   - Exportação
   ========================================================= */

console.log("TCS Finance: carregando Script.js...");

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* =========================================================
     SUPABASE
     ========================================================= */

  let supabase = null;

  /* =========================================================
     ESTADO GLOBAL
     ========================================================= */

  let dados = [];

  let recorrenciasDados = [];

  let recorrenciaEmEdicao = null;

  let idEmEdicao = null;

  let grafico = null;

  let graficoMensal = null;

  let graficoComparativo = null;

  let categoriasRecorrenciaMapa = {};

  let planoUsuario = "FREE";

  const LIMITE_FREE = 30;

  /* =========================================================
     UTILITÁRIO DOM
     ========================================================= */

  const $ = id => document.getElementById(id);

  /* =========================================================
     ELEMENTOS PRINCIPAIS
     ========================================================= */

  const loginContainer =
    $("login-container");

  const app =
    $("app");

  const dashboard =
    $("dashboard");

  const lancamentos =
    $("lancamentos");

  const relatorios =
    $("relatorios");

  const recorrencias =
    $("recorrencias");

  const contas =
    $("contas");

  const categoriasView =
    $("categorias");

  /* =========================================================
     USUÁRIO
     ========================================================= */

  const nomeCliente =
    $("nomeCliente");

  const topbarUser =
    $("topbarUser");

  const topbarPlano =
    $("topbarPlano");

  /* =========================================================
     LOGIN
     ========================================================= */

  const emailInput =
    $("email");

  const senhaInput =
    $("senha");

  const aceiteTermos =
    $("aceiteTermos");

  const btnLogin =
    $("btnLogin");

  const btnCadastro =
    $("btnCadastro");

  const btnEsqueciSenha =
    $("btnEsqueciSenha");

  const btnLogoutTop =
    $("btnLogoutTop");

  const btnLogout =
    $("btnLogout");

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */

  const btnDashboard =
    $("btnDashboard");

  const btnLancamentos =
    $("btnLancamentos");

  const btnRecorrencias =
    $("btnRecorrencias");

  const btnRelatorios =
    $("btnRelatorios");

  const btnContas =
    $("btnContas");

  /* =========================================================
     LANÇAMENTOS
     ========================================================= */

  const btnSalvar =
    $("btnSalvar");

  const tipo =
    $("tipo");

  const categoria =
    $("categoria");

  const descricao =
    $("descricao");

  const valor =
    $("valor");

  const dataInput =
    $("data");

  const lista =
    $("listaLancamentos");

  /* =========================================================
     FILTROS
     ========================================================= */

  const filtroMes =
    $("filtroMes");

  const btnLimparFiltro =
    $("btnLimparFiltro");

  const dashboardPeriodo =
    $("dashboardPeriodo");

  const tipoGrafico =
    $("tipoGrafico");

  /* =========================================================
     DASHBOARD
     ========================================================= */

  const totalReceitas =
    $("totalReceitas");

  const totalDespesas =
    $("totalDespesas");

  const totalInvestimentos =
    $("totalInvestimentos");

  const saldo =
    $("saldo");

  /* =========================================================
     EXPORTAÇÃO
     ========================================================= */

  const btnExportarPdf =
    $("btnExportarPdf");

  /* =========================================================
     MENU MOBILE
     ========================================================= */

  const btnMenu =
    $("btnMenu");

  const sidebar =
    document.querySelector(".sidebar");

  const menuOverlay =
    $("menuOverlay");

  /* =========================================================
     RECORRÊNCIAS
     ========================================================= */

  const recTipo =
    $("recTipo");

  const recCategoria =
    $("recCategoria");

  const recDescricao =
    $("recDescricao");

  const recValor =
    $("recValor");

  const recFrequencia =
    $("recFrequencia");

  const recDiaVencimento =
    $("recDiaVencimento");

  const recDataInicio =
    $("recDataInicio");

  const recDataFim =
    $("recDataFim");

  const btnSalvarRecorrencia =
    $("btnSalvarRecorrencia");

  const btnCancelarRecorrencia =
    $("btnCancelarRecorrencia");

  const listaRecorrencias =
    $("listaRecorrencias");

  const totalRecorrencias =
    $("totalRecorrencias");

  const recorrenciasAtivas =
    $("recorrenciasAtivas");

  const recorrenciasPausadas =
    $("recorrenciasPausadas");

  const contadorRecorrencias =
    $("contadorRecorrencias");

  const tituloFormularioRecorrencia =
    $("tituloFormularioRecorrencia");

  /* =========================================================
     FREQUÊNCIAS
     ========================================================= */

  const nomesFrequencia = {

    diaria:
      "Diária",

    semanal:
      "Semanal",

    quinzenal:
      "Quinzenal",

    mensal:
      "Mensal",

    bimestral:
      "Bimestral",

    trimestral:
      "Trimestral",

    semestral:
      "Semestral",

    anual:
      "Anual"

  };

  /* =========================================================
     CATEGORIAS PADRÃO
     ========================================================= */

  const categoriasPadrao = {

    Receita: [

      "Salário",
      "Renda Extra",
      "Mesada",
      "Freelance",
      "Vendas",
      "Comissões",
      "Benefícios",
      "Aluguéis",
      "Dividendos",
      "Juros",
      "Reembolsos",
      "Outros"

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
      "Outros"

    ],

    Investimento: [

      "Renda Fixa",
      "Tesouro Direto",
      "CDB",
      "LCI/LCA",
      "Ações",
      "FIIs",
      "ETFs",
      "Criptomoedas",
      "Previdência",
      "Poupança",
      "Outros"

    ]

  };

  let categoriasFinanceiras = [];

  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHtml(valor) {

    return String(
      valor ?? ""
    ).replace(
      /[&<>'"]/g,
      caractere => {

        const mapa = {

          "&":
            "&amp;",

          "<":
            "&lt;",

          ">":
            "&gt;",

          "'":
            "&#39;",

          '"':
            "&quot;"

        };

        return mapa[
          caractere
        ];

      }
    );

  }

  /* =========================================================
     NORMALIZAR TIPO
     ========================================================= */

  function normalizarTipo(
    valor
  ) {

    const texto =
      String(
        valor ?? ""
      )
        .trim()
        .toLowerCase();

    if (
      texto ===
      "receita"
    ) {

      return "Receita";

    }

    if (
      texto ===
      "despesa"
    ) {

      return "Despesa";

    }

    if (
      texto ===
      "investimento"
    ) {

      return "Investimento";

    }

    return String(
      valor ?? ""
    );

  }

  function normalizarTipoBanco(
    valor
  ) {

    return normalizarTipo(
      valor
    ).toLowerCase();

  }

  /* =========================================================
     CONVERTER NÚMERO
     ========================================================= */

  function numero(
    valor
  ) {

    if (
      typeof valor ===
      "number"
    ) {

      return Number.isFinite(
        valor
      )
        ? valor
        : 0;

    }

    let texto =
      String(
        valor ?? ""
      ).trim();

    if (!texto) {

      return 0;

    }

    if (
      texto.includes(",")
    ) {

      texto =
        texto
          .replace(
            /\./g,
            ""
          )
          .replace(
            ",",
            "."
          );

    }

    const resultado =
      Number(
        texto
      );

    return Number.isFinite(
      resultado
    )
      ? resultado
      : 0;

  }

  /* =========================================================
     MOEDA
     ========================================================= */

  function formatarMoeda(
    valor
  ) {

    return numero(
      valor
    ).toLocaleString(
      "pt-BR",
      {

        style:
          "currency",

        currency:
          "BRL"

      }
    );

  }

  /* =========================================================
     NÚMERO
     ========================================================= */

  function formatarNumero(
    valor
  ) {

    return numero(
      valor
    ).toLocaleString(
      "pt-BR",
      {

        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2

      }
    );

  }

  /* =========================================================
     DATA
     ========================================================= */

  function formatarData(
    valor
  ) {

    if (!valor) {

      return "";

    }

    const texto =
      String(
        valor
      ).slice(
        0,
        10
      );

    const partes =
      texto.split(
        "-"
      );

    if (
      partes.length ===
      3
    ) {

      return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }

    return texto;

  }

  /* =========================================================
     DATA HOJE
     ========================================================= */

  function obterDataHoje() {

    const data =
      new Date();

    return (

      data.getFullYear() +

      "-" +

      String(
        data.getMonth() + 1
      ).padStart(
        2,
        "0"
      ) +

      "-" +

      String(
        data.getDate()
      ).padStart(
        2,
        "0"
      )

    );

  }

  /* =========================================================
     MÊS ATUAL
     ========================================================= */

  function obterMesAtual() {

    const data =
      new Date();

    return (

      data.getFullYear() +

      "-" +

      String(
        data.getMonth() + 1
      ).padStart(
        2,
        "0"
      )

    );

  }

  /* =========================================================
     PERÍODO
     ========================================================= */

  function formatarPeriodo(
    valor
  ) {

    if (!valor) {

      return "Todos os períodos";

    }

    const partes =
      String(
        valor
      ).split(
        "-"
      );

    if (
      partes.length !==
      2
    ) {

      return valor;

    }

    const data =
      new Date(
        Number(
          partes[0]
        ),
        Number(
          partes[1]
        ) - 1,
        1
      );

    return data.toLocaleDateString(
      "pt-BR",
      {

        month:
          "long",

        year:
          "numeric"

      }
    );

  }

  /* =========================================================
     VALOR DO INPUT
     ========================================================= */

  function parseValorInput(
    valor
  ) {

    return numero(
      valor
    );

  }

  /* =========================================================
     VISIBILIDADE
     ========================================================= */

  function mostrarTela(
    tela
  ) {

    [

      dashboard,
      lancamentos,
      relatorios,
      recorrencias,
      contas,
      categoriasView

    ].forEach(
      elemento => {

        if (
          elemento
        ) {

          elemento.classList.add(
            "hidden"
          );

        }

      }
    );

    if (tela) {

      tela.classList.remove(
        "hidden"
      );

    }

    fecharMenuMobile();

  }

  /* =========================================================
     LOGIN / APP
     ========================================================= */

  function mostrarLogin() {

    if (app) {

      app.classList.add(
        "hidden"
      );

      app.style.display =
        "none";

    }

    if (
      loginContainer
    ) {

      loginContainer.classList.remove(
        "hidden"
      );

      loginContainer.style.display =
        "flex";

    }

  }

  function mostrarApp() {

    if (
      loginContainer
    ) {

      loginContainer.classList.add(
        "hidden"
      );

      loginContainer.style.display =
        "none";

    }

    if (app) {

      app.classList.remove(
        "hidden"
      );

      app.style.display =
        "flex";

    }

  }

  /* =========================================================
     SUPABASE
     ========================================================= */

  async function inicializarSupabase() {

    if (
      !window.supabase ||
      !window.supabase.createClient
    ) {

      console.error(
        "Supabase JS não encontrado."
      );

      alert(
        "O módulo Supabase não foi carregado. Verifique o HTML."
      );

      return false;

    }

    supabase =
      window.supabase.createClient(

        "https://figkamlmpangolnasaby.supabase.co",

        "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL"

      );

    return true;

  }

  /* =========================================================
     USUÁRIO ATUAL
     ========================================================= */

  async function obterUsuarioAtual() {

    if (!supabase) {

      return null;

    }

    try {

      const {
        data,
        error
      } =
        await supabase.auth.getUser();

      if (error) {

        console.warn(
          "getUser:",
          error.message
        );

        return null;

      }

      return (
        data?.user ||
        null
      );

    } catch (erro) {

      console.error(
        "Erro getUser:",
        erro
      );

      return null;

    }

  }

  /* =========================================================
     MENU MOBILE
     ========================================================= */

  function fecharMenuMobile() {

    if (sidebar) {

      sidebar.classList.remove(
        "active"
      );

    }

    if (menuOverlay) {

      menuOverlay.classList.add(
        "hidden"
      );

    }

  }

  function ativarMenu(
    botao
  ) {

    document
      .querySelectorAll(
        ".sidebar .nav-item"
      )
      .forEach(
        elemento => {

          elemento.classList.remove(
            "active"
          );

        }
      );

    if (botao) {

      botao.classList.add(
        "active"
      );

    }

  }

  if (
    btnMenu
  ) {

    btnMenu.addEventListener(
      "click",
      () => {

        if (sidebar) {

          sidebar.classList.toggle(
            "active"
          );

        }

        if (menuOverlay) {

          menuOverlay.classList.toggle(
            "hidden"
          );

        }

      }
    );

  }

  if (
    menuOverlay
  ) {

    menuOverlay.addEventListener(
      "click",
      fecharMenuMobile
    );

  }

  /* =========================================================
     CATEGORIAS
     ========================================================= */

  async function garantirCategoriasPadrao() {

    const user =
      await obterUsuarioAtual();

    if (!user) {

      return;

    }

    try {

      const {
        data,
        error
      } =
        await supabase
          .from(
            "categorias_financeiras"
          )
          .select(
            "id,nome,tipo,ativa"
          )
          .eq(
            "user_id",
            user.id
          );

      if (error) {

        console.warn(
          "Categorias padrão:",
          error.message
        );

        return;

      }

      const existentes =
        new Set(
          (data || []).map(
            item =>
              `${normalizarTipo(item.tipo).toLowerCase()}::${String(item.nome || "").trim().toLowerCase()}`
          )
        );

      const novas =
        [];

      Object.entries(
        categoriasPadrao
      ).forEach(
        (
          [
            tipoCategoria,
            nomes
          ]
        ) => {

          nomes.forEach(
            nome => {

              const chave =
                `${tipoCategoria.toLowerCase()}::${nome.toLowerCase()}`;

              if (
                !existentes.has(
                  chave
                )
              ) {

                novas.push({

                  user_id:
                    user.id,

                  nome:
                    nome,

                  tipo:
                    tipoCategoria,

                  ativa:
                    true

                });

              }

            }
          );

        }
      );

      if (
        novas.length
      ) {

        const {
          error:
            erroInsert
        } =
          await supabase
            .from(
              "categorias_financeiras"
            )
            .insert(
              novas
            );

        if (
          erroInsert
        ) {

          console.warn(
            "Não foi possível criar categorias padrão:",
            erroInsert.message
          );

        }

      }

    } catch (erro) {

      console.error(
        "Erro categorias padrão:",
        erro
      );

    }

  }

  /* =========================================================
     CARREGAR CATEGORIAS
     ========================================================= */

  async function carregarCategoriasFinanceiras() {

    const user =
      await obterUsuarioAtual();

    if (!user) {

      categoriasFinanceiras =
        [];

      return;

    }

    try {

      let resultado =
        await supabase
          .from(
            "categorias_financeiras"
          )
          .select(
            "*"
          )
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "ativa",
            true
          )
          .order(
            "nome",
            {
              ascending:
                true
            }
          );

      /*
       * Fallback para instalações
       * que estejam usando "categorias".
       */

      if (
        resultado.error
      ) {

        resultado =
          await supabase
            .from(
              "categorias"
            )
            .select(
              "*"
            )
            .eq(
              "user_id",
              user.id
            )
            .order(
              "nome",
              {
                ascending:
                  true
              }
            );

      }

      if (
        resultado.error
      ) {

        console.warn(
          "Erro ao carregar categorias:",
          resultado.error.message
        );

        categoriasFinanceiras =
          [];

        return;

      }

      categoriasFinanceiras =
        resultado.data ||
        [];

    } catch (erro) {

      console.error(
        "Erro categorias:",
        erro
      );

      categoriasFinanceiras =
        [];

    }

  }

  /* =========================================================
     SELECT DE CATEGORIAS
     ========================================================= */

  function atualizarSelectCategorias(

    tipoSelecionado = "",

    categoriaSelecionada = null

  ) {

    if (!categoria) {

      return;

    }

    categoria.innerHTML =
      "<option value=''>Selecione uma categoria</option>";

    if (
      !tipoSelecionado
    ) {

      categoria.disabled =
        true;

      return;

    }

    categoria.disabled =
      false;

    const lista =
      categoriasFinanceiras.filter(
        item =>
          normalizarTipo(
            item.tipo
          ) ===
          normalizarTipo(
            tipoSelecionado
          )
      );

    lista.forEach(
      item => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          item.id ??
          item.nome;

        option.textContent =
          item.nome ||
          item.descricao ||
          "Categoria";

        option.dataset.nome =
          item.nome ||
          "";

        if (

          String(
            categoriaSelecionada
          ) ===
          String(
            item.id
          ) ||

          String(
            categoriaSelecionada
          ) ===
          String(
            item.nome
          )

        ) {

          option.selected =
            true;

        }

        categoria.appendChild(
          option
        );

      }
    );

    if (
      !lista.length
    ) {

      const option =
        document.createElement(
          "option"
        );

      option.disabled =
        true;

      option.textContent =
        "Nenhuma categoria cadastrada";

      categoria.appendChild(
        option
      );

    }

  }

  if (
    tipo
  ) {

    tipo.addEventListener(
      "change",
      () => {

        atualizarSelectCategorias(
          tipo.value
        );

      }
    );

  }

  /* =========================================================
     LANÇAMENTOS
     ========================================================= */

  async function carregarDados() {

    const user =
      await obterUsuarioAtual();

    if (!user) {

      dados =
        [];

      return;

    }

    try {

      const {
        data,
        error
      } =
        await supabase
          .from(
            "lancamentos"
          )
          .select(
            "*"
          )
          .eq(
            "user_id",
            user.id
          )
          .order(
            "data",
            {
              ascending:
                false
            }
          );

      if (error) {

        console.error(
          "Erro ao carregar lançamentos:",
          error
        );

        dados =
          [];

        return;

      }

      dados =
        data ||
        [];

    } catch (erro) {

      console.error(
        "Erro inesperado:",
        erro
      );

      dados =
        [];

    }

  }

  /* =========================================================
     LIMPAR FORMULÁRIO
     ========================================================= */

  function limparFormulario() {

    idEmEdicao =
      null;

    if (tipo) {

      tipo.value =
        "";

    }

    if (categoria) {

      categoria.innerHTML =
        "<option value=''>Categoria</option>";

      categoria.disabled =
        true;

    }

    if (descricao) {

      descricao.value =
        "";

    }

    if (valor) {

      valor.value =
        "";

    }

    if (dataInput) {

      dataInput.value =
        obterDataHoje();

    }

    if (btnSalvar) {

      btnSalvar.innerText =
        "Salvar";

    }

  }

  /* =========================================================
     SALVAR LANÇAMENTO
     ========================================================= */

  if (
    btnSalvar
  ) {

    btnSalvar.addEventListener(
      "click",
      async () => {

        try {

          if (

            !tipo?.value ||

            !categoria?.value ||

            !valor?.value ||

            !dataInput?.value

          ) {

            alert(
              "Preencha tipo, categoria, valor e data."
            );

            return;

          }

          const valorNumerico =
            parseValorInput(
              valor.value
            );

          if (

            !Number.isFinite(
              valorNumerico
            ) ||

            valorNumerico <=
              0

          ) {

            alert(
              "Informe um valor válido."
            );

            return;

          }

          if (

            planoUsuario ===
              "FREE" &&

            dados.length >=
              LIMITE_FREE &&

            !idEmEdicao

          ) {

            alert(
              "Limite do plano gratuito atingido."
            );

            return;

          }

          const user =
            await obterUsuarioAtual();

          if (!user) {

            alert(
              "Sua sessão expirou. Faça login novamente."
            );

            mostrarLogin();

            return;

          }

          const optionSelecionada =
            categoria.options[
              categoria.selectedIndex
            ];

          const nomeCategoria =
            optionSelecionada
              ?.dataset
              ?.nome ||

            optionSelecionada
              ?.text ||

            categoria.value;

          let resultado;

          if (
            idEmEdicao
          ) {

            resultado =
              await supabase
                .from(
                  "lancamentos"
                )
                .update({

                  tipo:
                    tipo.value,

                  categoria:
                    nomeCategoria,

                  descricao:
                    descricao?.value?.trim() ||
                    "",

                  valor:
                    valorNumerico,

                  data:
                    dataInput.value

                })
                .eq(
                  "id",
                  idEmEdicao
                )
                .eq(
                  "user_id",
                  user.id
                );

          } else {

            resultado =
              await supabase
                .from(
                  "lancamentos"
                )
                .insert({

                  user_id:
                    user.id,

                  tipo:
                    tipo.value,

                  categoria:
                    nomeCategoria,

                  descricao:
                    descricao?.value?.trim() ||
                    "",

                  valor:
                    valorNumerico,

                  data:
                    dataInput.value

                });

          }

          if (
            resultado.error
          ) {

            console.error(
              resultado.error
            );

            alert(
              `Não foi possível salvar o lançamento.\n\n${resultado.error.message}`
            );

            return;

          }

          limparFormulario();

          await carregarDados();

          atualizarDashboard();

          renderizarLista();

          alert(
            "Lançamento salvo com sucesso!"
          );

        } catch (erro) {

          console.error(
            "Erro ao salvar lançamento:",
            erro
          );

          alert(
            "Ocorreu um erro ao salvar o lançamento."
          );

        }

      }
    );

  }

  /* =========================================================
     FILTRO
     ========================================================= */

  function obterDadosFiltrados() {

    if (
      !filtroMes?.value
    ) {

      return [
        ...dados
      ];

    }

    return dados.filter(
      item =>
        String(
          item.data ||
          ""
        ).startsWith(
          filtroMes.value
        )
    );

  }

  /* =========================================================
     DASHBOARD
     ========================================================= */

  function atualizarPeriodoDashboard() {

    if (
      dashboardPeriodo
    ) {

      dashboardPeriodo.innerText =
        formatarPeriodo(
          filtroMes?.value ||
          ""
        );

    }

  }

  function destruirGrafico(
    referencia
  ) {

    if (
      referencia
    ) {

      try {

        referencia.destroy();

      } catch (_) {}

    }

  }

  function atualizarDashboard() {

    const filtrados =
      obterDadosFiltrados();

    let receita =
      0;

    let despesa =
      0;

    let investimento =
      0;

    filtrados.forEach(
      item => {

        const v =
          numero(
            item.valor
          );

        const tipoItem =
          normalizarTipo(
            item.tipo
          );

        if (
          tipoItem ===
          "Receita"
        ) {

          receita +=
            v;

        }

        if (
          tipoItem ===
          "Despesa"
        ) {

          despesa +=
            v;

        }

        if (
          tipoItem ===
          "Investimento"
        ) {

          investimento +=
            v;

        }

      }
    );

    if (
      totalReceitas
    ) {

      totalReceitas.innerText =
        formatarMoeda(
          receita
        );

    }

    if (
      totalDespesas
    ) {

      totalDespesas.innerText =
        formatarMoeda(
          despesa
        );

    }

    if (
      totalInvestimentos
    ) {

      totalInvestimentos.innerText =
        formatarMoeda(
          investimento
        );

    }

    if (
      saldo
    ) {

      saldo.innerText =
        formatarMoeda(
          receita -
          despesa
        );

    }

    atualizarPeriodoDashboard();

    renderizarGrafico(
      filtrados,
      receita,
      despesa,
      investimento
    );

    renderizarGraficoMensal(
      filtrados
    );

    renderizarGraficoComparativo(
      filtrados
    );

    renderizarAlertas(
      filtrados
    );

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

    const canvas =
      $("grafico");

    if (
      !canvas ||
      !window.Chart
    ) {

      return;

    }

    destruirGrafico(
      grafico
    );

    let labels = [

      "Receitas",
      "Despesas",
      "Investimentos"

    ];

    let valores = [

      receita,
      despesa,
      investimento

    ];

    if (
      tipoGrafico?.value ===
      "categoria"
    ) {

      const mapa =
        {};

      filtrados.forEach(
        item => {

          const chave =
            item.categoria ||
            "Sem categoria";

          mapa[chave] =
            (
              mapa[chave] ||
              0
            ) +
            numero(
              item.valor
            );

        }
      );

      labels =
        Object.keys(
          mapa
        );

      valores =
        Object.values(
          mapa
        );

    }

    grafico =
      new Chart(
        canvas,
        {

          type:
            "doughnut",

          data: {

            labels,

            datasets: [

              {

                data:
                  valores

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                position:
                  "bottom"

              }

            }

          }

        }
      );

  }

  /* =========================================================
     AGRUPAR POR MÊS
     ========================================================= */

  function agruparPorMes(
    filtrados
  ) {

    const mapa =
      {};

    filtrados.forEach(
      item => {

        if (
          !item.data
        ) {

          return;

        }

        const mes =
          String(
            item.data
          ).slice(
            0,
            7
          );

        if (
          !mapa[mes]
        ) {

          mapa[mes] = {

            receita:
              0,

            despesa:
              0

          };

        }

        const v =
          numero(
            item.valor
          );

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Receita"
        ) {

          mapa[mes].receita +=
            v;

        }

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Despesa"
        ) {

          mapa[mes].despesa +=
            v;

        }

      }
    );

    return mapa;

  }

  /* =========================================================
     GRÁFICO MENSAL
     ========================================================= */

  function renderizarGraficoMensal(
    filtrados
  ) {

    const canvas =
      $("graficoMensal");

    if (
      !canvas ||
      !window.Chart
    ) {

      return;

    }

    destruirGrafico(
      graficoMensal
    );

    const mapa =
      agruparPorMes(
        filtrados
      );

    const labels =
      Object.keys(
        mapa
      ).sort();

    graficoMensal =
      new Chart(
        canvas,
        {

          type:
            "bar",

          data: {

            labels,

            datasets: [

              {

                label:
                  "Receitas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes]
                        .receita
                  )

              },

              {

                label:
                  "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes]
                        .despesa
                  )

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                position:
                  "bottom"

              }

            }

          }

        }

      );

  }

  /* =========================================================
     GRÁFICO COMPARATIVO
     ========================================================= */

  function renderizarGraficoComparativo(
    filtrados
  ) {

    const canvas =
      $("graficoComparativo");

    if (
      !canvas ||
      !window.Chart
    ) {

      return;

    }

    destruirGrafico(
      graficoComparativo
    );

    const mapa =
      agruparPorMes(
        filtrados
      );

    const labels =
      Object.keys(
        mapa
      ).sort();

    if (
      !labels.length
    ) {

      return;

    }

    graficoComparativo =
      new Chart(
        canvas,
        {

          type:
            "line",

          data: {

            labels,

            datasets: [

              {

                label:
                  "Receitas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes]
                        .receita
                  ),

                tension:
                  0.25,

                borderWidth:
                  3

              },

              {

                label:
                  "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes]
                        .despesa
                  ),

                tension:
                  0.25,

                borderWidth:
                  3

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                position:
                  "bottom"

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true

              }

            }

          }

        }

      );

  }

  /* =========================================================
     ALERTAS FINANCEIROS
     ========================================================= */

  function renderizarAlertas(
    filtrados
  ) {

    const container =
      $("alertasInteligentes");

    if (
      !container
    ) {

      return;

    }

    let receita =
      0;

    let despesa =
      0;

    let investimento =
      0;

    filtrados.forEach(
      item => {

        const v =
          numero(
            item.valor
          );

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Receita"
        ) {

          receita +=
            v;

        }

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Despesa"
        ) {

          despesa +=
            v;

        }

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Investimento"
        ) {

          investimento +=
            v;

        }

      }
    );

    const saldoAtual =
      receita -
      despesa;

    const percentual =
      receita > 0
        ? (
            despesa /
            receita
          ) *
          100
        : 0;

    const alertas =
      [];

    if (
      saldoAtual <
      0
    ) {

      alertas.push(
        "🔴 Seu saldo está negativo. Atenção ao controle de despesas."
      );

    }

    if (
      despesa >
      receita
    ) {

      alertas.push(
        "⚠️ Suas despesas estão maiores que suas receitas neste período."
      );

    } else if (
      percentual >
      70
    ) {

      alertas.push(
        `🟡 Você está comprometendo ${percentual.toFixed(0)}% da sua receita com despesas.`
      );

    }

    if (
      investimento ===
        0 &&
      receita >
        0
    ) {

      alertas.push(
        "💡 Nenhum investimento identificado neste período."
      );

    }

    if (
      !alertas.length
    ) {

      alertas.push(
        "✅ Sua saúde financeira está equilibrada neste período."
      );

    }

    container.innerHTML =
      alertas
        .map(
          texto =>
            `<div class="alerta">${escapeHtml(texto)}</div>`
        )
        .join("");

  }

  /* =========================================================
     LISTA
     ========================================================= */

  function renderizarLista() {

    if (
      !lista
    ) {

      return;

    }

    lista.innerHTML =
      "";

    if (
      !dados.length
    ) {

      lista.innerHTML =
        "<li>Nenhum lançamento cadastrado.</li>";

      return;

    }

    const filtrados =
      obterDadosFiltrados();

    if (
      !filtrados.length
    ) {

      lista.innerHTML =
        "<li>Nenhum lançamento encontrado para o período selecionado.</li>";

      return;

    }

    filtrados.forEach(
      item => {

        const li =
          document.createElement(
            "li"
          );

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

              ${escapeHtml(
                normalizarTipo(
                  item.tipo
                )
              )}

              •

              ${escapeHtml(
                item.categoria ||
                "Sem categoria"
              )}

              •

              ${formatarData(
                item.data
              )}

            </small>

          </div>

          <div>

            <strong>
              ${formatarMoeda(
                item.valor
              )}
            </strong>

            <button
              type="button"
              data-acao="editar"
              data-id="${escapeHtml(
                item.id
              )}"
            >
              ✏️
            </button>

            <button
              type="button"
              data-acao="excluir"
              data-id="${escapeHtml(
                item.id
              )}"
            >
              🗑️
            </button>

          </div>

        `;

        lista.appendChild(
          li
        );

      }
    );

  }

  /* =========================================================
     EDITAR LANÇAMENTO
     ========================================================= */

  async function editarLancamento(
    id
  ) {

    const item =
      dados.find(
        registro =>
          String(
            registro.id
          ) ===
          String(
            id
          )
      );

    if (
      !item
    ) {

      return;

    }

    idEmEdicao =
      item.id;

    if (
      tipo
    ) {

      tipo.value =
        normalizarTipo(
          item.tipo
        );

    }

    atualizarSelectCategorias(

      tipo?.value ||
      "",

      item.categoria_id ||
      item.categoria

    );

    if (
      descricao
    ) {

      descricao.value =
        item.descricao ||
        "";

    }

    if (
      valor
    ) {

      valor.value =
        formatarNumero(
          item.valor
        );

    }

    if (
      dataInput
    ) {

      dataInput.value =
        String(
          item.data ||
          ""
        ).slice(
          0,
          10
        );

    }

    if (
      btnSalvar
    ) {

      btnSalvar.innerText =
        "Atualizar";

    }

    mostrarTela(
      lancamentos
    );

  }

  /* =========================================================
     EXCLUIR LANÇAMENTO
     ========================================================= */

  async function excluirLancamento(
    id
  ) {

    if (
      !confirm(
        "Excluir lançamento?"
      )
    ) {

      return;

    }

    const user =
      await obterUsuarioAtual();

    if (
      !user
    ) {

      mostrarLogin();

      return;

    }

    const {
      error
    } =
      await supabase
        .from(
          "lancamentos"
        )
        .delete()
        .eq(
          "id",
          id
        )
        .eq(
          "user_id",
          user.id
        );

    if (
      error
    ) {

      alert(
        `Não foi possível excluir.\n\n${error.message}`
      );

      return;

    }

    await carregarDados();

    atualizarDashboard();

    renderizarLista();

  }

  if (
    lista
  ) {

    lista.addEventListener(
      "click",
      event => {

        const botao =
          event.target.closest(
            "button[data-acao]"
          );

        if (
          !botao
        ) {

          return;

        }

        if (
          botao.dataset.acao ===
          "editar"
        ) {

          editarLancamento(
            botao.dataset.id
          );

        }

        if (
          botao.dataset.acao ===
          "excluir"
        ) {

          excluirLancamento(
            botao.dataset.id
          );

        }

      }
    );

  }

  /* =========================================================
     RELATÓRIOS
     ========================================================= */

  function atualizarRelatorios() {

    const filtrados =
      obterDadosFiltrados();

    let receita =
      0;

    let despesa =
      0;

    let investimento =
      0;

    filtrados.forEach(
      item => {

        const v =
          numero(
            item.valor
          );

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Receita"
        ) {

          receita +=
            v;

        }

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Despesa"
        ) {

          despesa +=
            v;

        }

        if (
          normalizarTipo(
            item.tipo
          ) ===
          "Investimento"
        ) {

          investimento +=
            v;

        }

      }
    );

    const valores = {

      relatorioReceitas:
        formatarMoeda(
          receita
        ),

      relatorioDespesas:
        formatarMoeda(
          despesa
        ),

      relatorioInvestimentos:
        formatarMoeda(
          investimento
        ),

      relatorioSaldo:
        formatarMoeda(
          receita -
          despesa
        ),

      relatorioResumoReceitas:
        formatarMoeda(
          receita
        ),

      relatorioResumoDespesas:
        formatarMoeda(
          despesa
        ),

      relatorioResumoInvestimentos:
        formatarMoeda(
          investimento
        ),

      relatorioResumoSaldo:
        formatarMoeda(
          receita -
          despesa
        ),

      relatorioPeriodo:
        formatarPeriodo(
          filtroMes?.value ||
          ""
        )

    };

    Object.entries(
      valores
    ).forEach(
      (
        [
          id,
          texto
        ]
      ) => {

        const elemento =
          $(id);

        if (
          elemento
        ) {

          elemento.innerText =
            texto;

        }

      }
    );

  }

  /* =========================================================
     RECORRÊNCIAS
     ========================================================= */

  async function carregarCategoriasRecorrencia(

    tipoSelecionado = "",

    categoriaSelecionada = ""

  ) {

    if (
      !recCategoria
    ) {

      return;

    }

    recCategoria.innerHTML =
      "<option value=''>Carregando categorias...</option>";

    const user =
      await obterUsuarioAtual();

    if (
      !user
    ) {

      recCategoria.innerHTML =
        "<option value=''>Sessão expirada</option>";

      return;

    }

    try {

      let resultado =
        await supabase
          .from(
            "categorias_financeiras"
          )
          .select(
            "*"
          )
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "ativa",
            true
          )
          .order(
            "nome",
            {
              ascending:
                true
            }
          );

      /*
       * Fallback para bancos
       * que usam tabela "categorias".
       */

      if (
        resultado.error
      ) {

        resultado =
          await supabase
            .from(
              "categorias"
            )
            .select(
              "*"
            )
            .eq(
              "user_id",
              user.id
            )
            .order(
              "nome",
              {
                ascending:
                  true
              }
            );

      }

      if (
        resultado.error
      ) {

        console.error(
          "Erro ao carregar categorias da recorrência:",
          resultado.error
        );

        recCategoria.innerHTML =
          "<option value=''>Erro ao carregar categorias</option>";

        return;

      }

      recCategoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";

      const categorias =
        (
          resultado.data ||
          []
        ).filter(
          categoriaBanco => {

            if (
              !tipoSelecionado
            ) {

              return true;

            }

            if (
              !categoriaBanco.tipo
            ) {

              return true;

            }

            return (
              normalizarTipo(
                categoriaBanco.tipo
              ) ===
              normalizarTipo(
                tipoSelecionado
              )
            );

          }
        );

      categorias.forEach(
        item => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            item.id ??
            item.nome;

          option.textContent =
            item.nome ||
            item.descricao ||
            "Categoria";

          option.dataset.nome =
            item.nome ||
            "";

          if (

            String(
              item.id
            ) ===
            String(
              categoriaSelecionada
            ) ||

            String(
              item.nome
            ) ===
            String(
              categoriaSelecionada
            )

          ) {

            option.selected =
              true;

          }

          recCategoria.appendChild(
            option
          );

        }
      );

      if (
        !categorias.length
      ) {

        const option =
          document.createElement(
            "option"
          );

        option.disabled =
          true;

        option.textContent =
          "Nenhuma categoria cadastrada";

        recCategoria.appendChild(
          option
        );

      }

    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar categorias:",
        erro
      );

      recCategoria.innerHTML =
        "<option value=''>Erro ao carregar categorias</option>";

    }

  }

  if (
    recTipo
  ) {

    recTipo.addEventListener(
      "change",
      () => {

        carregarCategoriasRecorrencia(
          recTipo.value
        );

      }
    );

  }

  /* =========================================================
     NOMES DAS CATEGORIAS
     ========================================================= */

  async function carregarNomesCategorias() {

    categoriasRecorrenciaMapa =
      {};

    const user =
      await obterUsuarioAtual();

    if (
      !user
    ) {

      return;

    }

    try {

      let resultado =
        await supabase
          .from(
            "categorias_financeiras"
          )
          .select(
            "id,nome"
          )
          .eq(
            "user_id",
            user.id
          );

      if (
        resultado.error
      ) {

        resultado =
          await supabase
            .from(
              "categorias"
            )
            .select(
              "id,nome"
            )
            .eq(
              "user_id",
              user.id
            );

      }

      (
        resultado.data ||
        []
      ).forEach(
        item => {

          categoriasRecorrenciaMapa[
            item.id
          ] =
            item.nome;

        }
      );

    } catch (erro) {

      console.error(
        "Erro categorias recorrência:",
        erro
      );

    }

  }

  function obterNomeCategoriaRecorrencia(
    item
  ) {

    return (

      item.categoria ||

      item.categoria_nome ||

      categoriasRecorrenciaMapa[
        item.categoria_id
      ] ||

      item.categoria_id ||

      "Sem categoria"

    );

  }

  /* =========================================================
     CONTADORES
     ========================================================= */

  function atualizarContadoresRecorrencias() {

    const total =
      recorrenciasDados.length;

    const ativas =
      recorrenciasDados.filter(
        item =>
          item.ativo !== false &&
          item.ativa !== false
      ).length;

    const pausadas =
      total -
      ativas;

    if (
      totalRecorrencias
    ) {

      totalRecorrencias.innerText =
        total;

    }

    if (
      recorrenciasAtivas
    ) {

      recorrenciasAtivas.innerText =
        ativas;

    }

    if (
      recorrenciasPausadas
    ) {

      recorrenciasPausadas.innerText =
        pausadas;

    }

    if (
      contadorRecorrencias
    ) {

      contadorRecorrencias.innerText =
        `${total} ${
          total === 1
            ? "recorrência cadastrada."
            : "recorrências cadastradas."
        }`;

    }

  }

  /* =========================================================
     PRÓXIMA OCORRÊNCIA
     ========================================================= */

  function calcularProximaOcorrencia(
    recorrencia
  ) {

    if (
      !recorrencia
    ) {

      return null;

    }

    const ativa =
      recorrencia.ativo !== false &&
      recorrencia.ativa !== false;

    if (
      !ativa ||
      !recorrencia.data_inicio
    ) {

      return null;

    }

    let data =
      new Date(
        `${recorrencia.data_inicio}T00:00:00`
      );

    const hoje =
      new Date();

    hoje.setHours(
      0,
      0,
      0,
      0
    );

    const dataFim =
      recorrencia.data_fim
        ? new Date(
            `${recorrencia.data_fim}T00:00:00`
          )
        : null;

    const dia =
      Number(
        recorrencia.dia_vencimento
      );

    let contador =
      0;

    while (
      data < hoje &&
      contador <
        120
    ) {

      contador++;

      switch (
        recorrencia.frequencia
      ) {

        case "diaria":

          data.setDate(
            data.getDate() +
            1
          );

          break;

        case "semanal":

          data.setDate(
            data.getDate() +
            7
          );

          break;

        case "quinzenal":

          data.setDate(
            data.getDate() +
            15
          );

          break;

        case "bimestral":

          data.setMonth(
            data.getMonth() +
            2
          );

          break;

        case "trimestral":

          data.setMonth(
            data.getMonth() +
            3
          );

          break;

        case "semestral":

          data.setMonth(
            data.getMonth() +
            6
          );

          break;

        case "anual":

          data.setFullYear(
            data.getFullYear() +
            1
          );

          break;

        case "mensal":

        default:

          data.setMonth(
            data.getMonth() +
            1
          );

          if (
            Number.isInteger(
              dia
            )
          ) {

            const ultimoDia =
              new Date(
                data.getFullYear(),
                data.getMonth() + 1,
                0
              ).getDate();

            data.setDate(
              Math.min(
                dia,
                ultimoDia
              )
            );

          }

          break;

      }

    }

    if (
      dataFim &&
      data >
        dataFim
    ) {

      return null;

    }

    return data;

  }

  /* =========================================================
     RENDERIZAR RECORRÊNCIAS
     ========================================================= */

  function renderizarRecorrencias() {

    if (
      !listaRecorrencias
    ) {

      return;

    }

    listaRecorrencias.innerHTML =
      "";

    atualizarContadoresRecorrencias();

    if (
      !recorrenciasDados.length
    ) {

      listaRecorrencias.innerHTML = `

        <div class="recorrencias-vazio">

          <strong>
            Nenhuma recorrência cadastrada.
          </strong>

          <p>
            Cadastre uma recorrência para automatizar seus lançamentos.
          </p>

        </div>

      `;

      return;

    }

    recorrenciasDados.forEach(
      recorrencia => {

        const ativa =
          recorrencia.ativo !== false &&
          recorrencia.ativa !== false;

        const proxima =
          calcularProximaOcorrencia(
            recorrencia
          );

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "recorrencia-item";

        card.innerHTML = `

          <div class="recorrencia-info">

            <strong>

              ${escapeHtml(
                recorrencia.descricao ||
                "Sem descrição"
              )}

            </strong>

            <span>

              ${escapeHtml(
                normalizarTipo(
                  recorrencia.tipo
                )
              )}

              •

              ${escapeHtml(
                obterNomeCategoriaRecorrencia(
                  recorrencia
                )
              )}

            </span>

            <span>

              ${formatarMoeda(
                recorrencia.valor
              )}

            </span>

            <small>

              ${escapeHtml(
                nomesFrequencia[
                  recorrencia.frequencia
                ] ||
                recorrencia.frequencia ||
                "Mensal"
              )}

              ${
                recorrencia.dia_vencimento
                  ? ` • Dia ${escapeHtml(
                      recorrencia.dia_vencimento
                    )}`
                  : ""
              }

            </small>

            <small>

              Status:
              ${
                ativa
                  ? "Ativa"
                  : "Pausada"
              }

              ${
                proxima
                  ? ` • Próximo: ${formatarData(
                      proxima
                        .toISOString()
                        .slice(
                          0,
                          10
                        )
                    )}`
                  : ""
              }

            </small>

          </div>

          <div class="recorrencia-acoes">

            <button
              type="button"
              class="acao-editar"
              data-id="${escapeHtml(
                recorrencia.id
              )}"
            >
              ✏️ Editar
            </button>

            <button
              type="button"
              class="acao-pausar"
              data-id="${escapeHtml(
                recorrencia.id
              )}"
            >
              ${
                ativa
                  ? "⏸ Pausar"
                  : "▶ Reativar"
              }
            </button>

            <button
              type="button"
              class="acao-excluir"
              data-id="${escapeHtml(
                recorrencia.id
              )}"
            >
              🗑 Excluir
            </button>

          </div>

        `;

        listaRecorrencias.appendChild(
          card
        );

      }
    );

  }

  /* =========================================================
     CARREGAR RECORRÊNCIAS
     ========================================================= */

  async function carregarRecorrencias() {

    if (
      !listaRecorrencias
    ) {

      return;

    }

    const user =
      await obterUsuarioAtual();

    if (
      !user
    ) {

      recorrenciasDados =
        [];

      renderizarRecorrencias();

      return;

    }

    try {

      const {
        data,
        error
      } =
        await supabase
          .from(
            "lancamentos_recorrentes"
          )
          .select(
            "*"
          )
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending:
                false
            }
          );

      if (
        error
      ) {

        console.error(
          "Erro ao carregar recorrências:",
          error
        );

        listaRecorrencias.innerHTML = `

          <div class="recorrencias-vazio">

            <strong>
              Não foi possível carregar.
            </strong>

            <p>
              ${escapeHtml(
                error.message
              )}
            </p>

          </div>

        `;

        return;

      }

      recorrenciasDados =
        data ||
        [];

      await carregarNomesCategorias();

      renderizarRecorrencias();

    } catch (erro) {

      console.error(
        "Erro inesperado nas recorrências:",
        erro
      );

      listaRecorrencias.innerHTML = `

        <div class="recorrencias-vazio">

          <strong>
            Erro inesperado.
          </strong>

          <p>
            Não foi possível carregar suas recorrências.
          </p>

        </div>

      `;

    }

  }

  /* =========================================================
     LIMPAR RECORRÊNCIA
     ========================================================= */

  function limparFormularioRecorrencia() {

    recorrenciaEmEdicao =
      null;

    if (
      recTipo
    ) {

      recTipo.value =
        "";

    }

    if (
      recCategoria
    ) {

      recCategoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";

    }

    if (
      recDescricao
    ) {

      recDescricao.value =
        "";

    }

    if (
      recValor
    ) {

      recValor.value =
        "";

    }

    if (
      recFrequencia
    ) {

      recFrequencia.value =
        "mensal";

    }

    if (
      recDiaVencimento
    ) {

      recDiaVencimento.value =
        "";

    }

    if (
      recDataInicio
    ) {

      recDataInicio.value =
        obterDataHoje();

    }

    if (
      recDataFim
    ) {

      recDataFim.value =
        "";

    }

    if (
      tituloFormularioRecorrencia
    ) {

      tituloFormularioRecorrencia.innerText =
        "Nova recorrência";

    }

    if (
      btnSalvarRecorrencia
    ) {

      btnSalvarRecorrencia.innerText =
        "Criar recorrência";

    }

    if (
      btnCancelarRecorrencia
    ) {

      btnCancelarRecorrencia.classList.add(
        "hidden"
      );

    }

  }

  /* =========================================================
     SALVAR RECORRÊNCIA
     ========================================================= */

  async function salvarRecorrencia() {

    try {

      const user =
        await obterUsuarioAtual();

      if (
        !user
      ) {

        alert(
          "Sua sessão expirou. Faça login novamente."
        );

        mostrarLogin();

        return;

      }

      const tipoSelecionado =
        normalizarTipo(
          recTipo?.value ||
          ""
        );

      const categoriaId =
        recCategoria?.value ||
        "";

      const descricaoSelecionada =
        recDescricao?.value?.trim() ||
        "";

      const valorSelecionado =
        numero(
          recValor?.value ||
          ""
        );

      const frequenciaSelecionada =
        recFrequencia?.value ||
        "";

      const diaSelecionado =
        recDiaVencimento?.value
          ? Number(
              recDiaVencimento.value
            )
          : null;

      const dataInicioSelecionada =
        recDataInicio?.value ||
        "";

      const dataFimSelecionada =
        recDataFim?.value ||
        null;

      /* -----------------------------------------------------
         VALIDAÇÕES
         ----------------------------------------------------- */

      if (
        ![
          "Receita",
          "Despesa",
          "Investimento"
        ].includes(
          tipoSelecionado
        )
      ) {

        alert(
          "Selecione um tipo válido."
        );

        return;

      }

      if (
        !categoriaId
      ) {

        alert(
          "Selecione uma categoria."
        );

        return;

      }

      if (
        !descricaoSelecionada
      ) {

        alert(
          "Informe uma descrição."
        );

        return;

      }

      if (

        !Number.isFinite(
          valorSelecionado
        ) ||

        valorSelecionado <=
          0

      ) {

        alert(
          "Informe um valor válido."
        );

        return;

      }

      if (

        !frequenciaSelecionada ||

        !dataInicioSelecionada

      ) {

        alert(
          "Informe a frequência e a data de início."
        );

        return;

      }

      if (

        [

          "mensal",
          "bimestral",
          "trimestral",
          "semestral",
          "anual"

        ].includes(
          frequenciaSelecionada
        )

      ) {

        if (

          !Number.isInteger(
            diaSelecionado
          ) ||

          diaSelecionado <
            1 ||

          diaSelecionado >
            31

        ) {

          alert(
            "Informe um dia de lançamento entre 1 e 31."
          );

          return;

        }

      }

      if (

        dataFimSelecionada &&

        dataFimSelecionada <
          dataInicioSelecionada

      ) {

        alert(
          "A data de término não pode ser anterior à data de início."
        );

        return;

      }

      /* -----------------------------------------------------
         NOME DA CATEGORIA
         ----------------------------------------------------- */

      const option =
        recCategoria?.options?.[
          recCategoria.selectedIndex
        ];

      const nomeCategoria =
        option?.dataset?.nome ||

        option?.textContent ||

        "";

      /* -----------------------------------------------------
         REGISTRO
         ----------------------------------------------------- */

      const registro = {

        user_id:
          user.id,

        tipo:
          normalizarTipoBanco(
            tipoSelecionado
          ),

        categoria_id:
          categoriaId,

        categoria:
          nomeCategoria,

        descricao:
          descricaoSelecionada,

        valor:
          valorSelecionado,

        frequencia:
          frequenciaSelecionada,

        dia_vencimento:
          Number.isInteger(
            diaSelecionado
          )
            ? diaSelecionado
            : null,

        data_inicio:
          dataInicioSelecionada,

        data_fim:
          dataFimSelecionada,

        ativo:
          true

      };

      /* -----------------------------------------------------
         SALVAR OU ATUALIZAR
         ----------------------------------------------------- */

      let resultado;

      if (
        recorrenciaEmEdicao
      ) {

        resultado =
          await supabase
            .from(
              "lancamentos_recorrentes"
            )
            .update(
              registro
            )
            .eq(
              "id",
              recorrenciaEmEdicao
            )
            .eq(
              "user_id",
              user.id
            );

      } else {

        resultado =
          await supabase
            .from(
              "lancamentos_recorrentes"
            )
            .insert(
              registro
            );

      }

      if (
        resultado.error
      ) {

        console.error(
          "Erro ao salvar recorrência:",
          resultado.error
        );

        alert(
          `Não foi possível salvar a recorrência.\n\n${resultado.error.message}`
        );

        return;

      }

      alert(

        recorrenciaEmEdicao

          ? "Recorrência atualizada com sucesso!"

          : "Recorrência criada com sucesso!"

      );

      limparFormularioRecorrencia();

      await carregarRecorrencias();

    } catch (erro) {

      console.error(
        "Erro inesperado ao salvar recorrência:",
        erro
      );

      alert(
        "Ocorreu um erro ao salvar a recorrência."
      );

    }

  }

  if (
    btnSalvarRecorrencia
  ) {

    btnSalvarRecorrencia.addEventListener(
      "click",
      salvarRecorrencia
    );

  }

  /* =========================================================
     EDITAR RECORRÊNCIA
     ========================================================= */

  async function editarRecorrencia(
    id
  ) {

    const recorrencia =
      recorrenciasDados.find(
        item =>
          String(
            item.id
          ) ===
          String(
            id
          )
      );

    if (
      !recorrencia
    ) {

      alert(
        "Recorrência não encontrada."
      );

      return;

    }

    recorrenciaEmEdicao =
      recorrencia.id;

    if (
      recTipo
    ) {

      recTipo.value =
        normalizarTipo(
          recorrencia.tipo
        );

    }

    await carregarCategoriasRecorrencia(

      recorrencia.tipo,

      recorrencia.categoria_id ||
      recorrencia.categoria ||
      ""

    );

    if (
      recDescricao
    ) {

      recDescricao.value =
        recorrencia.descricao ||
        "";

    }

    if (
      recValor
    ) {

      recValor.value =
        formatarNumero(
          recorrencia.valor
        );

    }

    if (
      recFrequencia
    ) {

      recFrequencia.value =
        recorrencia.frequencia ||
        "mensal";

    }

    if (
      recDiaVencimento
    ) {

      recDiaVencimento.value =
        recorrencia.dia_vencimento ??
        "";

    }

    if (
      recDataInicio
    ) {

      recDataInicio.value =
        recorrencia.data_inicio ||
        obterDataHoje();

    }

    if (
      recDataFim
    ) {

      recDataFim.value =
        recorrencia.data_fim ||
        "";

    }

    if (
      tituloFormularioRecorrencia
    ) {

      tituloFormularioRecorrencia.innerText =
        "Editar recorrência";

    }

    if (
      btnSalvarRecorrencia
    ) {

      btnSalvarRecorrencia.innerText =
        "Atualizar recorrência";

    }

    if (
      btnCancelarRecorrencia
    ) {

      btnCancelarRecorrencia.classList.remove(
        "hidden"
      );

    }

    mostrarTela(
      recorrencias
    );

    const formulario =
      $("formRecorrencia");

    if (
      formulario
    ) {

      formulario.scrollIntoView({

        behavior:
          "smooth",

        block:
          "start"

      });

    }

  }

  /* =========================================================
     PAUSAR / REATIVAR
     ========================================================= */

  async function alternarStatusRecorrencia(
    id
  ) {

    const recorrencia =
      recorrenciasDados.find(
        item =>
          String(
            item.id
          ) ===
          String(
            id
          )
      );

    if (
      !recorrencia
    ) {

      return;

    }

    const atualmenteAtiva =
      recorrencia.ativo !== false &&
      recorrencia.ativa !== false;

    const novoStatus =
      !atualmenteAtiva;

    const acao =
      novoStatus
        ? "reativar"
        : "pausar";

    if (
      !confirm(
        `Deseja ${acao} a recorrência "${recorrencia.descricao || "sem descrição"}"?`
      )
    ) {

      return;

    }

    const user =
      await obterUsuarioAtual();

    if (
      !user
    ) {

      mostrarLogin();

      return;

    }

    try {

      const {
        error
      } =
        await supabase
          .from(
            "lancamentos_recorrentes"
          )
          .update({

            ativo:
              novoStatus

          })
          .eq(
            "id",
            recorrencia.id
          )
          .eq(
            "user_id",
            user.id
          );

      if (
        error
      ) {

        alert(
          `Não foi possível alterar o status.\n\n${error.message}`
        );

        return;

      }

      await carregarRecorrencias();

    } catch (erro) {

      console.error(
        "Erro ao alterar status:",
        erro
      );

      alert(
        "Ocorreu um erro ao alterar o status."
      );

    }

  }

  /* =========================================================
     EXCLUIR RECORRÊNCIA
     ========================================================= */

  async function excluirRecorrencia(
    id
  ) {

    const recorrencia =
      recorrenciasDados.find(
        item =>
          String(
            item.id
          ) ===
          String(
            id
          )
      );

    if (
      !recorrencia
    ) {

      return;

    }

    if (
      !confirm(
        `Tem certeza que deseja excluir a recorrência "${recorrencia.descricao || "sem descrição"}"?`
      )
    ) {

      return;

    }

    const user =
      await obterUsuarioAtual();

    if (
      !user
    ) {

      mostrarLogin();

      return;

    }

    try {

      const {
        error
      } =
        await supabase
          .from(
            "lancamentos_recorrentes"
          )
          .delete()
          .eq(
            "id",
            recorrencia.id
          )
          .eq(
            "user_id",
            user.id
          );

      if (
        error
      ) {

        alert(
          `Não foi possível excluir.\n\n${error.message}`
        );

        return;

      }

      if (
        String(
          recorrenciaEmEdicao
        ) ===
        String(
          recorrencia.id
        )
      ) {

        limparFormularioRecorrencia();

      }

      await carregarRecorrencias();

      alert(
        "Recorrência excluída com sucesso!"
      );

    } catch (erro) {

      console.error(
        "Erro ao excluir recorrência:",
        erro
      );

      alert(
        "Ocorreu um erro ao excluir a recorrência."
      );

    }

  }

  /* =========================================================
     EVENTOS DA LISTA DE RECORRÊNCIAS
     ========================================================= */

  if (
    listaRecorrencias
  ) {

    listaRecorrencias.addEventListener(
      "click",
      event => {

        const botao =
          event.target.closest(
            "button[data-id]"
          );

        if (
          !botao
        ) {

          return;

        }

        const id =
          botao.dataset.id;

        if (
          botao.classList.contains(
            "acao-editar"
          )
        ) {

          editarRecorrencia(
            id
          );

          return;

        }

        if (
          botao.classList.contains(
            "acao-pausar"
          )
        ) {

          alternarStatusRecorrencia(
            id
          );

          return;

        }

        if (
          botao.classList.contains(
            "acao-excluir"
          )
        ) {

          excluirRecorrencia(
            id
          );

        }

      }
    );

  }

  if (
    btnCancelarRecorrencia
  ) {

    btnCancelarRecorrencia.addEventListener(
      "click",
      limparFormularioRecorrencia
    );

  }

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */

  if (
    btnDashboard
  ) {

    btnDashboard.addEventListener(
      "click",
      () => {

        mostrarTela(
          dashboard
        );

        ativarMenu(
          btnDashboard
        );

        atualizarDashboard();

      }
    );

  }

  if (
    btnLancamentos
  ) {

    btnLancamentos.addEventListener(
      "click",
      () => {

        mostrarTela(
          lancamentos
        );

        ativarMenu(
          btnLancamentos
        );

        renderizarLista();

      }
    );

  }

  if (
    btnRecorrencias
  ) {

    btnRecorrencias.addEventListener(
      "click",
      async () => {

        mostrarTela(
          recorrencias
        );

        ativarMenu(
          btnRecorrencias
        );

        await carregarCategoriasRecorrencia(
          recTipo?.value ||
          ""
        );

        await carregarRecorrencias();

      }
    );

  }

  if (
    btnRelatorios
  ) {

    btnRelatorios.addEventListener(
      "click",
      () => {

        mostrarTela(
          relatorios
        );

        ativarMenu(
          btnRelatorios
        );

        atualizarRelatorios();

      }
    );

  }

  if (
    btnContas
  ) {

    btnContas.addEventListener(
      "click",
      () => {

        mostrarTela(
          contas
        );

        ativarMenu(
          btnContas
        );

      }
    );

  }

  /* =========================================================
     FILTROS
     ========================================================= */

  if (
    filtroMes
  ) {

    filtroMes.value =
      obterMesAtual();

    filtroMes.addEventListener(
      "change",
      () => {

        atualizarPeriodoDashboard();

        atualizarDashboard();

        renderizarLista();

      }
    );

  }

  if (
    btnLimparFiltro
  ) {

    btnLimparFiltro.addEventListener(
      "click",
      () => {

        if (
          filtroMes
        ) {

          filtroMes.value =
            "";

        }

        atualizarPeriodoDashboard();

        atualizarDashboard();

        renderizarLista();

      }
    );

  }

  if (
    tipoGrafico
  ) {

    tipoGrafico.addEventListener(
      "change",
      atualizarDashboard
    );

  }

  /* =========================================================
     LOGOUT
     ========================================================= */

  async function fazerLogout() {

    try {

      if (
        supabase
      ) {

        await supabase.auth.signOut();

      }

    } catch (erro) {

      console.error(
        "Logout:",
        erro
      );

    }

    dados =
      [];

    recorrenciasDados =
      [];

    recorrenciaEmEdicao =
      null;

    idEmEdicao =
      null;

    mostrarLogin();

  }

  if (
    btnLogoutTop
  ) {

    btnLogoutTop.addEventListener(
      "click",
      fazerLogout
    );

  }

  if (
    btnLogout
  ) {

    btnLogout.addEventListener(
      "click",
      () => {

        fecharMenuMobile();

        fazerLogout();

      }
    );

  }

  /* =========================================================
     LOGIN
     ========================================================= */

  async function iniciarSessao(
    user
  ) {

    if (
      !user
    ) {

      return;

    }

    const nome =
      user.user_metadata?.nome ||

      user.email?.split(
        "@"
      )[0] ||

      "Usuário";

    if (
      topbarUser
    ) {

      topbarUser.innerText =
        nome;

    }

    if (
      topbarPlano
    ) {

      topbarPlano.innerText =
        planoUsuario;

    }

    if (
      nomeCliente
    ) {

      nomeCliente.innerText =
        `Olá, ${nome}!`;

    }

    mostrarApp();

    mostrarTela(
      dashboard
    );

    ativarMenu(
      btnDashboard
    );

    if (
      filtroMes &&
      !filtroMes.value
    ) {

      filtroMes.value =
        obterMesAtual();

    }

    atualizarPeriodoDashboard();

    /*
     * A partir daqui somente
     * dados do usuário autenticado.
     */

    await garantirCategoriasPadrao();

    await carregarCategoriasFinanceiras();

    atualizarSelectCategorias(
      tipo?.value ||
      ""
    );

    await carregarDados();

    atualizarDashboard();

    renderizarLista();

  }

  if (
    btnLogin
  ) {

    btnLogin.addEventListener(
      "click",
      async () => {

        try {

          if (
            aceiteTermos &&
            !aceiteTermos.checked
          ) {

            alert(
              "Você precisa aceitar os termos."
            );

            return;

          }

          const email =
            emailInput?.value?.trim() ||
            "";

          const senha =
            senhaInput?.value ||
            "";

          if (
            !email ||
            !senha
          ) {

            alert(
              "Informe email e senha."
            );

            return;

          }

          /*
           * IMPORTANTE:
           * o login acontece diretamente
           * pelo cliente Supabase já inicializado.
           */

          const {
            data,
            error
          } =
            await supabase.auth.signInWithPassword({

              email:
                email,

              password:
                senha

            });

          if (
            error
          ) {

            console.error(
              "Erro de login:",
              error
            );

            alert(
              error.message
            );

            return;

          }

          if (
            !data?.user
          ) {

            alert(
              "Login não retornou um usuário válido."
            );

            return;

          }

          await iniciarSessao(
            data.user
          );

        } catch (erro) {

          console.error(
            "LOGIN:",
            erro
          );

          alert(
            "Não foi possível realizar o login. Verifique sua conexão, email e senha."
          );

        }

      }
    );

  }

  /* =========================================================
     CADASTRO
     ========================================================= */

  if (
    btnCadastro
  ) {

    btnCadastro.addEventListener(
      "click",
      async () => {

        try {

          if (
            aceiteTermos &&
            !aceiteTermos.checked
          ) {

            alert(
              "Você precisa aceitar os termos."
            );

            return;

          }

          const email =
            emailInput?.value?.trim() ||
            "";

          const senha =
            senhaInput?.value ||
            "";

          if (
            !email ||
            !senha
          ) {

            alert(
              "Informe email e senha."
            );

            return;

          }

          if (
            senha.length <
            6
          ) {

            alert(
              "A senha deve possuir pelo menos 6 caracteres."
            );

            return;

          }

          const {
            data,
            error
          } =
            await supabase.auth.signUp({

              email:
                email,

              password:
                senha,

              options: {

                data: {

                  nome:
                    email.split(
                      "@"
                    )[0]

                }

              }

            });

          if (
            error
          ) {

            alert(
              error.message
            );

            return;

          }

          /*
           * Se a confirmação de email estiver
           * desativada, o Supabase pode retornar
           * uma sessão imediatamente.
           */

          if (
            data?.session &&
            data?.user
          ) {

            await iniciarSessao(
              data.user
            );

            return;

          }

          alert(
            "Conta criada com sucesso! Confirme seu email para continuar."
          );

        } catch (erro) {

          console.error(
            "CADASTRO:",
            erro
          );

          alert(
            "Não foi possível criar a conta."
          );

        }

      }
    );

  }

  /* =========================================================
     ESQUECI A SENHA
     ========================================================= */

  if (
    btnEsqueciSenha
  ) {

    btnEsqueciSenha.addEventListener(
      "click",
      async () => {

        try {

          const email =
            emailInput?.value?.trim() ||
            "";

          if (
            !email
          ) {

            alert(
              "Informe seu email primeiro."
            );

            return;

          }

          const {
            error
          } =
            await supabase.auth.resetPasswordForEmail(
              email,
              {

                redirectTo:
                  window.location.origin +
                  window.location.pathname

              }
            );

          if (
            error
          ) {

            alert(
              error.message
            );

            return;

          }

          alert(
            "Enviamos as instruções de recuperação para seu email."
          );

        } catch (erro) {

          console.error(
            "Recuperação de senha:",
            erro
          );

          alert(
            "Não foi possível enviar o email de recuperação."
          );

        }

      }
    );

  }

  /* =========================================================
     EXPORTAÇÃO PDF
     ========================================================= */

  if (
    btnExportarPdf
  ) {

    btnExportarPdf.addEventListener(
      "click",
      () => {

        try {

          if (
            !window.jspdf ||
            !window.jspdf.jsPDF
          ) {

            alert(
              "A biblioteca de PDF não foi carregada."
            );

            return;

          }

          const {
            jsPDF
          } =
            window.jspdf;

          const pdf =
            new jsPDF();

          pdf.setFontSize(
            16
          );

          pdf.text(
            "TCS Finance - Extrato Financeiro",
            10,
            15
          );

          pdf.setFontSize(
            10
          );

          pdf.text(
            `Período: ${formatarPeriodo(
              filtroMes?.value ||
              ""
            )}`,
            10,
            23
          );

          let y =
            35;

          obterDadosFiltrados()
            .forEach(
              item => {

                if (
                  y >
                  280
                ) {

                  pdf.addPage();

                  y =
                    20;

                }

                const linha =
                  `${formatarData(
                    item.data
                  )} | ${
                    item.tipo ||
                    ""
                  } | ${
                    item.categoria ||
                    ""
                  } | ${
                    formatarMoeda(
                      item.valor
                    )
                  }`;

                pdf.text(
                  linha.substring(
                    0,
                    105
                  ),
                  10,
                  y
                );

                y +=
                  7;

              }
            );

          pdf.save(
            "extrato-financeiro.pdf"
          );

        } catch (erro) {

          console.error(
            "PDF:",
            erro
          );

          alert(
            "Não foi possível gerar o PDF."
          );

        }

      }
    );

  }

  /* =========================================================
     INICIALIZAÇÃO FINAL
     ========================================================= */

  (async () => {

    console.log(
      "Inicializando TCS Finance..."
    );

    /*
     * Primeiro garante que o Supabase
     * realmente existe.
     */

    const supabaseOK =
      await inicializarSupabase();

    if (
      !supabaseOK
    ) {

      mostrarLogin();

      return;

    }

    /*
     * Estado visual inicial.
     */

    fecharMenuMobile();

    mostrarLogin();

    if (
      filtroMes
    ) {

      filtroMes.value =
        obterMesAtual();

    }

    if (
      dataInput
    ) {

      dataInput.value =
        obterDataHoje();

    }

    if (
      recDataInicio
    ) {

      recDataInicio.value =
        obterDataHoje();

    }

    if (
      categoria
    ) {

      categoria.disabled =
        true;

    }

    if (
      tipoGrafico &&
      !tipoGrafico.value
    ) {

      tipoGrafico.value =
        "geral";

    }

    atualizarPeriodoDashboard();

    /*
     * RECUPERAÇÃO DA SESSÃO
     *
     * Esta é uma das partes mais importantes.
     */

    try {

      const {
        data,
        error
      } =
        await supabase.auth.getSession();

      if (
        error
      ) {

        console.warn(
          "Erro ao recuperar sessão:",
          error.message
        );

      }

      if (
        data?.session?.user
      ) {

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

    } catch (erro) {

      console.error(
        "Erro na recuperação da sessão:",
        erro
      );

      mostrarLogin();

    }

    /*
     * MONITORAMENTO DA AUTENTICAÇÃO
     */

    supabase.auth.onAuthStateChange(
      (
        evento,
        session
      ) => {

        console.log(
          "Auth event:",
          evento
        );

        if (

          evento ===
            "SIGNED_IN" &&

          session?.user

        ) {

          /*
           * setTimeout evita chamadas encadeadas
           * dentro do callback do Supabase.
           */

          setTimeout(
            () => {

              iniciarSessao(
                session.user
              );

            },
            0
          );

        }

        if (
          evento ===
          "SIGNED_OUT"
        ) {

          mostrarLogin();

        }

      }
    );

    /*
     * Carrega categorias de recorrência
     * somente depois que a sessão estiver
     * disponível.
     */

    const user =
      await obterUsuarioAtual();

    if (
      user
    ) {

      await carregarCategoriasRecorrencia();

    }

    console.log(
      "TCS Finance: inicialização concluída."
    );

  })();

});
