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
  let contas = [];
  let transferencias = [];

  let grafico = null;
  let graficoMensal = null;
  let graficoComparativo = null;

  let idEmEdicao = null;

  const LIMITE_FREE = 30;
  let planoUsuario = "FREE";

  /* ======================================================
     TRANSFERÊNCIA DENTRO DE LANÇAMENTOS
  ====================================================== */

  function popularContasTransferenciaLancamento() {
    [transferenciaOrigemLancamento, transferenciaDestinoLancamento].forEach(select => {
      if (!select) return;
      const valorAtual = select.value;
      select.innerHTML = '<option value="">Selecione a conta</option>';
      contas.filter(conta => conta.ativo !== false).forEach(conta => {
        const option = document.createElement("option");
        option.value = conta.id;
        option.textContent = `${conta.nome} — ${conta.tipo}`;
        select.appendChild(option);
      });
      if (valorAtual && contas.some(c => String(c.id) === String(valorAtual))) {
        select.value = valorAtual;
      }
    });
  }

  function atualizarFormularioPorTipo() {
    const transferencia = tipo?.value === "Transferência";
    categoria?.classList.toggle("hidden", transferencia);
    contaLancamento?.classList.toggle("hidden", transferencia);
    transferenciaOrigemLancamento?.classList.toggle("hidden", !transferencia);
    transferenciaDestinoLancamento?.classList.toggle("hidden", !transferencia);
    if (transferencia) {
      popularContasTransferenciaLancamento();
      if (btnSalvar) btnSalvar.innerText = "Realizar transferência";
    } else if (btnSalvar) {
      btnSalvar.innerText = idEmEdicao ? "Atualizar lançamento" : "Salvar lançamento";
    }
  }

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
      "Outros",
      "Resgate / Saque"
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
  const btnContas = document.getElementById("btnContas");
  const btnTransferencias = document.getElementById("btnTransferencias");
  const contasSection = document.getElementById("contas");
  const transferenciasSection = document.getElementById("transferencias");
  const transferenciaOrigem = document.getElementById("transferenciaOrigem");
  const transferenciaDestino = document.getElementById("transferenciaDestino");
  const transferenciaValor = document.getElementById("transferenciaValor");
  const transferenciaData = document.getElementById("transferenciaData");
  const transferenciaStatus = document.getElementById("transferenciaStatus");
  const transferenciaDescricao = document.getElementById("transferenciaDescricao");
  const btnSalvarTransferencia = document.getElementById("btnSalvarTransferencia");
  const listaTransferencias = document.getElementById("listaTransferencias");
  const nomeConta = document.getElementById("nomeConta");
  const tipoConta = document.getElementById("tipoConta");
  const saldoInicialConta = document.getElementById("saldoInicialConta");
  const btnSalvarConta = document.getElementById("btnSalvarConta");
  const listaContas = document.getElementById("listaContas");
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
        if (contasSection) {
            contasSection.classList.add("hidden");
        }

        if (transferenciasSection) {
            transferenciasSection.classList.add("hidden");
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
  const contaLancamento = document.getElementById("contaLancamento");
  const transferenciaOrigemLancamento = document.getElementById("transferenciaOrigemLancamento");
  const transferenciaDestinoLancamento = document.getElementById("transferenciaDestinoLancamento");

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
        if (contasSection) {
            contasSection.classList.add("hidden");
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
        if (contasSection) {
            contasSection.classList.add("hidden");
        }

        fecharMenuMobile();

        renderizarLista();
    };

}

  /* ======================================================
     CONTAS E CARTEIRAS — ETAPA 2A
  ====================================================== */

  function popularContasLancamento(contaSelecionada = "") {

    if (!contaLancamento) return;

    contaLancamento.innerHTML =
      "<option value=''>Conta / Carteira</option>";

    contas
      .filter(conta => conta.ativo !== false)
      .forEach(conta => {

        const option = document.createElement("option");

        option.value = conta.id;
        option.textContent = `${conta.nome} — ${conta.tipo}`;

        if (String(conta.id) === String(contaSelecionada)) {
          option.selected = true;
        }

        contaLancamento.appendChild(option);

      });

  }

  function obterNomeConta(contaId) {

    if (!contaId) return "";

    const conta = contas.find(
      c => String(c.id) === String(contaId)
    );

    return conta ? conta.nome : "Conta não encontrada";

  }

  async function carregarContas() {

    try {

      const { data, error } =
        await supabase
          .from("contas")
          .select("*")
          .order("created_at", { ascending: true });

      if (error) {

        console.error("Erro ao carregar contas:", error);
        contas = [];
        return;

      }

      contas = data || [];
      popularContasLancamento();
      popularContasTransferenciaLancamento();
      popularContasTransferencia();

    } catch (erro) {

      console.error("Erro inesperado ao carregar contas:", erro);
      contas = [];

    }

  }

  /* ======================================================
     SALDOS DAS CONTAS — ETAPA 2C
     O saldo atual usa o saldo inicial + lançamentos pagos.
     Lançamentos "Em aberto" não alteram o saldo disponível.
     Investimentos acumulam separadamente ao longo dos meses.
  ====================================================== */

  function calcularSaldoConta(conta) {

    let saldo = Number(conta?.saldo_inicial) || 0;

    if (!conta?.id) return saldo;

    dados.forEach(l => {

      if (String(l.conta_id || "") !== String(conta.id)) {
        return;
      }

      if ((l.status || "Pago") !== "Pago") {
        return;
      }

      const valor = Number(l.valor) || 0;

      if (l.tipo === "Receita") {
        saldo += valor;
        return;
      }

      if (l.tipo === "Despesa") {
        saldo -= valor;
        return;
      }

      /*
       * Para uma conta do tipo Investimentos:
       * - aportes aumentam o patrimônio;
       * - resgates reduzem o patrimônio.
       *
       * Para as demais contas, investimentos não alteram
       * o saldo disponível nesta etapa. A movimentação
       * entre uma conta bancária e um investimento será
       * tratada em uma etapa posterior de transferências.
       */
      if (l.tipo === "Investimento" &&
          String(conta.tipo || "") === "Investimentos") {

        if (l.categoria === "Resgate / Saque") {
          saldo -= valor;
        } else {
          saldo += valor;
        }

      }

    });

    saldo += calcularImpactoTransferencia(conta.id);

    return saldo;

  }

  function calcularPatrimonioInvestido() {

    let total = contas
      .filter(c => String(c.tipo || "") === "Investimentos")
      .reduce(
        (soma, conta) =>
          soma + (Number(conta.saldo_inicial) || 0),
        0
      );

    dados.forEach(l => {

      if (l.tipo !== "Investimento") return;
      if ((l.status || "Pago") !== "Pago") return;

      const valor = Number(l.valor) || 0;

      if (l.categoria === "Resgate / Saque") {
        total -= valor;
      } else {
        total += valor;
      }

    });

    transferencias.forEach(t => {

      if ((t.status || "Pago") !== "Pago") return;

      const valor = Number(t.valor) || 0;

      const origem =
        contas.find(c => String(c.id) === String(t.origem_id));

      const destino =
        contas.find(c => String(c.id) === String(t.destino_id));

      if (origem && String(origem.tipo || "") === "Investimentos") {
        total -= valor;
      }

      if (destino && String(destino.tipo || "") === "Investimentos") {
        total += valor;
      }

    });

    return Math.max(total, 0);

  }

  function renderizarContas() {

    if (!listaContas) return;

    if (!contas.length) {

      listaContas.innerHTML = `
        <div class="contas-vazio">
          <strong>Nenhuma conta cadastrada</strong>
          <span>Cadastre sua primeira conta ou carteira acima.</span>
        </div>
      `;

      return;

    }

    listaContas.innerHTML = contas.map(conta => {

      const saldoAtual = calcularSaldoConta(conta);

      return `
      <article class="conta-card">
        <div class="conta-card-topo">
          <div>
            <span class="conta-tipo">${conta.tipo || "Conta"}</span>
            <h3>${conta.nome || "Sem nome"}</h3>
          </div>
          <button type="button" class="btn-excluir-conta" data-conta-id="${conta.id}" title="Excluir conta">×</button>
        </div>

        <div class="conta-saldo">
          <small>Saldo atual</small>
          <strong>${formatarMoeda(saldoAtual)}</strong>
        </div>

        <div class="conta-saldo-inicial">
          Saldo inicial: ${formatarMoeda(conta.saldo_inicial)}
        </div>
      </article>
      `;

    }).join("");

    listaContas.querySelectorAll(".btn-excluir-conta").forEach(botao => {

      botao.onclick = async () => {

        const id = botao.dataset.contaId;

        if (!confirm("Excluir esta conta ou carteira?")) return;

        const { error } =
          await supabase
            .from("contas")
            .delete()
            .eq("id", id);

        if (error) {

          console.error("Erro ao excluir conta:", error);
          alert("Não foi possível excluir a conta.");
          return;

        }

        await carregarContas();
        renderizarContas();

      };

    });

  }

  async function carregarTransferencias() {

    try {

      const { data, error } =
        await supabase
          .from("transferencias")
          .select("*")
          .order("data", { ascending: false })
          .order("created_at", { ascending: false });

      if (error) {

        console.error("Erro ao carregar transferências:", error);
        transferencias = [];
        return;

      }

      transferencias = data || [];

    } catch (erro) {

      console.error("Erro inesperado ao carregar transferências:", erro);
      transferencias = [];

    }

  }

  function popularContasTransferencia() {

    [transferenciaOrigem, transferenciaDestino].forEach(select => {

      if (!select) return;

      const valorAtual = select.value;

      select.innerHTML =
        '<option value="">Selecione a conta</option>';

      contas
        .filter(c => c.ativo !== false)
        .forEach(conta => {

          const option = document.createElement("option");

          option.value = conta.id;
          option.textContent =
            `${conta.nome} — ${conta.tipo}`;

          select.appendChild(option);

        });

      if (
        valorAtual &&
        contas.some(c => String(c.id) === String(valorAtual))
      ) {
        select.value = valorAtual;
      }

    });

  }

  function obterNomeContaTransferencia(id) {

    if (!id) return "Conta não informada";

    const conta = contas.find(
      c => String(c.id) === String(id)
    );

    return conta
      ? conta.nome
      : "Conta não encontrada";

  }

  function calcularImpactoTransferencia(contaId) {

    let impacto = 0;

    transferencias.forEach(t => {

      if ((t.status || "Pago") !== "Pago") return;

      const valor = Number(t.valor) || 0;

      if (String(t.origem_id) === String(contaId)) {
        impacto -= valor;
      }

      if (String(t.destino_id) === String(contaId)) {
        impacto += valor;
      }

    });

    return impacto;

  }

  function renderizarTransferencias() {

    if (!listaTransferencias) return;

    if (!transferencias.length) {

      listaTransferencias.innerHTML = `
        <li class="transferencia-vazia">
          <strong>Nenhuma transferência cadastrada.</strong>
          <span>Use o formulário acima para movimentar dinheiro entre suas contas.</span>
        </li>
      `;

      return;

    }

    listaTransferencias.innerHTML =
      transferencias.map(t => {

        const statusTexto = t.status || "Pago";

        return `
          <li class="transferencia-item">
            <div class="transferencia-info">
              <strong>${formatarData(t.data)}</strong>
              <span class="transferencia-rota">
                ${obterNomeContaTransferencia(t.origem_id)}
                <b>→</b>
                ${obterNomeContaTransferencia(t.destino_id)}
              </span>
              <span class="transferencia-valor">
                ${formatarMoeda(t.valor)}
              </span>
              ${
                t.descricao
                  ? `<span class="transferencia-descricao">• ${t.descricao}</span>`
                  : ""
              }
              <span class="status-lancamento ${
                statusTexto === "Pago"
                  ? "status-pago"
                  : "status-aberto"
              }">
                ${statusTexto}
              </span>
            </div>

            <div class="transferencia-acoes">
              <button
                type="button"
                class="btn-acao excluir-transferencia"
                data-id="${t.id}"
                title="Excluir transferência"
              >🗑</button>
            </div>
          </li>
        `;

      }).join("");

    listaTransferencias
      .querySelectorAll(".excluir-transferencia")
      .forEach(botao => {

        botao.onclick = async () => {

          const id = botao.dataset.id;

          if (!confirm(
            "Excluir esta transferência? Os saldos das contas serão recalculados."
          )) return;

          const { error } =
            await supabase
              .from("transferencias")
              .delete()
              .eq("id", id);

          if (error) {

            console.error("Erro ao excluir transferência:", error);
            alert("Não foi possível excluir a transferência.");
            return;

          }

          await carregarTransferencias();
          renderizarTransferencias();
          renderizarContas();
          atualizarDashboard();

        };

      });

  }

  if (btnTransferencias) {

    btnTransferencias.onclick = () => {

      dashboard.classList.add("hidden");
      lancamentos.classList.add("hidden");
      contasSection?.classList.add("hidden");
      relatorios?.classList.add("hidden");
      transferenciasSection?.classList.remove("hidden");

      popularContasTransferencia();
      renderizarTransferencias();
      fecharMenuMobile();

    };

  }

  if (btnSalvarTransferencia) {

    btnSalvarTransferencia.onclick = async () => {

      const origem = transferenciaOrigem?.value;
      const destino = transferenciaDestino?.value;
      const valor = Number(transferenciaValor?.value || 0);
      const data = transferenciaData?.value;
      const statusTransferencia =
        transferenciaStatus?.value || "Pago";
      const descricao =
        transferenciaDescricao?.value.trim() || "";

      if (!origem || !destino) {
        alert("Selecione a conta de origem e a conta de destino.");
        return;
      }

      if (String(origem) === String(destino)) {
        alert("A conta de origem e a conta de destino devem ser diferentes.");
        return;
      }

      if (!Number.isFinite(valor) || valor <= 0) {
        alert("Informe um valor válido para a transferência.");
        return;
      }

      if (!data) {
        alert("Informe a data da transferência.");
        return;
      }

      try {

        const {
          data: userData,
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          alert("Sua sessão expirou. Faça login novamente.");
          return;
        }

        const { error } =
          await supabase
            .from("transferencias")
            .insert({
              user_id: userData.user.id,
              origem_id: origem,
              destino_id: destino,
              valor,
              data,
              status: statusTransferencia,
              descricao
            });

        if (error) {

          console.error("Erro ao salvar transferência:", error);
          alert("Não foi possível salvar a transferência.");
          return;

        }

        transferenciaOrigem.value = "";
        transferenciaDestino.value = "";
        transferenciaValor.value = "";
        transferenciaDescricao.value = "";

        await carregarTransferencias();

        renderizarTransferencias();
        renderizarContas();
        atualizarDashboard();

        alert("Transferência realizada com sucesso!");

      } catch (erro) {

        console.error("Erro inesperado ao salvar transferência:", erro);
        alert("Ocorreu um erro ao salvar a transferência.");

      }

    };

  }

  if (btnSalvarConta) {

    btnSalvarConta.onclick = async () => {

      const nome = nomeConta?.value.trim();
      const tipoSelecionado = tipoConta?.value;
      const saldoTexto = saldoInicialConta?.value;
      const saldoInicial = Number(saldoTexto || 0);

      if (!nome || !tipoSelecionado) {

        alert("Informe o nome e o tipo da conta.");
        return;

      }

      if (!Number.isFinite(saldoInicial) || saldoInicial < 0) {

        alert("Informe um saldo inicial válido.");
        return;

      }

      try {

        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData?.user) {

          alert("Sua sessão expirou. Faça login novamente.");
          return;

        }

        const { error } =
          await supabase
            .from("contas")
            .insert({
              user_id: userData.user.id,
              nome,
              tipo: tipoSelecionado,
              saldo_inicial: saldoInicial,
              ativo: true
            });

        if (error) {

          console.error("Erro ao salvar conta:", error);
          alert("Não foi possível cadastrar a conta.");
          return;

        }

        nomeConta.value = "";
        tipoConta.value = "";
        saldoInicialConta.value = "";

        await carregarContas();
        popularContasTransferencia();
        renderizarContas();

        alert("Conta cadastrada com sucesso!");

      } catch (erro) {

        console.error("Erro inesperado ao cadastrar conta:", erro);
        alert("Ocorreu um erro ao cadastrar a conta.");

      }

    };

  }

  if (btnContas) {

    btnContas.onclick = () => {

      dashboard.classList.add("hidden");
      lancamentos.classList.add("hidden");

      if (relatorios) {
        relatorios.classList.add("hidden");
      }

      if (contasSection) {
        contasSection.classList.remove("hidden");
      }

      fecharMenuMobile();
      renderizarContas();

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
      atualizarFormularioPorTipo();

    };

  }

  atualizarFormularioPorTipo();

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
    await carregarContas();
    await carregarTransferencias();

    atualizarDashboard();

    renderizarLista();
    renderizarContas();
    popularContasLancamento();
    popularContasTransferencia();
    renderizarTransferencias();

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

      if (tipo?.value === "Transferência") {

        const origem = transferenciaOrigemLancamento?.value;
        const destino = transferenciaDestinoLancamento?.value;
        const valorTransferencia = Number(String(valor?.value || "").replace(",", "."));
        const dataTransferencia = dataInput?.value;
        const statusTransferencia = status?.value || "Pago";
        const descricaoTransferencia = descricao?.value.trim() || "";

        if (!origem || !destino) {
          alert("Selecione a conta de origem e a conta de destino.");
          return;
        }
        if (String(origem) === String(destino)) {
          alert("A conta de origem e a conta de destino devem ser diferentes.");
          return;
        }
        if (!Number.isFinite(valorTransferencia) || valorTransferencia <= 0) {
          alert("Informe um valor válido para a transferência.");
          return;
        }
        if (!dataTransferencia) {
          alert("Informe a data da transferência.");
          return;
        }

        try {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError || !userData?.user) {
            alert("Sua sessão expirou. Faça login novamente.");
            return;
          }

          const { error } = await supabase.from("transferencias").insert({
            user_id: userData.user.id,
            origem_id: origem,
            destino_id: destino,
            valor: valorTransferencia,
            data: dataTransferencia,
            status: statusTransferencia,
            descricao: descricaoTransferencia
          });

          if (error) {
            console.error("Erro ao salvar transferência:", error);
            alert("Não foi possível salvar a transferência.");
            return;
          }

          await carregarTransferencias();
          await carregarDados();
          renderizarTransferencias();
          renderizarContas();
          atualizarDashboard();
          limparFormulario();
          alert("Transferência realizada com sucesso!");
          return;

        } catch (erro) {
          console.error("Erro inesperado ao salvar transferência:", erro);
          alert("Ocorreu um erro ao salvar a transferência.");
          return;
        }
      }

      if (
        !tipo.value ||
        !categoria.value ||
        !valor.value ||
        !dataInput.value ||
        !contaLancamento?.value
      ) {

        alert(
          "Preencha tipo, categoria, valor, data e conta/carteira."
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

                status: status?.value || "Pago",

                conta_id: contaLancamento.value

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

                 status: status?.value || "Pago",

                 conta_id: contaLancamento.value

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

        renderizarContas();

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

    if (contaLancamento) {

      contaLancamento.value = "";

    }

    if (transferenciaOrigemLancamento) transferenciaOrigemLancamento.value = "";
    if (transferenciaDestinoLancamento) transferenciaDestinoLancamento.value = "";

    atualizarFormularioPorTipo();

    if (btnSalvar) {

      btnSalvar.innerText = "Salvar lançamento";

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
        formatarMoeda(
          calcularPatrimonioInvestido()
        );

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
          ${
            l.conta_id
              ? ` • ${obterNomeConta(l.conta_id)}`
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

    atualizarFormularioPorTipo();

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

    popularContasLancamento(lancamento.conta_id || "");

    if (contaLancamento) {

      contaLancamento.value =
        lancamento.conta_id || "";

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