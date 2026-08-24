/* ======================================================
   TCS FINANCE
   SCRIPT PRINCIPAL
   VERSÃO CORRIGIDA - AUTENTICAÇÃO SUPABASE

   CORREÇÕES PRINCIPAIS:
   - Sessão persistente no navegador
   - Auto refresh do token
   - Recuperação automática da sessão
   - onAuthStateChange
   - Login sem solicitar novamente após reload
   - Proteção contra inicialização duplicada
   - Logout completo
   - Tratamento de sessão expirada
   - Mantidas funções financeiras
====================================================== */

console.log("========================================");
console.log("TCS FINANCE - SCRIPT CARREGADO");
console.log("========================================");


document.addEventListener("DOMContentLoaded", async () => {

  /* ======================================================
     CONTROLE DE INICIALIZAÇÃO
  ====================================================== */

  let sistemaInicializado = false;
  let processandoAutenticacao = false;


  /* ======================================================
     SUPABASE
  ====================================================== */

  if (!window.supabase) {

    console.error(
      "Supabase não foi carregado no HTML."
    );

    alert(
      "Não foi possível iniciar o sistema.\n\n" +
      "A biblioteca do Supabase não foi carregada.\n\n" +
      "Verifique o HTML e recarregue a página."
    );

    return;

  }


  let supabase;


  try {

    supabase =
      window.supabase.createClient(

        "https://figkamlmpangolnasaby.supabase.co",

        "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL",

        {

          auth: {

            /*
             * Mantém a sessão salva no navegador.
             */
            persistSession:
              true,

            /*
             * Renova automaticamente o access token.
             */
            autoRefreshToken:
              true,

            /*
             * Permite detectar sessões vindas
             * de confirmação de email / URL.
             */
            detectSessionInUrl:
              true,

            /*
             * Usa localStorage para persistência.
             */
            storage:
              window.localStorage,

            /*
             * Chave própria do TCS Finance.
             */
            storageKey:
              "tcs-finance-auth"

          }

        }

      );


    console.log(
      "Cliente Supabase inicializado corretamente."
    );


  } catch (erro) {

    console.error(
      "Erro ao criar cliente Supabase:",
      erro
    );

    alert(
      "Erro ao conectar ao sistema.\n\n" +
      "Verifique a configuração do Supabase."
    );

    return;

  }


  /* ======================================================
     ESTADO
  ====================================================== */

  let usuarioAtual = null;

  let sessaoAtual = null;

  let dados = [];

  let grafico = null;

  let graficoMensal = null;

  let graficoComparativo = null;

  let idEmEdicao = null;

  let planoUsuario = "FREE";

  const LIMITE_FREE = 30;

  let recorrenciasDados = [];

  let recorrenciaEmEdicao = null;

  let categoriasFinanceiras = [];

  let categoriaEmEdicao = null;

  let categoriaSelecionadaEdicao = null;

  let categoriasPorTipo = {

    Receita: [],

    Despesa: [],

    Investimento: []

  };


  /* ======================================================
     CATEGORIAS PADRÃO
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


  /* ======================================================
     FREQUÊNCIAS
  ====================================================== */

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


  /* ======================================================
     ELEMENTOS DO DOM
  ====================================================== */

  const loginContainer =
    document.getElementById(
      "login-container"
    );

  const app =
    document.getElementById(
      "app"
    );

  const dashboard =
    document.getElementById(
      "dashboard"
    );

  const lancamentos =
    document.getElementById(
      "lancamentos"
    );

  const recorrencias =
    document.getElementById(
      "recorrencias"
    );

  const relatorios =
    document.getElementById(
      "relatorios"
    );

  const contas =
    document.getElementById(
      "contas"
    );


  /* ======================================================
     LOGIN
  ====================================================== */

  const emailInput =
    document.getElementById(
      "email"
    );

  const senhaInput =
    document.getElementById(
      "senha"
    );

  const aceiteTermos =
    document.getElementById(
      "aceiteTermos"
    );

  const btnLogin =
    document.getElementById(
      "btnLogin"
    );

  const btnCadastro =
    document.getElementById(
      "btnCadastro"
    );

  const btnLogout =
    document.getElementById(
      "btnLogout"
    );

  const btnLogoutTop =
    document.getElementById(
      "btnLogoutTop"
    );


  /* ======================================================
     NAVEGAÇÃO
  ====================================================== */

  const btnDashboard =
    document.getElementById(
      "btnDashboard"
    );

  const btnLancamentos =
    document.getElementById(
      "btnLancamentos"
    );

  const btnRecorrencias =
    document.getElementById(
      "btnRecorrencias"
    );

  const btnContas =
    document.getElementById(
      "btnContas"
    );

  const btnRelatorios =
    document.getElementById(
      "btnRelatorios"
    );


  /* ======================================================
     MENU MOBILE
  ====================================================== */

  const btnMenu =
    document.getElementById(
      "btnMenu"
    );

  const sidebar =
    document.querySelector(
      ".sidebar"
    );

  const menuOverlay =
    document.getElementById(
      "menuOverlay"
    );


  /* ======================================================
     USUÁRIO
  ====================================================== */

  const nomeCliente =
    document.getElementById(
      "nomeCliente"
    );

  const topbarUser =
    document.getElementById(
      "topbarUser"
    );

  const topbarPlano =
    document.getElementById(
      "topbarPlano"
    );


  /* ======================================================
     LANÇAMENTOS
  ====================================================== */

  const tipo =
    document.getElementById(
      "tipo"
    );

  const categoria =
    document.getElementById(
      "categoria"
    );

  const descricao =
    document.getElementById(
      "descricao"
    );

  const valor =
    document.getElementById(
      "valor"
    );

  const dataInput =
    document.getElementById(
      "data"
    );

  const btnSalvar =
    document.getElementById(
      "btnSalvar"
    );


  /* ======================================================
     DASHBOARD
  ====================================================== */

  const filtroMes =
    document.getElementById(
      "filtroMes"
    );

  const btnLimparFiltro =
    document.getElementById(
      "btnLimparFiltro"
    );

  const dashboardPeriodo =
    document.getElementById(
      "dashboardPeriodo"
    );

  const totalReceitas =
    document.getElementById(
      "totalReceitas"
    );

  const totalDespesas =
    document.getElementById(
      "totalDespesas"
    );

  const totalInvestimentos =
    document.getElementById(
      "totalInvestimentos"
    );

  const saldo =
    document.getElementById(
      "saldo"
    );

  const lista =
    document.getElementById(
      "listaLancamentos"
    );

  const tipoGrafico =
    document.getElementById(
      "tipoGrafico"
    );


  /* ======================================================
     CATEGORIAS
  ====================================================== */

  const categorias =
    document.getElementById(
      "categorias"
    );

  const catTipo =
    document.getElementById(
      "catTipo"
    );

  const catNome =
    document.getElementById(
      "catNome"
    );

  const catDescricao =
    document.getElementById(
      "catDescricao"
    );

  const catIcone =
    document.getElementById(
      "catIcone"
    );

  const btnSalvarCategoria =
    document.getElementById(
      "btnSalvarCategoria"
    );

  const btnCancelarCategoria =
    document.getElementById(
      "btnCancelarCategoria"
    );

  const listaCategorias =
    document.getElementById(
      "listaCategorias"
    );

  const filtroCategoriaTipo =
    document.getElementById(
      "filtroCategoriaTipo"
    );

  const contadorCategorias =
    document.getElementById(
      "contadorCategorias"
    );


  /* ======================================================
     RECORRÊNCIAS
  ====================================================== */

  const recTipo =
    document.getElementById(
      "recTipo"
    );

  const recCategoria =
    document.getElementById(
      "recCategoria"
    );

  const recDescricao =
    document.getElementById(
      "recDescricao"
    );

  const recValor =
    document.getElementById(
      "recValor"
    );

  const recFrequencia =
    document.getElementById(
      "recFrequencia"
    );

  const recDiaVencimento =
    document.getElementById(
      "recDiaVencimento"
    );

  const recDataInicio =
    document.getElementById(
      "recDataInicio"
    );

  const recDataFim =
    document.getElementById(
      "recDataFim"
    );

  const btnSalvarRecorrencia =
    document.getElementById(
      "btnSalvarRecorrencia"
    );

  const btnCancelarRecorrencia =
    document.getElementById(
      "btnCancelarRecorrencia"
    );

  const listaRecorrencias =
    document.getElementById(
      "listaRecorrencias"
    );

  const totalRecorrencias =
    document.getElementById(
      "totalRecorrencias"
    );

  const recorrenciasAtivas =
    document.getElementById(
      "recorrenciasAtivas"
    );

  const recorrenciasPausadas =
    document.getElementById(
      "recorrenciasPausadas"
    );

  const contadorRecorrencias =
    document.getElementById(
      "contadorRecorrencias"
    );

  const tituloFormularioRecorrencia =
    document.getElementById(
      "tituloFormularioRecorrencia"
    );


  /* ======================================================
     CONTAS
  ====================================================== */

  const listaContas =
    document.getElementById(
      "listaContas"
    );

  const btnSalvarConta =
    document.getElementById(
      "btnSalvarConta"
    );

  const btnCancelarConta =
    document.getElementById(
      "btnCancelarConta"
    );


  /* ======================================================
     EXPORTAÇÃO
  ====================================================== */

  const btnExportarPdf =
    document.getElementById(
      "btnExportarPdf"
    );

  const btnExportarExcel =
    document.getElementById(
      "btnExportarExcel"
    );

  const btnExportarJson =
    document.getElementById(
      "btnExportarJson"
    );


  /* ======================================================
     UTILITÁRIOS
  ====================================================== */

  function normalizarTipoCategoria(
    tipoSelecionado
  ) {

    const valorNormalizado =
      String(
        tipoSelecionado || ""
      )
        .trim()
        .toLowerCase();


    if (
      valorNormalizado ===
      "receita"
    ) {

      return "Receita";

    }


    if (
      valorNormalizado ===
      "despesa"
    ) {

      return "Despesa";

    }


    if (
      valorNormalizado ===
      "investimento"
    ) {

      return "Investimento";

    }


    return String(
      tipoSelecionado || ""
    ).trim();

  }


  function escapeHtml(
    valor
  ) {

    return String(
      valor ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );

  }


  function formatarMoeda(
    valorNumerico
  ) {

    return (
      Number(
        valorNumerico
      ) || 0
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


  function formatarData(
    data
  ) {

    if (!data) {

      return "";

    }


    const partes =
      String(
        data
      ).split(
        "-"
      );


    return partes.length === 3

      ? `${partes[2]}/${partes[1]}/${partes[0]}`

      : String(data);

  }


  function obterDataHoje() {

    const agora =
      new Date();


    return (

      `${agora.getFullYear()}-` +

      `${String(
        agora.getMonth() + 1
      ).padStart(
        2,
        "0"
      )}-` +

      `${String(
        agora.getDate()
      ).padStart(
        2,
        "0"
      )}`

    );

  }


  function obterMesAtual() {

    const agora =
      new Date();


    return (

      `${agora.getFullYear()}-` +

      `${String(
        agora.getMonth() + 1
      ).padStart(
        2,
        "0"
      )}`

    );

  }


  function formatarPeriodo(
    mes
  ) {

    if (!mes) {

      return "Todos os períodos";

    }


    const partes =
      String(
        mes
      ).split(
        "-"
      );


    if (
      partes.length !== 2
    ) {

      return mes;

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
        item => {

          item.classList.remove(
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


  function mostrarTela(
    tela
  ) {

    [

      dashboard,
      lancamentos,
      recorrencias,
      relatorios,
      contas

    ].forEach(
      elemento => {

        if (elemento) {

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


  /* ======================================================
     INTERFACE DE LOGIN
  ====================================================== */

  function mostrarInterfaceLogin() {

    console.log(
      "Mostrando tela de login."
    );


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

      loginContainer.classList.remove(
        "hidden"
      );

    }

  }


  function mostrarInterfaceApp() {

    console.log(
      "Mostrando aplicação."
    );


    if (loginContainer) {

      loginContainer.style.display =
        "none";

      loginContainer.classList.add(
        "hidden"
      );

    }


    if (app) {

      app.style.display =
        "flex";

      app.classList.remove(
        "hidden"
      );

    }

  }


  /* ======================================================
     OBTÉM USUÁRIO ATUAL
  ====================================================== */

  async function obterUsuarioAtual() {

    try {

      const {
        data,
        error
      } =
        await supabase.auth.getUser();


      if (error) {

        console.error(
          "Erro ao obter usuário:",
          error
        );

        return null;

      }


      return data?.user || null;


    } catch (erro) {

      console.error(
        "Erro inesperado ao obter usuário:",
        erro
      );

      return null;

    }

  }


  /* ======================================================
     CATEGORIAS PADRÃO
  ====================================================== */

  async function garantirCategoriasPadrao() {

    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        return;

      }


      const userId =
        user.id;


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


      const mapa =
        new Set(
          (
            existentes || []
          ).map(
            item =>
              `${normalizarTipoCategoria(
                item.tipo
              ).toLowerCase()}::${String(
                item.nome || ""
              ).trim().toLowerCase()}`
          )
        );


      const novas =
        [];


      Object.entries(
        categoriasPadrao
      ).forEach(
        (
          [
            tipoPadrao,
            nomes
          ]
        ) => {

          nomes.forEach(
            nome => {

              const chave =
                `${tipoPadrao.toLowerCase()}::${nome.toLowerCase()}`;


              if (
                !mapa.has(
                  chave
                )
              ) {

                novas.push({

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
        !novas.length
      ) {

        return;

      }


      const {
        error
      } =
        await supabase
          .from(
            "categorias_financeiras"
          )
          .insert(
            novas
          );


      if (error) {

        console.error(
          "Erro ao criar categorias padrão:",
          error
        );

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

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

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


      if (error) {

        console.error(
          "Erro ao carregar categorias:",
          error
        );

        return;

      }


      categoriasFinanceiras =
        data || [];


      categoriasPorTipo = {

        Receita: [],

        Despesa: [],

        Investimento: []

      };


      (
        data || []
      ).forEach(
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


    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar categorias:",
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
      "<option value=''>Selecione uma categoria</option>";


    categoria.disabled =
      !tipoSelecionado;


    const tipoNormalizado =
      normalizarTipoCategoria(
        tipoSelecionado
      );


    const listaCategoriasTipo =
      categoriasPorTipo[
        tipoNormalizado
      ] || [];


    listaCategoriasTipo.forEach(
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

          String(
            categoriaSelecionada
          ) ===
          String(
            cat.nome
          )

          ||

          String(
            categoriaSelecionada
          ) ===
          String(
            cat.id
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

      !listaCategoriasTipo.length &&
      tipoSelecionado

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


  async function carregarCategoriasRecorrencia(
    tipoSelecionado = "",
    categoriaSelecionada = ""
  ) {

    if (!recCategoria) {

      return;

    }


    recCategoria.innerHTML =
      "<option value=''>Carregando categorias...</option>";


    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        recCategoria.innerHTML =
          "<option value=''>Sessão expirada</option>";

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


      if (error) {

        console.error(
          "Erro ao carregar categorias da recorrência:",
          error
        );


        recCategoria.innerHTML =
          "<option value=''>Erro ao carregar categorias</option>";

        return;

      }


      const tipoNormalizado =
        normalizarTipoCategoria(
          tipoSelecionado
        );


      const categoriasFiltradas =
        (
          data || []
        ).filter(
          cat => {

            if (
              !tipoSelecionado
            ) {

              return true;

            }


            return (

              normalizarTipoCategoria(
                cat.tipo
              ) ===
              tipoNormalizado

            );

          }
        );


      recCategoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";


      categoriasFiltradas.forEach(
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

            String(
              cat.id
            ) ===
            String(
              categoriaSelecionada
            )

            ||

            String(
              cat.nome
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
        !categoriasFiltradas.length
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
     INICIAR SESSÃO
  ====================================================== */

  async function iniciarSessao(
    user,
    session = null
  ) {

    if (!user) {

      console.warn(
        "iniciarSessao chamada sem usuário."
      );

      return;

    }


    /*
     * Evita inicializações simultâneas.
     */
    if (
      processandoAutenticacao
    ) {

      console.log(
        "Inicialização de autenticação já está em andamento."
      );

      return;

    }


    processandoAutenticacao =
      true;


    try {

      usuarioAtual =
        user;


      if (session) {

        sessaoAtual =
          session;

      }


      console.log(
        "Usuário autenticado:",
        user.email
      );


      const nomeUsuario =
        user.user_metadata?.nome ||
        user.user_metadata?.name ||
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


      if (nomeCliente) {

        nomeCliente.innerText =
          `Olá, ${nomeUsuario}!`;

      }


      mostrarInterfaceApp();


      mostrarTela(
        dashboard
      );


      if (
        filtroMes &&
        !filtroMes.value
      ) {

        filtroMes.value =
          obterMesAtual();

      }


      if (
        dataInput &&
        !dataInput.value
      ) {

        dataInput.value =
          obterDataHoje();

      }


      if (
        recDataInicio &&
        !recDataInicio.value
      ) {

        recDataInicio.value =
          obterDataHoje();

      }


      /*
       * Carregamentos principais.
       */
      await carregarCategoriasFinanceiras();

      await carregarDados();

      atualizarDashboard();

      renderizarLista();

      sistemaInicializado =
        true;


      console.log(
        "TCS Finance inicializado com sucesso."
      );


    } catch (erro) {

      console.error(
        "Erro ao iniciar sessão:",
        erro
      );

      alert(
        "O login foi realizado, mas ocorreu um erro ao carregar seus dados.\n\n" +
        "Verifique o console para mais detalhes."
      );

    } finally {

      processandoAutenticacao =
        false;

    }

  }


  /* ======================================================
     LOGIN
  ====================================================== */

  if (btnLogin) {

    btnLogin.addEventListener(
      "click",
      async () => {

        try {

          if (
            !aceiteTermos?.checked
          ) {

            alert(
              "Você precisa aceitar os termos de uso."
            );

            return;

          }


          const email =
            emailInput?.value?.trim() ||
            "";


          const senha =
            senhaInput?.value ||
            "";


          if (!email) {

            alert(
              "Informe seu email."
            );

            emailInput?.focus();

            return;

          }


          if (!senha) {

            alert(
              "Informe sua senha."
            );

            senhaInput?.focus();

            return;

          }


          btnLogin.disabled =
            true;


          btnLogin.innerText =
            "Entrando...";


          console.log(
            "Tentando autenticar:",
            email
          );


          /*
           * Antes do login, encerramos qualquer
           * estado de sessão inconsistente.
           */
          try {

            await supabase.auth.signOut();

          } catch (_) {

            /*
             * Não interrompe o login caso
             * não exista sessão anterior.
             */

          }


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


          if (error) {

            console.error(
              "Erro retornado pelo Supabase:",
              error
            );


            let mensagem =
              error.message ||
              "Não foi possível fazer login.";


            if (
              error.message?.toLowerCase().includes(
                "invalid login credentials"
              )
            ) {

              mensagem =
                "Email ou senha incorretos.";

            }


            if (
              error.message?.toLowerCase().includes(
                "email not confirmed"
              )
            ) {

              mensagem =
                "Seu email ainda não foi confirmado.\n\n" +
                "Verifique sua caixa de entrada e confirme seu cadastro antes de entrar.";

            }


            if (
              error.message?.toLowerCase().includes(
                "too many requests"
              )
            ) {

              mensagem =
                "Muitas tentativas de login.\n\n" +
                "Aguarde alguns minutos e tente novamente.";

            }


            alert(
              mensagem
            );

            return;

          }


          console.log(
            "Resposta do login:",
            data
          );


          /*
           * O ponto mais importante:
           * precisamos ter uma SESSION válida.
           */
          if (
            !data?.session ||
            !data?.user
          ) {

            console.error(
              "Supabase não retornou sessão após login.",
              data
            );


            alert(
              "O Supabase aceitou a solicitação, mas não retornou uma sessão autenticada.\n\n" +
              "Isso normalmente indica que o email ainda precisa ser confirmado."
            );

            return;

          }


          sessaoAtual =
            data.session;


          usuarioAtual =
            data.user;


          /*
           * O Supabase já persiste a sessão automaticamente,
           * mas garantimos também que o estado local esteja correto.
           */
          try {

            await supabase.auth.setSession({

              access_token:
                data.session.access_token,

              refresh_token:
                data.session.refresh_token

            });

          } catch (erroSessao) {

            console.warn(
              "Não foi necessário redefinir a sessão:",
              erroSessao
            );

          }


          await iniciarSessao(
            data.user,
            data.session
          );


        } catch (erro) {

          console.error(
            "Erro inesperado no login:",
            erro
          );


          alert(
            "Ocorreu um erro ao fazer login.\n\n" +
            "Verifique sua conexão e tente novamente."
          );


        } finally {

          btnLogin.disabled =
            false;


          btnLogin.innerText =
            "Entrar";

        }

      }
    );

  }


  /* ======================================================
     ENTER NO LOGIN
  ====================================================== */

  if (emailInput) {

    emailInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Enter"
        ) {

          event.preventDefault();

          btnLogin?.click();

        }

      }
    );

  }


  if (senhaInput) {

    senhaInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Enter"
        ) {

          event.preventDefault();

          btnLogin?.click();

        }

      }
    );

  }


  /* ======================================================
     CADASTRO
  ====================================================== */

  if (btnCadastro) {

    btnCadastro.addEventListener(
      "click",
      async () => {

        try {

          if (
            !aceiteTermos?.checked
          ) {

            alert(
              "Você precisa aceitar os termos de uso."
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
            senha.length < 6
          ) {

            alert(
              "A senha deve possuir pelo menos 6 caracteres."
            );

            return;

          }


          btnCadastro.disabled =
            true;


          btnCadastro.innerText =
            "Criando conta...";


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


          if (error) {

            console.error(
              "Erro no cadastro:",
              error
            );


            alert(
              error.message ||
              "Não foi possível criar a conta."
            );

            return;

          }


          console.log(
            "Cadastro realizado:",
            data
          );


          /*
           * Se o Supabase retornar sessão imediatamente,
           * o usuário já pode entrar.
           */
          if (
            data?.session &&
            data?.user
          ) {

            await iniciarSessao(
              data.user,
              data.session
            );


          } else {

            alert(

              "Conta criada com sucesso!\n\n" +

              "Enviamos um email de confirmação para " +
              email +
              ".\n\n" +

              "Confirme seu email e depois faça login."

            );

          }


        } catch (erro) {

          console.error(
            "Erro inesperado no cadastro:",
            erro
          );


          alert(
            "Ocorreu um erro ao criar a conta."
          );


        } finally {

          btnCadastro.disabled =
            false;


          btnCadastro.innerText =
            "Criar conta";

        }

      }
    );

  }


  /* ======================================================
     LOGOUT
  ====================================================== */

  async function fazerLogout() {

    console.log(
      "Executando logout..."
    );


    try {

      await supabase.auth.signOut();

    } catch (erro) {

      console.error(
        "Erro ao sair:",
        erro
      );

    }


    usuarioAtual =
      null;


    sessaoAtual =
      null;


    sistemaInicializado =
      false;


    mostrarInterfaceLogin();


    if (emailInput) {

      emailInput.value =
        "";

    }


    if (senhaInput) {

      senhaInput.value =
        "";

    }


    if (aceiteTermos) {

      aceiteTermos.checked =
        false;

    }


    fecharMenuMobile();


    console.log(
      "Logout concluído."
    );

  }


  if (btnLogout) {

    btnLogout.addEventListener(
      "click",
      fazerLogout
    );

  }


  if (btnLogoutTop) {

    btnLogoutTop.addEventListener(
      "click",
      fazerLogout
    );

  }


  /* ======================================================
     MONITORAMENTO DE AUTENTICAÇÃO
     
     MUITO IMPORTANTE PARA O LOGIN.
  ====================================================== */

  supabase.auth.onAuthStateChange(
    (
      event,
      session
    ) => {

      console.log(
        "AUTH EVENT:",
        event,
        session?.user?.email || "sem usuário"
      );


      /*
       * Não executamos toda a inicialização
       * diretamente dentro do callback do Supabase.
       *
       * O setTimeout evita conflitos internos
       * com o processamento de autenticação.
       */
      setTimeout(
        async () => {

          try {

            if (
              event ===
                "SIGNED_IN" &&
              session?.user
            ) {

              sessaoAtual =
                session;

              usuarioAtual =
                session.user;


              if (
                !sistemaInicializado &&
                !processandoAutenticacao
              ) {

                await iniciarSessao(
                  session.user,
                  session
                );

              }


              return;

            }


            if (
              event ===
                "TOKEN_REFRESHED" &&
              session?.user
            ) {

              sessaoAtual =
                session;

              usuarioAtual =
                session.user;


              console.log(
                "Token renovado automaticamente."
              );


              return;

            }


            if (
              event ===
                "SIGNED_OUT"
            ) {

              usuarioAtual =
                null;

              sessaoAtual =
                null;

              sistemaInicializado =
                false;


              mostrarInterfaceLogin();


              return;

            }


            if (
              event ===
                "USER_UPDATED" &&
              session?.user
            ) {

              usuarioAtual =
                session.user;

              sessaoAtual =
                session;

              return;

            }

          } catch (erro) {

            console.error(
              "Erro no monitoramento de autenticação:",
              erro
            );

          }

        },
        0
      );

    }
  );


  /* ======================================================
     LANÇAMENTOS
  ====================================================== */

  async function carregarDados() {

    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        dados =
          [];

        return;

      }


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
        data || [];


    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar lançamentos:",
        erro
      );


      dados =
        [];

    }

  }


  function limparFormulario() {

    idEmEdicao =
      null;


    if (tipo) {

      tipo.value =
        "";

    }


    if (categoria) {

      categoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";

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
        "Salvar lançamento";

    }

  }


  if (tipo) {

    tipo.addEventListener(
      "change",
      async () => {

        await carregarCategoriasFinanceiras();

        popularCategorias(
          tipo.value
        );

      }
    );

  }


  if (btnSalvar) {

    btnSalvar.addEventListener(
      "click",
      async () => {

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
          Number(
            String(
              valor.value
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


        if (

          !Number.isFinite(
            valorNumerico
          ) ||
          valorNumerico <= 0

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


        try {

          const user =
            usuarioAtual ||
            await obterUsuarioAtual();


          if (!user) {

            alert(
              "Sua sessão expirou. Faça login novamente."
            );

            mostrarInterfaceLogin();

            return;

          }


          const registro = {

            user_id:
              user.id,

            tipo:
              tipo.value,

            categoria:
              categoria.value,

            descricao:
              descricao?.value?.trim() ||
              "",

            valor:
              valorNumerico,

            data:
              dataInput.value

          };


          let resultado;


          if (
            idEmEdicao
          ) {

            resultado =
              await supabase
                .from(
                  "lancamentos"
                )
                .update(
                  registro
                )
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
                .insert(
                  registro
                );

          }


          if (
            resultado.error
          ) {

            console.error(
              "Erro ao salvar lançamento:",
              resultado.error
            );


            alert(
              `Não foi possível salvar o lançamento.\n\n${resultado.error.message}`
            );

            return;

          }


          alert(
            idEmEdicao

              ? "Lançamento atualizado com sucesso!"

              : "Lançamento salvo com sucesso!"
          );


          limparFormulario();

          await carregarDados();

          atualizarDashboard();

          renderizarLista();


        } catch (erro) {

          console.error(
            "Erro inesperado ao salvar lançamento:",
            erro
          );


          alert(
            "Ocorreu um erro ao salvar o lançamento."
          );

        }

      }
    );

  }


  async function editarLancamento(
    id
  ) {

    const item =
      dados.find(
        l =>
          String(
            l.id
          ) ===
          String(
            id
          )
      );


    if (!item) {

      return;

    }


    idEmEdicao =
      item.id;


    if (tipo) {

      tipo.value =
        item.tipo ||
        "";

    }


    await carregarCategoriasFinanceiras();


    popularCategorias(
      item.tipo,
      item.categoria
    );


    if (descricao) {

      descricao.value =
        item.descricao ||
        "";

    }


    if (valor) {

      valor.value =
        Number(
          item.valor || 0
        ).toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits:
              2
          }
        );

    }


    if (dataInput) {

      dataInput.value =
        item.data ||
        obterDataHoje();

    }


    if (btnSalvar) {

      btnSalvar.innerText =
        "Atualizar lançamento";

    }


    mostrarTela(
      lancamentos
    );


    window.scrollTo({

      top:
        0,

      behavior:
        "smooth"

    });

  }


  async function excluirLancamento(
    id
  ) {

    const item =
      dados.find(
        l =>
          String(
            l.id
          ) ===
          String(
            id
          )
      );


    if (!item) {

      return;

    }


    if (
      !confirm(
        `Deseja excluir o lançamento "${item.descricao || item.categoria || "sem descrição"}"?`
      )
    ) {

      return;

    }


    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        alert(
          "Sua sessão expirou. Faça login novamente."
        );

        mostrarInterfaceLogin();

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


      if (error) {

        alert(
          `Não foi possível excluir o lançamento.\n\n${error.message}`
        );

        return;

      }


      await carregarDados();

      atualizarDashboard();

      renderizarLista();


    } catch (erro) {

      console.error(
        "Erro ao excluir lançamento:",
        erro
      );


      alert(
        "Ocorreu um erro ao excluir o lançamento."
      );

    }

  }


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
          item.data || ""
        ).startsWith(
          filtroMes.value
        )
    );

  }


  function renderizarLista() {

    if (!lista) {

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
              ${
                escapeHtml(
                  item.descricao ||
                  item.categoria ||
                  "Sem descrição"
                )
              }
            </strong>

            <small>
              ${
                escapeHtml(
                  item.tipo ||
                  ""
                )
              }

              •

              ${
                escapeHtml(
                  item.categoria ||
                  "Sem categoria"
                )
              }

              •

              ${
                formatarData(
                  item.data
                )
              }

            </small>

          </div>

          <div>

            <strong>
              ${
                formatarMoeda(
                  item.valor
                )
              }
            </strong>

            <button
              type="button"
              data-acao="editar"
              data-id="${escapeHtml(item.id)}"
            >
              ✏️
            </button>

            <button
              type="button"
              data-acao="excluir"
              data-id="${escapeHtml(item.id)}"
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


  if (lista) {

    lista.addEventListener(
      "click",
      async event => {

        const botao =
          event.target.closest(
            "button[data-acao]"
          );


        if (!botao) {

          return;

        }


        const id =
          botao.dataset.id;


        if (
          botao.dataset.acao ===
          "editar"
        ) {

          await editarLancamento(
            id
          );

        }


        if (
          botao.dataset.acao ===
          "excluir"
        ) {

          await excluirLancamento(
            id
          );

        }

      }
    );

  }


  /* ======================================================
     DASHBOARD
  ====================================================== */

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
          Number(
            item.valor
          ) || 0;


        const tipoItem =
          normalizarTipoCategoria(
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


    if (totalReceitas) {

      totalReceitas.innerText =
        formatarMoeda(
          receita
        );

    }


    if (totalDespesas) {

      totalDespesas.innerText =
        formatarMoeda(
          despesa
        );

    }


    if (totalInvestimentos) {

      totalInvestimentos.innerText =
        formatarMoeda(
          investimento
        );

    }


    if (saldo) {

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


    atualizarRelatorios();

  }


  function destruirGrafico(
    ref
  ) {

    if (ref) {

      try {

        ref.destroy();

      } catch (_) {}

    }

  }


  function renderizarGrafico(
    filtrados,
    receita,
    despesa,
    investimento
  ) {

    const canvas =
      document.getElementById(
        "grafico"
      );


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
            (
              Number(
                item.valor
              ) || 0
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
              false

          }

        }
      );

  }


  function renderizarGraficoMensal(
    filtrados
  ) {

    const canvas =
      document.getElementById(
        "graficoMensal"
      );


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
      {};


    filtrados.forEach(
      item => {

        const mes =
          String(
            item.data ||
            ""
          ).slice(
            0,
            7
          );


        if (!mes) {

          return;

        }


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
          Number(
            item.valor
          ) || 0;


        if (
          normalizarTipoCategoria(
            item.tipo
          ) ===
          "Receita"
        ) {

          mapa[mes].receita +=
            v;

        }


        if (
          normalizarTipoCategoria(
            item.tipo
          ) ===
          "Despesa"
        ) {

          mapa[mes].despesa +=
            v;

        }

      }
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
                      mapa[mes].receita
                  )

              },

              {

                label:
                  "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes].despesa
                  )

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false

          }

        }
      );

  }


  function renderizarGraficoComparativo(
    filtrados
  ) {

    const canvas =
      document.getElementById(
        "graficoComparativo"
      );


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
      {};


    filtrados.forEach(
      item => {

        const mes =
          String(
            item.data ||
            ""
          ).slice(
            0,
            7
          );


        if (!mes) {

          return;

        }


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
          Number(
            item.valor
          ) || 0;


        if (
          normalizarTipoCategoria(
            item.tipo
          ) ===
          "Receita"
        ) {

          mapa[mes].receita +=
            v;

        }


        if (
          normalizarTipoCategoria(
            item.tipo
          ) ===
          "Despesa"
        ) {

          mapa[mes].despesa +=
            v;

        }

      }
    );


    const labels =
      Object.keys(
        mapa
      ).sort();


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
                      mapa[mes].receita
                  ),

                tension:
                  0.25

              },

              {

                label:
                  "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes].despesa
                  ),

                tension:
                  0.25

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false

          }

        }
      );

  }


  if (tipoGrafico) {

    tipoGrafico.addEventListener(
      "change",
      atualizarDashboard
    );

  }


  if (filtroMes) {

    filtroMes.addEventListener(
      "change",
      () => {

        atualizarDashboard();

        renderizarLista();

      }
    );

  }


  if (btnLimparFiltro) {

    btnLimparFiltro.addEventListener(
      "click",
      () => {

        if (filtroMes) {

          filtroMes.value =
            "";

        }


        atualizarDashboard();

        renderizarLista();

      }
    );

  }


  /* ======================================================
     RELATÓRIOS
  ====================================================== */

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
          Number(
            item.valor
          ) || 0;


        if (
          normalizarTipoCategoria(
            item.tipo
          ) ===
          "Receita"
        ) {

          receita +=
            v;

        }


        if (
          normalizarTipoCategoria(
            item.tipo
          ) ===
          "Despesa"
        ) {

          despesa +=
            v;

        }


        if (
          normalizarTipoCategoria(
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

        const el =
          document.getElementById(
            id
          );


        if (el) {

          el.innerText =
            texto;

        }

      }
    );

  }


  /* ======================================================
     RECORRÊNCIAS
  ====================================================== */

  async function carregarRecorrencias() {

    if (
      !listaRecorrencias
    ) {

      return;

    }


    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

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


  function atualizarContadoresRecorrencias() {

    const total =
      recorrenciasDados.length;


    const ativas =
      recorrenciasDados.filter(
        item =>
          item.ativo !==
          false
      ).length;


    const pausadas =
      recorrenciasDados.filter(
        item =>
          item.ativo ===
          false
      ).length;


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


  function renderizarRecorrencias() {

    if (
      !listaRecorrencias
    ) {

      return;

    }


    listaRecorrencias.innerHTML =
      "";


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


      atualizarContadoresRecorrencias();

      return;

    }


    recorrenciasDados.forEach(
      rec => {

        const ativa =
          rec.ativo !==
          false;


        const categoriaNome =
          rec.categoria ||
          rec.categoria_nome ||
          rec.categoria_id ||
          "Sem categoria";


        const card =
          document.createElement(
            "div"
          );


        card.className =
          "recorrencia-item";


        card.innerHTML = `

          <div class="recorrencia-info">

            <strong>
              ${
                escapeHtml(
                  rec.descricao ||
                  "Sem descrição"
                )
              }
            </strong>

            <span>
              ${
                escapeHtml(
                  normalizarTipoCategoria(
                    rec.tipo
                  )
                )
              }

              •

              ${
                escapeHtml(
                  categoriaNome
                )
              }

            </span>

            <span>
              ${
                formatarMoeda(
                  rec.valor
                )
              }
            </span>

            <small>

              ${
                escapeHtml(
                  nomesFrequencia[
                    rec.frequencia
                  ] ||
                  rec.frequencia ||
                  "Mensal"
                )
              }

              ${
                rec.dia_vencimento

                  ? ` • Dia ${escapeHtml(
                      rec.dia_vencimento
                    )}`

                  : ""

              }

            </small>

          </div>


          <div class="recorrencia-acoes">

            <button
              type="button"
              class="acao-editar"
              data-id="${escapeHtml(rec.id)}"
            >
              ✏️ Editar
            </button>


            <button
              type="button"
              class="acao-pausar"
              data-id="${escapeHtml(rec.id)}"
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
              data-id="${escapeHtml(rec.id)}"
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


    atualizarContadoresRecorrencias();

  }


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


  if (btnSalvarRecorrencia) {

    btnSalvarRecorrencia.addEventListener(
      "click",
      async () => {

        try {

          const user =
            usuarioAtual ||
            await obterUsuarioAtual();


          if (!user) {

            alert(
              "Sua sessão expirou. Faça login novamente."
            );

            mostrarInterfaceLogin();

            return;

          }


          const tipoRec =
            normalizarTipoCategoria(
              recTipo?.value ||
              ""
            );


          const categoriaId =
            recCategoria?.value ||
            "";


          const descricaoRec =
            recDescricao?.value?.trim() ||
            "";


          const valorRec =
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


          const frequencia =
            recFrequencia?.value ||
            "";


          const dia =
            recDiaVencimento?.value

              ? Number(
                  recDiaVencimento.value
                )

              : null;


          const dataInicio =
            recDataInicio?.value ||
            "";


          const dataFim =
            recDataFim?.value ||
            null;


          if (
            ![
              "Receita",
              "Despesa",
              "Investimento"
            ].includes(
              tipoRec
            )
          ) {

            alert(
              "Selecione um tipo válido."
            );

            return;

          }


          if (!categoriaId) {

            alert(
              "Selecione uma categoria."
            );

            return;

          }


          if (!descricaoRec) {

            alert(
              "Informe uma descrição."
            );

            return;

          }


          if (

            !Number.isFinite(
              valorRec
            ) ||
            valorRec <= 0

          ) {

            alert(
              "Informe um valor válido."
            );

            return;

          }


          if (
            !frequencia ||
            !dataInicio
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
              frequencia
            )

          ) {

            if (

              !Number.isInteger(
                dia
              ) ||
              dia < 1 ||
              dia > 31

            ) {

              alert(
                "Informe um dia de lançamento entre 1 e 31."
              );

              return;

            }

          }


          if (

            dataFim &&
            dataFim <
              dataInicio

          ) {

            alert(
              "A data de término não pode ser anterior à data de início."
            );

            return;

          }


          const registro = {

            user_id:
              user.id,

            tipo:
              tipoRec,

            categoria_id:
              categoriaId,

            descricao:
              descricaoRec,

            valor:
              valorRec,

            frequencia:
              frequencia,

            dia_vencimento:
              Number.isInteger(
                dia
              )
                ? dia
                : null,

            data_inicio:
              dataInicio,

            data_fim:
              dataFim,

            ativo:
              true

          };


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
    );

  }


  async function editarRecorrencia(
    id
  ) {

    const rec =
      recorrenciasDados.find(
        item =>
          String(
            item.id
          ) ===
          String(
            id
          )
      );


    if (!rec) {

      alert(
        "Recorrência não encontrada."
      );

      return;

    }


    recorrenciaEmEdicao =
      rec.id;


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


    if (recTipo) {

      recTipo.value =
        normalizarTipoCategoria(
          rec.tipo
        );

    }


    await carregarCategoriasRecorrencia(
      rec.tipo,
      rec.categoria_id ||
      rec.categoria
    );


    if (recDescricao) {

      recDescricao.value =
        rec.descricao ||
        "";

    }


    if (recValor) {

      recValor.value =
        rec.valor ??
        "";

    }


    if (recFrequencia) {

      recFrequencia.value =
        rec.frequencia ||
        "";

    }


    if (recDiaVencimento) {

      recDiaVencimento.value =
        rec.dia_vencimento ??
        "";

    }


    if (recDataInicio) {

      recDataInicio.value =
        rec.data_inicio ||
        obterDataHoje();

    }


    if (recDataFim) {

      recDataFim.value =
        rec.data_fim ||
        "";

    }


    mostrarTela(
      recorrencias
    );


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


  async function alternarStatusRecorrencia(
    id
  ) {

    const rec =
      recorrenciasDados.find(
        item =>
          String(
            item.id
          ) ===
          String(
            id
          )
      );


    if (!rec) {

      return;

    }


    const novoStatus =
      rec.ativo !==
      true;


    if (
      !confirm(
        `Deseja ${
          novoStatus
            ? "reativar"
            : "pausar"
        } esta recorrência?`
      )
    ) {

      return;

    }


    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        alert(
          "Sua sessão expirou. Faça login novamente."
        );

        mostrarInterfaceLogin();

        return;

      }


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
          )
          .eq(
            "user_id",
            user.id
          );


      if (error) {

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


  async function excluirRecorrencia(
    id
  ) {

    const rec =
      recorrenciasDados.find(
        item =>
          String(
            item.id
          ) ===
          String(
            id
          )
      );


    if (!rec) {

      return;

    }


    if (
      !confirm(
        `Tem certeza que deseja excluir a recorrência "${rec.descricao || "sem descrição"}"?`
      )
    ) {

      return;

    }


    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        alert(
          "Sua sessão expirou. Faça login novamente."
        );

        mostrarInterfaceLogin();

        return;

      }


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
          )
          .eq(
            "user_id",
            user.id
          );


      if (error) {

        alert(
          `Não foi possível excluir a recorrência.\n\n${error.message}`
        );

        return;

      }


      if (

        String(
          recorrenciaEmEdicao
        ) ===

        String(
          id
        )

      ) {

        limparFormularioRecorrencia();

      }


      await carregarRecorrencias();


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
        "";

    }


    if (recDiaVencimento) {

      recDiaVencimento.value =
        "";

    }


    if (recDataInicio) {

      recDataInicio.value =
        obterDataHoje();

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


  if (
    listaRecorrencias
  ) {

    listaRecorrencias.addEventListener(
      "click",
      async event => {

        const botao =
          event.target.closest(
            "button[data-id]"
          );


        if (!botao) {

          return;

        }


        if (
          botao.classList.contains(
            "acao-editar"
          )
        ) {

          await editarRecorrencia(
            botao.dataset.id
          );

        }


        if (
          botao.classList.contains(
            "acao-pausar"
          )
        ) {

          await alternarStatusRecorrencia(
            botao.dataset.id
          );

        }


        if (
          botao.classList.contains(
            "acao-excluir"
          )
        ) {

          await excluirRecorrencia(
            botao.dataset.id
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


  /* ======================================================
     NAVEGAÇÃO
  ====================================================== */

  if (btnDashboard) {

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


  if (btnLancamentos) {

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


  if (btnRecorrencias) {

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


  if (btnRelatorios) {

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


  if (btnContas) {

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


  /* ======================================================
     MENU MOBILE
  ====================================================== */

  if (btnMenu) {

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


  if (menuOverlay) {

    menuOverlay.addEventListener(
      "click",
      fecharMenuMobile
    );

  }


  /* ======================================================
     PDF
  ====================================================== */

  if (btnExportarPdf) {

    btnExportarPdf.addEventListener(
      "click",
      () => {

        try {

          if (
            !window.jspdf?.jsPDF
          ) {

            alert(
              "O módulo de PDF ainda não foi carregado. Recarregue a página."
            );

            return;

          }


          const doc =
            new window.jspdf.jsPDF();


          doc.setFontSize(
            18
          );


          doc.text(
            "TCS Finance - Extrato Financeiro",
            15,
            20
          );


          doc.setFontSize(
            10
          );


          doc.text(
            `Período: ${formatarPeriodo(
              filtroMes?.value ||
              ""
            )}`,
            15,
            28
          );


          let y =
            40;


          const filtrados =
            obterDadosFiltrados();


          filtrados.forEach(
            item => {

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


              if (
                y > 280
              ) {

                doc.addPage();

                y =
                  20;

              }


              doc.text(
                linha.substring(
                  0,
                  105
                ),
                15,
                y
              );


              y +=
                7;

            }
          );


          doc.save(
            "extrato-financeiro.pdf"
          );


        } catch (erro) {

          console.error(
            "Erro ao exportar PDF:",
            erro
          );


          alert(
            "Não foi possível gerar o PDF."
          );

        }

      }
    );

  }


  /* ======================================================
     EXPORTAR JSON
  ====================================================== */

  if (btnExportarJson) {

    btnExportarJson.addEventListener(
      "click",
      () => {

        try {

          const dadosExportacao = {

            sistema:
              "TCS Finance",

            versao:
              "Auth Fix",

            exportadoEm:
              new Date().toISOString(),

            usuario:
              usuarioAtual?.email ||
              null,

            lancamentos:
              dados,

            recorrencias:
              recorrenciasDados,

            categorias:
              categoriasFinanceiras

          };


          const blob =
            new Blob(

              [
                JSON.stringify(
                  dadosExportacao,
                  null,
                  2
                )
              ],

              {
                type:
                  "application/json"
              }

            );


          const url =
            URL.createObjectURL(
              blob
            );


          const a =
            document.createElement(
              "a"
            );


          a.href =
            url;


          a.download =
            "tcs-finance-backup.json";


          document.body.appendChild(
            a
          );


          a.click();


          a.remove();


          URL.revokeObjectURL(
            url
          );


        } catch (erro) {

          console.error(
            "Erro ao exportar JSON:",
            erro
          );


          alert(
            "Não foi possível gerar o backup JSON."
          );

        }

      }
    );

  }


  /* ======================================================
     EXPORTAR EXCEL
  ====================================================== */

  if (btnExportarExcel) {

    btnExportarExcel.addEventListener(
      "click",
      () => {

        try {

          if (
            !window.XLSX
          ) {

            alert(
              "A biblioteca Excel não foi carregada no HTML."
            );

            return;

          }


          const dadosExcel =
            obterDadosFiltrados().map(
              item => ({

                Data:
                  formatarData(
                    item.data
                  ),

                Tipo:
                  item.tipo,

                Categoria:
                  item.categoria,

                Descrição:
                  item.descricao,

                Valor:
                  Number(
                    item.valor
                  ) || 0

              })
            );


          const worksheet =
            XLSX.utils.json_to_sheet(
              dadosExcel
            );


          const workbook =
            XLSX.utils.book_new();


          XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Lançamentos"
          );


          XLSX.writeFile(
            workbook,
            "tcs-finance.xlsx"
          );


        } catch (erro) {

          console.error(
            "Erro ao exportar Excel:",
            erro
          );


          alert(
            "Não foi possível gerar o arquivo Excel."
          );

        }

      }
    );

  }


  /* ======================================================
     INICIALIZAÇÃO
  ====================================================== */

  if (filtroMes) {

    filtroMes.value =
      obterMesAtual();

  }


  if (dataInput) {

    dataInput.value =
      obterDataHoje();

  }


  if (recDataInicio) {

    recDataInicio.value =
      obterDataHoje();

  }


  if (categoria) {

    categoria.disabled =
      true;

  }


  /* ======================================================
     RECUPERAÇÃO DA SESSÃO
     
     ESTE É O PONTO PRINCIPAL DA CORREÇÃO.
  ====================================================== */

  console.log(
    "Verificando sessão existente..."
  );


  try {

    /*
     * Primeiro verificamos a sessão persistida.
     */
    const {
      data:
        sessionData,
      error:
        sessionError
    } =
      await supabase.auth.getSession();


    if (sessionError) {

      console.error(
        "Erro ao recuperar sessão:",
        sessionError
      );

      mostrarInterfaceLogin();

    } else if (
      sessionData?.session?.user
    ) {

      console.log(
        "========================================"
      );

      console.log(
        "SESSÃO EXISTENTE ENCONTRADA"
      );

      console.log(
        "Usuário:",
        sessionData.session.user.email
      );

      console.log(
        "========================================"
      );


      sessaoAtual =
        sessionData.session;


      usuarioAtual =
        sessionData.session.user;


      await iniciarSessao(

        sessionData.session.user,

        sessionData.session

      );


    } else {

      console.log(
        "Nenhuma sessão encontrada."
      );


      mostrarInterfaceLogin();

    }


  } catch (erro) {

    console.error(
      "Erro ao inicializar autenticação:",
      erro
    );


    mostrarInterfaceLogin();

  }


  atualizarPeriodoDashboard();


  console.log(
    "TCS Finance finalizado."
  );

});
