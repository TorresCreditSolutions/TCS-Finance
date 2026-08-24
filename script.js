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
     AGORA CARREGADAS DO SUPABASE
  ====================================================== */

  let categoriasFinanceiras = [];

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

    const numero =
      Number(valorNumerico) || 0;

    return numero.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

  }

  function formatarNumero(valorNumerico) {

    const numero =
      Number(valorNumerico) || 0;

    return numero.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

  }

  function formatarData(data) {

    if (!data) return "";

    const partes =
      data.split("-");

    if (partes.length !== 3) {
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

  function formatarPeriodo(mes) {

    if (!mes) {
      return "Todos os períodos";
    }

    const partes =
      mes.split("-");

    if (partes.length !== 2) {
      return mes;
    }

    const ano =
      Number(partes[0]);

    const numeroMes =
      Number(partes[1]);

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
     CATEGORIAS
     BUSCA DINÂMICA NO SUPABASE
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

        console.error(
          "Usuário não autenticado para carregar categorias:",
          userError
        );

        categoriasFinanceiras = [];

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
              ascending: true
            }
          );

      if (error) {

        console.error(
          "Erro ao carregar categorias financeiras:",
          error
        );

        categoriasFinanceiras = [];

        return;

      }

      categoriasFinanceiras =
        data || [];

      console.log(
        "Categorias financeiras carregadas:",
        categoriasFinanceiras
      );

    } catch (erro) {

      console.error(
        "Erro inesperado ao carregar categorias:",
        erro
      );

      categoriasFinanceiras = [];

    }

  }

  /* ======================================================
     POPULAR CATEGORIAS
  ====================================================== */

  function popularCategorias(
    tipoSelecionado,
    categoriaSelecionada = ""
  ) {

    if (!categoria) {
      return;
    }

    categoria.innerHTML =
      "<option value=''>Categoria</option>";

    if (!tipoSelecionado) {
      return;
    }

    const tipoNormalizado =
      String(
        tipoSelecionado
      )
        .trim()
        .toLowerCase();

    const categoriasFiltradas =
      categoriasFinanceiras.filter(
        cat => {

          if (
            cat.ativa === false
          ) {

            return false;

          }

          const tipoCategoria =
            String(
              cat.tipo || ""
            )
              .trim()
              .toLowerCase();

          return (
            tipoCategoria ===
            tipoNormalizado
          );

        }
      );

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
          String(cat.id) ===
          String(categoriaSelecionada)
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
      categoriasFiltradas.length ===
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

  if (tipo) {

    tipo.onchange = () => {

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
          await supabase.auth
            .signUp({

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

    /*
      PRIMEIRO CARREGAMOS AS CATEGORIAS
      DO USUÁRIO.
    */

    await carregarCategoriasFinanceiras();

    /*
      DEPOIS CARREGAMOS OS LANÇAMENTOS.
    */

    await carregarDados();

    if (
      filtroMes &&
      !filtroMes.value
    ) {

      filtroMes.value =
        obterMesAtual();

    }

    atualizarPeriodoDashboard();

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
          .from("lancamentos")
          .select("*")
          .order(
            "data",
            {
              ascending: false
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
            String(
              valor.value
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
          planoUsuario === "FREE" &&
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
                    descricao.value.trim(),

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
                    descricao.value.trim(),

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
              "Não foi possível salvar o lançamento."
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
        "";

    }

    if (btnSalvar) {

      btnSalvar.innerText =
        "Salvar";

    }

  }

  /* ======================================================
     FILTRO
  ====================================================== */

  function obterDadosFiltrados() {

    let filtrados =
      [...dados];

    if (
      filtroMes &&
      filtroMes.value
    ) {

      filtrados =
        filtrados.filter(
          l => {

            if (!l.data) {
              return false;
            }

            return l.data.startsWith(
              filtroMes.value
            );

          }
        );

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

    btnLimparFiltro.onclick =
      () => {

        filtroMes.value =
          "";

        atualizarPeriodoDashboard();

        atualizarDashboard();

      };

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

        alert(
          "A senha deve possuir pelo menos 6 caracteres."
        );

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

                data: dataInput.value

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

                data: dataInput.value

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
  ====================================================== */

  function renderizarGraficoComparativo(
    dadosFiltrados
  ) {

    const canvas =
      document.getElementById(
        "graficoComparativo"
      );

    if (!canvas) return;

    if (graficoComparativo) {

      graficoComparativo.destroy();

      graficoComparativo = null;

    }

    const meses = {};

    dadosFiltrados.forEach(l => {

      if (!l.data) return;

      const mes =
        l.data.slice(0, 7);

      if (!meses[mes]) {

        meses[mes] = {

          receita: 0,

          despesa: 0,

          investimento: 0

        };

      }

      const valorLancamento =
        Number(l.valor) || 0;

      if (l.tipo === "Receita") {

        meses[mes].receita +=
          valorLancamento;

      }

      if (l.tipo === "Despesa") {

        meses[mes].despesa +=
          valorLancamento;

      }

      if (l.tipo === "Investimento") {

        meses[mes].investimento +=
          valorLancamento;

      }

    });

    const labels =
      Object.keys(meses).sort();

    if (labels.length === 0) {

      return;

    }

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
                      meses[mes].receita
                  ),

                tension: 0.3,

                borderWidth: 2

              },

              {

                label: "Despesas",

                data:
                  labels.map(
                    mes =>
                      meses[mes].despesa
                  ),

                tension: 0.3,

                borderWidth: 2

              },

              {

                label: "Investimentos",

                data:
                  labels.map(
                    mes =>
                      meses[mes].investimento
                  ),

                tension: 0.3,

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
     ALTERAÇÃO DO TIPO DE GRÁFICO
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
     RENDERIZAR LISTA DE LANÇAMENTOS
  ====================================================== */

  function renderizarLista() {

    if (!lista) return;

    const filtrados =
      obterDadosFiltrados();

    lista.innerHTML = "";

    if (
      filtrados.length === 0
    ) {

      lista.innerHTML = `
        <div class="sem-lancamentos">
          Nenhum lançamento encontrado.
        </div>
      `;

      return;

    }

    filtrados.forEach(l => {

      const item =
        document.createElement("div");

      item.className =
        "lancamento-item";

      const valorFormatado =
        formatarMoeda(l.valor);

      const dataFormatada =
        formatarData(l.data);

      item.innerHTML = `

        <div class="lancamento-info">

          <strong>
            ${l.descricao || "Sem descrição"}
          </strong>

          <span>
            ${l.tipo}
          </span>

          <small>
            ${dataFormatada}
          </small>

        </div>

        <div class="lancamento-categoria">

          ${l.categoria || "Sem categoria"}

        </div>

        <div class="lancamento-valor">

          ${valorFormatado}

        </div>

        <div class="lancamento-acoes">

          <button
            class="btn-editar"
            data-id="${l.id}"
          >
            Editar
          </button>

          <button
            class="btn-excluir"
            data-id="${l.id}"
          >
            Excluir
          </button>

        </div>

      `;

      lista.appendChild(item);

    });

    configurarAcoesLancamentos();

  }

  /* ======================================================
     AÇÕES DOS LANÇAMENTOS
  ====================================================== */

  function configurarAcoesLancamentos() {

    const botoesEditar =
      document.querySelectorAll(
        ".btn-editar"
      );

    botoesEditar.forEach(
      botao => {

        botao.onclick = () => {

          const id =
            botao.dataset.id;

          editarLancamento(id);

        };

      }
    );

    const botoesExcluir =
      document.querySelectorAll(
        ".btn-excluir"
      );

    botoesExcluir.forEach(
      botao => {

        botao.onclick = () => {

          const id =
            botao.dataset.id;

          excluirLancamento(id);

        };

      }
    );

  }

  /* ======================================================
     EDITAR LANÇAMENTO
  ====================================================== */

  async function editarLancamento(id) {

    const lancamento =
      dados.find(
        l =>
          String(l.id) ===
          String(id)
      );

    if (!lancamento) {

      return;

    }

    idEmEdicao =
      lancamento.id;

    if (tipo) {

      tipo.value =
        lancamento.tipo;

    }

    /*
      Recarrega as categorias do tipo
      selecionado antes de selecionar
      a categoria do lançamento.
    */

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
        lancamento.data || "";

    }

    if (btnSalvar) {

      btnSalvar.innerText =
        "Atualizar";

    }

    dashboard.classList.add(
      "hidden"
    );

    lancamentos.classList.remove(
      "hidden"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
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

      pdf.setFontSize(18);

      pdf.text(
        "TCS Finance",
        20,
        20
      );

      pdf.setFontSize(12);

      pdf.text(
        `Relatório - ${formatarPeriodo(
          filtroMes?.value || ""
        )}`,
        20,
        30
      );

      let y = 45;

      const filtrados =
        obterDadosFiltrados();

      filtrados.forEach(l => {

        const linha =
          `${formatarData(l.data)} - ${l.tipo} - ${l.categoria || "Sem categoria"} - ${formatarMoeda(l.valor)}`;

        pdf.text(
          linha,
          20,
          y
        );

        y += 8;

        if (y > 280) {

          pdf.addPage();

          y = 20;

        }

      });

      pdf.save(
        "relatorio-tcs-finance.pdf"
      );

    };

  }

  /* ======================================================
     EXPORTAÇÃO EXCEL
  ====================================================== */

  const btnExportarExcel =
    document.getElementById(
      "btnExportarExcel"
    );

  if (btnExportarExcel) {

    btnExportarExcel.onclick = () => {

      if (!window.XLSX) {

        alert(
          "Biblioteca Excel não carregada."
        );

        return;

      }

      const dadosExcel =
        obterDadosFiltrados()
          .map(l => ({

            Data:
              formatarData(l.data),

            Tipo:
              l.tipo,

            Categoria:
              l.categoria || "",

            Descrição:
              l.descricao || "",

            Valor:
              Number(l.valor) || 0

          }));

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
        "tcs-finance-lancamentos.xlsx"
      );

    };

  }

  /* ======================================================
     BACKUP JSON
  ====================================================== */

  const btnExportarJson =
    document.getElementById(
      "btnExportarJson"
    );

  if (btnExportarJson) {

    btnExportarJson.onclick = () => {

      const dadosBackup =
        obterDadosFiltrados();

      const blob =
        new Blob(
          [
            JSON.stringify(
              dadosBackup,
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
        document.createElement("a");

      a.href = url;

      a.download =
        "tcs-finance-backup.json";

      document.body.appendChild(a);

      a.click();

      a.remove();

      URL.revokeObjectURL(url);

    };

  }

  /* ======================================================
     IMPORTAÇÃO JSON
  ====================================================== */

  const inputImportarJson =
    document.getElementById(
      "inputImportarJson"
    );

  if (inputImportarJson) {

    inputImportarJson.addEventListener(
      "change",
      event => {

        const arquivo =
          event.target.files?.[0];

        if (!arquivo) return;

        const leitor =
          new FileReader();

        leitor.onload = async e => {

          try {

            const dadosImportados =
              JSON.parse(
                e.target.result
              );

            if (
              !Array.isArray(
                dadosImportados
              )
            ) {

              alert(
                "Arquivo JSON inválido."
              );

              return;

            }

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
                "Usuário não autenticado."
              );

              return;

            }

            const registros =
              dadosImportados.map(
                item => ({

                  user_id:
                    userData.user.id,

                  tipo:
                    item.tipo ||
                    item.Tipo,

                  categoria:
                    item.categoria ||
                    item.Categoria ||
                    "",

                  descricao:
                    item.descricao ||
                    item.Descrição ||
                    "",

                  valor:
                    Number(
                      item.valor ||
                      item.Valor ||
                      0
                    ),

                  data:
                    item.data ||
                    item.Data

                })
              );

            const {
              error
            } =
              await supabase
                .from("lancamentos")
                .insert(
                  registros
                );

            if (error) {

              console.error(
                "Erro ao importar:",
                error
              );

              alert(
                "Erro ao importar dados."
              );

              return;

            }

            await carregarDados();

            atualizarDashboard();

            renderizarLista();

            alert(
              "Backup importado com sucesso!"
            );

          } catch (erro) {

            console.error(
              "Erro ao processar JSON:",
              erro
            );

            alert(
              "Não foi possível processar o arquivo."
            );

          }

        };

        leitor.readAsText(
          arquivo
        );

      }
    );

  }
      /* --------------------------------------------------
       ADICIONAR CATEGORIAS AO SELECT
    -------------------------------------------------- */

    categorias.forEach(cat => {

      const option =
        document.createElement("option");

      option.value =
        cat.id;

      option.textContent =
        cat.nome;

      if (
        String(cat.id) ===
        String(categoriaSelecionada)
      ) {

        option.selected =
          true;

      }

      recCategoria.appendChild(
        option
      );

    });

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
      "Erro inesperado ao carregar categorias:",
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
    () => {

      carregarCategoriasRecorrencia(
        recTipo.value
      );

    }
  );

}


/* ======================================================
   CARREGAR RECORRÊNCIAS
====================================================== */

async function carregarRecorrencias() {

  if (!listaRecorrencias) {
    return;
  }

  try {

    const {
      data,
      error
    } = await supabase
      .from("lancamentos_recorrentes")
      .select("*")
      .order(
        "data_inicio",
        {
          ascending: true
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


/* ======================================================
   RENDERIZAR RECORRÊNCIAS
====================================================== */

function renderizarRecorrencias() {

  if (!listaRecorrencias) {
    return;
  }

  listaRecorrencias.innerHTML =
    "";

  const total =
    recorrenciasDados.length;

  const ativas =
    recorrenciasDados.filter(
      r => r.ativo === true
    ).length;

  const pausadas =
    recorrenciasDados.filter(
      r => r.ativo === false
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
      `${total} recorrência${total === 1 ? "" : "s"}`;

  }

  if (total === 0) {

    listaRecorrencias.innerHTML = `

      <div class="sem-recorrencias">

        <div class="sem-recorrencias-icon">
          🔄
        </div>

        <strong>
          Nenhuma recorrência cadastrada
        </strong>

        <span>
          Cadastre uma receita, despesa ou investimento recorrente.
        </span>

      </div>

    `;

    return;

  }

  recorrenciasDados.forEach(
    recorrencia => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "recorrencia-card";

      if (
        recorrencia.ativo === false
      ) {

        card.classList.add(
          "pausada"
        );

      }

      const valor =
        formatarMoeda(
          recorrencia.valor
        );

      const tipo =
        recorrencia.tipo ||
        "";

      const categoria =
        recorrencia.categoria_nome ||
        recorrencia.categoria ||
        "Sem categoria";

      const frequencia =
        nomesFrequencia[
          recorrencia.frequencia
        ] ||
        recorrencia.frequencia ||
        "";

      const descricao =
        recorrencia.descricao ||
        "Sem descrição";

      const dia =
        recorrencia.dia_vencimento ||
        "";

      const ativo =
        recorrencia.ativo !== false;

      card.innerHTML = `

        <div class="recorrencia-card-top">

          <div class="recorrencia-tipo">

            <span class="recorrencia-tipo-label">
              ${tipo}
            </span>

            <span class="recorrencia-status ${
              ativo
                ? "ativo"
                : "pausado"
            }">

              ${
                ativo
                  ? "Ativa"
                  : "Pausada"
              }

            </span>

          </div>

          <div class="recorrencia-valor">

            ${valor}

          </div>

        </div>


        <div class="recorrencia-descricao">

          ${descricao}

        </div>


        <div class="recorrencia-detalhes">

          <div>

            <small>
              Categoria
            </small>

            <strong>
              ${categoria}
            </strong>

          </div>


          <div>

            <small>
              Frequência
            </small>

            <strong>
              ${frequencia}
            </strong>

          </div>


          <div>

            <small>
              Dia
            </small>

            <strong>
              ${dia || "-"}
            </strong>

          </div>

        </div>


        <div class="recorrencia-acoes">

          <button
            type="button"
            class="btn-rec-editar"
            data-id="${recorrencia.id}"
          >
            ✏️ Editar
          </button>


          <button
            type="button"
            class="btn-rec-toggle"
            data-id="${recorrencia.id}"
          >

            ${
              ativo
                ? "⏸ Pausar"
                : "▶ Ativar"
            }

          </button>


          <button
            type="button"
            class="btn-rec-excluir"
            data-id="${recorrencia.id}"
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

  configurarAcoesRecorrencias();

}


/* ======================================================
   AÇÕES DAS RECORRÊNCIAS
====================================================== */

function configurarAcoesRecorrencias() {

  const botoesEditar =
    document.querySelectorAll(
      ".btn-rec-editar"
    );

  botoesEditar.forEach(
    botao => {

      botao.onclick = () => {

        editarRecorrencia(
          botao.dataset.id
        );

      };

    }
  );


  const botoesToggle =
    document.querySelectorAll(
      ".btn-rec-toggle"
    );

  botoesToggle.forEach(
    botao => {

      botao.onclick = () => {

        alternarRecorrencia(
          botao.dataset.id
        );

      };

    }
  );


  const botoesExcluir =
    document.querySelectorAll(
      ".btn-rec-excluir"
    );

  botoesExcluir.forEach(
    botao => {

      botao.onclick = () => {

        excluirRecorrencia(
          botao.dataset.id
        );

      };

    }
  );

}


/* ======================================================
   EDITAR RECORRÊNCIA
====================================================== */

async function editarRecorrencia(id) {

  const recorrencia =
    recorrenciasDados.find(
      r =>
        String(r.id) ===
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

  if (tituloFormularioRecorrencia) {

    tituloFormularioRecorrencia.innerText =
      "Editar recorrência";

  }

  if (recTipo) {

    recTipo.value =
      recorrencia.tipo || "";

  }

  await carregarCategoriasRecorrencia(
    recorrencia.tipo,
    recorrencia.categoria_id ||
    recorrencia.categoria
  );

  if (recDescricao) {

    recDescricao.value =
      recorrencia.descricao || "";

  }

  if (recValor) {

    recValor.value =
      recorrencia.valor || "";

  }

  if (recFrequencia) {

    recFrequencia.value =
      recorrencia.frequencia || "";

  }

  if (recDiaVencimento) {

    recDiaVencimento.value =
      recorrencia.dia_vencimento || "";

  }

  if (recDataInicio) {

    recDataInicio.value =
      recorrencia.data_inicio || "";

  }

  if (recDataFim) {

    recDataFim.value =
      recorrencia.data_fim || "";

  }

  if (btnSalvarRecorrencia) {

    btnSalvarRecorrencia.innerText =
      "Atualizar recorrência";

  }

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* ======================================================
   CANCELAR EDIÇÃO
====================================================== */

function cancelarEdicaoRecorrencia() {

  recorrenciaEmEdicao =
    null;

  if (tituloFormularioRecorrencia) {

    tituloFormularioRecorrencia.innerText =
      "Nova recorrência";

  }

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

  if (btnSalvarRecorrencia) {

    btnSalvarRecorrencia.innerText =
      "Salvar recorrência";

  }

}


if (btnCancelarRecorrencia) {

  btnCancelarRecorrencia.onclick =
    () => {

      cancelarEdicaoRecorrencia();

    };

}


/* ======================================================
   SALVAR RECORRÊNCIA
====================================================== */

if (btnSalvarRecorrencia) {

  btnSalvarRecorrencia.onclick =
    async () => {

      if (
        !recTipo?.value ||
        !recCategoria?.value ||
        !recDescricao?.value ||
        !recValor?.value ||
        !recFrequencia?.value ||
        !recDataInicio?.value
      ) {

        alert(
          "Preencha todos os campos obrigatórios."
        );

        return;

      }

      const valorNumerico =
        Number(
          String(
            recValor.value
          )
            .replace(",", ".")
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

        const categoriaSelecionada =
          categoriasFinanceiras.find(
            cat =>
              String(cat.id) ===
              String(recCategoria.value)
          );

        const dadosRecorrencia = {

          user_id:
            userData.user.id,

          tipo:
            recTipo.value,

          categoria_id:
            recCategoria.value,

          categoria:
            categoriaSelecionada?.nome ||
            "",

          descricao:
            recDescricao.value.trim(),

          valor:
            valorNumerico,

          frequencia:
            recFrequencia.value,

          dia_vencimento:
            recDiaVencimento.value
              ? Number(
                  recDiaVencimento.value
                )
              : null,

          data_inicio:
            recDataInicio.value,

          data_fim:
            recDataFim.value ||
            null

        };

        let erroOperacao = null;

        if (recorrenciaEmEdicao) {

          const resultado =
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
              );

          erroOperacao =
            resultado.error;

        } else {

          const resultado =
            await supabase
              .from(
                "lancamentos_recorrentes"
              )
              .insert(
                dadosRecorrencia
              );

          erroOperacao =
            resultado.error;

        }

        if (erroOperacao) {

          console.error(
            "Erro ao salvar recorrência:",
            erroOperacao
          );

          alert(
            "Não foi possível salvar a recorrência."
          );

          return;

        }

        alert(
          recorrenciaEmEdicao
            ? "Recorrência atualizada com sucesso!"
            : "Recorrência criada com sucesso!"
        );

        cancelarEdicaoRecorrencia();

        await carregarRecorrencias();

      } catch (erro) {

        console.error(
          "Erro inesperado:",
          erro
        );

        alert(
          "Ocorreu um erro ao salvar a recorrência."
        );

      }

    };

}
    /* --------------------------------------------------
       CRIAR OPTIONS
    -------------------------------------------------- */

    categorias.forEach(
      cat => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          cat.id;

        option.textContent =
          cat.nome ||
          "Categoria";

        if (
          String(cat.id) ===
          String(categoriaSelecionada)
        ) {

          option.selected = true;

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

      option.value = "";

      option.textContent =
        "Nenhuma categoria cadastrada";

      option.disabled = true;

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

/* ======================================================
   ALTERAÇÃO DO TIPO
====================================================== */

if (recTipo) {

  recTipo.onchange = async () => {

    await carregarCategoriasRecorrencia(
      recTipo.value
    );

  };

}


/* ======================================================
   CARREGAR RECORRÊNCIAS
====================================================== */

async function carregarRecorrencias() {

  if (!listaRecorrencias) return;

  listaRecorrencias.innerHTML = `
    <div class="recorrencias-vazio">
      <div class="recorrencias-vazio-icone">↻</div>
      <strong>Carregando recorrências...</strong>
      <p>Aguarde enquanto buscamos seus lançamentos automáticos.</p>
    </div>
  `;

  try {

    const {
      data: userData,
      error: userError
    } = await supabase.auth.getUser();

    if (
      userError ||
      !userData?.user
    ) {

      listaRecorrencias.innerHTML = `
        <div class="recorrencias-vazio">
          <div class="recorrencias-vazio-icone">🔒</div>
          <strong>Sessão expirada</strong>
          <p>Faça login novamente para acessar suas recorrências.</p>
        </div>
      `;

      return;

    }

    const {
      data,
      error
    } = await supabase
      .from("lancamentos_recorrentes")
      .select("*")
      .eq(
        "user_id",
        userData.user.id
      )
      .order("data_inicio", {
        ascending: false
      });

    if (error) {

      console.error(
        "Erro ao carregar recorrências:",
        error
      );

      listaRecorrencias.innerHTML = `
        <div class="recorrencias-vazio">
          <div class="recorrencias-vazio-icone">⚠️</div>
          <strong>Não foi possível carregar</strong>
          <p>${escapeHtml(error.message)}</p>
        </div>
      `;

      return;

    }

    recorrenciasDados =
      data || [];

    await carregarNomesCategorias();

    renderizarRecorrencias();

  } catch (erro) {

    console.error(
      "Erro inesperado nas recorrências:",
      erro
    );

    listaRecorrencias.innerHTML = `
      <div class="recorrencias-vazio">
        <div class="recorrencias-vazio-icone">⚠️</div>
        <strong>Erro inesperado</strong>
        <p>Não foi possível carregar suas recorrências.</p>
      </div>
    `;

  }

}


/* ======================================================
   NOMES DAS CATEGORIAS
====================================================== */

let categoriasRecorrenciaMapa = {};


async function carregarNomesCategorias() {

  categoriasRecorrenciaMapa = {};

  if (
    !recorrenciasDados.length
  ) {
    return;
  }

  try {

    const ids =
      recorrenciasDados
        .map(item => item.categoria_id)
        .filter(Boolean);

    if (!ids.length) {
      return;
    }

    const {
      data,
      error
    } = await supabase
      .from("categorias_financeiras")
      .select("id,nome")
      .in("id", ids);

    if (error) {

      console.warn(
        "Não foi possível carregar nomes das categorias:",
        error
      );

      return;

    }

    (data || []).forEach(cat => {

      categoriasRecorrenciaMapa[
        cat.id
      ] = cat.nome;

    });

  } catch (erro) {

    console.warn(
      "Erro ao carregar nomes das categorias:",
      erro
    );

  }

}


/* ======================================================
   ESCAPAR HTML
====================================================== */

function escapeHtml(valor) {

  return String(
    valor ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* ======================================================
   PRÓXIMA DATA
====================================================== */

function calcularProximoLancamento(
  recorrencia
) {

  if (!recorrencia) {
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

  const dataInicio =
    recorrencia.data_inicio
      ? new Date(
          `${recorrencia.data_inicio}T00:00:00`
        )
      : hoje;

  dataInicio.setHours(
    0,
    0,
    0,
    0
  );

  let data =
    new Date(dataInicio);

  const dia =
    Number(
      recorrencia.dia_vencimento
    );

  const frequencia =
    recorrencia.frequencia;

  if (
    frequencia === "diaria"
  ) {

    data = new Date(
      Math.max(
        hoje.getTime(),
        dataInicio.getTime()
      )
    );

    if (
      data < hoje
    ) {

      data.setDate(
        data.getDate() + 1
      );

    }

  } else if (
    frequencia === "semanal"
  ) {

    while (
      data < hoje
    ) {

      data.setDate(
        data.getDate() + 7
      );

    }

  } else if (
    frequencia === "quinzenal"
  ) {

    while (
      data < hoje
    ) {

      data.setDate(
        data.getDate() + 15
      );

    }

  } else {

    const mesesPorFrequencia = {

      mensal: 1,
      bimestral: 2,
      trimestral: 3,
      semestral: 6,
      anual: 12

    };

    const intervalo =
      mesesPorFrequencia[
        frequencia
      ] || 1;

    const anoInicial =
      dataInicio.getFullYear();

    const mesInicial =
      dataInicio.getMonth();

    let ano =
      anoInicial;

    let mes =
      mesInicial;

    if (
      Number.isFinite(dia) &&
      dia >= 1 &&
      dia <= 31
    ) {

      data =
        criarDataSegura(
          ano,
          mes,
          dia
        );

    }

    while (
      data < hoje
    ) {

      mes += intervalo;

      data =
        criarDataSegura(
          ano,
          mes,
          dia || 1
        );

    }

  }

  if (
    recorrencia.data_fim
  ) {

    const dataFim =
      new Date(
        `${recorrencia.data_fim}T00:00:00`
      );

    if (
      data > dataFim
    ) {

      return null;

    }

  }

  return data;

}


/* ======================================================
   CRIAR DATA SEGURA
====================================================== */

function criarDataSegura(
  ano,
  mes,
  dia
) {

  const primeiroDia =
    new Date(
      ano,
      mes,
      1
    );

  const ultimoDia =
    new Date(
      ano,
      mes + 1,
      0
    ).getDate();

  const diaSeguro =
    Math.min(
      Math.max(
        Number(dia) || 1,
        1
      ),
      ultimoDia
    );

  return new Date(
    primeiroDia.getFullYear(),
    primeiroDia.getMonth(),
    diaSeguro
  );

}


/* ======================================================
   RENDERIZAR RECORRÊNCIAS
====================================================== */
function renderizarRecorrencias() {

  if (!listaRecorrencias) {
    return;
  }

  const total =
    recorrenciasDados.length;

  const ativas =
    recorrenciasDados.filter(
      item => item.ativo === true
    ).length;

  const pausadas =
    total - ativas;

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
      total === 0
        ? "Nenhuma recorrência cadastrada."
        : `${total} ${
            total === 1
              ? "recorrência cadastrada"
              : "recorrências cadastradas"
          }.`;

  }

  if (!total) {

    listaRecorrencias.innerHTML = `
      <div class="recorrencias-vazio">

        <div class="recorrencias-vazio-icone">
          ↻
        </div>

        <strong>
          Nenhuma recorrência cadastrada
        </strong>

        <p>
          Cadastre sua primeira receita,
          despesa ou investimento automático
          usando o formulário acima.
        </p>

      </div>
    `;

    return;

  }

  listaRecorrencias.innerHTML = "";

  recorrenciasDados.forEach(
    recorrencia => {

      const categoriaNome =
        categoriasRecorrenciaMapa[
          recorrencia.categoria_id
        ] ||
        "Sem categoria";

      const proximo =
        calcularProximoLancamento(
          recorrencia
        );

      const statusAtivo =
        recorrencia.ativo === true;

      let icone =
        "↻";

      if (
        recorrencia.tipo === "Receita"
      ) {
        icone = "↑";
      }

      if (
        recorrencia.tipo === "Despesa"
      ) {
        icone = "↓";
      }

      if (
        recorrencia.tipo === "Investimento"
      ) {
        icone = "◔";
      }

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "recorrencia-item";

      card.innerHTML = `

        <div class="recorrencia-item-topo">

          <div class="recorrencia-item-identificacao">

            <div class="recorrencia-item-icone">
              ${icone}
            </div>

            <div class="recorrencia-item-titulo">

              <strong>
                ${escapeHtml(
                  recorrencia.descricao ||
                  "Recorrência sem descrição"
                )}
              </strong>

              <span>
                ${escapeHtml(
                  recorrencia.tipo ||
                  ""
                )}
                •
                ${escapeHtml(
                  categoriaNome
                )}
              </span>

            </div>

          </div>


          <span
            class="recorrencia-status ${
              statusAtivo
                ? "ativa"
                : "pausada"
            }"
          >
            ${statusAtivo
              ? "● Ativa"
              : "● Pausada"}
          </span>

        </div>


        <div class="recorrencia-item-valor">

          ${formatarMoeda(
            recorrencia.valor
          )}

        </div>


        <div class="recorrencia-item-info">

          <div class="recorrencia-item-info-bloco">

            <span>FREQUÊNCIA</span>

            <strong>
              ${
                nomesFrequencia[
                  recorrencia.frequencia
                ] ||
                recorrencia.frequencia ||
                "-"
              }
            </strong>

          </div>


          <div class="recorrencia-item-info-bloco">

            <span>DIA</span>

            <strong>
              ${
                recorrencia.dia_vencimento ||
                "-"
              }
            </strong>

          </div>


          <div class="recorrencia-item-info-bloco">

            <span>INÍCIO</span>

            <strong>
              ${
                recorrencia.data_inicio
                  ? formatarData(
                      recorrencia.data_inicio
                    )
                  : "-"
              }
            </strong>

          </div>


          <div class="recorrencia-item-info-bloco">

            <span>TÉRMINO</span>

            <strong>
              ${
                recorrencia.data_fim
                  ? formatarData(
                      recorrencia.data_fim
                    )
                  : "Sem término"
              }
            </strong>

          </div>

        </div>


        <div class="recorrencia-proximo">

          <span>
            PRÓXIMO LANÇAMENTO
          </span>

          <strong>
            ${
              statusAtivo && proximo
                ? formatarDataISO(
                    proximo
                  )
                : statusAtivo
                  ? "Sem próxima ocorrência"
                  : "Recorrência pausada"
            }
          </strong>

        </div>


        <div class="recorrencia-item-acoes">

          <button
            type="button"
            class="acao-editar"
            data-id="${recorrencia.id}"
          >
            ✏️ Editar
          </button>

          <button
            type="button"
            class="acao-pausar"
            data-id="${recorrencia.id}"
          >
            ${
              statusAtivo
                ? "⏸ Pausar"
                : "▶ Reativar"
            }
          </button>

          <button
            type="button"
            class="acao-excluir"
            data-id="${recorrencia.id}"
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


/* ======================================================
   FORMATAR DATA DE OBJETO DATE
====================================================== */

function formatarDataISO(
  data
) {

  if (!data) return "";

  const dia =
    String(
      data.getDate()
    ).padStart(
      2,
      "0"
    );

  const mes =
    String(
      data.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const ano =
    data.getFullYear();

  return `${dia}/${mes}/${ano}`;

}


/* ======================================================
   SALVAR RECORRÊNCIA
====================================================== */

if (btnSalvarRecorrencia) {

  btnSalvarRecorrencia.onclick =
    async () => {

      if (
        !recTipo?.value ||
        !recCategoria?.value ||
        !recDescricao?.value.trim() ||
        !recValor?.value ||
        !recFrequencia?.value ||
        !recDataInicio?.value
      ) {

        alert(
          "Preencha tipo, categoria, descrição, valor, frequência e data de início."
        );

        return;

      }


      const valorNumerico =
        Number(
          String(
            recValor.value
          ).replace(
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


      const dia =
        Number(
          recDiaVencimento.value
        );


      if (
        recFrequencia.value === "mensal" ||
        recFrequencia.value === "bimestral" ||
        recFrequencia.value === "trimestral" ||
        recFrequencia.value === "semestral" ||
        recFrequencia.value === "anual"
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
        recDataFim.value &&
        recDataFim.value <
          recDataInicio.value
      ) {

        alert(
          "A data de término não pode ser anterior à data de início."
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


        const dadosRecorrencia = {

          user_id:
            userData.user.id,

          tipo:
            recTipo.value,

          categoria_id:
            recCategoria.value,

          descricao:
            recDescricao.value.trim(),

          valor:
            valorNumerico,

          frequencia:
            recFrequencia.value,

          dia_vencimento:
            Number.isInteger(dia)
              ? dia
              : null,

          data_inicio:
            recDataInicio.value,

          data_fim:
            recDataFim.value ||
            null,

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

          resultado =
            await supabase
              .from(
                "lancamentos_recorrentes"
              )
              .insert(
                dadosRecorrencia
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

    };

}


/* ======================================================
   EVENTOS DA LISTA DE RECORRÊNCIAS
====================================================== */

if (listaRecorrencias) {

  listaRecorrencias.addEventListener(
    "click",
    async event => {

      const btnEditar =
        event.target.closest(
          ".acao-editar"
        );

      const btnPausar =
        event.target.closest(
          ".acao-pausar"
        );

      const btnExcluir =
        event.target.closest(
          ".acao-excluir"
        );


      if (btnEditar) {

        await editarRecorrencia(
          btnEditar.dataset.id
        );

        return;

      }


      if (btnPausar) {

        await alternarStatusRecorrencia(
          btnPausar.dataset.id
        );

        return;

      }


      if (btnExcluir) {

        await excluirRecorrencia(
          btnExcluir.dataset.id
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
      recorrencia.tipo || "";

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
      "";

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


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ======================================================
   PAUSAR / REATIVAR
====================================================== */

async function alternarStatusRecorrencia(
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
    recorrencia.ativo !== true;


  const acao =
    novoStatus
      ? "reativar"
      : "pausar";


  const confirmar =
    confirm(
      `Deseja ${acao} a recorrência "${recorrencia.descricao || "sem descrição"}"?`
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
        "Sua sessão expirou."
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


    if (error) {

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
      "Erro inesperado:",
      erro
    );

    alert(
      "Ocorreu um erro ao alterar o status."
    );

  }

}


/* ======================================================
   EXCLUIR RECORRÊNCIA
====================================================== */

async function excluirRecorrencia(
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


  const confirmar =
    confirm(
      `Tem certeza que deseja excluir a recorrência "${recorrencia.descricao || "sem descrição"}"?\n\nOs lançamentos financeiros que já foram gerados NÃO serão apagados.`
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
        "Sua sessão expirou."
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


    if (error) {

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
      recorrenciaEmEdicao ===
      recorrencia.id
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
   LIMPAR FORMULÁRIO DE RECORRÊNCIA
====================================================== */

function limparFormularioRecorrencia() {

  recorrenciaEmEdicao =
    null;


  if (tituloFormularioRecorrencia) {

    tituloFormularioRecorrencia.innerText =
      "Nova recorrência";

  }


  if (btnSalvarRecorrencia) {

    btnSalvarRecorrencia.innerText =
      "Salvar recorrência";

  }


  if (btnCancelarRecorrencia) {

    btnCancelarRecorrencia.classList.add(
      "hidden"
    );

  }


  if (recTipo) {

    recTipo.value =
      "";

  }


  if (recCategoria) {

    recCategoria.innerHTML =
      `
        <option value="">
          Selecione uma categoria
        </option>
      `;

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

}


/* ======================================================
   NAVEGAÇÃO — DASHBOARD
====================================================== */

if (navDashboard) {

  navDashboard.onclick =
    async () => {

      dashboard.classList.remove(
        "hidden"
      );

      lancamentos.classList.add(
        "hidden"
      );

      if (recorrencias) {

        recorrencias.classList.add(
          "hidden"
        );

      }

      fecharMenuMobile();

      await carregarDados();

      atualizarDashboard();

      renderizarLista();

    };

}


/* ======================================================
   NAVEGAÇÃO — LANÇAMENTOS
====================================================== */

if (navLancamentos) {

  navLancamentos.onclick =
    async () => {

      dashboard.classList.add(
        "hidden"
      );

      lancamentos.classList.remove(
        "hidden"
      );

      if (recorrencias) {

        recorrencias.classList.add(
          "hidden"
        );

      }

      fecharMenuMobile();

      await carregarDados();

      renderizarLista();

    };

}


/* ======================================================
   NAVEGAÇÃO — RECORRÊNCIAS
====================================================== */

if (navRecorrencias) {

  navRecorrencias.onclick =
    async () => {

      dashboard.classList.add(
        "hidden"
      );

      lancamentos.classList.add(
        "hidden"
      );

      if (recorrencias) {

        recorrencias.classList.remove(
          "hidden"
        );

      }

      fecharMenuMobile();

      await carregarRecorrencias();

    };

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