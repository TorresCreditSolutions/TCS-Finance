console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  /* ================= SUPABASE ================= */
  const supabaseUrl = "https://figkamlmpangolnasaby.supabase.co";
  const supabaseKey = "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL";

  const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

  let usuarioLogado = null;
  let dados = [];
  let grafico = null;
  let graficoMensal = null;

  /* ================= ELEMENTOS ================= */
  const loginContainer = document.getElementById("login-container");
  const app = document.getElementById("app");
  const dashboard = document.getElementById("dashboard");
  const secLancamentos = document.getElementById("lancamentos");

  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");

  const btnLogin = document.getElementById("btnLogin");
  const btnCadastro = document.getElementById("btnCadastro");
  const btnLogout = document.getElementById("btnLogout");

  const btnDashboard = document.getElementById("btnDashboard");
  const btnLancamentos = document.getElementById("btnLancamentos");
  const btnSalvar = document.getElementById("btnSalvar");

  const tipo = document.getElementById("tipo");
  const categoria = document.getElementById("categoria");
  const descricao = document.getElementById("descricao");
  const valor = document.getElementById("valor");
  const dataInput = document.getElementById("data");

  const totalReceitas = document.getElementById("totalReceitas");
  const totalDespesas = document.getElementById("totalDespesas");
  const totalInvestimentos = document.getElementById("totalInvestimentos");
  const saldo = document.getElementById("saldo");

  const lista = document.getElementById("listaLancamentos");

  const filtroMes = document.getElementById("filtroMes");
  const filtroAno = document.getElementById("filtroAno");
  const btnLimparFiltro = document.getElementById("btnLimparFiltro");

  /* ================= AUTH ================= */

  btnLogin.onclick = async () => {
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      alert("Informe email e senha");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) {
      alert(error.message);
      return;
    }

    iniciarSessao();
  };

  btnCadastro.onclick = async () => {
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      alert("Informe email e senha");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: "https://torrescreditsolutions.github.io/TCS-Finance/"
      }
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Conta criada com sucesso! Confirme no email.");
  };

  btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  async function iniciarSessao() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    usuarioLogado = session.session.user.id;

    loginContainer.classList.add("hidden");
    app.classList.remove("hidden");

    await carregarDados();
    mostrarDashboard();
  }

  /* ================= DATABASE ================= */
  async function carregarDados() {
    const { data, error } = await supabase
      .from("lancamentos")
      .select("*")
      .order("data", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    dados = data || [];
  }

  btnSalvar.onclick = async () => {
    if (!tipo.value || !categoria.value || !valor.value || !dataInput.value) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const { error } = await supabase.from("lancamentos").insert({
      tipo: tipo.value,
      categoria: categoria.value,
      descricao: descricao.value,
      valor: Number(valor.value),
      data: dataInput.value
    });

    if (error) {
      alert(error.message);
      return;
    }

    await carregarDados();
    renderizarLista();
    atualizarDashboard();

    tipo.value = "";
    categoria.innerHTML = "";
    descricao.value = "";
    valor.value = "";
    dataInput.value = "";
  };

  /* ================= CATEGORIAS ================= */
  tipo.addEventListener("change", () => {
    categoria.innerHTML = "<option value=''>Selecione</option>";

    const opcoes = {
      Receita: ["Salário", "Mesada", "Renda Extra", "Dividendos", "Bônus"],
      Despesa: ["Moradia", "Saúde", "Alimentação", "Transporte", "Contas", "Lazer"],
      Investimento: ["Renda Fixa", "Poupança", "Renda Variável"]
    };

    if (!tipo.value) return;

    opcoes[tipo.value].forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      categoria.appendChild(opt);
    });
  });

  /* ================= FILTROS ================= */
  function filtrarLancamentos() {
    return dados.filter(l => {
      if (!l.data) return false;
      if (filtroMes.value && !l.data.startsWith(filtroMes.value)) return false;
      if (filtroAno.value && !l.data.startsWith(filtroAno.value)) return false;
      return true;
    });
  }

  function calcularResumoMensal() {
    const resumo = {};
    dados.forEach(l => {
      const mes = l.data.slice(0, 7);
      if (!resumo[mes]) resumo[mes] = { receita: 0, despesa: 0 };
      if (l.tipo === "Receita") resumo[mes].receita += l.valor;
      if (l.tipo === "Despesa") resumo[mes].despesa += l.valor;
    });
    return resumo;
  }

  /* ================= UI ================= */
  function mostrarDashboard() {
    secLancamentos.classList.add("hidden");
    dashboard.classList.remove("hidden");

    // 🔥 garante que o canvas já esteja visível
    setTimeout(() => {
      atualizarDashboard();
    }, 80);
  }

  function mostrarLancamentos() {
    dashboard.classList.add("hidden");
    secLancamentos.classList.remove("hidden");
    renderizarLista();
  }

  btnDashboard.onclick = mostrarDashboard;
  btnLancamentos.onclick = mostrarLancamentos;

  /* ================= DASHBOARD ================= */
  function atualizarDashboard() {
    let r = 0, d = 0, i = 0;

    filtrarLancamentos().forEach(l => {
      if (l.tipo === "Receita") r += l.valor;
      if (l.tipo === "Despesa") d += l.valor;
      if (l.tipo === "Investimento") i += l.valor;
    });

    totalReceitas.innerText = `R$ ${r.toFixed(2)}`;
    totalDespesas.innerText = `R$ ${d.toFixed(2)}`;
    totalInvestimentos.innerText = `R$ ${i.toFixed(2)}`;
    saldo.innerText = `R$ ${(r - d).toFixed(2)}`;

    renderizarGrafico(r, d, i);
    renderizarGraficoMensal();
  }

  function renderizarGrafico(r, d, i) {
    const canvas = document.getElementById("grafico");
    if (!canvas) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 280;

    if (grafico) grafico.destroy();

    grafico = new Chart(canvas, {
      type: "pie",
      data: {
        labels: ["Receitas", "Despesas", "Investimentos"],
        datasets: [{
          data: [r, d, i],
          backgroundColor: ["#2ecc71", "#e74c3c", "#3498db"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  function renderizarGraficoMensal() {
    const canvas = document.getElementById("graficoMensal");
    if (!canvas) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 280;

    if (graficoMensal) graficoMensal.destroy();

    const resumo = calcularResumoMensal();
    const meses = Object.keys(resumo).sort();

    graficoMensal = new Chart(canvas, {
      type: "bar",
      data: {
        labels: meses,
        datasets: [
          {
            label: "Receitas",
            data: meses.map(m => resumo[m].receita),
            backgroundColor: "#2ecc71"
          },
          {
            label: "Despesas",
            data: meses.map(m => resumo[m].despesa),
            backgroundColor: "#e74c3c"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  function renderizarLista() {
    lista.innerHTML = "";
    const registros = filtrarLancamentos();

    if (!registros.length) {
      lista.innerHTML = "<li>Nenhum lançamento encontrado</li>";
      return;
    }

    registros.forEach(l => {
      const li = document.createElement("li");
      li.textContent = `${l.data} - ${l.tipo} - ${l.categoria} - R$ ${l.valor.toFixed(2)}`;
      lista.appendChild(li);
    });
  }

  /* ================= INIT ================= */
  const { data: session } = await supabase.auth.getSession();
  if (session.session) iniciarSessao();

});
