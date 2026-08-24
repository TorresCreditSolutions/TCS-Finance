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
     ELEMENTOS DO DOM
  ====================================================== */

  const loginContainer =
    document.getElementById("login-container");

  const app =
    document.getElementById("app");

  const dashboard =
    document.getElementById("dashboard");

  const lancamentos =
    document.getElementById("lancamentos");

  const nomeCliente =
    document.getElementById("nomeCliente");

  const emailInput =
    document.getElementById("email");

  const senhaInput =
    document.getElementById("senha");

  const aceiteTermos =
    document.getElementById("aceiteTermos");

  const btnLogin =
    document.getElementById("btnLogin");

  const btnCadastro =
    document.getElementById("btnCadastro");

  const btnLogoutTop =
    document.getElementById("btnLogoutTop");

  const btnLogout =
    document.getElementById("btnLogout");

  const btnRelatorios =
    document.getElementById("btnRelatorios");

  const relatorios =
    document.getElementById("relatorios");

  const btnDashboard =
    document.getElementById("btnDashboard");

  const btnLancamentos =
    document.getElementById("btnLancamentos");

  /* ======================================================
     RELATÓRIOS
  ====================================================== */

  if (btnRelatorios) {

    btnRelatorios.onclick = () => {

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

      if (relatorios) {

        relatorios.classList.remove(
          "hidden"
        );

      }

      fecharMenuMobile();

      atualizarRelatorios();

    };

  }

  /* ======================================================
     ELEMENTOS DE LANÇAMENTOS
  ====================================================== */

  const btnSalvar =
    document.getElementById("btnSalvar");

  const tipo =
    document.getElementById("tipo");

  const categoria =
    document.getElementById("categoria");

  const descricao =
    document.getElementById("descricao");

  const valor =
    document.getElementById("valor");

  const dataInput =
    document.getElementById("data");

  const filtroMes =
    document.getElementById("filtroMes");

  const btnLimparFiltro =
    document.getElementById("btnLimparFiltro");

  const totalReceitas =
    document.getElementById("totalReceitas");

  const totalDespesas =
    document.getElementById("totalDespesas");

  const totalInvestimentos =
    document.getElementById(
      "totalInvestimentos"
    );

  const saldo =
    document.getElementById("saldo");

  const lista =
    document.getElementById(
      "listaLancamentos"
    );

  const tipoGrafico =
    document.getElementById(
      "tipoGrafico"
    );

  const btnMenu =
    document.getElementById("btnMenu");

  const sidebar =
    document.querySelector(".sidebar");

  const menuOverlay =
    document.getElementById(
      "menuOverlay"
    );

  const dashboardPeriodo =
    document.getElementById(
      "dashboardPeriodo"
    );

  /* ======================================================
     ATUALIZAR RELATÓRIOS
  ====================================================== */

  function atualizarRelatorios() {

    const filtrados =
      obterDadosFiltrados();

    let receita = 0;
    let despesa = 0;
    let investimento = 0;

    filtrados.forEach(
      lancamento => {

        const valorLancamento =
          Number(
            lancamento.valor
          ) || 0;

        if (
          lancamento.tipo ===
          "Receita"
        ) {

          receita +=
            valorLancamento;

        }

        if (
          lancamento.tipo ===
          "Despesa"
        ) {

          despesa +=
            valorLancamento;

        }

        if (
          lancamento.tipo ===
          "Investimento"
        ) {

          investimento +=
            valorLancamento;

        }

      }
    );

    const saldoAtual =
      receita - despesa;

    const elementos = {

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
          saldoAtual
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
          saldoAtual
        ),

      relatorioPeriodo:
        formatarPeriodo(
          filtroMes?.value || ""
        )

    };

    Object.entries(
      elementos
    ).forEach(
      ([id, texto]) => {

        const elemento =
          document.getElementById(
            id
          );

        if (elemento) {

          elemento.innerText =
            texto;

        }

      }
    );

  }

  /* ======================================================
     FORMATAÇÃO
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

  function formatarNumero(
    valorNumerico
  ) {

    const numero =
      Number(
        valorNumerico
      ) || 0;

    return numero.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2
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
      data.split("-");

    if (
      partes.length !==
      3
    ) {

      return data;

    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  }

  function obterMesAtual() {

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

    return `${ano}-${mes}`;

  }

  function formatarPeriodo(
    mes
  ) {

    if (!mes) {

      return "Todos os períodos";

    }

    const partes =
      mes.split("-");

    if (
      partes.length !==
      2
    ) {

      return mes;

    }

    const ano =
      Number(
        partes[0]
      );

    const numeroMes =
      Number(
        partes[1]
      );

    const data =
      new Date(
        ano,
        numeroMes - 1,
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

  /* ======================================================
     MENU MOBILE
  ====================================================== */

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

    menuOverlay.onclick =
      () => {

        fecharMenuMobile();

      };

  }

  /* ======================================================
     NAVEGAÇÃO
  ====================================================== */

  if (btnDashboard) {

    btnDashboard.onclick =
      () => {

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

    btnLancamentos.onclick =
      () => {

        if (dashboard) {

          dashboard.classList.add(
            "hidden"
          );

        }

        if (lancamentos) {

          lancamentos.classList.remove(
            "hidden"
          );

        }

        fecharMenuMobile();

        renderizarLista();

      };

  }

  /* ======================================================
     LOGOUT
  ====================================================== */

  async function fazerLogout() {

    try {

      await supabase.auth.signOut();

    } catch (erro) {

      console.error(
        "Erro ao fazer logout:",
        erro
      );

    }

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
     CATEGORIAS — SUPABASE
  ====================================================== */

  async function popularCategorias(
    tipoSelecionado,
    categoriaSelecionada = ""
  ) {

    if (!categoria) {

      return;

    }

    categoria.innerHTML =
      "<option value=''>Carregando categorias...</option>";

    if (!tipoSelecionado) {

      categoria.innerHTML =
        "<option value=''>Categoria</option>";

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

        categoria.innerHTML =
          "<option value=''>Sessão expirada</option>";

        console.error(
          "Erro ao identificar usuário:",
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

        categoria.innerHTML =
          "<option value=''>Erro ao carregar categorias</option>";

        return;

      }

      const tipoNormalizado =
        String(
          tipoSelecionado
        )
          .trim()
          .toLowerCase();

      const categorias =
        (data || [])
          .filter(
            cat => {

              if (
                cat.ativa ===
                false
              ) {

                return false;

              }

              const tipoCategoria =
                String(
                  cat.tipo ||
                  ""
                )
                  .trim()
                  .toLowerCase();

              return (
                tipoCategoria ===
                tipoNormalizado
              );

            }
          );

      categoria.innerHTML =
        "<option value=''>Categoria</option>";

      categorias.forEach(
        cat => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            cat.nome ||
            "";

          option.textContent =
            cat.nome ||
            "Categoria";

          if (
            String(
              cat.nome ||
              ""
            ) ===
            String(
              categoriaSelecionada ||
              ""
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
        !categorias.length
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

    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar categorias:",
        erro
      );

      categoria.innerHTML =
        "<option value=''>Erro ao carregar categorias</option>";

    }

  }

  if (tipo) {

    tipo.onchange =
      async () => {

        await popularCategorias(
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
          aceiteTermos &&
          !aceiteTermos.checked
        ) {

          alert(
            "Você precisa aceitar os termos."
          );

          return;

        }

        if (
          !emailInput?.value ||
          !senhaInput?.value
        ) {

          alert(
            "Informe seu email e senha."
          );

          return;

        }

        try {

          const {
            data,
            error
          } =
            await supabase.auth
              .signInWithPassword({

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

        } catch (erro) {

          console.error(
            "Erro no login:",
            erro
          );

          alert(
            "Não foi possível realizar o login."
          );

        }

      };

  }

  /* ======================================================
     CADASTRO
  ====================================================== */

  if (btnCadastro) {

    btnCadastro.onclick =
      async () => {

        if (
          aceiteTermos &&
          !aceiteTermos.checked
        ) {

          alert(
            "Você precisa aceitar os termos."
          );

          return;

        }

        if (
          !emailInput?.value ||
          !senhaInput?.value
        ) {

          alert(
            "Informe email e senha."
          );

          return;

        }

        if (
          senhaInput.value.length <
          6
        ) {

          alert(
            "A senha deve possuir pelo menos 6 caracteres."
          );

          return;

        }

        try {

          const {
            error
          } =
            await supabase.auth
              .signUp({

                email:
                  emailInput.value.trim(),

                password:
                  senhaInput.value,

                options: {

                  data: {

                    nome:
                      emailInput
                        .value
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

        } catch (erro) {

          console.error(
            "Erro no cadastro:",
            erro
          );

          alert(
            "Não foi possível criar a conta."
          );

        }

      };

  }

  /* ======================================================
     INICIAR SESSÃO
  ====================================================== */

  async function iniciarSessao(
    user
  ) {

    if (!user) {

      return;

    }

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

    if (
      filtroMes &&
      !filtroMes.value
    ) {

      filtroMes.value =
        obterMesAtual();

    }

    atualizarPeriodoDashboard();

    await carregarDados();

    if (tipo?.value) {

      await popularCategorias(
        tipo.value
      );

    }

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
      } =
        await supabase
          .from(
            "lancamentos"
          )
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

  /* ======================================================
     SALVAR LANÇAMENTO
  ====================================================== */

  if (btnSalvar) {

    btnSalvar.onclick =
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

          const {
            data: userData,
            error: userError
          } =
            await supabase.auth
              .getUser();

          if (
            userError ||
            !userData?.user
          ) {

            alert(
              "Sua sessão expirou. Faça login novamente."
            );

            return;

          }

          let erroOperacao =
            null;

          if (idEmEdicao) {

            const resultado =
              await supabase
                .from(
                  "lancamentos"
                )
                .update({

                  tipo:
                    tipo.value,

                  categoria:
                    categoria.value,

                  descricao:
                    descricao?.value
                      ?.trim() ||
                    "",

                  valor:
                    valorNumerico,

                  data:
                    dataInput.value

                })
                .eq(
                  "id",
                  idEmEdicao
                );

            erroOperacao =
              resultado.error;

          } else {

            const resultado =
              await supabase
                .from(
                  "lancamentos"
                )
                .insert({

                  user_id:
                    userData.user.id,

                  tipo:
                    tipo.value,

                  categoria:
                    categoria.value,

                  descricao:
                    descricao?.value
                      ?.trim() ||
                    "",

                  valor:
                    valorNumerico,

                  data:
                    dataInput.value

                });

            erroOperacao =
              resultado.error;

          }

          if (erroOperacao) {

            console.error(
              "Erro ao salvar:",
              erroOperacao
            );

            alert(
              `Não foi possível salvar o lançamento.\n\n${erroOperacao.message || ""}`
            );

            return;

          }

          idEmEdicao =
            null;

          await carregarDados();

          atualizarDashboard();

          renderizarLista();

          limparFormulario();

          alert(
            "Lançamento salvo com sucesso!"
          );

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

    idEmEdicao =
      null;

    if (tipo) {

      tipo.value =
        "";

    }

    if (categoria) {

      categoria.innerHTML =
        "<option value=''>Categoria</option>";

    }

    if (valor) {

      valor.value =
        "";

    }

    if (descricao) {

      descricao.value =
        "";

    }

    if (dataInput) {

      dataInput.value =
        obterDataHoje();

    }

  }

   /* ======================================================
     DATA ATUAL
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
     NORMALIZAÇÃO
  ====================================================== */

  function normalizarTipoCategoria(
    valor
  ) {

    const texto =
      String(
        valor ||
        ""
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

    return valor || "";

  }


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


  /* ======================================================
     FILTRO
  ====================================================== */

  function obterDadosFiltrados() {

    if (
      !filtroMes?.value
    ) {

      return [
        ...dados
      ];

    }

    return dados.filter(
      item => {

        const data =
          String(
            item.data ||
            ""
          );

        return data.startsWith(
          filtroMes.value
        );

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

        const valorItem =
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
            valorItem;

        }


        if (
          tipoItem ===
          "Despesa"
        ) {

          despesa +=
            valorItem;

        }


        if (
          tipoItem ===
          "Investimento"
        ) {

          investimento +=
            valorItem;

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


  /* ======================================================
     DESTRUIR GRÁFICO
  ====================================================== */

  function destruirGrafico(
    referencia
  ) {

    if (
      referencia
    ) {

      try {

        referencia.destroy();

      } catch (erro) {

        console.warn(
          "Não foi possível destruir o gráfico anterior:",
          erro
        );

      }

    }

  }


  /* ======================================================
     GRÁFICO PRINCIPAL
  ====================================================== */

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

          const categoriaItem =
            item.categoria ||
            "Sem categoria";


          const valorItem =
            Number(
              item.valor
            ) || 0;


          mapa[
            categoriaItem
          ] =
            (
              mapa[
                categoriaItem
              ] ||
              0
            ) +
            valorItem;

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


    if (
      !labels.length
    ) {

      labels = [
        "Sem dados"
      ];

      valores = [
        0
      ];

    }


    grafico =
      new Chart(
        canvas,
        {

          type:
            "doughnut",

          data: {

            labels:
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

            animation:
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


  /* ======================================================
     GRÁFICO MENSAL
  ====================================================== */

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


        const valorItem =
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
            valorItem;

        }


        if (
          tipoItem ===
          "Despesa"
        ) {

          mapa[mes].despesa +=
            valorItem;

        }

      }
    );


    const labels =
      Object.keys(
        mapa
      ).sort();


    if (
      !labels.length
    ) {

      labels.push(
        "Sem dados"
      );

      mapa[
        "Sem dados"
      ] = {

        receita:
          0,

        despesa:
          0

      };

    }


    graficoMensal =
      new Chart(
        canvas,
        {

          type:
            "bar",

          data: {

            labels:
              labels,

            datasets: [

              {

                label:
                  "Receitas",

                data:
                  labels.map(
                    mes =>
                      mapa[
                        mes
                      ].receita
                  )

              },

              {

                label:
                  "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[
                        mes
                      ].despesa
                  )

              }

            ]

          },

          options: {

            responsive:
              false,

            maintainAspectRatio:
              false,

            animation:
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


  /* ======================================================
     GRÁFICO COMPARATIVO
     
     CORREÇÃO PRINCIPAL:
     - responsive:false
     - animation:false
     - sem loop de redimensionamento
  ====================================================== */

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


        const valorItem =
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
            valorItem;

        }


        if (
          tipoItem ===
          "Despesa"
        ) {

          mapa[mes].despesa +=
            valorItem;

        }

      }
    );


    const labels =
      Object.keys(
        mapa
      ).sort();


    if (
      !labels.length
    ) {

      labels.push(
        "Sem dados"
      );

      mapa[
        "Sem dados"
      ] = {

        receita:
          0,

        despesa:
          0

      };

    }


    graficoComparativo =
      new Chart(
        canvas,
        {

          type:
            "line",

          data: {

            labels:
              labels,

            datasets: [

              {

                label:
                  "Receitas",

                data:
                  labels.map(
                    mes =>
                      mapa[
                        mes
                      ].receita
                  ),

                tension:
                  0.25,

                pointRadius:
                  3,

                fill:
                  false

              },

              {

                label:
                  "Despesas",

                data:
                  labels.map(
                    mes =>
                      mapa[
                        mes
                      ].despesa
                  ),

                tension:
                  0.25,

                pointRadius:
                  3,

                fill:
                  false

              }

            ]

          },

          options: {

            responsive:
              false,

            maintainAspectRatio:
              false,

            animation:
              false,

            resizeDelay:
              0,

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


  /* ======================================================
     EVENTO DO TIPO DE GRÁFICO
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
     FILTRO MENSAL
  ====================================================== */

  if (filtroMes) {

    filtroMes.addEventListener(
      "change",
      () => {

        atualizarDashboard();

        renderizarLista();

      }
    );

  }


  /* ======================================================
     LIMPAR FILTRO
  ====================================================== */

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
     LISTA DE LANÇAMENTOS
  ====================================================== */

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
                  normalizarTipoCategoria(
                    item.tipo
                  )
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


  /* ======================================================
     EDITAR LANÇAMENTO
  ====================================================== */

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


    idEmEdicao =
      item.id;


    if (tipo) {

      tipo.value =
        normalizarTipoCategoria(
          item.tipo
        );

      await popularCategorias(
        tipo.value,
        item.categoria
      );

    }


    if (descricao) {

      descricao.value =
        item.descricao ||
        "";

    }


    if (valor) {

      valor.value =
        String(
          item.valor ??
          ""
        ).replace(
          ".",
          ","
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


    if (lancamentos) {

      lancamentos.classList.remove(
        "hidden"
      );

    }


    if (dashboard) {

      dashboard.classList.add(
        "hidden"
      );

    }


    window.scrollTo({

      top:
        0,

      behavior:
        "smooth"

    });

  }


  /* ======================================================
     EXCLUIR LANÇAMENTO
  ====================================================== */

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
          item.categoria ||
          "sem descrição"
        }"?`
      );


    if (!confirmado) {

      return;

    }


    try {

      const {
        data: userData,
        error: userError
      } =
        await supabase.auth
          .getUser();


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
            "lancamentos"
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
          "Erro ao excluir lançamento:",
          error
        );

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
        "Erro inesperado ao excluir:",
        erro
      );

      alert(
        "Ocorreu um erro ao excluir o lançamento."
      );

    }

  }


  /* ======================================================
     EVENTOS DA LISTA
  ====================================================== */

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
     MÁSCARA DE VALOR
  ====================================================== */

  if (valor) {

    valor.addEventListener(
      "input",
      () => {

        let texto =
          valor.value
            .replace(
              /\D/g,
              ""
            );


        if (!texto) {

          valor.value =
            "";

          return;

        }


        const numero =
          Number(
            texto
          ) / 100;


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
     FINALIZAÇÃO DO SCRIPT
  ====================================================== */

  console.log(
    "TCS Finance finalizado."
  );

});
                          
