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

console.log(
  "TCS FINANCE — SCRIPT CORRIGIDO — 25/08/2026 — VERSÃO 20260825-01"
);

document.addEventListener(
  "DOMContentLoaded",
  () => {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
       ===================================================== */

    const SUPABASE_URL =
      "https://figkamlpango1asaby.supabase.co";


    const SUPABASE_ANON_KEY =
      "COLOQUE_SUA_CHAVE_ANON_AQUI";


    let supabase;


    try {

      if (
        window.supabase &&
        typeof window.supabase.createClient ===
          "function"
      ) {

        supabase =
          window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
          );

      }

    } catch (erro) {

      console.error(
        "Erro ao inicializar Supabase:",
        erro
      );

    }


    if (!supabase) {

      console.error(
        "Supabase não foi inicializado."
      );

      alert(
        "Não foi possível inicializar o sistema. Verifique o carregamento do Supabase."
      );

      return;

    }


    /* =====================================================
       ESTADO GLOBAL
       ===================================================== */

    let usuarioAtual =
      null;


    let sessaoAtual =
      null;


    let dados =
      [];


    let categoriasFinanceiras =
      [];


    let recorrenciasDados =
      [];


    let recorrenciaEmEdicao =
      null;


    let grafico =
      null;


    let graficoMensal =
      null;


    let graficoComparativo =
      null;


    /* =====================================================
       ELEMENTOS DOM
       ===================================================== */

    const loginScreen =
      document.getElementById(
        "loginScreen"
      );


    const app =
      document.getElementById(
        "app"
      );


    const loginForm =
      document.getElementById(
        "loginForm"
      );


    const cadastroForm =
      document.getElementById(
        "cadastroForm"
      );


    const emailLogin =
      document.getElementById(
        "emailLogin"
      );


    const senhaLogin =
      document.getElementById(
        "senhaLogin"
      );


    const emailCadastro =
      document.getElementById(
        "emailCadastro"
      );


    const senhaCadastro =
      document.getElementById(
        "senhaCadastro"
      );


    const confirmarSenhaCadastro =
      document.getElementById(
        "confirmarSenhaCadastro"
      );


    const btnLogin =
      document.getElementById(
        "btnLogin"
      );


    const btnCadastro =
      document.getElementById(
        "btnCadastro"
      );


    const btnMostrarCadastro =
      document.getElementById(
        "btnMostrarCadastro"
      );


    const btnMostrarLogin =
      document.getElementById(
        "btnMostrarLogin"
      );


    const btnEsqueciSenha =
      document.getElementById(
        "btnEsqueciSenha"
      );


    const btnLogout =
      document.getElementById(
        "btnLogout"
      );


    const usuarioEmail =
      document.getElementById(
        "usuarioEmail"
      );


    const nomeUsuario =
      document.getElementById(
        "nomeUsuario"
      );


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


    const btnRelatorios =
      document.getElementById(
        "btnRelatorios"
      );


    const btnContas =
      document.getElementById(
        "btnContas"
      );


    const btnMenu =
      document.getElementById(
        "btnMenu"
      );


    const sidebar =
      document.getElementById(
        "sidebar"
      );


    const menuOverlay =
      document.getElementById(
        "menuOverlay"
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


    const formularioLancamento =
      document.getElementById(
        "formLancamento"
      );


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


    const btnCancelar =
      document.getElementById(
        "btnCancelar"
      );


    const tituloFormulario =
      document.getElementById(
        "tituloFormulario"
      );


    const lista =
      document.getElementById(
        "listaLancamentos"
      );


    const filtroMes =
      document.getElementById(
        "filtroMes"
      );


    const btnLimparFiltro =
      document.getElementById(
        "btnLimparFiltro"
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


    const dashboardPeriodo =
      document.getElementById(
        "dashboardPeriodo"
      );


    const tipoGrafico =
      document.getElementById(
        "tipoGrafico"
      );


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


    /* =====================================================
       ELEMENTOS — RECORRÊNCIAS
       ===================================================== */

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


    /* =====================================================
       OUTROS ELEMENTOS
       ===================================================== */

    const relatorioReceitas =
      document.getElementById(
        "relatorioReceitas"
      );


    const relatorioDespesas =
      document.getElementById(
        "relatorioDespesas"
      );


    const relatorioInvestimentos =
      document.getElementById(
        "relatorioInvestimentos"
      );


    const relatorioSaldo =
      document.getElementById(
        "relatorioSaldo"
      );


    /* =====================================================
       FREQUÊNCIAS
       ===================================================== */

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


    /* =====================================================
       FUNÇÕES BÁSICAS
       ===================================================== */

    function escapeHtml(
      valor
    ) {

      return String(
        valor ??
        ""
      )
        .replace(
          /&/g,
          "&amp;"
        )
        .replace(
          /</g,
          "&lt;"
        )
        .replace(
          />/g,
          "&gt;"
        )
        .replace(
          /"/g,
          "&quot;"
        )
        .replace(
          /'/g,
          "&#039;"
        );

    }


    function formatarMoeda(
      valor
    ) {

      const numero =
        Number(
          valor
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


    function formatarData(
      valor
    ) {

      if (!valor) {

        return "";

      }


      const texto =
        String(
          valor
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


      const data =
        new Date(
          valor
        );


      if (
        Number.isNaN(
          data.getTime()
        )
      ) {

        return texto;

      }


      return data.toLocaleDateString(
        "pt-BR"
      );

    }


    function obterDataHoje() {

      const hoje =
        new Date();


      const ano =
        hoje.getFullYear();


      const mes =
        String(
          hoje.getMonth() + 1
        ).padStart(
          2,
          "0"
        );


      const dia =
        String(
          hoje.getDate()
        ).padStart(
          2,
          "0"
        );


      return `${ano}-${mes}-${dia}`;

    }


    function obterMesAtual() {

      return obterDataHoje()
        .slice(
          0,
          7
        );

    }


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

        return valor;

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


    function normalizarTipoCategoria(
      valor
    ) {

      const texto =
        String(
          valor ??
          ""
        )
          .trim()
          .toLowerCase();


      if (
        texto ===
          "receita" ||
        texto ===
          "receitas"
      ) {

        return "Receita";

      }


      if (
        texto ===
          "despesa" ||
        texto ===
          "despesas"
      ) {

        return "Despesa";

      }


      if (
        texto ===
          "investimento" ||
        texto ===
          "investimentos"
      ) {

        return "Investimento";

      }


      return valor || "";

    }


    /* =====================================================
       INTERFACE
       ===================================================== */

    function mostrarInterfaceLogin() {

      if (loginScreen) {

        loginScreen.classList.remove(
          "hidden"
        );

      }


      if (app) {

        app.classList.add(
          "hidden"
        );

      }

    }


    function mostrarInterfaceApp() {

      if (loginScreen) {

        loginScreen.classList.add(
          "hidden"
        );

      }


      if (app) {

        app.classList.remove(
          "hidden"
        );

      }

    }


    function mostrarTela(
      tela
    ) {

      const telas = [

        dashboard,

        lancamentos,

        recorrencias,

        relatorios,

        contas

      ];


      telas.forEach(
        item => {

          if (!item) {

            return;

          }


          item.classList.add(
            "hidden"
          );

        }
      );


      if (tela) {

        tela.classList.remove(
          "hidden"
        );

      }


      fecharMenuMobile();

    }


    function ativarMenu(
      botao
    ) {

      const botoes = [

        btnDashboard,

        btnLancamentos,

        btnRecorrencias,

        btnRelatorios,

        btnContas

      ];


      botoes.forEach(
        item => {

          if (!item) {

            return;

          }


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


    /* =====================================================
       USUÁRIO / SESSÃO
       ===================================================== */

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


        return (
          data?.user ||
          null
        );

      } catch (erro) {

        console.error(
          "Erro inesperado ao obter usuário:",
          erro
        );

        return null;

      }

    }


    async function iniciarSessao(
      user,
      session
    ) {

      usuarioAtual =
        user ||
        null;


      sessaoAtual =
        session ||
        null;


      if (!usuarioAtual) {

        mostrarInterfaceLogin();

        return;

      }


      if (usuarioEmail) {

        usuarioEmail.innerText =
          usuarioAtual.email ||
          "";

      }


      if (nomeUsuario) {

        nomeUsuario.innerText =
          usuarioAtual.user_metadata
            ?.nome ||
          usuarioAtual.email ||
          "Usuário";

      }


      mostrarInterfaceApp();


      await carregarCategoriasFinanceiras();

      await carregarLancamentos();

      await carregarRecorrencias();


      atualizarDashboard();

      renderizarLista();

      atualizarRelatorios();


      mostrarTela(
        dashboard
      );


      ativarMenu(
        btnDashboard
      );

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    if (loginForm) {

      loginForm.addEventListener(
        "submit",
        async event => {

          event.preventDefault();


          const email =
            emailLogin?.value?.trim() ||
            "";


          const senha =
            senhaLogin?.value ||
            "";


          if (!email) {

            alert(
              "Informe seu e-mail."
            );

            return;

          }


          if (!senha) {

            alert(
              "Informe sua senha."
            );

            return;

          }


          if (btnLogin) {

            btnLogin.disabled =
              true;

            btnLogin.innerText =
              "Entrando...";

          }


          try {

            const {
              data,
              error
            } =
              await supabase.auth.signInWithPassword({

                email,

                password:
                  senha

              });


            if (error) {

              console.error(
                "Erro no login:",
                error
              );


              alert(
                error.message ||
                "Não foi possível realizar o login."
              );

              return;

            }


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
                "Login realizado, mas a sessão não foi encontrada."
              );

            }

          } catch (erro) {

            console.error(
              "Erro inesperado no login:",
              erro
            );


            alert(
              "Ocorreu um erro ao realizar o login."
            );

          } finally {

            if (btnLogin) {

              btnLogin.disabled =
                false;

              btnLogin.innerText =
                "Entrar";

            }

          }

        }
      );

    }


    /* =====================================================
       CADASTRO
       ===================================================== */

    if (cadastroForm) {

      cadastroForm.addEventListener(
        "submit",
        async event => {

          event.preventDefault();


          const email =
            emailCadastro?.value?.trim() ||
            "";


          const senha =
            senhaCadastro?.value ||
            "";


          const confirmarSenha =
            confirmarSenhaCadastro?.value ||
            "";


          if (!email) {

            alert(
              "Informe seu e-mail."
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


          if (
            senha !==
            confirmarSenha
          ) {

            alert(
              "As senhas não conferem."
            );

            return;

          }


          if (btnCadastro) {

            btnCadastro.disabled =
              true;

            btnCadastro.innerText =
              "Criando conta...";

          }


          try {

            const {
              data,
              error
            } =
              await supabase.auth.signUp({

                email,

                password:
                  senha

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
                "Cadastro realizado. Verifique seu e-mail para confirmar a conta."
              );

              if (
                btnMostrarLogin
              ) {

                btnMostrarLogin.click();

              }

            }

          } catch (erro) {

            console.error(
              "Erro inesperado no cadastro:",
              erro
            );


            alert(
              "Ocorreu um erro ao criar sua conta."
            );

          } finally {

            if (btnCadastro) {

              btnCadastro.disabled =
                false;

              btnCadastro.innerText =
                "Criar conta";

            }

          }

        }
      );

    }


    /* =====================================================
       TROCA LOGIN / CADASTRO
       ===================================================== */

    if (
      btnMostrarCadastro
    ) {

      btnMostrarCadastro.addEventListener(
        "click",
        () => {

          if (loginForm) {

            loginForm.classList.add(
              "hidden"
            );

          }


          if (cadastroForm) {

            cadastroForm.classList.remove(
              "hidden"
            );

          }

        }
      );

    }


    if (
      btnMostrarLogin
    ) {

      btnMostrarLogin.addEventListener(
        "click",
        () => {

          if (cadastroForm) {

            cadastroForm.classList.add(
              "hidden"
            );

          }


          if (loginForm) {

            loginForm.classList.remove(
              "hidden"
            );

          }

        }
      );

    }


    /* =====================================================
       RECUPERAÇÃO DE SENHA
       ===================================================== */

    if (
      btnEsqueciSenha
    ) {

      btnEsqueciSenha.addEventListener(
        "click",
        async () => {

          const email =
            emailLogin?.value?.trim() ||
            "";


          if (!email) {

            alert(
              "Informe seu e-mail no campo de login antes de solicitar a recuperação."
            );

            return;

          }


          try {

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


            if (error) {

              console.error(
                "Erro ao recuperar senha:",
                error
              );


              alert(
                error.message ||
                "Não foi possível enviar o e-mail de recuperação."
              );

              return;

            }


            alert(
              "E-mail de recuperação enviado. Verifique sua caixa de entrada."
            );

          } catch (erro) {

            console.error(
              "Erro inesperado na recuperação:",
              erro
            );


            alert(
              "Ocorreu um erro ao solicitar a recuperação da senha."
            );

          }

        }
      );

    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    async function fazerLogout() {

      try {

        const {
          error
        } =
          await supabase.auth.signOut();


        if (error) {

          console.error(
            "Erro ao sair:",
            error
          );

        }

      } catch (erro) {

        console.error(
          "Erro inesperado ao sair:",
          erro
        );

      }


      usuarioAtual =
        null;


      sessaoAtual =
        null;


      dados =
        [];


      recorrenciasDados =
        [];


      categoriasFinanceiras =
        [];


      mostrarInterfaceLogin();

    }


    if (btnLogout) {

      btnLogout.addEventListener(
        "click",
        fazerLogout
      );

    }


    /* =====================================================
       OBSERVADOR DE AUTENTICAÇÃO
       ===================================================== */

    supabase.auth.onAuthStateChange(
      async (
        event,
        session
      ) => {

        console.log(
          "Auth event:",
          event
        );


        if (
          event ===
          "SIGNED_IN" &&
          session?.user
        ) {

          sessaoAtual =
            session;


          usuarioAtual =
            session.user;


          await iniciarSessao(

            session.user,

            session

          );

        }


        if (
          event ===
          "SIGNED_OUT"
        ) {

          usuarioAtual =
            null;


          sessaoAtual =
            null;


          dados =
            [];


          recorrenciasDados =
            [];


          mostrarInterfaceLogin();

        }

      }
    );


    /* =====================================================
       CATEGORIAS FINANCEIRAS
       ===================================================== */

    async function carregarCategoriasFinanceiras() {

      try {

        const user =
          usuarioAtual ||
          await obterUsuarioAtual();


        if (!user) {

          categoriasFinanceiras =
            [];

          return;

        }


        const {
          data,
          error
        } =
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

          return;

        }


        categoriasFinanceiras =
          data ||
          [];


        preencherCategoriasLancamento();

      } catch (erro) {

        console.error(
          "Erro inesperado ao carregar categorias:",
          erro
        );


        categoriasFinanceiras =
          [];

      }

    }


    function preencherCategoriasLancamento() {

      if (!categoria) {

        return;

      }


      categoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";


      categoriasFinanceiras
        .filter(
          item => {

            const tipoCategoria =
              normalizarTipoCategoria(
                item.tipo
              );


            const tipoLancamento =
              normalizarTipoCategoria(
                tipo?.value ||
                ""
              );


            return (
              !tipoLancamento ||
              !tipoCategoria ||
              tipoCategoria ===
                tipoLancamento
            );

          }
        )
        .forEach(
          item => {

            const option =
              document.createElement(
                "option"
              );


            option.value =
              item.id;


            option.textContent =
              item.nome;


            categoria.appendChild(
              option
            );

          }
        );


      categoria.disabled =
        false;

    }


    if (tipo) {

      tipo.addEventListener(
        "change",
        () => {

          preencherCategoriasLancamento();

        }
      );

    }

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

    function escapeHtml(
      valor
    ) {

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
       LISTA DE LANÇAMENTOS
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
   VERSÃO CORRIGIDA
   ========================================================= */


/* =========================================================
   CARREGAR CATEGORIAS DA RECORRÊNCIA
   ========================================================= */

async function carregarCategoriasRecorrencia(
  tipoSelecionado = "",
  categoriaSelecionada = ""
) {

  if (!recCategoria) {
    return;
  }

  recCategoria.innerHTML =
    "<option value=''>Carregando categorias...</option>";

  recCategoria.disabled = true;

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

      recCategoria.innerHTML =
        "<option value=''>Sessão expirada</option>";

      console.error(
        "Erro ao obter usuário:",
        userError
      );

      return;

    }


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
        "Erro ao carregar categorias:",
        error
      );

      recCategoria.innerHTML =
        "<option value=''>Erro ao carregar categorias</option>";

      return;

    }


    recCategoria.innerHTML =
      "<option value=''>Selecione uma categoria</option>";


    const tipoNormalizado =
      String(
        tipoSelecionado ||
        ""
      )
        .trim()
        .toLowerCase();


    const categorias =
      (data || []).filter(
        categoria => {

          const tipoCategoria =
            String(
              categoria.tipo ||
              ""
            )
              .trim()
              .toLowerCase();


          if (
            !tipoNormalizado
          ) {

            return true;

          }


          return (
            !tipoCategoria ||
            tipoCategoria ===
              tipoNormalizado
          );

        }
      );


    categorias.forEach(
      categoria => {

        const option =
          document.createElement(
            "option"
          );


        /*
         * IMPORTANTE:
         *
         * O value do select é o ID.
         *
         * NÃO usamos o nome da categoria
         * como valor.
         */
        option.value =
          categoria.id;


        option.textContent =
          categoria.nome ||
          "Categoria";


        option.dataset.nome =
          categoria.nome ||
          "";


        if (
          String(
            categoria.id
          ) ===
          String(
            categoriaSelecionada ||
            ""
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
      categorias.length ===
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


      recCategoria.appendChild(
        option
      );

    }


    recCategoria.disabled =
      false;


  } catch (erro) {

    console.error(
      "Erro inesperado ao carregar categorias da recorrência:",
      erro
    );


    recCategoria.innerHTML =
      "<option value=''>Erro ao carregar categorias</option>";

  }

}


/* =========================================================
   ALTERAR TIPO DA RECORRÊNCIA
   ========================================================= */

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


/* =========================================================
   CARREGAR RECORRÊNCIAS
   ========================================================= */

async function carregarRecorrencias() {

  if (!listaRecorrencias) {
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

      recorrenciasDados =
        [];

      renderizarRecorrencias();

      return;

    }


    /*
     * IMPORTANTE:
     *
     * NÃO usar:
     *
     * .order("created_at")
     *
     * porque essa coluna NÃO existe
     * na tabela atual.
     */


    const {
      data,
      error
    } =
      await supabase
        .from(
          "lancamentos_recorrentes"
        )
        .select(
          `
          id,
          user_id,
          tipo,
          categoria_id,
          descricao,
          valor,
          frequencia,
          dia_vencimento,
          data_inicio,
          data_fim,
          ativo
          `
        )
        .eq(
          "user_id",
          userData.user.id
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


    /*
     * Ordenação feita no navegador.
     *
     * Assim não dependemos de created_at
     * no banco.
     */

    recorrenciasDados.sort(
      (
        a,
        b
      ) => {

        const dataA =
          String(
            a.data_inicio ||
            ""
          );

        const dataB =
          String(
            b.data_inicio ||
            ""
          );


        return dataB.localeCompare(
          dataA
        );

      }
    );


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


/* =========================================================
   CONTADORES
   ========================================================= */

function atualizarContadoresRecorrencias() {

  const total =
    recorrenciasDados.length;


  const ativas =
    recorrenciasDados.filter(
      item =>
        item.ativo !== false
    ).length;


  const pausadas =
    recorrenciasDados.filter(
      item =>
        item.ativo === false
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


/* =========================================================
   NOME DA CATEGORIA
   ========================================================= */

function obterNomeCategoriaRecorrencia(
  recorrencia
) {

  if (
    !recorrencia
  ) {

    return "Sem categoria";

  }


  /*
   * Primeiro tentamos encontrar
   * a categoria já carregada no select.
   */

  if (
    recCategoria &&
    recorrencia.categoria_id
  ) {

    const option =
      Array.from(
        recCategoria.options
      ).find(
        item =>
          String(
            item.value
          ) ===
          String(
            recorrencia.categoria_id
          )
      );


    if (
      option &&
      option.textContent
    ) {

      return option.textContent;

    }

  }


  /*
   * Caso a categoria não esteja no
   * select atual, tentamos carregar
   * pelo cache de categorias.
   */

  if (
    Array.isArray(
      categoriasFinanceiras
    )
  ) {

    const categoria =
      categoriasFinanceiras.find(
        item =>
          String(
            item.id
          ) ===
          String(
            recorrencia.categoria_id
          )
      );


    if (
      categoria?.nome
    ) {

      return categoria.nome;

    }

  }


  return "Sem categoria";

}


/* =========================================================
   PRÓXIMA OCORRÊNCIA
   ========================================================= */

function calcularProximaOcorrencia(
  recorrencia
) {

  if (
    !recorrencia ||
    recorrencia.ativo === false
  ) {

    return null;

  }


  if (
    !recorrencia.data_inicio
  ) {

    return null;

  }


  const hoje =
    new Date();


  hoje.setHours(
    0,
    0,
    0,
    0
  );


  const inicio =
    new Date(
      `${recorrencia.data_inicio}T00:00:00`
    );


  inicio.setHours(
    0,
    0,
    0,
    0
  );


  let data =
    new Date(
      inicio
    );


  const frequencia =
    String(
      recorrencia.frequencia ||
      "mensal"
    )
      .toLowerCase()
      .trim();


  const dia =
    Number(
      recorrencia.dia_vencimento
    );


  /*
   * Para frequências semanais,
   * quinzenais etc., usamos a
   * data inicial como referência.
   */


  if (
    frequencia ===
    "diaria"
  ) {

    while (
      data < hoje
    ) {

      data.setDate(
        data.getDate() +
        1
      );

    }

  } else if (
    frequencia ===
    "semanal"
  ) {

    while (
      data < hoje
    ) {

      data.setDate(
        data.getDate() +
        7
      );

    }

  } else if (
    frequencia ===
    "quinzenal"
  ) {

    while (
      data < hoje
    ) {

      data.setDate(
        data.getDate() +
        15
      );

    }

  } else {

    /*
     * Mensal / bimestral /
     * trimestral / semestral /
     * anual.
     */

    if (
      Number.isInteger(
        dia
      )
    ) {

      data.setDate(
        Math.min(
          dia,
          28
        )
      );

    }


    while (
      data < hoje
    ) {

      let meses =
        1;


      if (
        frequencia ===
        "bimestral"
      ) {

        meses =
          2;

      }


      if (
        frequencia ===
        "trimestral"
      ) {

        meses =
          3;

      }


      if (
        frequencia ===
        "semestral"
      ) {

        meses =
          6;

      }


      if (
        frequencia ===
        "anual"
      ) {

        meses =
          12;

      }


      const novoMes =
        data.getMonth() +
        meses;


      data.setMonth(
        novoMes
      );


      if (
        Number.isInteger(
          dia
        )
      ) {

        data.setDate(
          Math.min(
            dia,
            28
          )
        );

      }

    }

  }


  if (
    recorrencia.data_fim
  ) {

    const fim =
      new Date(
        `${recorrencia.data_fim}T00:00:00`
      );


    if (
      data > fim
    ) {

      return null;

    }

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


  if (
    !recorrenciasDados.length
  ) {

    listaRecorrencias.innerHTML = `

      <div class="empty-state">

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
    recorrencia => {

      const ativa =
        recorrencia.ativo !== false;


      const nomeCategoria =
        obterNomeCategoriaRecorrencia(
          recorrencia
        );


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


      const tipo =
        normalizarTipoCategoria(
          recorrencia.tipo
        );


      const frequencia =
        nomesFrequencia[
          recorrencia.frequencia
        ] ||
        recorrencia.frequencia ||
        "Mensal";


      card.innerHTML = `

        <div class="recorrencia-info">

          <strong>
            ${
              escapeHtml(
                recorrencia.descricao ||
                "Sem descrição"
              )
            }
          </strong>


          <span>

            ${
              escapeHtml(
                tipo
              )
            }

            •

            ${
              escapeHtml(
                nomeCategoria
              )
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
              escapeHtml(
                frequencia
              )
            }

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


  atualizarContadoresRecorrencias();

}


/* =========================================================
   SALVAR / ATUALIZAR RECORRÊNCIA
   ========================================================= */

async function salvarRecorrencia() {

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


    const valorTexto =
      String(
        recValor?.value ||
        ""
      )
        .trim();


    /*
     * Aceita:
     *
     * 250
     * 250,00
     * 1.250,50
     */

    let valorRec =
      valorTexto;


    if (
      valorRec.includes(
        ","
      )
    ) {

      valorRec =
        valorRec
          .replace(
            /\./g,
            ""
          )
          .replace(
            ",",
            "."
          );

    }


    valorRec =
      Number(
        valorRec
      );


    const frequencia =
      String(
        recFrequencia?.value ||
        ""
      )
        .trim()
        .toLowerCase();


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


    /* -----------------------------------------------------
       VALIDAÇÕES
       ----------------------------------------------------- */

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


    if (
      !categoriaId
    ) {

      alert(
        "Selecione uma categoria."
      );

      return;

    }


    if (
      !descricaoRec
    ) {

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
      !frequencia
    ) {

      alert(
        "Selecione a frequência."
      );

      return;

    }


    if (
      !dataInicio
    ) {

      alert(
        "Informe a data de início."
      );

      return;

    }


    /*
     * Frequências que dependem
     * de dia do mês.
     */

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


    /*
     * =====================================================
     * REGISTRO
     *
     * ATENÇÃO:
     *
     * NÃO EXISTE:
     *
     * categoria:
     *
     * Usamos somente:
     *
     * categoria_id
     * =====================================================
     */

    const registro = {

      user_id:
        userData.user.id,

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


    console.log(
      "REGISTRO DE RECORRÊNCIA:",
      registro
    );


    let resultado;


    /* -----------------------------------------------------
       ATUALIZAÇÃO
       ----------------------------------------------------- */

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
            userData.user.id
          );

    }


    /* -----------------------------------------------------
       NOVA RECORRÊNCIA
       ----------------------------------------------------- */

    else {

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
        "ERRO SUPABASE AO SALVAR RECORRÊNCIA:",
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


/* =========================================================
   BOTÃO SALVAR
   ========================================================= */

if (
  btnSalvarRecorrencia
) {

  btnSalvarRecorrencia.onclick =
    salvarRecorrencia;

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
      normalizarTipoCategoria(
        recorrencia.tipo
      );

  }


  /*
   * IMPORTANTE:
   *
   * A categoria é identificada
   * pelo categoria_id.
   */

  await carregarCategoriasRecorrencia(
    recorrencia.tipo,
    recorrencia.categoria_id ||
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


  if (
    recorrencias
  ) {

    mostrarTela(
      recorrencias
    );

  }


  const formulario =
    document.getElementById(
      "formRecorrencia"
    );


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

    alert(
      "Recorrência não encontrada."
    );

    return;

  }


  const atualmenteAtiva =
    recorrencia.ativo !== false;


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
          userData.user.id
        );


    if (
      error
    ) {

      console.error(
        "Erro ao alterar status:",
        error
      );


      alert(
        `Não foi possível alterar o status.\n\n${error.message}`
      );


      return;

    }


    await carregarRecorrencias();


  } catch (erro) {

    console.error(
      "Erro inesperado ao alterar status:",
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

    alert(
      "Recorrência não encontrada."
    );

    return;

  }


  if (
    !confirm(
      `Tem certeza que deseja excluir a recorrência "${recorrencia.descricao || "sem descrição"}"?`
    )
  ) {

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
          userData.user.id
        );


    if (
      error
    ) {

      console.error(
        "Erro ao excluir recorrência:",
        error
      );


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
      "Erro inesperado ao excluir recorrência:",
      erro
    );


    alert(
      "Ocorreu um erro ao excluir a recorrência."
    );

  }

}


/* =========================================================
   EVENTOS DA LISTA
   ========================================================= */

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

        await alternarStatusRecorrencia(
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


/* =========================================================
   LIMPAR FORMULÁRIO DE RECORRÊNCIA
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

    recCategoria.value =
      "";

    recCategoria.disabled =
      true;

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
   CANCELAR EDIÇÃO
   ========================================================= */

if (
  btnCancelarRecorrencia
) {

  btnCancelarRecorrencia.onclick =
    () => {

      limparFormularioRecorrencia();

    };

}


/* =========================================================
   INICIALIZAÇÃO DAS RECORRÊNCIAS
   ========================================================= */

if (
  recDataInicio &&
  !recDataInicio.value
) {

  recDataInicio.value =
    obterDataHoje();

} 