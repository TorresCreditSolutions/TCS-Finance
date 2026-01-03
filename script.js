console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  /* ================= CHART GLOBAL ================= */
  Chart.defaults.devicePixelRatio = window.devicePixelRatio || 1;

  /* ================= SUPABASE ================= */
  const supabaseUrl = "https://figkamlmpangolnasaby.supabase.co";
  const supabaseKey = "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  let dados = [];
  let grafico = null;
  let graficoMensal = null;

  /* ================= ELEMENTOS ================= */
  const loginContainer = document.getElementById("login-container");
  const app = document.getElementById("app");
  const dashboard = document.getElementById("dashboard");
  const lancamentos = document.getElementById("lancamentos");

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

  const tipoGrafico = document.getElementById("tipoGrafico");

  /* ================= AUTH ================= */
  btnLogin.onclick = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: senhaInput.value.trim()
    });
    if (error) return alert(error.message);
    iniciarSessao();
  };

  btnCadastro.onclick = async () => {
    const { error } = await supabase.auth.signUp({
      email: emailInput.value.trim(),
      password: senhaInput.value.trim(),
      options: {
        emailRedirectTo: "https://torrescreditsolutions.github.io/TCS-Finance/"
      }
    });
    if (error) return alert(error.message);
    alert("Conta criada! Confirme no email.");
  };

  btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  async function iniciarSessao() {
    loginContainer.style.display = "none";
    app.style.display = "flex";
    await carregarDados();
    mostrarDashboard();
  }

  /* ================= DATABASE ================= */
  async function carregarDados() {
    const { data, error } = await supabase
      .from("lancamentos")
      .select("*")
      .order("data", { ascending: true });

    if (error) return alert(error.message);
    dados = data || [];
  }

  btnSalvar.onclick = async () => {
    if (!tipo.value || !categoria.value || !valor.value || !dataInput.value) {
      return alert("Preencha todos os campos obrigatórios");
    }

    const { error } = await supabase.from("lancamentos").insert({
      tipo: tipo.value,
      categoria: categoria.value,
      descricao: descricao.value,
      valor: Number(valor.value),
      data: dataInput.value
    });

    if (error) return alert(error.message);

    await carregarDados();
    atualizarDashboard();
    renderizarLista();

    tipo.value = "";
    categoria.innerHTML = "<option value=''>Selecione a categoria</option>";
    descricao.value = "";
    valor.value = "";
    dataInput.value = "";
  };

  /* ================= CATEGORIAS (FIX DEFINITIVO) ================= */
  tipo.addEventListener("change", () => {
    categoria.innerHTML = "<option value=''>Selecione a categoria</option>";

    const opcoes = {
      Receita: ["Salário", "Mesada", "Renda Extra", "Dividendos", "Bônus"],
      Despesa: ["Moradia", "Saúde", "Alimentação", "Transporte", "Contas", "Lazer"],
      Investimento: ["Renda Fixa", "Poupança", "Renda Variável"]
    };

    if (!tipo.value || !opcoes[tipo.value]) return;

    opcoes[tipo.value].forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      categoria.appendChild(opt);
    });
  });

  /* ================= UI ================= */
  btnDashboard.onclick = mostrarDashboard;
  btnLancamentos.onclick = mostrarLancamentos;

  function mostrarDashboard() {
    lancamentos.classList.add("hidden");
    dashboard.classList.remove("hidden");
    setTimeout(atualizarDashboard, 60);
  }

  function mostrarLancamentos() {
    dashboard.classList.add("hidden");
    lancamentos.classList.remove("hidden");
    renderizarLista();
  }

  /* ================= DASHBOARD ================= */
  function atualizarDashboard() {
    let r = 0, d = 0, i = 0;

    dados.forEach(l => {
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

  /* ================= GRÁFICO DE PIZZA ================= */
  function renderizarGrafico(r, d, i) {
    if (grafico) grafico.destroy();

    let labels, values, colors;

    if (tipoGrafico && tipoGrafico.value === "categoria") {
      const map = {};
      dados.forEach(l => {
        map[l.categoria] = (map[l.categoria] || 0) + l.valor;
      });
      labels = Object.keys(map);
      values = Object.values(map);
      colors = labels.map(() =>
        "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
    } else {
      labels = ["Receitas", "Despesas", "Investimentos"];
      values = [r, d, i];
      colors = ["#2ecc71", "#e74c3c", "#3498db"];
    }

    grafico = new Chart(document.getElementById("grafico"), {
      type: "pie",
      data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  if (tipoGrafico) {
    tipoGrafico.addEventListener("change", atualizarDashboard);
  }

  /* ================= GRÁFICO DE BARRAS ================= */
  function renderizarGraficoMensal() {
    if (graficoMensal) graficoMensal.destroy();

    const resumo = {};
    dados.forEach(l => {
      const mes = l.data.slice(0, 7);
      if (!resumo[mes]) resumo[mes] = { receita: 0, despesa: 0 };
      if (l.tipo === "Receita") resumo[mes].receita += l.valor;
      if (l.tipo === "Despesa") resumo[mes].despesa += l.valor;
    });

    const meses = Object.keys(resumo);

    graficoMensal = new Chart(document.getElementById("graficoMensal"), {
      type: "bar",
      data: {
        labels: meses,
        datasets: [
          { label: "Receitas", data: meses.map(m => resumo[m].receita), backgroundColor: "#2ecc71" },
          { label: "Despesas", data: meses.map(m => resumo[m].despesa), backgroundColor: "#e74c3c" }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  /* ================= LISTA ================= */
  function renderizarLista() {
    lista.innerHTML = "";
    dados.forEach(l => {
      const li = document.createElement("li");
      li.textContent = `${l.data} - ${l.tipo} - ${l.categoria} - R$ ${l.valor.toFixed(2)}`;
      lista.appendChild(li);
    });
  }

  /* ================= INIT ================= */
  const { data: session } = await supabase.auth.getSession();
  if (session.session) iniciarSessao();

});
