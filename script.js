// ======================================================
// TCS FINANCE
// SCRIPT.JS — VERSÃO CORRIGIDA E COMPLETA
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    console.log(
      "TCS Finance iniciando..."
    );

    // ======================================================
    // VARIÁVEIS GLOBAIS
    // ======================================================

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


    // ======================================================
    // SUPABASE
    // ======================================================

    const supabase =
      window.supabaseClient ||
      window.supabase;


    if (!supabase) {

      console.error(
        "Cliente Supabase não encontrado."
      );

      alert(
        "Erro: o Supabase não foi inicializado."
      );

      return;

    }


    // ======================================================
    // ELEMENTOS DO DOM
    // ======================================================

    const login =
      document.getElementById(
        "login"
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


    // ======================================================
    // LOGIN
    // ======================================================

    const formLogin =
      document.getElementById(
        "formLogin"
      );

    const loginEmail =
      document.getElementById(
        "loginEmail"
      );

    const loginSenha =
      document.getElementById(
        "loginSenha"
      );

    const btnLogin =
      document.getElementById(
        "btnLogin"
      );

    const btnLogout =
      document.getElementById(
        "btnLogout"
      );

    const btnEsqueciSenha =
      document.getElementById(
        "btnEsqueciSenha"
      );


    // ======================================================
    // DASHBOARD
    // ======================================================

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


    const filtroMes =
      document.getElementById(
        "filtroMes"
      );

    const btnLimparFiltro =
      document.getElementById(
        "btnLimparFiltro"
      );

    const tipoGrafico =
      document.getElementById(
        "tipoGrafico"
      );


    // ======================================================
    // LANÇAMENTOS
    // ======================================================

    const lista =
      document.getElementById(
        "lista"
      );

    const formLancamento =
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


    // ======================================================
    // RECORRÊNCIAS
    // ======================================================

    const listaRecorrencias =
      document.getElementById(
        "listaRecorrencias"
      );

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

    const tituloFormularioRecorrencia =
      document.getElementById(
        "tituloFormularioRecorrencia"
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


    // ======================================================
    // EXPORTAÇÕES
    // ======================================================

    const btnExportarPdf =
      document.getElementById(
        "btnExportarPdf"
      );

    const btnExportarJson =
      document.getElementById(
        "btnExportarJson"
      );

    const btnExportarExcel =
      document.getElementById(
        "btnExportarExcel"
      );


    // ======================================================
    // RELATÓRIOS
    // ======================================================

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


    // ======================================================
    // FREQUÊNCIAS
    // ======================================================

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


    // ======================================================
    // FUNÇÕES UTILITÁRIAS
    // ======================================================

    function escapeHtml(
      valor
    ) {

      return String(
        valor ?? ""
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
      data
    ) {

      if (!data) {

        return "";

      }


      const texto =
        String(
          data
        );


      if (
        /^\d{4}-\d{2}-\d{2}$/.test(
          texto
        )
      ) {

        const partes =
          texto.split(
            "-"
          );


        return `${partes[2]}/${partes[1]}/${partes[0]}`;

      }


      const d =
        new Date(
          data
        );


      if (
        Number.isNaN(
          d.getTime()
        )
      ) {

        return texto;

      }


      return d.toLocaleDateString(
        "pt-BR"
      );

    }


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


    function obterMesAtual() {

      const hoje =
        obterDataHoje();


      return hoje.slice(
        0,
        7
      );

    }


    function formatarPeriodo(
      periodo
    ) {

      if (!periodo) {

        return "Todos os períodos";

      }


      const partes =
        String(
          periodo
        ).split(
          "-"
        );


      if (
        partes.length !== 2
      ) {

        return periodo;

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

        return periodo;

      }


      const nomes = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

      ];


      return `${nomes[mes - 1]} de ${ano}`;

    }


    function normalizarTipoCategoria(
      valor
    ) {

      const texto =
        String(
          valor || ""
        )
          .trim()
          .toLowerCase();


      if (
        texto === "receita" ||
        texto === "receitas"
      ) {

        return "Receita";

      }


      if (
        texto === "despesa" ||
        texto === "despesas"
      ) {

        return "Despesa";

      }


      if (
        texto === "investimento" ||
        texto === "investimentos"
      ) {

        return "Investimento";

      }


      return String(
        valor || ""
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
          ".menu-item, .nav-item, .sidebar button"
        )
        .forEach(
          el => {

            el.classList.remove(
              "active"
            );

          }
        );


      if (botao) {

        botao.classList.add(
          "active"
        );

      }


      fecharMenuMobile();

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
        el => {

          if (!el) {

            return;

          }


          el.classList.remove(
            "active"
          );


          el.classList.add(
            "hidden"
          );

        }
      );


      if (tela) {

        tela.classList.remove(
          "hidden"
        );

        tela.classList.add(
          "active"
        );

      }


      fecharMenuMobile();

    }


    // ======================================================
    // LOGIN / INTERFACE
    // ======================================================

    function mostrarInterfaceLogin() {

      if (login) {

        login.classList.remove(
          "hidden"
        );

        login.classList.add(
          "active"
        );

      }


      if (app) {

        app.classList.add(
          "hidden"
        );

        app.classList.remove(
          "active"
        );

      }

    }


    function mostrarInterfaceApp() {

      if (login) {

        login.classList.add(
          "hidden"
        );

        login.classList.remove(
          "active"
        );

      }


      if (app) {

        app.classList.remove(
          "hidden"
        );

        app.classList.add(
          "active"
        );

      }

    }


    // ======================================================
    // OBTTER USUÁRIO
    // ======================================================

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


        usuarioAtual =
          data?.user ||
          null;


        return usuarioAtual;

      } catch (erro) {

        console.error(
          "Erro inesperado ao obter usuário:",
          erro
        );

        return null;

      }

    }


    // ======================================================
    // LOGIN
    // ======================================================

    if (formLogin) {

      formLogin.addEventListener(
        "submit",
        async event => {

          event.preventDefault();


          const email =
            loginEmail?.value?.trim() ||
            "";

          const senha =
            loginSenha?.value ||
            "";


          if (!email || !senha) {

            alert(
              "Informe seu e-mail e sua senha."
            );

            return;

          }


          try {

            if (btnLogin) {

              btnLogin.disabled =
                true;

              btnLogin.innerText =
                "Entrando...";

            }


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
                `Não foi possível entrar.\n\n${error.message}`
              );

              return;

            }


            sessaoAtual =
              data?.session ||
              null;

            usuarioAtual =
              data?.user ||
              null;


            if (
              usuarioAtual
            ) {

              await iniciarSessao(
                usuarioAtual,
                sessaoAtual
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


    // ======================================================
    // LOGOUT
    // ======================================================

    if (btnLogout) {

      btnLogout.addEventListener(
        "click",
        async () => {

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

          dados =
            [];

          recorrenciasDados =
            [];


          mostrarInterfaceLogin();

        }
      );

    }


    // ======================================================
    // RECUPERAÇÃO DE SENHA
    // ======================================================

    if (btnEsqueciSenha) {

      btnEsqueciSenha.addEventListener(
        "click",
        async () => {

          const email =
            loginEmail?.value?.trim() ||
            "";


          if (!email) {

            alert(
              "Digite seu e-mail antes de solicitar a recuperação da senha."
            );

            loginEmail?.focus();

            return;

          }


          try {

            const {
              error
            } =
              await supabase.auth.resetPasswordForEmail(
                email
              );


            if (error) {

              alert(
                `Não foi possível enviar o e-mail.\n\n${error.message}`
              );

              return;

            }


            alert(
              "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
            );

          } catch (erro) {

            console.error(
              "Erro ao recuperar senha:",
              erro
            );


            alert(
              "Ocorreu um erro ao solicitar a recuperação da senha."
            );

          }

        }
      );

    }


    // ======================================================
    // INICIALIZAR SESSÃO
    // ======================================================

    async function iniciarSessao(
      user,
      session
    ) {

      if (!user) {

        mostrarInterfaceLogin();

        return;

      }


      usuarioAtual =
        user;

      sessaoAtual =
        session ||
        null;


      mostrarInterfaceApp();


      try {

        await Promise.all([

          carregarCategorias(),

          carregarLancamentos(),

          carregarRecorrencias()

        ]);

      } catch (erro) {

        console.error(
          "Erro ao carregar dados da sessão:",
          erro
        );

      }


      mostrarTela(
        dashboard
      );


      ativarMenu(
        btnDashboard
      );


      atualizarDashboard();

    }


    // ======================================================
    // CATEGORIAS
    // ======================================================

    async function carregarCategorias() {

      if (!usuarioAtual) {

        return;

      }


      try {

        const {
          data,
          error
        } =
          await supabase
            .from(
              "categorias"
            )
            .select(
              "*"
            )
            .eq(
              "user_id",
              usuarioAtual.id
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

      }

    }


    function preencherCategoriasLancamento() {

      if (!categoria) {

        return;

      }


      categoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";


      categoriasFinanceiras.forEach(
        item => {

          const option =
            document.createElement(
              "option"
            );


          option.value =
            item.id;


          option.textContent =
            item.nome ||
            item.name ||
            "Sem nome";


          categoria.appendChild(
            option
          );

        }
      );


      if (tipo?.value) {

        categoria.disabled =
          false;

      } else {

        categoria.disabled =
          true;

      }

    }


    // ======================================================
    // CATEGORIAS DAS RECORRÊNCIAS
    // ======================================================

    async function carregarCategoriasRecorrencia(
      tipoSelecionado,
      categoriaSelecionada
    ) {

      if (!recCategoria) {

        return;

      }


      recCategoria.innerHTML =
        "<option value=''>Carregando categorias...</option>";


      const tipoNormalizado =
        normalizarTipoCategoria(
          tipoSelecionado
        );


      let listaCategorias =
        categoriasFinanceiras;


      if (
        !listaCategorias.length
      ) {

        await carregarCategorias();

        listaCategorias =
          categoriasFinanceiras;

      }


      if (
        tipoNormalizado
      ) {

        listaCategorias =
          listaCategorias.filter(
            item => {

              const tipoCategoria =
                normalizarTipoCategoria(
                  item.tipo ||
                  item.tipo_categoria
                );


              return (
                !tipoCategoria ||
                tipoCategoria ===
                  tipoNormalizado
              );

            }
          );

      }


      recCategoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";


      listaCategorias.forEach(
        item => {

          const option =
            document.createElement(
              "option"
            );


          option.value =
            item.id;


          option.textContent =
            item.nome ||
            item.name ||
            "Sem nome";


          if (
            categoriaSelecionada &&
            String(
              item.id
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

    }


    // ======================================================
    // CARREGAR LANÇAMENTOS
    // ======================================================

    async function carregarLancamentos() {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        dados =
          [];

        renderizarLista();

        atualizarDashboard();

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

          renderizarLista();

          atualizarDashboard();

          return;

        }


        dados =
          data ||
          [];


        renderizarLista();

        atualizarDashboard();

      } catch (erro) {

        console.error(
          "Erro inesperado ao carregar lançamentos:",
          erro
        );


        dados =
          [];

        renderizarLista();

        atualizarDashboard();

      }

    }


    // ======================================================
    // FILTRO
    // ======================================================

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


    // ======================================================
    // RENDERIZAR LISTA
    // ======================================================

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


    // ======================================================
    // EVENTOS DA LISTA
    // ======================================================

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


    // ======================================================
    // EDITAR LANÇAMENTO
    // ======================================================

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


      if (!item) {

        alert(
          "Lançamento não encontrado."
        );

        return;

      }


      mostrarTela(
        lancamentos
      );


      ativarMenu(
        btnLancamentos
      );


      if (tipo) {

        tipo.value =
          normalizarTipoCategoria(
            item.tipo
          );

      }


      if (categoria) {

        categoria.disabled =
          false;

      }


      if (
        categoria &&
        item.categoria_id
      ) {

        categoria.value =
          item.categoria_id;

      }


      if (descricao) {

        descricao.value =
          item.descricao ||
          "";

      }


      if (valor) {

        valor.value =
          item.valor ??
          "";

      }


      if (dataInput) {

        dataInput.value =
          item.data ||
          obterDataHoje();

      }


      if (btnSalvar) {

        btnSalvar.dataset.editando =
          item.id;

        btnSalvar.innerText =
          "Atualizar lançamento";

      }


      if (btnCancelar) {

        btnCancelar.classList.remove(
          "hidden"
        );

      }

    }


    // ======================================================
    // EXCLUIR LANÇAMENTO
    // ======================================================

    async function excluirLancamento(
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


      if (!item) {

        return;

      }


      const confirmado =
        confirm(
          `Tem certeza que deseja excluir o lançamento "${
            item.descricao ||
            "sem descrição"
          }"?`
        );


      if (!confirmado) {

        return;

      }


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


      try {

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

          console.error(
            "Erro ao excluir lançamento:",
            error
          );


          alert(
            `Não foi possível excluir o lançamento.\n\n${error.message}`
          );

          return;

        }


        await carregarLancamentos();

      } catch (erro) {

        console.error(
          "Erro inesperado ao excluir lançamento:",
          erro
        );


        alert(
          "Ocorreu um erro ao excluir o lançamento."
        );

      }

    }


    // ======================================================
    // FORMULÁRIO DE LANÇAMENTO
    // ======================================================

    if (tipo) {

      tipo.addEventListener(
        "change",
        () => {

          if (categoria) {

            categoria.disabled =
              !tipo.value;

          }


          preencherCategoriasLancamento();

        }
      );

    }


    if (formLancamento) {

      formLancamento.addEventListener(
        "submit",
        async event => {

          event.preventDefault();


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


          const tipoLancamento =
            normalizarTipoCategoria(
              tipo?.value ||
              ""
            );


          const categoriaId =
            categoria?.value ||
            "";


          const descricaoLancamento =
            descricao?.value?.trim() ||
            "";


          const valorLancamento =
            Number(
              String(
                valor?.value ||
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


          const dataLancamento =
            dataInput?.value ||
            "";


          if (
            ![
              "Receita",
              "Despesa",
              "Investimento"
            ].includes(
              tipoLancamento
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


          if (!descricaoLancamento) {

            alert(
              "Informe uma descrição."
            );

            return;

          }


          if (
            !Number.isFinite(
              valorLancamento
            ) ||
            valorLancamento <= 0
          ) {

            alert(
              "Informe um valor válido."
            );

            return;

          }


          if (!dataLancamento) {

            alert(
              "Informe a data."
            );

            return;

          }


          const registro = {

            user_id:
              user.id,

            tipo:
              tipoLancamento,

            categoria_id:
              categoriaId,

            descricao:
              descricaoLancamento,

            valor:
              valorLancamento,

            data:
              dataLancamento

          };


          try {

            let resultado;


            const idEdicao =
              btnSalvar?.dataset?.editando;


            if (idEdicao) {

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
                    idEdicao
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
              idEdicao
                ? "Lançamento atualizado com sucesso!"
                : "Lançamento cadastrado com sucesso!"
            );


            limparFormularioLancamento();

            await carregarLancamentos();

            mostrarTela(
              lancamentos
            );

            ativarMenu(
              btnLancamentos
            );

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


    // ======================================================
    // LIMPAR FORMULÁRIO
    // ======================================================

    function limparFormularioLancamento() {

      if (formLancamento) {

        formLancamento.reset();

      }


      if (dataInput) {

        dataInput.value =
          obterDataHoje();

      }


      if (categoria) {

        categoria.value =
          "";

        categoria.disabled =
          true;

      }


      if (btnSalvar) {

        delete btnSalvar.dataset.editando;

        btnSalvar.innerText =
          "Salvar lançamento";

      }


      if (btnCancelar) {

        btnCancelar.classList.add(
          "hidden"
        );

      }

    }


    if (btnCancelar) {

      btnCancelar.addEventListener(
        "click",
        limparFormularioLancamento
      );

    }


    // ======================================================
    // DASHBOARD
    // ======================================================

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


    // ======================================================
    // GRÁFICO PRINCIPAL
    // ======================================================

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


    // ======================================================
    // GRÁFICO MENSAL
    // ======================================================

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


          const tipoItem =
            normalizarTipoCategoria(
              item.tipo
            );


          if (
            tipoItem ===
            "Receita"
          ) {

            mapa[mes].receita +=
              v;

          }


          if (
            tipoItem ===
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


    // ======================================================
    // GRÁFICO COMPARATIVO
    // ======================================================

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


          const tipoItem =
            normalizarTipoCategoria(
              item.tipo
            );


          if (
            tipoItem ===
            "Receita"
          ) {

            mapa[mes].receita +=
              v;

          }


          if (
            tipoItem ===
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


    // ======================================================
    // EVENTOS DO DASHBOARD
    // ======================================================

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


    // ======================================================
    // RELATÓRIOS
    // ======================================================

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
  function obterDadosFiltrados() {

    if (!filtroMes?.value) {
      return [...dados];
    }

    return dados.filter(
      item =>
        String(item.data || "").startsWith(
          filtroMes.value
        )
    );

  }


  function renderizarLista() {

    if (!lista) {
      return;
    }

    lista.innerHTML = "";

    if (!dados.length) {

      lista.innerHTML =
        "<li>Nenhum lançamento cadastrado.</li>";

      return;

    }

    const filtrados =
      obterDadosFiltrados();

    if (!filtrados.length) {

      lista.innerHTML =
        "<li>Nenhum lançamento encontrado para o período selecionado.</li>";

      return;

    }

    filtrados.forEach(item => {

      const li =
        document.createElement("li");

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
                item.tipo || ""
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

      lista.appendChild(li);

    });

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

          await editarLancamento(id);

        }

        if (
          botao.dataset.acao ===
          "excluir"
        ) {

          await excluirLancamento(id);

        }

      }
    );

  }


  /* ======================================================
     DASHBOARD
  ====================================================== */

  function atualizarPeriodoDashboard() {

    if (dashboardPeriodo) {

      dashboardPeriodo.innerText =
        formatarPeriodo(
          filtroMes?.value || ""
        );

    }

  }


  function atualizarDashboard() {

    const filtrados =
      obterDadosFiltrados();

    let receita = 0;
    let despesa = 0;
    let investimento = 0;

    filtrados.forEach(item => {

      const v =
        Number(item.valor) || 0;

      const tipoItem =
        normalizarTipoCategoria(
          item.tipo
        );

      if (tipoItem === "Receita") {
        receita += v;
      }

      if (tipoItem === "Despesa") {
        despesa += v;
      }

      if (tipoItem === "Investimento") {
        investimento += v;
      }

    });


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
        formatarMoeda(
          receita - despesa
        );

    }


    atualizarPeriodoDashboard();


    /*
     * IMPORTANTE:
     * Todos os gráficos recebem os mesmos
     * dados filtrados do dashboard.
     */

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


  function destruirGrafico(ref) {

    if (!ref) {
      return;
    }

    try {

      ref.destroy();

    } catch (_) {}

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


    destruirGrafico(grafico);


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

      const mapa = {};


      filtrados.forEach(item => {

        const chave =
          item.categoria ||
          "Sem categoria";

        mapa[chave] =
          (
            mapa[chave] ||
            0
          ) +
          (
            Number(item.valor) ||
            0
          );

      });


      labels =
        Object.keys(mapa);

      valores =
        Object.values(mapa);

    }


    grafico =
      new Chart(
        canvas,
        {

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


    const mapa = {};


    filtrados.forEach(item => {

      const mes =
        String(
          item.data || ""
        ).slice(0, 7);


      if (!mes) {
        return;
      }


      if (!mapa[mes]) {

        mapa[mes] = {

          receita: 0,

          despesa: 0

        };

      }


      const v =
        Number(item.valor) || 0;


      const tipo =
        normalizarTipoCategoria(
          item.tipo
        );


      if (tipo === "Receita") {

        mapa[mes].receita += v;

      }


      if (tipo === "Despesa") {

        mapa[mes].despesa += v;

      }

    });


    const labels =
      Object.keys(mapa).sort();


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

                data:
                  labels.map(
                    mes =>
                      mapa[mes].receita
                  )

              },

              {

                label: "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes].despesa
                  )

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

              mode: "index",

              intersect: false

            },

            plugins: {

              legend: {

                position: "bottom"

              }

            }

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


    const mapa = {};


    filtrados.forEach(item => {

      const mes =
        String(
          item.data || ""
        ).slice(0, 7);


      if (!mes) {
        return;
      }


      if (!mapa[mes]) {

        mapa[mes] = {

          receita: 0,

          despesa: 0

        };

      }


      const v =
        Number(item.valor) || 0;


      const tipo =
        normalizarTipoCategoria(
          item.tipo
        );


      if (tipo === "Receita") {

        mapa[mes].receita += v;

      }


      if (tipo === "Despesa") {

        mapa[mes].despesa += v;

      }

    });


    const labels =
      Object.keys(mapa).sort();


    graficoComparativo =
      new Chart(
        canvas,
        {

          type: "line",

          data: {

            labels,

            datasets: [

              {

                label: "Receitas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes].receita
                  ),

                tension: 0.25,

                fill: false

              },

              {

                label: "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[mes].despesa
                  ),

                tension: 0.25,

                fill: false

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

              mode: "index",

              intersect: false

            },

            plugins: {

              legend: {

                position: "bottom"

              }

            }

          }

        }
      );

  }


  /*
   * Alteração do tipo de gráfico.
   */

  if (tipoGrafico) {

    tipoGrafico.addEventListener(
      "change",
      () => {

        atualizarDashboard();

      }
    );

  }


  /*
   * Filtro mensal.
   */

  if (filtroMes) {

    filtroMes.addEventListener(
      "change",
      () => {

        atualizarDashboard();

        renderizarLista();

      }
    );

  }


  /*
   * Limpar filtro.
   */

  if (btnLimparFiltro) {

    btnLimparFiltro.addEventListener(
      "click",
      () => {

        if (filtroMes) {

          filtroMes.value = "";

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


    let receita = 0;
    let despesa = 0;
    let investimento = 0;


    filtrados.forEach(item => {

      const v =
        Number(item.valor) || 0;


      const tipo =
        normalizarTipoCategoria(
          item.tipo
        );


      if (tipo === "Receita") {
        receita += v;
      }


      if (tipo === "Despesa") {
        despesa += v;
      }


      if (tipo === "Investimento") {
        investimento += v;
      }

    });


    const valores = {

      relatorioReceitas:
        formatarMoeda(receita),

      relatorioDespesas:
        formatarMoeda(despesa),

      relatorioInvestimentos:
        formatarMoeda(investimento),

      relatorioSaldo:
        formatarMoeda(
          receita - despesa
        ),

      relatorioResumoReceitas:
        formatarMoeda(receita),

      relatorioResumoDespesas:
        formatarMoeda(despesa),

      relatorioResumoInvestimentos:
        formatarMoeda(investimento),

      relatorioResumoSaldo:
        formatarMoeda(
          receita - despesa
        ),

      relatorioPeriodo:
        formatarPeriodo(
          filtroMes?.value || ""
        )

    };


    Object.entries(valores)
      .forEach(
        ([id, texto]) => {

          const el =
            document.getElementById(id);


          if (el) {

            el.innerText = texto;

          }

        }
      );

  }


  /* ======================================================
     RECORRÊNCIAS
  ====================================================== */

  async function carregarRecorrencias() {

    if (!listaRecorrencias) {
      return;
    }


    try {

      const user =
        usuarioAtual ||
        await obterUsuarioAtual();


      if (!user) {

        recorrenciasDados = [];

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
            user.id
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );


      if (error) {

        console.error(
          "Erro ao carregar recorrências:",
          error
        );


        recorrenciasDados = [];

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


      recorrenciasDados = [];

      renderizarRecorrencias();

    }

  }


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
        `${total} ${
          total === 1
            ? "recorrência cadastrada."
            : "recorrências cadastradas."
        }`;

    }

  }


  function renderizarRecorrencias() {

    if (!listaRecorrencias) {
      return;
    }


    listaRecorrencias.innerHTML = "";


    if (!recorrenciasDados.length) {

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
          rec.ativo !== false;


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
              recTipo?.value || ""
            );


          const categoriaId =
            recCategoria?.value || "";


          const descricaoRec =
            recDescricao?.value?.trim() || "";


          const valorRec =
            Number(
              String(
                recValor?.value || ""
              )
                .replace(/\./g, "")
                .replace(",", ".")
            );


          const frequencia =
            recFrequencia?.value || "";


          const dia =
            recDiaVencimento?.value
              ? Number(
                  recDiaVencimento.value
                )
              : null;


          const dataInicio =
            recDataInicio?.value || "";


          const dataFim =
            recDataFim?.value || null;


          if (
            ![
              "Receita",
              "Despesa",
              "Investimento"
            ].includes(tipoRec)
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
            !Number.isFinite(valorRec) ||
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
            ].includes(frequencia)
          ) {

            if (
              !Number.isInteger(dia) ||
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
            dataFim < dataInicio
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
              Number.isInteger(dia)
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


          if (recorrenciaEmEdicao) {

            resultado =
              await supabase
                .from(
                  "lancamentos_recorrentes"
                )
                .update(registro)
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
                .insert(registro);

          }


          if (resultado.error) {

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


  async function editarRecorrencia(id) {

    const rec =
      recorrenciasDados.find(
        item =>
          String(item.id) ===
          String(id)
      );


    if (!rec) {

      alert(
        "Recorrência não encontrada."
      );

      return;

    }


    recorrenciaEmEdicao =
      rec.id;


    if (tituloFormularioRecorrencia) {

      tituloFormularioRecorrencia.innerText =
        "Editar recorrência";

    }


    if (btnSalvarRecorrencia) {

      btnSalvarRecorrencia.innerText =
        "Atualizar recorrência";

    }


    if (btnCancelarRecorrencia) {

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
        rec.descricao || "";

    }


    if (recValor) {

      recValor.value =
        rec.valor ?? "";

    }


    if (recFrequencia) {

      recFrequencia.value =
        rec.frequencia || "";

    }


    if (recDiaVencimento) {

      recDiaVencimento.value =
        rec.dia_vencimento ?? "";

    }


    if (recDataInicio) {

      recDataInicio.value =
        rec.data_inicio ||
        obterDataHoje();

    }


    if (recDataFim) {

      recDataFim.value =
        rec.data_fim || "";

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

        behavior: "smooth",

        block: "start"

      });

    }

  }


  async function alternarStatusRecorrencia(
    id
  ) {

    const rec =
      recorrenciasDados.find(
        item =>
          String(item.id) ===
          String(id)
      );


    if (!rec) {
      return;
    }


    const novoStatus =
      rec.ativo !== true;


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


  async function excluirRecorrencia(id) {

    const rec =
      recorrenciasDados.find(
        item =>
          String(item.id) ===
          String(id)
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
        String(recorrenciaEmEdicao) ===
        String(id)
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

      recDataInicio.value =
        obterDataHoje();

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


  if (listaRecorrencias) {

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


  if (btnCancelarRecorrencia) {

    btnCancelarRecorrencia.addEventListener(
      "click",
      limparFormularioRecorrencia
    );

  }

     
   
