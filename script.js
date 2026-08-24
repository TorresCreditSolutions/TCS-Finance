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
     As categorias vêm do Supabase.
     A lista padrão abaixo é usada somente para garantir
     que cada usuário tenha uma base completa de categorias.
  ====================================================== */

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

  let categoriasPorTipo = {
    Receita: [],
    Despesa: [],
    Investimento: []
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

    const mes =
      String(
        agora.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    return `${ano}-${mes}`;

  }

  function formatarPeriodo(mes) {

    if (!mes) return "Todos os períodos";

    const partes = mes.split("-");

    if (partes.length !== 2) return mes;

    const ano = Number(partes[0]);

    const numeroMes = Number(partes[1]);

    const data =
      new Date(
        ano,
        numeroMes - 1,
        1
      );

    return data.toLocaleDateString(
      "pt-BR",
      {
        month: "long",
        year: "numeric"
      }
    );

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

  if (
    btnMenu &&
    sidebar &&
    menuOverlay
  ) {

    btnMenu.onclick = () => {

      const aberto =
        sidebar.classList.contains(
          "active"
        );

      if (aberto) {

        sidebar.classList.remove(
          "active"
        );

        menuOverlay.classList.add(
          "hidden"
        );

      } else {

        sidebar.classList.add(
          "active"
        );

        menuOverlay.classList.remove(
          "hidden"
        );

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

      dashboard.classList.remove(
        "hidden"
      );

      lancamentos.classList.add(
        "hidden"
      );

      if (relatorios) {

        relatorios.classList.add(
          "hidden"
        );

      }

      fecharMenuMobile();

      atualizarDashboard();

    };

  }

  if (btnLancamentos) {

    btnLancamentos.onclick = () => {

      dashboard.classList.add(
        "hidden"
      );

      lancamentos.classList.remove(
        "hidden"
      );

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

      app.classList.add(
        "hidden"
      );

      app.style.display =
        "none";

    }

    if (loginContainer) {

      loginContainer.style.display =
        "flex";

    }

  }

  if (btnLogoutTop) {

    btnLogoutTop.onclick =
      async () => {

        await fazerLogout();

      };

  }

  if (btnLogout) {

    btnLogout.onclick =
      async () => {

        fecharMenuMobile();

        await fazerLogout();

      };

  }

  /* ======================================================
     CATEGORIAS — CARREGAMENTO E FILTRO
  ====================================================== */

  function normalizarTipoCategoria(
    tipoSelecionado
  ) {

    const valor =
      String(
        tipoSelecionado || ""
      )
        .trim()
        .toLowerCase();

    if (
      valor === "receita"
    ) {
      return "Receita";
    }

    if (
      valor === "despesa"
    ) {
      return "Despesa";
    }

    if (
      valor === "investimento"
    ) {
      return "Investimento";
    }

    return tipoSelecionado || "";

  }

  async function garantirCategoriasPadrao() {

    try {

      const {
        data: userData,
        error: userError
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !userData?.user
      ) {

        return;

      }

      const userId =
        userData.user.id;

      const {
        data: existentes,
        error: buscaError
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
            userId
          );

      if (buscaError) {

        console.error(
          "Erro ao verificar categorias:",
          buscaError
        );

        return;

      }

      const listaExistente =
        existentes || [];

      const mapa =
        new Set(
          listaExistente.map(
            item =>
              `${normalizarTipoCategoria(item.tipo)}::${String(item.nome || "").trim().toLowerCase()}`
          )
        );

      const novasCategorias = [];

      Object.entries(
        categoriasPadrao
      ).forEach(
        ([tipoPadrao, nomes]) => {

          nomes.forEach(
            nome => {

              const chave =
                `${tipoPadrao}::${nome.toLowerCase()}`;

              if (
                !mapa.has(chave)
              ) {

                novasCategorias.push({
                  user_id:
                    userId,

                  nome:
                    nome,

                  tipo:
                    tipoPadrao,

                  ativa:
                    true
                });

              }

            }
          );

        }
      );

      if (
        novasCategorias.length
      ) {

        const {
          error: insertError
        } =
          await supabase
            .from(
              "categorias_financeiras"
            )
            .insert(
              novasCategorias
            );

        if (
          insertError
        ) {

          console.error(
            "Erro ao criar categorias padrão:",
            insertError
          );

        }

      }

    } catch (erro) {

      console.error(
        "Erro inesperado ao garantir categorias padrão:",
        erro
      );

    }

  }

  async function carregarCategoriasFinanceiras() {

    try {

      const {
        data: userData,
        error: userError
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !userData?.user
      ) {

        categoriasPorTipo = {
          Receita: [],
          Despesa: [],
          Investimento: []
        };

        return;

      }

      await garantirCategoriasPadrao();

      const {
        data,
        error
      } =
        await supabase
          .from(
            "categorias_financeiras"
          )
          .select(
            "id,user_id,nome,tipo,ativa"
          )
          .eq(
            "user_id",
            userData.user.id
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

      if (error) {

        console.error(
          "Erro ao carregar categorias financeiras:",
          error
        );

        return;

      }

      categoriasPorTipo = {
        Receita: [],
        Despesa: [],
        Investimento: []
      };

      (data || []).forEach(
        item => {

          const tipoNormalizado =
            normalizarTipoCategoria(
              item.tipo
            );

          if (
            categoriasPorTipo[
              tipoNormalizado
            ]
          ) {

            categoriasPorTipo[
              tipoNormalizado
            ].push(
              item
            );

          }

        }
      );

      if (
        tipo?.value
      ) {

        popularCategorias(
          tipo.value,
          categoria?.value || ""
        );

      }

    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar categorias financeiras:",
        erro
      );

    }

  }

  function popularCategorias(
    tipoSelecionado,
    categoriaSelecionada = ""
  ) {

    if (!categoria) {

      return;

    }

    categoria.innerHTML =
      "<option value=''>Categoria</option>";

    const tipoNormalizado =
      normalizarTipoCategoria(
        tipoSelecionado
      );

    const lista =
      categoriasPorTipo[
        tipoNormalizado
      ] || [];

    lista.forEach(
      item => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          item.nome;

        option.textContent =
          item.nome;

        option.dataset.id =
          item.id;

        if (
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

      option.value =
        "";

      option.textContent =
        "Nenhuma categoria cadastrada";

      option.disabled =
        true;

      categoria.appendChild(
        option
      );

    }

  }

  if (tipo) {

    tipo.onchange =
      () => {

        popularCategorias(
          tipo.value
        );

      };

  }

  /* ======================================================
     LOGIN
  ====================================================== */

  if (btnLogin) {

    btnLogin.onclick =
      async () => {

        if (
          !aceiteTermos.checked
        ) {

          alert(
            "Você precisa aceitar os termos."
          );

          return;

        }

        if (
          !emailInput.value ||
          !senhaInput.value
        ) {

          alert(
            "Informe seu email e senha."
          );

          return;

        }

        const {
          data,
          error
        } =
          await supabase.auth.signInWithPassword({

            email:
              emailInput.value.trim(),

            password:
              senhaInput.value

          });

        if (error) {

          alert(
            error.message
          );

          return;

        }

        await iniciarSessao(
          data.user
        );

      };

  }

  /* ======================================================
     CADASTRO
  ====================================================== */

  if (btnCadastro) {

    btnCadastro.onclick =
      async () => {

        if (
          !aceiteTermos.checked
        ) {

          alert(
            "Você precisa aceitar os termos."
          );

          return;

        }

        if (
          !emailInput.value ||
          !senhaInput.value
        ) {

          alert(
            "Informe email e senha."
          );

          return;

        }

        if (
          senhaInput.value.length < 6
        ) {

          alert(
            "A senha deve possuir pelo menos 6 caracteres."
          );

          return;

        }

        const {
          error
        } =
          await supabase.auth.signUp({

            email:
              emailInput.value.trim(),

            password:
              senhaInput.value,

            options: {

              data: {

                nome:
                  emailInput.value
                    .split("@")[0]

              }

            }

          });

        if (error) {

          alert(
            error.message
          );

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

  async function iniciarSessao(
    user
  ) {

    if (!user) return;

    const topbarUser =
      document.getElementById(
        "topbarUser"
      );

    const topbarPlano =
      document.getElementById(
        "topbarPlano"
      );

    const nomeUsuario =
      user.user_metadata?.nome ||
      user.email?.split("@")[0] ||
      "Usuário";

    if (topbarUser) {

      topbarUser.innerText =
        nomeUsuario;

    }

    if (topbarPlano) {

      topbarPlano.innerText =
        planoUsuario;

    }

    if (loginContainer) {

      loginContainer.style.display =
        "none";

    }

    if (app) {

      app.style.display =
        "flex";

      app.classList.remove(
        "hidden"
      );

    }

    if (dashboard) {

      dashboard.classList.remove(
        "hidden"
      );

    }

    if (lancamentos) {

      lancamentos.classList.add(
        "hidden"
      );

    }

    if (nomeCliente) {

      nomeCliente.innerText =
        `Olá, ${nomeUsuario}!`;

    }

    /* Define mês atual somente se não houver filtro */

    if (
      filtroMes &&
      !filtroMes.value
    ) {

      filtroMes.value =
        obterMesAtual();

    }

   atualizarPeriodoDashboard();

await garantirCategoriasPadrao();

await carregarCategoriasFinanceiras();

await carregarDados();

atualizarDashboard();

renderizarLista();

  /* ======================================================
     CARREGAR DADOS
  ====================================================== */

  async function carregarDados() {

    try {

      const {
        data,
        error
      } =
        await supabase
          .from("lancamentos")
          .select("*")
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

        alert(
          "Não foi possível carregar seus lançamentos."
        );

        dados = [];

        return;

      }

      dados =
        data || [];

    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar dados:",
        erro
      );

      dados = [];

    }

  }
      /* --------------------------------------------------
       ADICIONAR CATEGORIAS AO SELECT
    -------------------------------------------------- */

    categorias.forEach(
      cat => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          cat.nome;

        option.textContent =
          cat.nome;

        option.dataset.id =
          cat.id;

        if (
          categoriaSelecionada &&
          (
            String(
              categoriaSelecionada
            ) ===
            String(
              cat.nome
            ) ||
            String(
              categoriaSelecionada
            ) ===
            String(
              cat.id
            )
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


    /* --------------------------------------------------
       NENHUMA CATEGORIA
    -------------------------------------------------- */

    if (
      categorias.length === 0
    ) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        "";

      option.textContent =
        "Nenhuma categoria cadastrada";

      option.disabled =
        true;

      recCategoria.appendChild(
        option
      );

    }


  } catch (erro) {

    console.error(
      "Erro inesperado ao carregar categorias da recorrência:",
      erro
    );

    recCategoria.innerHTML =
      "<option value=''>Erro ao carregar categorias</option>";

  }

}


/* ======================================================
   ALTERAÇÃO DO TIPO DA RECORRÊNCIA
====================================================== */

if (recTipo) {

  recTipo.addEventListener(
    "change",
    async () => {

      await carregarCategoriasRecorrencia(
        recTipo.value
      );

    }
  );

}


/* ======================================================
   LIMPAR FORMULÁRIO DE RECORRÊNCIA
====================================================== */

function limparFormularioRecorrencia() {

  recorrenciaEmEdicao =
    null;


  if (recTipo) {

    recTipo.value =
      "";

  }


  if (recCategoria) {

    recCategoria.innerHTML =
      "<option value=''>Selecione uma categoria</option>";

  }


  if (recDescricao) {

    recDescricao.value =
      "";

  }


  if (recValor) {

    recValor.value =
      "";

  }


  if (recFrequencia) {

    recFrequencia.value =
      "mensal";

  }


  if (recDiaVencimento) {

    recDiaVencimento.value =
      "";

  }


  if (recDataInicio) {

    recDataInicio.value =
      "";

  }


  if (recDataFim) {

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
      "Salvar recorrência";

  }

}


/* ======================================================
   CARREGAR RECORRÊNCIAS
====================================================== */

async function carregarRecorrencias() {

  try {

    const {
      data: userData,
      error: userError
    } =
      await supabase.auth.getUser();


    if (
      userError ||
      !userData?.user
    ) {

      recorrenciasDados =
        [];

      renderizarRecorrencias();

      return;

    }


    const {
      data,
      error
    } =
      await supabase
        .from(
          "lancamentos_recorrentes"
        )
        .select("*")
        .eq(
          "user_id",
          userData.user.id
        )
        .order(
          "created_at",
          {
            ascending:
              false
          }
        );


    if (error) {

      console.error(
        "Erro ao carregar recorrências:",
        error
      );

      recorrenciasDados =
        [];

      renderizarRecorrencias();

      return;

    }


    recorrenciasDados =
      data || [];


    atualizarContadoresRecorrencias();

    renderizarRecorrencias();


  } catch (erro) {

    console.error(
      "Erro inesperado ao carregar recorrências:",
      erro
    );

    recorrenciasDados =
      [];

    renderizarRecorrencias();

  }

}


/* ======================================================
   CONTADORES DE RECORRÊNCIAS
====================================================== */

function atualizarContadoresRecorrencias() {

  const total =
    recorrenciasDados.length;


  const ativas =
    recorrenciasDados.filter(
      item =>
        item.ativa === true
    ).length;


  const pausadas =
    recorrenciasDados.filter(
      item =>
        item.ativa === false
    ).length;


  if (totalRecorrencias) {

    totalRecorrencias.innerText =
      total;

  }


  if (recorrenciasAtivas) {

    recorrenciasAtivas.innerText =
      ativas;

  }


  if (recorrenciasPausadas) {

    recorrenciasPausadas.innerText =
      pausadas;

  }


  if (contadorRecorrencias) {

    contadorRecorrencias.innerText =
      total;

  }

}


/* ======================================================
   RENDERIZAR RECORRÊNCIAS
====================================================== */

function renderizarRecorrencias() {

  if (!listaRecorrencias) {

    return;

  }


  listaRecorrencias.innerHTML =
    "";


  if (
    !recorrenciasDados.length
  ) {

    listaRecorrencias.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma recorrência cadastrada.</p>
      </div>
    `;

    atualizarContadoresRecorrencias();

    return;

  }


  recorrenciasDados.forEach(
    recorrencia => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "recorrencia-item";


      const ativa =
        recorrencia.ativa !== false;


      const status =
        ativa
          ? "Ativa"
          : "Pausada";


      const frequencia =
        nomesFrequencia[
          recorrencia.frequencia
        ] ||
        recorrencia.frequencia ||
        "Mensal";


      item.innerHTML = `

        <div class="recorrencia-info">

          <strong>
            ${
              recorrencia.descricao ||
              "Sem descrição"
            }
          </strong>

          <span>
            ${
              recorrencia.tipo ||
              ""
            }
            •
            ${
              recorrencia.categoria ||
              "Sem categoria"
            }
          </span>

          <span>
            ${
              formatarMoeda(
                recorrencia.valor
              )
            }
          </span>

          <small>
            ${
              frequencia
            }
            ${
              recorrencia.dia_vencimento
                ? `• Dia ${recorrencia.dia_vencimento}`
                : ""
            }
          </small>

        </div>


        <div class="recorrencia-status">

          <span class="${
            ativa
              ? "status-ativa"
              : "status-pausada"
          }">

            ${
              status
            }

          </span>

        </div>


        <div class="recorrencia-acoes">

          <button
            type="button"
            class="btn-acao"
            data-acao="editar"
            data-id="${
              recorrencia.id
            }"
            title="Editar"
          >
            ✏️
          </button>


          <button
            type="button"
            class="btn-acao"
            data-acao="alternar"
            data-id="${
              recorrencia.id
            }"
            title="${
              ativa
                ? "Pausar"
                : "Ativar"
            }"
          >
            ${
              ativa
                ? "⏸️"
                : "▶️"
            }
          </button>


          <button
            type="button"
            class="btn-acao"
            data-acao="excluir"
            data-id="${
              recorrencia.id
            }"
            title="Excluir"
          >
            🗑️
          </button>

        </div>

      `;


      listaRecorrencias.appendChild(
        item
      );

    }
  );


  atualizarContadoresRecorrencias();

}


/* ======================================================
   EVENTOS DAS RECORRÊNCIAS
====================================================== */

if (listaRecorrencias) {

  listaRecorrencias.addEventListener(
    "click",
    async event => {

      const botao =
        event.target.closest(
          "[data-acao]"
        );


      if (!botao) {

        return;

      }


      const id =
        botao.dataset.id;


      const acao =
        botao.dataset.acao;


      if (
        acao ===
        "editar"
      ) {

        await editarRecorrencia(
          id
        );

      }


      if (
        acao ===
        "alternar"
      ) {

        await alternarRecorrencia(
          id
        );

      }


      if (
        acao ===
        "excluir"
      ) {

        await excluirRecorrencia(
          id
        );

      }

    }
  );

}


/* ======================================================
   EDITAR RECORRÊNCIA
====================================================== */

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


  if (!recorrencia) {

    alert(
      "Recorrência não encontrada."
    );

    return;

  }


  recorrenciaEmEdicao =
    recorrencia.id;


  if (recTipo) {

    recTipo.value =
      recorrencia.tipo ||
      "";

  }


  await carregarCategoriasRecorrencia(
    recorrencia.tipo ||
      "",
    recorrencia.categoria ||
      ""
  );


  if (recDescricao) {

    recDescricao.value =
      recorrencia.descricao ||
      "";

  }


  if (recValor) {

    recValor.value =
      recorrencia.valor ||
      "";

  }


  if (recFrequencia) {

    recFrequencia.value =
      recorrencia.frequencia ||
      "mensal";

  }


  if (recDiaVencimento) {

    recDiaVencimento.value =
      recorrencia.dia_vencimento ||
      "";

  }


  if (recDataInicio) {

    recDataInicio.value =
      recorrencia.data_inicio ||
      "";

  }


  if (recDataFim) {

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
    recorrencias
  ) {

    recorrencias.classList.remove(
      "hidden"
    );

  }


  const formulario =
    document.getElementById(
      "formRecorrencia"
    );


  if (formulario) {

    formulario.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start"

    });

  }

}


/* ======================================================
   SALVAR / ATUALIZAR RECORRÊNCIA
====================================================== */

if (
  btnSalvarRecorrencia
) {

  btnSalvarRecorrencia.onclick =
    async () => {

      try {

        const {
          data: userData,
          error: userError
        } =
          await supabase.auth.getUser();


        if (
          userError ||
          !userData?.user
        ) {

          alert(
            "Sua sessão expirou. Faça login novamente."
          );

          return;

        }


        const tipoSelecionado =
          recTipo?.value ||
          "";


        const categoriaSelecionada =
          recCategoria?.value ||
          "";


        const descricaoSelecionada =
          recDescricao?.value?.trim() ||
          "";


        const valorSelecionado =
          Number(
            String(
              recValor?.value ||
              ""
            )
              .replace(
                /\./g,
                ""
              )
              .replace(
                ",",
                "."
              )
          );


        const frequenciaSelecionada =
          recFrequencia?.value ||
          "mensal";


        const diaSelecionado =
          recDiaVencimento?.value ||
          null;


        const dataInicioSelecionada =
          recDataInicio?.value ||
          null;


        const dataFimSelecionada =
          recDataFim?.value ||
          null;


        if (!tipoSelecionado) {

          alert(
            "Selecione o tipo da recorrência."
          );

          return;

        }


        if (!categoriaSelecionada) {

          alert(
            "Selecione uma categoria."
          );

          return;

        }


        if (!descricaoSelecionada) {

          alert(
            "Informe uma descrição."
          );

          return;

        }


        if (
          !valorSelecionado ||
          valorSelecionado <= 0
        ) {

          alert(
            "Informe um valor válido."
          );

          return;

        }


        /* ======================================================
   MONTAR REGISTRO DA RECORRÊNCIA
====================================================== */

const tipoNormalizado =
  normalizarTipoCategoria(
    tipoSelecionado
  ).toLowerCase();


const registro = {

  user_id:
    userData.user.id,

  tipo:
    tipoNormalizado,

  categoria:
    categoriaSelecionada,

  descricao:
    descricaoSelecionada,

  valor:
    valorSelecionado,

  frequencia:
    frequenciaSelecionada,

  dia_vencimento:
    diaSelecionado
      ? Number(
          diaSelecionado
        )
      : null,

  data_inicio:
    dataInicioSelecionada,

  data_fim:
    dataFimSelecionada,

  ativa:
    true

};


/* ======================================================
   VALIDAR TIPO DA RECORRÊNCIA
====================================================== */

if (
  ![
    "receita",
    "despesa",
    "investimento"
  ].includes(
    tipoNormalizado
  )
) {

  alert(
    "Tipo de recorrência inválido."
  );

  console.error(
    "Tipo de recorrência recebido:",
    tipoSelecionado
  );

  return;

}


/* ======================================================
   ATUALIZAR RECORRÊNCIA
====================================================== */

if (
  recorrenciaEmEdicao
) {

  const {
    error
  } =
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
        userData.user.id
      );


  if (
    error
  ) {

    console.error(
      "Erro ao atualizar recorrência:",
      error
    );

    alert(
      `Não foi possível atualizar a recorrência.\n\n${error.message}`
    );

    return;

  }


  alert(
    "Recorrência atualizada com sucesso!"
  );


} else {


  /* ==================================================
     CRIAR NOVA RECORRÊNCIA
  ================================================== */

  const {
    error
  } =
    await supabase
      .from(
        "lancamentos_recorrentes"
      )
      .insert(
        registro
      );


  if (
    error
  ) {

    console.error(
      "Erro ao criar recorrência:",
      error
    );

    alert(
      `Não foi possível criar a recorrência.\n\n${error.message}`
    );

    return;

  }


  alert(
    "Recorrência criada com sucesso!"
  );

}


/* ======================================================
   FINALIZAÇÃO
====================================================== */

limparFormularioRecorrencia();

await carregarRecorrencias();


} catch (
  erro
) {

  console.error(
    "Erro inesperado ao salvar recorrência:",
    erro
  );

  alert(
    "Ocorreu um erro ao salvar a recorrência."
  );

}

};
          data_fim:
            recDataFim.value ||
            null,

          ativo:
            true

        };


        let resposta;


        if (
          recorrenciaEmEdicao
        ) {

          resposta =
            await supabase
              .from(
                "lancamentos_recorrentes"
              )
              .update(
                dadosRecorrencia
              )
              .eq(
                "id",
                recorrenciaEmEdicao
              )
              .eq(
                "user_id",
                userData.user.id
              );


        } else {

          resposta =
            await supabase
              .from(
                "lancamentos_recorrentes"
              )
              .insert(
                dadosRecorrencia
              );

        }


        if (resposta.error) {

          console.error(
            "Erro ao salvar recorrência:",
            resposta.error
          );

          alert(
            "Não foi possível salvar a recorrência."
          );

          return;

        }


        alert(
          recorrenciaEmEdicao
            ? "Recorrência atualizada com sucesso!"
            : "Recorrência cadastrada com sucesso!"
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

    };

}


/* ======================================================
   EDITAR RECORRÊNCIA
====================================================== */

async function editarRecorrencia(
  id
) {

  const recorrencia =
    recorrenciasDados.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!recorrencia) {

    alert(
      "Recorrência não encontrada."
    );

    return;

  }


  recorrenciaEmEdicao =
    recorrencia.id;


  if (recTipo) {

    recTipo.value =
      recorrencia.tipo ||
      "";

  }


  await carregarCategoriasRecorrencia(
    recorrencia.tipo,
    recorrencia.categoria_id
  );


  if (recDescricao) {

    recDescricao.value =
      recorrencia.descricao ||
      "";

  }


  if (recValor) {

    recValor.value =
      recorrencia.valor ||
      "";

  }


  if (recFrequencia) {

    recFrequencia.value =
      recorrencia.frequencia ||
      "mensal";

  }


  if (recDiaVencimento) {

    recDiaVencimento.value =
      recorrencia.dia_vencimento ||
      "";

  }


  if (recDataInicio) {

    recDataInicio.value =
      recorrencia.data_inicio ||
      "";

  }


  if (recDataFim) {

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


  const formulario =
    document.getElementById(
      "formRecorrencia"
    );


  if (formulario) {

    formulario.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start"

    });

  }

}


/* ======================================================
   ALTERNAR STATUS DA RECORRÊNCIA
====================================================== */

async function alternarRecorrencia(
  id
) {

  const recorrencia =
    recorrenciasDados.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!recorrencia) {

    alert(
      "Recorrência não encontrada."
    );

    return;

  }


  const novoStatus =
    !(
      recorrencia.ativo === true
    );


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
          id
        );


    if (error) {

      console.error(
        "Erro ao alterar status da recorrência:",
        error
      );

      alert(
        "Não foi possível alterar o status da recorrência."
      );

      return;

    }


    await carregarRecorrencias();


  } catch (erro) {

    console.error(
      "Erro inesperado ao alterar recorrência:",
      erro
    );

    alert(
      "Ocorreu um erro ao alterar a recorrência."
    );

  }

}


/* ======================================================
   EXCLUIR RECORRÊNCIA
====================================================== */

async function excluirRecorrencia(
  id
) {

  if (
    !confirm(
      "Tem certeza que deseja excluir esta recorrência?"
    )
  ) {

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
          id
        );


    if (error) {

      console.error(
        "Erro ao excluir recorrência:",
        error
      );

      alert(
        "Não foi possível excluir a recorrência."
      );

      return;

    }


    if (
      String(
        recorrenciaEmEdicao
      ) ===
      String(id)
    ) {

      limparFormularioRecorrencia();

    }


    await carregarRecorrencias();


    alert(
      "Recorrência excluída com sucesso!"
    );


  } catch (erro) {

    console.error(
      "Erro inesperado ao excluir recorrência:",
      erro
    );

    alert(
      "Ocorreu um erro ao excluir a recorrência."
    );

  }

}


/* ======================================================
   EVENTOS DA LISTA DE RECORRÊNCIAS
====================================================== */

if (listaRecorrencias) {

  listaRecorrencias.addEventListener(
    "click",
    async event => {

      const botao =
        event.target.closest(
          "button"
        );


      if (!botao) {

        return;

      }


      const id =
        botao.dataset.id;


      if (!id) {

        return;

      }


      if (
        botao.classList.contains(
          "acao-editar"
        )
      ) {

        await editarRecorrencia(
          id
        );

        return;

      }


      if (
        botao.classList.contains(
          "acao-pausar"
        )
      ) {

        await alternarRecorrencia(
          id
        );

        return;

      }


      if (
        botao.classList.contains(
          "acao-excluir"
        )
      ) {

        await excluirRecorrencia(
          id
        );

        return;

      }

    }
  );

}


/* ======================================================
   NAVEGAÇÃO — RECORRÊNCIAS
====================================================== */

if (navRecorrencias) {

  navRecorrencias.addEventListener(
    "click",
    async () => {

      if (dashboard) {

        dashboard.classList.add(
          "hidden"
        );

      }

      if (lancamentos) {

        lancamentos.classList.add(
          "hidden"
        );

      }

      if (recorrencias) {

        recorrencias.classList.remove(
          "hidden"
        );

      }

      await carregarCategoriasRecorrencia(
        recTipo?.value || ""
      );

      await carregarRecorrencias();

    }
  );

}
      alert(
        `Não foi possível excluir a recorrência.\n\n${error.message}`
      );

      return;

    }


    await carregarRecorrencias();


  } catch (erro) {

    console.error(
      "Erro inesperado ao excluir recorrência:",
      erro
    );

    alert(
      "Ocorreu um erro ao excluir a recorrência."
    );

  }

}


/* ======================================================
   CANCELAR EDIÇÃO DE RECORRÊNCIA
====================================================== */

if (btnCancelarRecorrencia) {

  btnCancelarRecorrencia.onclick =
    () => {

      limparFormularioRecorrencia();

    };

}


/* ======================================================
   NAVEGAÇÃO — LANÇAMENTOS
====================================================== */

if (navLancamentos) {

  navLancamentos.addEventListener(
    "click",
    () => {

      if (dashboard) {

        dashboard.classList.add(
          "hidden"
        );

      }

      if (recorrencias) {

        recorrencias.classList.add(
          "hidden"
        );

      }

      if (lancamentos) {

        lancamentos.classList.remove(
          "hidden"
        );

      }

      fecharMenuMobile();

    }
  );

}


/* ======================================================
   NAVEGAÇÃO — DASHBOARD
====================================================== */

if (navDashboard) {

  navDashboard.addEventListener(
    "click",
    () => {

      if (lancamentos) {

        lancamentos.classList.add(
          "hidden"
        );

      }

      if (recorrencias) {

        recorrencias.classList.add(
          "hidden"
        );

      }

      if (dashboard) {

        dashboard.classList.remove(
          "hidden"
        );

      }

      atualizarDashboard();

      fecharMenuMobile();

    }
  );

}


/* ======================================================
   NAVEGAÇÃO — CATEGORIAS
====================================================== */

if (navCategorias) {

  navCategorias.addEventListener(
    "click",
    async () => {

      if (dashboard) {

        dashboard.classList.add(
          "hidden"
        );

      }

      if (lancamentos) {

        lancamentos.classList.add(
          "hidden"
        );

      }

      if (recorrencias) {

        recorrencias.classList.add(
          "hidden"
        );

      }

      if (categoriasView) {

        categoriasView.classList.remove(
          "hidden"
        );

      }

      fecharMenuMobile();

      await carregarCategoriasFinanceiras();

      renderizarCategorias();

    }
  );

}


/* ======================================================
   CARREGAR CATEGORIAS FINANCEIRAS
====================================================== */

async function carregarCategoriasFinanceiras() {

  try {

    const {
      data: userData,
      error: userError
    } =
      await supabase.auth.getUser();


    if (
      userError ||
      !userData?.user
    ) {

      categoriasFinanceiras =
        [];

      categoriasRecorrenciaMapa =
        {};

      return;

    }


    const {
      data,
      error
    } =
      await supabase
        .from(
          "categorias"
        )
        .select("*")
        .eq(
          "user_id",
          userData.user.id
        )
        .order(
          "tipo",
          {
            ascending:
              true
          }
        )
        .order(
          "nome",
          {
            ascending:
              true
          }
        );


    if (error) {

      console.error(
        "Erro ao carregar categorias:",
        error
      );

      categoriasFinanceiras =
        [];

      categoriasRecorrenciaMapa =
        {};

      return;

    }


    categoriasFinanceiras =
      data || [];


    categoriasRecorrenciaMapa =
      {};


    categoriasFinanceiras.forEach(
      categoria => {

        categoriasRecorrenciaMapa[
          categoria.id
        ] =
          categoria.nome;

      }
    );


  } catch (erro) {

    console.error(
      "Erro inesperado ao carregar categorias:",
      erro
    );

    categoriasFinanceiras =
      [];

    categoriasRecorrenciaMapa =
      {};

  }

}


/* ======================================================
   RENDERIZAR CATEGORIAS
====================================================== */

function renderizarCategorias() {

  if (!listaCategorias) {

    return;

  }


  listaCategorias.innerHTML =
    "";


  if (
    !categoriasFinanceiras.length
  ) {

    listaCategorias.innerHTML = `

      <div class="categorias-vazio">

        <div class="categorias-vazio-icone">
          📂
        </div>

        <strong>
          Nenhuma categoria cadastrada
        </strong>

        <p>
          Cadastre categorias para organizar
          suas receitas, despesas e investimentos.
        </p>

      </div>

    `;

    return;

  }


  const grupos = {

    Receita: [],

    Despesa: [],

    Investimento: []

  };


  categoriasFinanceiras.forEach(
    categoria => {

      if (
        grupos[categoria.tipo]
      ) {

        grupos[categoria.tipo]
          .push(
            categoria
          );

      }

    }
  );


  Object.keys(
    grupos
  ).forEach(
    tipo => {

      const categorias =
        grupos[tipo];


      if (
        !categorias.length
      ) {

        return;

      }


      const grupo =
        document.createElement(
          "div"
        );


      grupo.className =
        "categoria-grupo";


      grupo.innerHTML = `

        <div class="categoria-grupo-titulo">

          <h3>
            ${escapeHtml(tipo)}
          </h3>

          <span>
            ${categorias.length}
            ${
              categorias.length === 1
                ? "categoria"
                : "categorias"
            }
          </span>

        </div>

      `;


      categorias.forEach(
        categoria => {

          const item =
            document.createElement(
              "div"
            );


          item.className =
            "categoria-item";


          item.innerHTML = `

            <div class="categoria-item-info">

              <div
                class="categoria-item-icone"
              >
                ${categoria.icone || "📁"}
              </div>

              <div>

                <strong>
                  ${
                    escapeHtml(
                      categoria.nome
                    )
                  }
                </strong>

                ${
                  categoria.descricao
                    ? `
                      <small>
                        ${
                          escapeHtml(
                            categoria.descricao
                          )
                        }
                      </small>
                    `
                    : ""
                }

              </div>

            </div>


            <div class="categoria-item-acoes">

              <button
                type="button"
                class="acao-editar-categoria"
                data-id="${
                  categoria.id
                }"
              >
                ✏️
              </button>

              <button
                type="button"
                class="acao-excluir-categoria"
                data-id="${
                  categoria.id
                }"
              >
                🗑️
              </button>

            </div>

          `;


          grupo.appendChild(
            item
          );

        }
      );


      listaCategorias.appendChild(
        grupo
      );

    }
  );

}


/* ======================================================
   FORMULÁRIO DE CATEGORIA
====================================================== */

function limparFormularioCategoria() {

  categoriaEmEdicao =
    null;


  if (catTipo) {

    catTipo.value =
      "";

  }


  if (catNome) {

    catNome.value =
      "";

  }


  if (catDescricao) {

    catDescricao.value =
      "";

  }


  if (catIcone) {

    catIcone.value =
      "";

  }


  if (tituloFormularioCategoria) {

    tituloFormularioCategoria.innerText =
      "Nova categoria";

  }


  if (btnSalvarCategoria) {

    btnSalvarCategoria.innerText =
      "Salvar categoria";

  }


  if (btnCancelarCategoria) {

    btnCancelarCategoria.classList.add(
      "hidden"
    );

  }

}


/* ======================================================
   SALVAR CATEGORIA
====================================================== */

if (btnSalvarCategoria) {

  btnSalvarCategoria.onclick =
    async () => {

      const tipoSelecionado =
        catTipo?.value ||
        "";


      const nomeSelecionado =
        catNome?.value?.trim() ||
        "";


      const descricaoSelecionada =
        catDescricao?.value?.trim() ||
        "";


      const iconeSelecionado =
        catIcone?.value?.trim() ||
        "📁";


      if (!tipoSelecionado) {

        alert(
          "Selecione o tipo da categoria."
        );

        return;

      }


      if (!nomeSelecionado) {

        alert(
          "Informe o nome da categoria."
        );

        return;

      }


      try {

        const {
          data: userData,
          error: userError
        } =
          await supabase.auth.getUser();


        if (
          userError ||
          !userData?.user
        ) {

          alert(
            "Sua sessão expirou. Faça login novamente."
          );

          return;

        }


        const dadosCategoria = {

          user_id:
            userData.user.id,

          tipo:
            tipoSelecionado,

          nome:
            nomeSelecionado,

          descricao:
            descricaoSelecionada,

          icone:
            iconeSelecionado

        };


        let resultado;


        if (
          categoriaEmEdicao
        ) {

          resultado =
            await supabase
              .from(
                "categorias"
              )
              .update(
                dadosCategoria
              )
              .eq(
                "id",
                categoriaEmEdicao
              )
              .eq(
                "user_id",
                userData.user.id
              );

        } else {

          resultado =
            await supabase
              .from(
                "categorias"
              )
              .insert(
                dadosCategoria
              );

        }


        if (
          resultado.error
        ) {

          console.error(
            "Erro ao salvar categoria:",
            resultado.error
          );

          alert(
            `Não foi possível salvar a categoria.\n\n${resultado.error.message}`
          );

          return;

        }


        alert(
          categoriaEmEdicao
            ? "Categoria atualizada com sucesso!"
            : "Categoria criada com sucesso!"
        );


        limparFormularioCategoria();

        await carregarCategoriasFinanceiras();

        renderizarCategorias();

        atualizarSelectCategorias();

      } catch (erro) {

        console.error(
          "Erro inesperado ao salvar categoria:",
          erro
        );

        alert(
          "Ocorreu um erro ao salvar a categoria."
        );

      }

    };

}


/* ======================================================
   EDITAR CATEGORIA
====================================================== */

async function editarCategoria(
  id
) {

  const categoriaEncontrada =
    categoriasFinanceiras.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (
    !categoriaEncontrada
  ) {

    alert(
      "Categoria não encontrada."
    );

    return;

  }


  categoriaEmEdicao =
    categoriaEncontrada.id;


  if (catTipo) {

    catTipo.value =
      categoriaEncontrada.tipo ||
      "";

  }


  if (catNome) {

    catNome.value =
      categoriaEncontrada.nome ||
      "";

  }


  if (catDescricao) {

    catDescricao.value =
      categoriaEncontrada.descricao ||
      "";

  }


  if (catIcone) {

    catIcone.value =
      categoriaEncontrada.icone ||
      "";

  }


  if (
    tituloFormularioCategoria
  ) {

    tituloFormularioCategoria.innerText =
      "Editar categoria";

  }


  if (
    btnSalvarCategoria
  ) {

    btnSalvarCategoria.innerText =
      "Atualizar categoria";

  }


  if (
    btnCancelarCategoria
  ) {

    btnCancelarCategoria.classList.remove(
      "hidden"
    );

  }

}
/* ======================================================
   EXCLUIR CATEGORIA
====================================================== */

async function excluirCategoria(
  id
) {

  const categoriaEncontrada =
    categoriasFinanceiras.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (
    !categoriaEncontrada
  ) {

    alert(
      "Categoria não encontrada."
    );

    return;

  }


  const confirmar =
    confirm(
      `Deseja realmente excluir a categoria "${categoriaEncontrada.nome}"?`
    );


  if (!confirmar) {

    return;

  }


  try {

    const {
      data: userData,
      error: userError
    } =
      await supabase.auth.getUser();


    if (
      userError ||
      !userData?.user
    ) {

      alert(
        "Sua sessão expirou. Faça login novamente."
      );

      return;

    }


    /*
     * Verifica se existem lançamentos
     * utilizando esta categoria.
     */

    const {
      data: lancamentosCategoria,
      error: erroLancamentos
    } =
      await supabase
        .from(
          "lancamentos"
        )
        .select(
          "id"
        )
        .eq(
          "user_id",
          userData.user.id
        )
        .eq(
          "categoria_id",
          id
        )
        .limit(
          1
        );


    if (erroLancamentos) {

      console.warn(
        "Não foi possível verificar os lançamentos da categoria:",
        erroLancamentos
      );

    }


    if (
      lancamentosCategoria &&
      lancamentosCategoria.length > 0
    ) {

      alert(
        "Esta categoria possui lançamentos vinculados e não pode ser excluída."
      );

      return;

    }


    /*
     * Verifica também recorrências
     * vinculadas à categoria.
     */

    const {
      data: recorrenciasCategoria,
      error: erroRecorrencias
    } =
      await supabase
        .from(
          "lancamentos_recorrentes"
        )
        .select(
          "id"
        )
        .eq(
          "user_id",
          userData.user.id
        )
        .eq(
          "categoria_id",
          id
        )
        .limit(
          1
        );


    if (erroRecorrencias) {

      console.warn(
        "Não foi possível verificar as recorrências da categoria:",
        erroRecorrencias
      );

    }


    if (
      recorrenciasCategoria &&
      recorrenciasCategoria.length > 0
    ) {

      alert(
        "Esta categoria possui recorrências vinculadas e não pode ser excluída."
      );

      return;

    }


    const {
      error
    } =
      await supabase
        .from(
          "categorias"
        )
        .delete()
        .eq(
          "id",
          id
        )
        .eq(
          "user_id",
          userData.user.id
        );


    if (error) {

      console.error(
        "Erro ao excluir categoria:",
        error
      );

      alert(
        `Não foi possível excluir a categoria.\n\n${error.message}`
      );

      return;

    }


    if (
      String(
        categoriaEmEdicao
      ) ===
      String(id)
    ) {

      limparFormularioCategoria();

    }


    await carregarCategoriasFinanceiras();

    renderizarCategorias();

    atualizarSelectCategorias();


    alert(
      "Categoria excluída com sucesso!"
    );


  } catch (erro) {

    console.error(
      "Erro inesperado ao excluir categoria:",
      erro
    );

    alert(
      "Ocorreu um erro ao excluir a categoria."
    );

  }

}


/* ======================================================
   CANCELAR EDIÇÃO DE CATEGORIA
====================================================== */

if (
  btnCancelarCategoria
) {

  btnCancelarCategoria.onclick =
    () => {

      limparFormularioCategoria();

    };

}


/* ======================================================
   EVENTOS DA LISTA DE CATEGORIAS
====================================================== */

if (listaCategorias) {

  listaCategorias.addEventListener(
    "click",
    async event => {

      const botao =
        event.target.closest(
          "button"
        );


      if (!botao) {

        return;

      }


      const id =
        botao.dataset.id;


      if (!id) {

        return;

      }


      if (
        botao.classList.contains(
          "acao-editar-categoria"
        )
      ) {

        await editarCategoria(
          id
        );

        return;

      }


      if (
        botao.classList.contains(
          "acao-excluir-categoria"
        )
      ) {

        await excluirCategoria(
          id
        );

        return;

      }

    }
  );

}


/* ======================================================
   ATUALIZAR SELECTS DE CATEGORIAS
====================================================== */

function atualizarSelectCategorias(
  tipoSelecionado = null,
  categoriaSelecionada = null
) {

  if (!categoria) {

    return;

  }


  const tipoAtual =
    tipoSelecionado ||
    tipo?.value ||
    "";


  categoria.innerHTML = `
    <option value="">
      Selecione uma categoria
    </option>
  `;


  if (!tipoAtual) {

    categoria.disabled =
      true;

    return;

  }


  categoria.disabled =
    false;


  const categoriasDoTipo =
    categoriasFinanceiras.filter(
      item =>
        item.tipo ===
        tipoAtual
    );


  categoriasDoTipo.forEach(
    cat => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        cat.id;


      option.textContent =
        cat.nome;


      if (
        categoriaSelecionada &&
        (
          String(
            categoriaSelecionada
          ) ===
          String(
            cat.id
          ) ||
          String(
            categoriaSelecionada
          ) ===
          String(
            cat.nome
          )
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
    categoriasDoTipo.length ===
    0
  ) {

    const option =
      document.createElement(
        "option"
      );


    option.value =
      "";


    option.textContent =
      "Nenhuma categoria cadastrada";


    option.disabled =
      true;


    categoria.appendChild(
      option
    );

  }

}


/* ======================================================
   ALTERAÇÃO DO TIPO DO LANÇAMENTO
====================================================== */

if (tipo) {

  tipo.addEventListener(
    "change",
    () => {

      atualizarSelectCategorias(
        tipo.value
      );

    }
  );

}


/* ======================================================
   MÁSCARA DE VALOR
====================================================== */

if (valor) {

  valor.addEventListener(
    "input",
    () => {

      let numero =
        valor.value.replace(
          /\D/g,
          ""
        );


      if (!numero) {

        valor.value =
          "";

        return;

      }


      numero =
        Number(numero) /
        100;


      valor.value =
        numero.toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits:
              2,

            maximumFractionDigits:
              2
          }
        );

    }
  );

}


/* ======================================================
   FORMATAR VALOR AO EDITAR
====================================================== */

function formatarInputValor(
  numero
) {

  if (
    numero === null ||
    numero === undefined ||
    numero === ""
  ) {

    return "";

  }


  const valorNumerico =
    Number(numero);


  if (
    Number.isNaN(
      valorNumerico
    )
  ) {

    return "";

  }


  return valorNumerico.toLocaleString(
    "pt-BR",
    {

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2

    }
  );

}


/* ======================================================
   FORMATAÇÃO DE MOEDA
====================================================== */

function formatarMoeda(
  valorNumerico
) {

  const numero =
    Number(
      valorNumerico
    ) || 0;


  return numero.toLocaleString(
    "pt-BR",
    {

      style:
        "currency",

      currency:
        "BRL"

    }
  );

}


/* ======================================================
   FORMATAÇÃO DE DATA
====================================================== */

function formatarData(
  dataValor
) {

  if (!dataValor) {

    return "";

  }


  const partes =
    String(
      dataValor
    ).split(
      "-"
    );


  if (
    partes.length ===
    3
  ) {

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  }


  return String(
    dataValor
  );

}


/* ======================================================
   FORMATAR PERÍODO
====================================================== */

function formatarPeriodo(
  valorMes
) {

  if (!valorMes) {

    return "Todos os períodos";

  }


  const partes =
    String(
      valorMes
    ).split(
      "-"
    );


  if (
    partes.length !==
    2
  ) {

    return valorMes;

  }


  const ano =
    Number(
      partes[0]
    );


  const mes =
    Number(
      partes[1]
    );


  if (
    !ano ||
    !mes
  ) {

    return valorMes;

  }


  const data =
    new Date(
      ano,
      mes - 1,
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
        `Não foi possível excluir a recorrência.\n\n${error.message}`
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
      "Erro inesperado:",
      erro
    );

    alert(
      "Ocorreu um erro ao excluir a recorrência."
    );

  }

}


/* ======================================================
   CANCELAR EDIÇÃO
====================================================== */

if (btnCancelarRecorrencia) {

  btnCancelarRecorrencia.onclick =
    () => {

      limparFormularioRecorrencia();

    };

}


/* ======================================================
   LIMPAR FORMULÁRIO
====================================================== */

function limparFormularioRecorrencia() {

  recorrenciaEmEdicao =
    null;


  if (recTipo) {
    recTipo.value = "";
  }


  if (recCategoria) {

    recCategoria.innerHTML =
      "<option value=''>Selecione uma categoria</option>";

  }


  if (recDescricao) {
    recDescricao.value = "";
  }


  if (recValor) {
    recValor.value = "";
  }


  if (recFrequencia) {
    recFrequencia.value = "";
  }


  if (recDiaVencimento) {
    recDiaVencimento.value = "";
  }


  if (recDataInicio) {
    recDataInicio.value = "";
  }


  if (recDataFim) {
    recDataFim.value = "";
  }


  if (tituloFormularioRecorrencia) {

    tituloFormularioRecorrencia.innerText =
      "Nova recorrência";

  }


  if (btnSalvarRecorrencia) {

    btnSalvarRecorrencia.innerText =
      "Criar recorrência";

  }


  if (btnCancelarRecorrencia) {

    btnCancelarRecorrencia.classList.add(
      "hidden"
    );

  }

}


/* ======================================================
   DATA INICIAL AUTOMÁTICA
====================================================== */

if (recDataInicio) {

  recDataInicio.value =
    obterDataHoje();

}


/* ======================================================
   DATA DE HOJE
====================================================== */

function obterDataHoje() {

  const agora =
    new Date();


  const ano =
    agora.getFullYear();


  const mes =
    String(
      agora.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const dia =
    String(
      agora.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${ano}-${mes}-${dia}`;

}


/* ======================================================
   INICIALIZAÇÃO
====================================================== */

if (recTipo) {

  carregarCategoriasRecorrencia();

}

});
