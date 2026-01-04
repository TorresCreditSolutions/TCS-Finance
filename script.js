console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  /* ================= SUPABASE ================= */
  const supabase = window.supabase.createClient(
    "https://figkamlmpangolnasaby.supabase.co",
    "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL"
  );

  /* ================= ESTADO ================= */
  let dados = [];
  let grafico = null;
  let graficoMensal = null;
  let idEmEdicao = null;

  const LIMITE_FREE = 30; // limite de lançamentos plano free
  let planoUsuario = "FREE";

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
  const btnEsqueciSenha = document.getElementById("btnEsqueciSenha");

  const btnDashboard = document.getElementById("btnDashboard");
  const btnLancamentos = document.getElementById("btnLancamentos");
  const btnSalvar = document.getElementById("btnSalvar");

  const tipo = document.getElementById("tipo");
  const categoria = document.getElementById("categoria");
  const descricao = document.getElementById("descricao");
  const valor = document.getElementById("valor");
  const dataInput = document.getElementById("data");

  const filtroMes = document.getElementById("filtroMes");
  const filtroAno = document.getElementById("filtroAno");
  const btnLimparFiltro = document.getElementById("btnLimparFiltro");

  const totalReceitas = document.getElementById("totalReceitas");
  const totalDespesas = document.getElementById("totalDespesas");
  const totalInvestimentos = document.getElementById("totalInvestimentos");
  const saldo = document.getElementById("saldo");

  const lista = document.getElementById("listaLancamentos");
  const tipoGrafico = document.getElementById("tipoGrafico");

  /* ================= AUTH ================= */
  btnLogin.onclick = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: senhaInput.value
    });
    if (error) return alert(error.message);
    iniciarSessao();
  };

  btnCadastro.onclick = async () => {
    const { error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: senhaInput.value
    });
    if (error) return alert(error.message);
    alert("Conta criada. Confirme no email.");
  };

  btnEsqueciSenha.onclick = async () => {
    if (!emailInput.value) return alert("Informe o email.");
    await supabase.auth.resetPasswordForEmail(emailInput.value);
    alert("Email de redefinição enviado.");
  };

  btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  /* ================= CORE ================= */
  async function iniciarSessao() {
    loginContainer.style.display = "none";
    app.style.display = "flex";

    dashboard.classList.remove("hidden");
    lancamentos.classList.add("hidden");

    await carregarDados();
    atualizarDashboard();
  }

  async function carregarDados() {
    const { data } = await supabase.from("lancamentos").select("*");
    dados = data || [];
  }

  /* ================= SALVAR / EDITAR ================= */
  btnSalvar.onclick = async () => {

    if (!tipo.value || !categoria.value || !valor.value || !dataInput.value) {
      return alert("Preencha todos os campos.");
    }

    if (planoUsuario === "FREE" && dados.length >= LIMITE_FREE && !idEmEdicao) {
      return alert("Limite do plano gratuito atingido.");
    }

    if (idEmEdicao) {
      await supabase.from("lancamentos")
        .update({
          tipo: tipo.value,
          categoria: categoria.value,
          descricao: descricao.value,
          valor: Number(valor.value),
          data: dataInput.value
        })
        .eq("id", idEmEdicao);
      idEmEdicao = null;
    } else {
      await supabase.from("lancamentos").insert({
        tipo: tipo.value,
        categoria: categoria.value,
        descricao: descricao.value,
        valor: Number(valor.value),
        data: dataInput.value
      });
    }

    await carregarDados();
    atualizarDashboard();
    renderizarLista();
    limparFormulario();
  };

  function limparFormulario() {
    tipo.value = "";
    categoria.innerHTML = "";
    descricao.value = "";
    valor.value = "";
    dataInput.value = "";
  }

  /* ================= FILTROS ================= */
  filtroMes.onchange = atualizarDashboard;
  filtroAno.onchange = atualizarDashboard;
  btnLimparFiltro.onclick = () => {
    filtroMes.value = "";
    filtroAno.value = "";
    atualizarDashboard();
  };

  /* ================= DASHBOARD ================= */
  function atualizarDashboard() {
    let filtrados = [...dados];

    if (filtroMes.value)
      filtrados = filtrados.filter(l => l.data.startsWith(filtroMes.value));

    if (filtroAno.value)
      filtrados = filtrados.filter(l => l.data.startsWith(filtroAno.value));

    let r = 0, d = 0, i = 0;
    filtrados.forEach(l => {
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
    if (grafico) grafico.destroy();
    grafico = new Chart(document.getElementById("grafico"), {
      type: "pie",
      data: {
        labels: ["Receitas", "Despesas", "Investimentos"],
        datasets: [{ data: [r, d, i] }]
      },
      options: { responsive: true }
    });
  }

  function renderizarGraficoMensal() {
    if (graficoMensal) graficoMensal.destroy();

    const resumo = {};
    dados.forEach(l => {
      const m = l.data.slice(0, 7);
      resumo[m] = resumo[m] || { r: 0, d: 0 };
      if (l.tipo === "Receita") resumo[m].r += l.valor;
      if (l.tipo === "Despesa") resumo[m].d += l.valor;
    });

    graficoMensal = new Chart(document.getElementById("graficoMensal"), {
      type: "bar",
      data: {
        labels: Object.keys(resumo),
        datasets: [
          { label: "Receitas", data: Object.values(resumo).map(v => v.r) },
          { label: "Despesas", data: Object.values(resumo).map(v => v.d) }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  /* ================= LISTA ================= */
  function renderizarLista() {
    lista.innerHTML = "";
    dados.forEach(l => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${l.data} - ${l.tipo} - ${l.categoria} - R$ ${l.valor}
        <button onclick="editar(${l.id})">✏️</button>
        <button onclick="excluir(${l.id})">🗑</button>
      `;
      lista.appendChild(li);
    });
  }

  window.excluir = async (id) => {
    if (!confirm("Excluir lançamento?")) return;
    await supabase.from("lancamentos").delete().eq("id", id);
    await carregarDados();
    atualizarDashboard();
    renderizarLista();
  };

  window.editar = (id) => {
    const l = dados.find(d => d.id === id);
    if (!l) return;
    idEmEdicao = id;
    tipo.value = l.tipo;
    categoria.innerHTML = `<option>${l.categoria}</option>`;
    descricao.value = l.descricao;
    valor.value = l.valor;
    dataInput.value = l.data;
    mostrarLancamentos();
  };

});
