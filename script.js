console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

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
  const btnEsqueciSenha = document.getElementById("btnEsqueciSenha");

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
  const tipoGrafico = document.getElementById("tipoGrafico");

  /* ================= RECOVERY MODE ================= */
  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "recovery") {
    const novaSenha = prompt("Digite sua nova senha:");

    if (novaSenha && novaSenha.length >= 6) {
      const { error } = await supabase.auth.updateUser({
        password: novaSenha
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Senha redefinida com sucesso. Faça login novamente.");
        window.location.href = window.location.origin + window.location.pathname;
      }
    } else {
      alert("Senha inválida. Mínimo 6 caracteres.");
    }
    return;
  }

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

  if (btnEsqueciSenha) {
    btnEsqueciSenha.onclick = async () => {
      if (!emailInput.value) return alert("Informe seu email.");

      const { error } = await supabase.auth.resetPasswordForEmail(
        emailInput.value.trim(),
        { redirectTo: "https://torrescreditsolutions.github.io/TCS-Finance/" }
      );

      if (error) return alert(error.message);
      alert("Email de redefinição enviado.");
    };
  }

  btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  async function iniciarSessao() {
    loginContainer.style.display = "none";
    loginContainer.style.pointerEvents = "none"; // 🔥 FIX DESKTOP
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

  function renderizarGrafico(r, d, i) {
    if (grafico) grafico.destroy();

    grafico = new Chart(document.getElementById("grafico"), {
      type: "pie",
      data: {
        labels: ["Receitas", "Despesas", "Investimentos"],
        datasets: [{ data: [r, d, i], backgroundColor: ["#2ecc71","#e74c3c","#3498db"] }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
  }

  function renderizarGraficoMensal() {
    if (graficoMensal) graficoMensal.destroy();

    const resumo = {};
    dados.forEach(l => {
      const mes = l.data.slice(0,7);
      if (!resumo[mes]) resumo[mes] = { receita:0, despesa:0 };
      if (l.tipo==="Receita") resumo[mes].receita += l.valor;
      if (l.tipo==="Despesa") resumo[mes].despesa += l.valor;
    });

    graficoMensal = new Chart(document.getElementById("graficoMensal"), {
      type: "bar",
      data: {
        labels: Object.keys(resumo),
        datasets: [
          { label:"Receitas", data:Object.values(resumo).map(v=>v.receita), backgroundColor:"#2ecc71" },
          { label:"Despesas", data:Object.values(resumo).map(v=>v.despesa), backgroundColor:"#e74c3c" }
        ]
      },
      options:{ responsive:true, maintainAspectRatio:false }
    });
  }

  function renderizarLista() {
    lista.innerHTML="";
    dados.forEach(l=>{
      const li=document.createElement("li");
      li.textContent=`${l.data} - ${l.tipo} - ${l.categoria} - R$ ${l.valor.toFixed(2)}`;
      lista.appendChild(li);
    });
  }

  const { data: session } = await supabase.auth.getSession();
  if (session.session) iniciarSessao();

});
