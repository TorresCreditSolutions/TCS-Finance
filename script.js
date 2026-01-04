console.log("SCRIPT CARREGADO");

document.addEventListener("DOMContentLoaded", async () => {

  const supabase = window.supabase.createClient(
    "https://figkamlmpangolnasaby.supabase.co",
    "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL"
  );

  let dados = [];
  let grafico = null;
  let graficoMensal = null;

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

  /* ================= RECOVERY ================= */
  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "recovery") {
    const novaSenha = prompt("Crie sua nova senha (mínimo 6 caracteres):");

    if (!novaSenha || novaSenha.length < 6) {
      alert("Senha inválida.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) return alert(error.message);

    alert("Senha redefinida com sucesso.");
    await supabase.auth.signOut();
    window.location.href = window.location.pathname;
    return;
  }

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
      password: senhaInput.value,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) return alert(error.message);
    alert("Conta criada. Confirme no email.");
  };

  btnEsqueciSenha.onclick = async () => {
    if (!emailInput.value) return alert("Informe o email.");
    await supabase.auth.resetPasswordForEmail(emailInput.value, {
      redirectTo: window.location.origin + window.location.pathname
    });
    alert("Email de redefinição enviado.");
  };

  btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  async function iniciarSessao() {
    loginContainer.style.display = "none";
    app.classList.remove("hidden");
    await carregarDados();
    mostrarDashboard();
  }

  async function carregarDados() {
    const { data } = await supabase.from("lancamentos").select("*");
    dados = data || [];
  }

  btnSalvar.onclick = async () => {
    if (!tipo.value || !categoria.value || !valor.value || !dataInput.value) {
      return alert("Preencha todos os campos");
    }

    await supabase.from("lancamentos").insert({
      tipo: tipo.value,
      categoria: categoria.value,
      descricao: descricao.value,
      valor: Number(valor.value),
      data: dataInput.value
    });

    await carregarDados();
    atualizarDashboard();
    renderizarLista();
  };

  tipo.addEventListener("change", () => {
    categoria.innerHTML = "";
    const map = {
      Receita: ["Salário", "Mesada", "Bônus", "Renda Extra","Dividendos"],
      Despesa: ["Moradia","Alimentação", "Saúde", "Cartão de Crédito", "Contas de Consumo", "Compras diversas", "Lazer"],
      Investimento: ["Renda Fixa","Renda Variável", "Poupança"]
    };
    (map[tipo.value] || []).forEach(c => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      categoria.appendChild(o);
    });
  });

  btnDashboard.onclick = mostrarDashboard;
  btnLancamentos.onclick = mostrarLancamentos;

  function mostrarDashboard() {
    lancamentos.classList.add("hidden");
    dashboard.classList.remove("hidden");
    atualizarDashboard();
  }

  function mostrarLancamentos() {
    dashboard.classList.add("hidden");
    lancamentos.classList.remove("hidden");
    renderizarLista();
  }

  function atualizarDashboard() {
    let r=0,d=0,i=0;
    dados.forEach(l=>{
      if(l.tipo==="Receita") r+=l.valor;
      if(l.tipo==="Despesa") d+=l.valor;
      if(l.tipo==="Investimento") i+=l.valor;
    });
    totalReceitas.innerText=`R$ ${r.toFixed(2)}`;
    totalDespesas.innerText=`R$ ${d.toFixed(2)}`;
    totalInvestimentos.innerText=`R$ ${i.toFixed(2)}`;
    saldo.innerText=`R$ ${(r-d).toFixed(2)}`;
    renderizarGrafico(r,d,i);
    renderizarGraficoMensal();
  }

  function renderizarGrafico(r,d,i){
    if(grafico) grafico.destroy();
    grafico=new Chart(document.getElementById("grafico"),{
      type:"pie",
      data:{labels:["Receitas","Despesas","Investimentos"],datasets:[{data:[r,d,i]}]},
      options:{responsive:true}
    });
  }

  function renderizarGraficoMensal(){
    if(graficoMensal) graficoMensal.destroy();
    const resumo={};
    dados.forEach(l=>{
      const m=l.data.slice(0,7);
      resumo[m]=resumo[m]||{r:0,d:0};
      if(l.tipo==="Receita") resumo[m].r+=l.valor;
      if(l.tipo==="Despesa") resumo[m].d+=l.valor;
    });
    graficoMensal=new Chart(document.getElementById("graficoMensal"),{
      type:"bar",
      data:{labels:Object.keys(resumo),datasets:[
        {label:"Receitas",data:Object.values(resumo).map(v=>v.r)},
        {label:"Despesas",data:Object.values(resumo).map(v=>v.d)}
      ]},
      options:{responsive:true,maintainAspectRatio:false}
    });
  }

  function renderizarLista(){
    lista.innerHTML="";
    dados.forEach(l=>{
      const li=document.createElement("li");
      li.textContent=`${l.data} - ${l.tipo} - ${l.categoria} - R$ ${l.valor}`;
      lista.appendChild(li);
    });
  }

  /* ================= INIT PROFISSIONAL (FIX DEFINITIVO) ================= */
const hasAuthParams =
  params.has("type") ||
  params.has("access_token") ||
  params.has("refresh_token");

if (!hasAuthParams) {
  const { data: session } = await supabase.auth.getSession();

  if (session.session) {
    iniciarSessao();
  } else {
    // garante estado limpo
    app.classList.add("hidden");
    loginContainer.style.display = "flex";
  }
}


});
