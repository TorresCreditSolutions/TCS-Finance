TCS FINANCE — VERSÃO FINAL SEM RECORRÊNCIAS

ARQUIVO 1 — index.html

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>TCS Finance | Controle Financeiro</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="style.css">

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body>

<div id="menuOverlay" class="menu-overlay hidden"></div>

<div id="login-container">
  <h2>TCS Finance</h2>
  <input type="email" id="email" placeholder="Email">
  <input type="password" id="senha" placeholder="Senha">
  <button type="button" id="btnLogin">Entrar</button>
  <button type="button" id="btnCadastro">Criar Conta</button>
  <a href="javascript:void(0)" id="btnEsqueciSenha" class="esqueci-senha">Esqueci minha senha</a>
  <div class="termos-container">
    <label class="termos">
      <input type="checkbox" id="aceiteTermos">
      Li e aceito os termos de uso
    </label>
  </div>
  <div class="creditos">© Torres Credit Solutions • Dados criptografados</div>
</div>

<div id="app" class="hidden">

  <aside class="sidebar">
    <div class="sidebar-brand">
      <span class="brand-tcs">TCS</span><span class="brand-finance">Finance</span>
    </div>

    <nav class="sidebar-nav">
      <button type="button" id="btnDashboard" class="nav-item active">
        <span class="nav-icon">▥</span><span>Dashboard</span>
      </button>

      <button type="button" id="btnLancamentos" class="nav-item">
        <span class="nav-icon">⇄</span><span>Lançamentos</span>
      </button>

      <button type="button" id="btnRelatorios" class="nav-item visual-only">
        <span class="nav-icon">◔</span><span>Relatórios</span>
      </button>
    </nav>

    <div class="sidebar-account">
      <span class="account-label">CONTA</span>
      <div class="account-card">
        <span class="account-avatar">●</span>
        <div>
          <strong>Plano FREE</strong>
          <small>Usuário</small>
        </div>
        <span class="free-pill">FREE</span>
      </div>
    </div>

    <button type="button" id="btnLogout" class="sidebar-logout">
      <span class="nav-icon">↪</span><span>Sair</span>
    </button>
  </aside>

  <header class="topbar">
    <div class="topbar-left">
      <button type="button" id="btnMenu" class="btn-menu" aria-label="Abrir menu">☰</button>
      <span class="topbar-title">TCS Finance</span>
    </div>

    <div class="topbar-center">
      <span id="topbarUser">anderson.a9bank</span>
      <span id="topbarPlano" class="plano-badge">FREE</span>
    </div>

    <div class="topbar-right">
      <button type="button" id="btnLogoutTop" class="btn-logout-top">⇥&nbsp; Sair</button>
    </div>
  </header>

  <main class="content">

    <section id="dashboard">

      <!-- Mantidos para compatibilidade com o JS; visualmente compactados no novo layout. -->
      <div class="dashboard-heading">
        <div>
          <span class="eyebrow">VISÃO GERAL</span>
          <h1>Dashboard Financeiro</h1>
          <p>Acompanhe suas receitas, despesas e investimentos em um só lugar.</p>
        </div>
        <div class="dashboard-date" id="dashboardPeriodo">Período atual</div>
      </div>

      <div class="avisos-sistema">
        <span id="nomeCliente">Olá!</span>
        <span class="badge">Sistema Profissional</span>
        <span id="planoUsuario">Plano Free</span>
      </div>

      <div class="filtros">
        <label>
          <span>PERÍODO</span>
          <input type="month" id="filtroMes">
        </label>
        <button id="btnLimparFiltro" type="button">Limpar filtro</button>
      </div>

      <div class="cards">
        <div class="card receita">
          <span class="card-icon" aria-hidden="true">↑</span>
          <span class="card-label">RECEITAS</span>
          <strong id="totalReceitas">R$ 0,00</strong>
          <small>Entradas no período</small>
        </div>

        <div class="card despesa">
          <span class="card-icon" aria-hidden="true">↓</span>
          <span class="card-label">DESPESAS</span>
          <strong id="totalDespesas">R$ 0,00</strong>
          <small>Saídas no período</small>
        </div>

        <div class="card investimento">
          <span class="card-icon" aria-hidden="true">◔</span>
          <span class="card-label">INVESTIMENTOS</span>
          <strong id="totalInvestimentos">R$ 0,00</strong>
          <small>Valores investidos</small>
        </div>

        <div class="card saldo">
          <span class="card-icon" aria-hidden="true">▱</span>
          <span class="card-label">SALDO</span>
          <strong id="saldo">R$ 0,00</strong>
          <small>Receitas menos despesas</small>
        </div>

        <div id="alertasInteligentes" class="alertas"></div>
      </div>

      <div class="dashboard-section-title">
        <div>
          <span class="eyebrow">ANÁLISE</span>
          <h2>Desempenho financeiro</h2>
        </div>
      </div>

      <div class="graficos">
        <div class="grafico-box grafico-principal">
          <div class="grafico-header">
            <div>
              <h3>Distribuição financeira</h3>
              <p>Visualização dos valores registrados.</p>
            </div>
            <select id="tipoGrafico">
              <option value="geral">Resumo Geral</option>
              <option value="categoria">Por Categoria</option>
            </select>
          </div>
          <div class="chart-wrap chart-pie">
            <canvas id="grafico"></canvas>
          </div>
        </div>

        <div class="grafico-box">
          <div class="grafico-header">
            <div>
              <h3>Resumo mensal</h3>
              <p>Comparativo de receitas e despesas.</p>
            </div>
          </div>
          <div class="chart-wrap chart-bar">
            <canvas id="graficoMensal"></canvas>
          </div>
        </div>
      </div>

      <div class="grafico-box grafico-comparativo">
        <div class="grafico-header">
          <div>
            <h3>Evolução Receita x Despesa</h3>
            <p>Acompanhe a evolução do seu caixa ao longo dos meses.</p>
          </div>
        </div>
        <div class="chart-wrap chart-line">
          <canvas id="graficoComparativo"></canvas>
        </div>
      </div>

      <section id="adminPanel" class="hidden" data-admin-only>
        <h2>Painel Administrativo</h2>
        <table>
          <thead><tr><th>Email</th><th>Plano</th><th>Ação</th></tr></thead>
          <tbody id="listaUsuariosAdmin"></tbody>
        </table>
      </section>

      <div data-admin-only class="hidden">
        <h2>Painel Administrativo</h2>
        <p>Gerenciamento de usuários e planos</p>
        <button type="button">Gerenciar Usuários</button>
      </div>
    </section>

    <section id="lancamentos" class="hidden">
      <div class="page-heading">
        <span class="eyebrow">MOVIMENTAÇÕES</span>
        <h2>Novo Lançamento</h2>
        <p>Registre suas receitas, despesas e investimentos.</p>
      </div>

      <div class="lancamento-form-card">
        <div class="form-grid">
          <select id="tipo">
            <option value="">Tipo</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
            <option value="Investimento">Investimento</option>
          </select>

          <select id="categoria"></select>
          <input type="text" id="descricao" placeholder="Descrição">
          <input type="number" id="valor" placeholder="Valor">
          <input type="date" id="data">
        </div>

        <button id="btnSalvar">Salvar lançamento</button>
      </div>

      <div class="extrato-card">
        <h3>Extrato</h3>
        <ul id="listaLancamentos"></ul>
        <button id="btnExportarPdf">Exportar PDF</button>
      </div>
    </section>


    <section id="relatorios" class="hidden">
      <div class="page-heading">
        <span class="eyebrow">ANÁLISE</span>
        <h2>Relatórios Financeiros</h2>
        <p>Resumo consolidado do período selecionado.</p>
      </div>
      <div class="cards relatorios-cards">
        <div class="card receita"><span class="card-label">RECEITAS</span><strong id="relatorioReceitas">R$ 0,00</strong></div>
        <div class="card despesa"><span class="card-label">DESPESAS</span><strong id="relatorioDespesas">R$ 0,00</strong></div>
        <div class="card investimento"><span class="card-label">INVESTIMENTOS</span><strong id="relatorioInvestimentos">R$ 0,00</strong></div>
        <div class="card saldo"><span class="card-label">SALDO</span><strong id="relatorioSaldo">R$ 0,00</strong></div>
      </div>
      <div class="grafico-box">
        <div class="grafico-header"><div><h3>Resumo do período</h3><p id="relatorioPeriodo">Período atual</p></div></div>
        <div class="relatorio-resumo" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;">
          <div><span>Receitas</span><strong id="relatorioResumoReceitas">R$ 0,00</strong></div>
          <div><span>Despesas</span><strong id="relatorioResumoDespesas">R$ 0,00</strong></div>
          <div><span>Investimentos</span><strong id="relatorioResumoInvestimentos">R$ 0,00</strong></div>
          <div><span>Saldo</span><strong id="relatorioResumoSaldo">R$ 0,00</strong></div>
        </div>
      </div>
    </section>

    <footer class="creditos-app">© TCS Finance • Dados criptografados • Uso profissional</footer>
  </main>
</div>

<script src="script.js"></script>
</body>
</html>



===== ARQUIVO 2 — style.css =====

/* =========================================================
   TCS FINANCE — INTERFACE CORPORATIVA
   V5 — reconstrução visual baseada no layout de referência.
   Compatível com os IDs usados pelo script.js.
========================================================= */

:root{
  --navy:#071b2c;
  --navy-2:#0b2942;
  --blue:#1677ff;
  --blue-2:#2563eb;
  --blue-soft:#eef5ff;
  --green:#12a66a;
  --green-soft:#eaf8f0;
  --red:#e5484d;
  --red-soft:#fff0f1;
  --purple:#6956d8;
  --bg:#f5f7fb;
  --surface:#fff;
  --text:#101828;
  --muted:#667085;
  --line:#e4e9f0;
  --shadow:0 8px 26px rgba(16,24,40,.055);
  --shadow-sm:0 2px 8px rgba(16,24,40,.035);
  --radius:18px;
  --sidebar:240px;
  --topbar:60px;
}

*{box-sizing:border-box}

html{
  min-height:100%;
  scroll-behavior:smooth;
}

body{
  margin:0;
  min-height:100vh;
  background:var(--bg);
  color:var(--text);
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:14px;
  line-height:1.45;
  -webkit-font-smoothing:antialiased;
}

button,input,select,textarea{font:inherit}
button{cursor:pointer}
.hidden{display:none!important}

/* =========================================================
   LOGIN
========================================================= */

#login-container{
  width:min(430px,calc(100% - 32px));
  min-height:100vh;
  margin:auto;
  padding:40px 0;
  display:flex;
  flex-direction:column;
  justify-content:center;
}

#login-container h2{
  margin:0 0 10px;
  color:var(--navy);
  font-size:30px;
  font-weight:850;
  letter-spacing:-1px;
}

#login-container h2:after{
  content:"";
  display:block;
  width:44px;
  height:4px;
  margin-top:10px;
  border-radius:99px;
  background:var(--blue);
}

#login-container>input{
  width:100%;
  height:50px;
  margin-top:12px;
  padding:0 15px;
  border:1px solid var(--line);
  border-radius:12px;
  outline:none;
  background:#fff;
  color:var(--text);
  box-shadow:var(--shadow-sm);
}

#login-container>input:focus{
  border-color:#9ec5ff;
  box-shadow:0 0 0 4px rgba(22,119,255,.10);
}

#btnLogin,#btnCadastro{
  width:100%;
  min-height:48px;
  margin-top:12px;
  border:0;
  border-radius:12px;
  font-weight:750;
}

#btnLogin{
  background:var(--blue);
  color:#fff;
  box-shadow:0 8px 20px rgba(22,119,255,.18);
}

#btnCadastro{
  background:var(--blue-soft);
  color:var(--blue-2);
}

.esqueci-senha{
  display:block;
  margin:14px 0 6px;
  color:var(--blue);
  text-align:center;
  font-weight:650;
  text-decoration:none;
}

.termos-container{
  margin-top:12px;
  padding:12px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#fff;
}

.termos{
  display:flex;
  align-items:center;
  gap:9px;
  color:var(--muted);
  font-size:13px;
}

.termos input{accent-color:var(--blue)}
.creditos{margin-top:20px;color:#98a2b3;font-size:11px;text-align:center}

/* =========================================================
   SIDEBAR
========================================================= */

.sidebar{
  position:fixed;
  inset:0 auto 0 0;
  z-index:1300;
  width:var(--sidebar);
  padding:23px 16px 18px;
  display:flex;
  flex-direction:column;
  background:linear-gradient(180deg,#071c2e 0%,#06192a 100%);
  color:#fff;
  border-right:1px solid rgba(255,255,255,.045);
}

.sidebar-brand{
  padding:0 8px 30px;
  font-size:20px;
  font-weight:850;
  letter-spacing:-.8px;
}

.brand-tcs{color:#2490ff;margin-right:5px}
.brand-finance{color:#fff}

.sidebar-nav{
  display:flex;
  flex-direction:column;
  gap:5px;
}

.nav-item{
  width:100%;
  height:48px;
  display:flex;
  align-items:center;
  gap:12px;
  padding:0 12px;
  border:0;
  border-radius:10px;
  background:transparent;
  color:#d7e1eb;
  text-align:left;
  font-size:13px;
  font-weight:700;
  transition:.18s ease;
}

.nav-item:hover{
  background:rgba(255,255,255,.07);
  color:#fff;
}

.nav-item.active{
  background:linear-gradient(135deg,#1677ff,#246be4);
  color:#fff;
  box-shadow:0 8px 18px rgba(22,119,255,.22);
}

.nav-icon{
  width:20px;
  display:inline-flex;
  justify-content:center;
  font-size:17px;
  line-height:1;
}

.sidebar-account{
  margin-top:auto;
}

.account-label{
  display:block;
  margin:0 4px 8px;
  color:#8798a9;
  font-size:10px;
  font-weight:800;
  letter-spacing:1px;
}

.account-card{
  min-height:74px;
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 11px;
  border:1px solid rgba(255,255,255,.06);
  border-radius:12px;
  background:rgba(255,255,255,.055);
}

.account-avatar{
  width:34px;
  height:34px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:#d9eaff;
  color:#1677ff;
  font-size:14px;
}

.account-card strong{
  display:block;
  color:#fff;
  font-size:12px;
  line-height:1.2;
}

.account-card small{
  display:block;
  margin-top:3px;
  color:#9fb0bf;
  font-size:11px;
}

.free-pill{
  margin-left:auto;
  padding:3px 7px;
  border-radius:999px;
  background:#1677ff;
  color:#fff;
  font-size:9px;
  font-weight:850;
}

.sidebar-logout{
  width:100%;
  height:48px;
  margin-top:12px;
  display:flex;
  align-items:center;
  gap:12px;
  padding:0 12px;
  border:0;
  border-radius:10px;
  background:transparent;
  color:#ff7a7e;
  font-size:13px;
  font-weight:750;
  text-align:left;
}

.sidebar-logout:hover{background:rgba(229,72,77,.09)}

/* =========================================================
   TOPBAR
========================================================= */

.topbar{
  position:fixed;
  top:0;
  left:var(--sidebar);
  right:0;
  z-index:1200;
  height:var(--topbar);
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  background:rgba(255,255,255,.96);
  border-bottom:1px solid var(--line);
  backdrop-filter:blur(12px);
}

.topbar-left{
  display:flex;
  align-items:center;
  gap:16px;
}

.btn-menu{
  width:32px;
  height:32px;
  display:grid;
  place-items:center;
  border:0;
  background:transparent;
  color:#344054;
  font-size:19px;
}

.topbar-title{
  color:var(--navy);
  font-size:15px;
  font-weight:850;
  letter-spacing:-.3px;
}

.topbar-center{
  display:flex;
  align-items:center;
  gap:9px;
  color:#475467;
  font-size:12px;
  font-weight:650;
}

.plano-badge{
  padding:4px 8px;
  border-radius:999px;
  background:var(--blue-soft);
  color:var(--blue);
  font-size:10px;
  font-weight:850;
}

.btn-logout-top{
  min-width:50px;
  height:36px;
  padding:0 13px;
  border:1px solid #ffb7b9;
  border-radius:10px;
  background:#fff;
  color:var(--red);
  font-size:12px;
  font-weight:750;
}

/* =========================================================
   CONTEÚDO
========================================================= */

.content{
  min-height:100vh;
  margin-left:var(--sidebar);
  padding:calc(var(--topbar) + 8px) 28px 36px;
}

.dashboard-heading,
.avisos-sistema{
  display:none;
}

.filtros{
  width:100%;
  min-height:100px;
  margin:0 0 16px;
  padding:16px 18px;
  display:flex;
  align-items:flex-end;
  gap:12px;
  border:1px solid var(--line);
  border-radius:16px;
  background:#fff;
  box-shadow:var(--shadow-sm);
}

.filtros label{
  display:flex;
  flex-direction:column;
  gap:7px;
  color:#475467;
  font-size:10px;
  font-weight:850;
  letter-spacing:1px;
}

.filtros input{
  width:250px;
  height:42px;
  padding:0 12px;
  border:1px solid var(--line);
  border-radius:10px;
  outline:none;
  background:#fbfcfe;
  color:#344054;
  font-size:12px;
  font-weight:650;
}

#btnLimparFiltro{
  height:42px;
  padding:0 17px;
  border:1px solid var(--line);
  border-radius:10px;
  background:#fff;
  color:#475467;
  font-size:12px;
  font-weight:750;
}

/* =========================================================
   CARDS
========================================================= */

.cards{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:16px;
  margin-bottom:17px;
}

.cards .card{
  position:relative;
  min-height:116px;
  padding:18px 20px 17px 94px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  border:1px solid var(--line);
  border-radius:18px;
  background:#fff;
  box-shadow:var(--shadow);
  overflow:hidden;
}

.cards .card:before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  width:3px;
}

.cards .card:after{
  content:"";
  position:absolute;
  left:20px;
  top:50%;
  width:56px;
  height:56px;
  transform:translateY(-50%);
  display:grid;
  place-items:center;
  border-radius:50%;
  font-size:28px;
  font-weight:500;
  opacity:1;
}

.card-icon{display:none}

.card.receita:before{background:var(--green)}
.card.despesa:before{background:var(--red)}
.card.investimento:before{background:var(--blue)}
.card.saldo:before{background:#fff}

.card.receita:after{content:"↑";background:#e1f5e9;color:var(--green)}
.card.despesa:after{content:"↓";background:#ffe5e6;color:var(--red)}
.card.investimento:after{content:"◔";background:#e4efff;color:var(--blue)}
.card.saldo:after{content:"▱";background:rgba(255,255,255,.10);color:#fff}

.card-label{
  margin:0 0 6px;
  color:#475467;
  font-size:11px;
  font-weight:800;
  letter-spacing:.8px;
}

.cards .card strong{
  color:var(--text);
  font-size:24px;
  font-weight:850;
  line-height:1.1;
  letter-spacing:-.7px;
}

.cards .card small{
  margin-top:5px;
  color:#667085;
  font-size:11px;
}

.cards .receita strong{color:var(--green)}
.cards .despesa strong{color:var(--red)}
.cards .investimento strong{color:var(--blue)}

.cards .saldo{
  border-color:#0b3554;
  background:linear-gradient(135deg,#0a2943,#123b5d);
}

.cards .saldo .card-label,
.cards .saldo small{color:#d7e6f3}
.cards .saldo strong{color:#fff}

.alertas{
  grid-column:1/-1;
  min-height:42px;
  display:flex;
  align-items:center;
  gap:12px;
  margin-top:-2px;
  padding:0 12px;
  color:#475467;
  font-size:12px;
}

.alerta{
  padding:8px 10px!important;
  border:0!important;
  border-radius:9px!important;
  background:transparent!important;
  font-size:12px!important;
  font-weight:550!important;
}

.alerta:before{margin-right:7px}
.alerta.verde{color:#087443!important}
.alerta.verde:before{content:"✓";color:#12a66a}
.alerta.amarelo{color:#667085!important}
.alerta.amarelo:before{content:"💡"}
.alerta.azul{color:#1757b5!important}
.alerta.vermelho{color:#b4232a!important}

/* =========================================================
   TÍTULO DE ANÁLISE
========================================================= */

.dashboard-section-title{
  margin:2px 0 10px;
}

.dashboard-section-title .eyebrow{display:block;color:#344054}
.dashboard-section-title h2{
  margin:4px 0 0;
  color:var(--text);
  font-size:20px;
  font-weight:850;
  letter-spacing:-.35px;
}

/* =========================================================
   GRÁFICOS — tamanho controlado para nunca cortar a pizza
========================================================= */

.graficos{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}

.grafico-box{
  min-width:0;
  height:276px;
  padding:18px 20px 14px;
  border:1px solid var(--line);
  border-radius:18px;
  background:#fff;
  box-shadow:var(--shadow);
  overflow:hidden;
}

.grafico-principal{
  height:276px;
}

.grafico-header{
  min-height:54px;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
  margin-bottom:3px;
}

.grafico-header h3{
  margin:0 0 5px;
  color:var(--text);
  font-size:15px;
  font-weight:800;
}

.grafico-header p{
  margin:0;
  color:var(--muted);
  font-size:11px;
}

.grafico-header select{
  width:162px;
  height:36px;
  flex:0 0 162px;
  padding:0 10px;
  border:1px solid var(--line);
  border-radius:9px;
  background:#fff;
  color:#344054;
  font-size:11px;
  font-weight:650;
}

.chart-wrap{
  position:relative;
  width:100%;
  min-width:0;
}

.chart-pie{
  height:194px;
}

.chart-bar{
  height:194px;
}

.chart-pie canvas,
.chart-bar canvas{
  display:block!important;
  width:100%!important;
  height:194px!important;
  max-width:100%!important;
}

.grafico-comparativo{
  height:246px;
  margin-top:16px;
}

.chart-line{
  height:174px;
}

.chart-line canvas{
  display:block!important;
  width:100%!important;
  height:174px!important;
}

.grafico-box canvas{
  max-width:100%;
}

/* =========================================================
   LANÇAMENTOS
========================================================= */

#lancamentos{
  max-width:1180px;
}

.page-heading{
  margin-bottom:18px;
}

.page-heading h2{
  margin:4px 0;
  color:var(--text);
  font-size:26px;
  font-weight:850;
}

.page-heading p{
  margin:0;
  color:var(--muted);
}

.lancamento-form-card,
.extrato-card{
  padding:20px;
  border:1px solid var(--line);
  border-radius:18px;
  background:#fff;
  box-shadow:var(--shadow);
}

.form-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:12px;
}

.form-grid input,
.form-grid select{
  width:100%;
  height:46px;
  padding:0 12px;
  border:1px solid var(--line);
  border-radius:10px;
  outline:none;
  background:#fbfcfe;
  color:var(--text);
}

#btnSalvar{
  width:100%;
  height:46px;
  margin-top:14px;
  border:0;
  border-radius:10px;
  background:var(--blue);
  color:#fff;
  font-weight:800;
}

.extrato-card{margin-top:18px}
.extrato-card h3{margin:0 0 12px}
#listaLancamentos{margin:0;padding:0;list-style:none}
#btnExportarPdf{
  width:auto;
  min-width:180px;
  height:42px;
  margin-top:15px;
  padding:0 16px;
  border:1px solid var(--line);
  border-radius:10px;
  background:#fff;
  color:#344054;
  font-weight:750;
}

.creditos-app{
  margin-top:28px;
  padding:16px 0;
  border-top:1px solid var(--line);
  color:#98a2b3;
  font-size:10px;
  text-align:center;
}

/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width:1100px){
  :root{--sidebar:220px}
  .content{padding-left:20px;padding-right:20px}
  .cards{grid-template-columns:repeat(2,minmax(0,1fr))}
}

@media (max-width:850px){
  .topbar{left:0}
  .sidebar{
    transform:translateX(-102%);
    transition:transform .2s ease;
  }
  .sidebar.open{transform:translateX(0)}
  .content{margin-left:0;padding-top:calc(var(--topbar) + 12px)}
  .btn-menu{display:grid}
  .topbar-center{margin-left:auto;margin-right:12px}
  .graficos{grid-template-columns:1fr}
  .grafico-box,.grafico-principal{height:300px}
  .chart-pie,.chart-bar{height:218px}
  .chart-pie canvas,.chart-bar canvas{height:218px!important}
}

@media (max-width:600px){
  .topbar{padding:0 12px}
  .topbar-title{font-size:14px}
  .topbar-center{display:none}
  .btn-logout-top{height:34px;padding:0 10px}
  .content{padding-left:12px;padding-right:12px}

  .filtros{
    align-items:stretch;
    flex-direction:column;
    padding:14px;
  }

  .filtros input,#btnLimparFiltro{width:100%}

  .cards{grid-template-columns:1fr;gap:10px}
  .cards .card{min-height:108px}

  .grafico-box,.grafico-principal{height:320px;padding:16px}
  .grafico-header{flex-direction:column}
  .grafico-header select{width:100%;flex-basis:auto}
  .chart-pie,.chart-bar{height:220px}
  .chart-pie canvas,.chart-bar canvas{height:220px!important}
  .grafico-comparativo{height:290px}
  .chart-line{height:205px}
  .chart-line canvas{height:205px!important}

  .form-grid{grid-template-columns:1fr}
}

@media (max-width:420px){
  .cards .card{padding-left:84px}
  .cards .card:after{left:16px;width:52px;height:52px}
  .cards .card strong{font-size:21px}
}
/* =========================================================
   TCS FINANCE — AJUSTE FINAL DE LAYOUT
   FULL WIDTH + GRÁFICOS + PIZZA
   ========================================================= */

/* ---------------------------------------------------------
   ESTRUTURA PRINCIPAL
   --------------------------------------------------------- */

html,
body {
    width: 100%;
    min-width: 0;
    overflow-x: hidden;
}

#app {
    width: 100%;
    min-height: 100vh;
}

.content {
    width: calc(100% - var(--sidebar));
    max-width: none !important;
    min-width: 0;
    margin-left: var(--sidebar) !important;
    margin-right: 0 !important;
    padding: calc(var(--topbar) + 18px) 28px 40px !important;
    box-sizing: border-box;
}

/* O conteúdo interno não deve criar uma largura artificial */
#dashboard {
    width: 100%;
    max-width: none !important;
    min-width: 0;
}

/* ---------------------------------------------------------
   FILTRO
   --------------------------------------------------------- */

.filtros {
    width: 100%;
    max-width: none !important;
    box-sizing: border-box;
}

/* ---------------------------------------------------------
   CARDS FINANCEIROS
   --------------------------------------------------------- */

.cards {
    width: 100%;
    max-width: none !important;

    display: grid !important;
    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 16px !important;
}

.cards .card {
    min-width: 0;
    width: 100%;
}

/* ---------------------------------------------------------
   ALERTAS
   --------------------------------------------------------- */

.alertas {
    width: 100%;
    min-width: 0;
}

/* ---------------------------------------------------------
   ÁREA DE ANÁLISE
   --------------------------------------------------------- */

.dashboard-section-title {
    width: 100%;
}

/* ---------------------------------------------------------
   DOIS GRÁFICOS SUPERIORES
   --------------------------------------------------------- */

.graficos {
    width: 100%;
    max-width: none !important;
    min-width: 0;

    display: grid !important;
    grid-template-columns:
        minmax(0, 1fr)
        minmax(0, 1fr);

    gap: 18px !important;

    align-items: stretch;
}

/* ---------------------------------------------------------
   CARDS DOS GRÁFICOS
   --------------------------------------------------------- */

.grafico-box {
    width: 100%;
    min-width: 0;

    box-sizing: border-box;

    background: #fff;

    border: 1px solid var(--line);
    border-radius: 18px;

    box-shadow:
        0 8px 26px rgba(16, 24, 40, .055);

    overflow: hidden;
}

/* Os dois cards superiores ficam com a mesma altura */
.graficos > .grafico-box {
    height: 330px;
}

/* ---------------------------------------------------------
   CABEÇALHO DOS GRÁFICOS
   --------------------------------------------------------- */

.grafico-header {
    width: 100%;
    min-width: 0;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 16px;

    margin-bottom: 6px;
}

.grafico-header > div {
    min-width: 0;
}

.grafico-header h3 {
    margin: 0 0 5px;

    color: var(--text);

    font-size: 15px;
    font-weight: 800;

    line-height: 1.25;
}

.grafico-header p {
    margin: 0;

    color: var(--muted);

    font-size: 11px;
    line-height: 1.4;
}

.grafico-header select {
    flex: 0 0 155px;

    width: 155px;
    height: 36px;

    box-sizing: border-box;

    padding: 0 10px;

    border: 1px solid var(--line);
    border-radius: 9px;

    background: #fff;
    color: #344054;

    font-size: 11px;
    font-weight: 650;
}

/* ---------------------------------------------------------
   ÁREA INTERNA DOS GRÁFICOS
   --------------------------------------------------------- */

.chart-wrap {
    position: relative;

    width: 100%;
    min-width: 0;

    box-sizing: border-box;
}

/* ---------------------------------------------------------
   PIZZA — CORREÇÃO DEFINITIVA
   --------------------------------------------------------- */

/*
   A pizza estava sendo cortada porque o canvas tinha
   uma altura grande demais para o espaço vertical disponível.

   Agora damos uma área própria e controlada.
*/

.chart-pie {
    position: relative;

    width: 100%;
    height: 238px !important;

    min-height: 238px;
    max-height: 238px;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
}

/*
   O canvas não pode ultrapassar a área do card.
*/

.chart-pie canvas {
    display: block !important;

    width: 100% !important;
    height: 238px !important;

    max-width: 100% !important;
    max-height: 238px !important;

    box-sizing: border-box;
}

/*
   IMPORTANTE:
   quando o gráfico for circular, deixamos o espaço
   horizontal e vertical igualmente disponível.
*/

.grafico-principal .chart-pie {
    overflow: hidden;
}

/* ---------------------------------------------------------
   GRÁFICO DE BARRAS
   --------------------------------------------------------- */

.chart-bar {
    position: relative;

    width: 100%;
    height: 238px !important;

    min-height: 238px;
    max-height: 238px;

    box-sizing: border-box;
}

.chart-bar canvas {
    display: block !important;

    width: 100% !important;
    height: 238px !important;

    max-width: 100% !important;
    max-height: 238px !important;

    box-sizing: border-box;
}

/* ---------------------------------------------------------
   GRÁFICO DE EVOLUÇÃO
   --------------------------------------------------------- */

.grafico-comparativo {
    width: 100%;
    max-width: none !important;

    height: 340px;

    margin-top: 18px;

    box-sizing: border-box;
}

.chart-line {
    position: relative;

    width: 100%;

    height: 260px !important;

    min-height: 260px;
}

.chart-line canvas {
    display: block !important;

    width: 100% !important;
    height: 260px !important;

    max-width: 100% !important;
    max-height: 260px !important;

    box-sizing: border-box;
}

/* ---------------------------------------------------------
   EVITA QUALQUER ESTOURO HORIZONTAL
   --------------------------------------------------------- */

.graficos,
.grafico-box,
.chart-wrap,
.chart-pie,
.chart-bar,
.chart-line,
.grafico-box canvas {
    max-width: 100%;
}

/* ---------------------------------------------------------
   LANÇAMENTOS TAMBÉM APROVEITA A TELA
   --------------------------------------------------------- */

#lancamentos {
    width: 100%;
    max-width: none !important;
}

/* ---------------------------------------------------------
   FOOTER
   --------------------------------------------------------- */

.creditos-app {
    width: 100%;
    box-sizing: border-box;
}

/* =========================================================
   TELAS GRANDES
   ========================================================= */

@media (min-width: 1600px) {

    .content {
        padding-left: 34px !important;
        padding-right: 34px !important;
    }

    .cards {
        gap: 18px !important;
    }

    .graficos {
        gap: 20px !important;
    }

    .graficos > .grafico-box {
        height: 350px;
    }

    .chart-pie,
    .chart-bar {
        height: 258px !important;
        min-height: 258px;
        max-height: 258px;
    }

    .chart-pie canvas,
    .chart-bar canvas {
        height: 258px !important;
        max-height: 258px !important;
    }

    .grafico-comparativo {
        height: 360px;
    }

    .chart-line {
        height: 278px !important;
    }

    .chart-line canvas {
        height: 278px !important;
        max-height: 278px !important;
    }
}

/* =========================================================
   NOTEBOOK / TELAS MÉDIAS
   ========================================================= */

@media (max-width: 1200px) {

    .content {
        padding-left: 20px !important;
        padding-right: 20px !important;
    }

    .cards {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));
    }

    .graficos {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));
    }
}

/* =========================================================
   TABLET / MENU MOBILE
   ========================================================= */

@media (max-width: 850px) {

    .content {
        width: 100%;
        margin-left: 0 !important;

        padding:
            calc(var(--topbar) + 16px)
            18px
            32px !important;
    }

    .graficos {
        grid-template-columns: 1fr;
    }

    .graficos > .grafico-box {
        height: 330px;
    }

    .chart-pie,
    .chart-bar {
        height: 240px !important;
        min-height: 240px;
        max-height: 240px;
    }

    .chart-pie canvas,
    .chart-bar canvas {
        height: 240px !important;
        max-height: 240px !important;
    }

    .grafico-comparativo {
        height: 300px;
    }

    .chart-line {
        height: 220px !important;
    }

    .chart-line canvas {
        height: 220px !important;
        max-height: 220px !important;
    }
}

/* =========================================================
   CELULAR
   ========================================================= */

@media (max-width: 600px) {

    .content {
        padding:
            calc(var(--topbar) + 14px)
            12px
            28px !important;
    }

    .filtros {
        flex-direction: column !important;
        align-items: stretch !important;
    }

    .filtros input,
    #btnLimparFiltro {
        width: 100%;
    }

    .cards {
        grid-template-columns: 1fr 1fr;
        gap: 10px !important;
    }

    .cards .card {
        min-height: 126px;
        padding: 15px !important;
    }

    .cards .card strong {
        font-size: 18px !important;
        word-break: break-word;
    }

    .graficos {
        grid-template-columns: 1fr;
        gap: 12px !important;
    }

    .graficos > .grafico-box {
        height: 330px;
        padding: 15px !important;
    }

    .grafico-header {
        flex-direction: column;
        gap: 10px;
    }

    .grafico-header select {
        width: 100%;
        flex-basis: auto;
    }

    .chart-pie,
    .chart-bar {
        height: 230px !important;
        min-height: 230px;
        max-height: 230px;
    }

    .chart-pie canvas,
    .chart-bar canvas {
        height: 230px !important;
        max-height: 230px !important;
    }

    .grafico-comparativo {
        height: 300px;
        margin-top: 12px;
    }

    .chart-line {
        height: 215px !important;
        min-height: 215px;
    }

    .chart-line canvas {
        height: 215px !important;
        max-height: 215px !important;
    }
}

/* =========================================================
   CELULARES PEQUENOS
   ========================================================= */

@media (max-width: 420px) {

    .cards {
        grid-template-columns: 1fr;
    }

    .cards .card {
        min-height: 115px;
    }

    .grafico-box {
        border-radius: 15px;
    }

    .grafico-header h3 {
        font-size: 14px;
    }

    .chart-pie,
    .chart-bar {
        height: 220px !important;
        min-height: 220px;
        max-height: 220px;
    }

    .chart-pie canvas,
    .chart-bar canvas {
        height: 220px !important;
        max-height: 220px !important;
    }
}
/* =========================================================
   TCS FINANCE — CORREÇÃO MENU MOBILE
   JS utiliza "active"
   ========================================================= */

@media (max-width: 850px) {

    .sidebar {
        transform: translateX(-102%) !important;
        transition: transform .25s ease !important;
        left: 0 !important;
        visibility: hidden;
    }

    .sidebar.active {
        transform: translateX(0) !important;
        visibility: visible;
    }

    .btn-menu {
        display: grid !important;
        position: relative;
        z-index: 1400;
        pointer-events: auto;
    }

    #menuOverlay {
        position: fixed;
        inset: 0;
        z-index: 1250;
        background: rgba(7, 27, 44, .42);
        backdrop-filter: blur(2px);
    }

    #menuOverlay.hidden {
        display: none !important;
    }

    .sidebar {
        z-index: 1300;
    }

    .topbar {
        z-index: 1200;
    }
}
/* =========================================================
   TCS FINANCE — CARDS MOBILE
   Layout compacto e sem sobreposição
   ========================================================= */

@media (max-width: 600px) {

    .cards {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 12px !important;
    }

    .cards .card {
        width: 100%;
        min-width: 0;
        min-height: 96px;

        padding: 14px 16px 14px 72px !important;

        display: flex;
        flex-direction: column;
        justify-content: center;

        overflow: hidden;
    }

    .cards .card:after {
        left: 16px !important;

        width: 42px !important;
        height: 42px !important;

        font-size: 21px !important;
    }

    .cards .card-label {
        margin-bottom: 4px !important;
        font-size: 10px !important;
        line-height: 1.2;
    }

    .cards .card strong {
        display: block;

        max-width: 100%;

        font-size: 21px !important;
        line-height: 1.15 !important;
        letter-spacing: -.4px !important;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .cards .card small {
        margin-top: 4px !important;
        font-size: 10px !important;
        line-height: 1.2;
    }
}


/* ---------------------------------------------------------
   CELULARES MUITO PEQUENOS
   --------------------------------------------------------- */

@media (max-width: 420px) {

    .cards {
        grid-template-columns: 1fr !important;
    }

    .cards .card {
        min-height: 92px;

        padding:
            13px
            14px
            13px
            66px !important;
    }

    .cards .card:after {
        left: 13px !important;

        width: 40px !important;
        height: 40px !important;

        font-size: 20px !important;
    }

    .cards .card strong {
        font-size: 19px !important;
    }
}
/* =========================================================
   RELATÓRIOS
   ========================================================= */

#relatorios {
    width: 100%;
    max-width: none;
}

.relatorios-grid {
    display: grid;
    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 16px;

    margin-top: 20px;
}

.relatorio-card {
    min-height: 120px;

    display: flex;
    align-items: center;

    gap: 14px;

    padding: 18px;

    border: 1px solid var(--line);
    border-radius: 18px;

    background: #fff;

    box-shadow: var(--shadow);
}

.relatorio-icon {
    width: 48px;
    height: 48px;

    flex: 0 0 48px;

    display: grid;
    place-items: center;

    border-radius: 50%;

    background: var(--blue-soft);
    color: var(--blue);

    font-size: 22px;
    font-weight: 700;
}

.relatorio-card small {
    display: block;

    margin-bottom: 5px;

    color: var(--muted);

    font-size: 10px;
    font-weight: 800;

    letter-spacing: .8px;
}

.relatorio-card strong {
    display: block;

    color: var(--text);

    font-size: 22px;
    font-weight: 850;
}

.relatorio-saldo {
    background: linear-gradient(
        135deg,
        #0a2943,
        #123b5d
    );

    border-color: #0b3554;
}

.relatorio-saldo small {
    color: #d7e6f3;
}

.relatorio-saldo strong {
    color: #fff;
}

.relatorio-saldo .relatorio-icon {
    background: rgba(255,255,255,.10);
    color: #fff;
}

.relatorio-resumo {
    margin-top: 20px;

    padding: 22px;

    border: 1px solid var(--line);
    border-radius: 18px;

    background: #fff;

    box-shadow: var(--shadow);
}

.relatorio-resumo h3 {
    margin: 0 0 4px;

    font-size: 16px;
}

.relatorio-resumo p {
    margin: 0 0 18px;

    color: var(--muted);

    font-size: 12px;
}

.relatorio-linha {
    min-height: 48px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 4px;

    border-bottom: 1px solid var(--line);

    color: #475467;
}

.relatorio-linha strong {
    color: var(--text);
}

.relatorio-linha.destaque {
    margin-top: 4px;

    border-bottom: 0;

    font-weight: 800;
}

.relatorio-linha.destaque strong {
    color: var(--blue);
}


/* MOBILE */

@media (max-width: 850px) {

    .relatorios-grid {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {

    .relatorios-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .relatorio-card {
        min-height: 92px;
        padding: 14px;
    }

    .relatorio-icon {
        width: 42px;
        height: 42px;
        flex-basis: 42px;
        font-size: 19px;
    }

    .relatorio-card strong {
        font-size: 20px;
    }
}
/* ==========================================================
   TCS FINANCE — RECORRÊNCIAS
   ========================================================== */

#recorrencias {
  width: 100%;
  animation: aparecerRecorrencias 0.25s ease;
}

@keyframes aparecerRecorrencias {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* ==========================================================
   CABEÇALHO
   ========================================================== */

#recorrencias .page-heading {
  margin-bottom: 24px;
}

#recorrencias .page-heading .eyebrow {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  opacity: 0.65;
}

#recorrencias .page-heading h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}

#recorrencias .page-heading p {
  margin: 7px 0 0;
  opacity: 0.65;
  font-size: 14px;
}


/* ==========================================================
   CARD DO FORMULÁRIO
   ========================================================== */

.recorrencias-form-card,
.recorrencias-lista-card {
  width: 100%;
  box-sizing: border-box;
  padding: 24px;
  margin-bottom: 20px;

  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e7eaf0);
  border-radius: 18px;

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.04);
}


/* ==========================================================
   CABEÇALHO INTERNO DOS CARDS
   ========================================================== */

.recorrencias-form-card .section-card-heading,
.recorrencias-lista-card .section-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 22px;
}

.recorrencias-form-card .section-card-heading h3,
.recorrencias-lista-card .section-card-heading h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.recorrencias-form-card .section-card-heading p,
.recorrencias-lista-card .section-card-heading p {
  margin: 5px 0 0;
  font-size: 13px;
  opacity: 0.62;
}


/* ==========================================================
   GRID DO FORMULÁRIO
   ========================================================== */

.recorrencia-form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  width: 100%;
}


/* ==========================================================
   CAMPOS
   ========================================================== */

.recorrencia-form-grid .field-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.recorrencia-form-grid .field-group span {
  font-size: 12px;
  font-weight: 750;
  opacity: 0.75;
}

.recorrencia-form-grid input,
.recorrencia-form-grid select {
  width: 100%;
  min-width: 0;
  height: 46px;

  box-sizing: border-box;

  padding: 0 13px;

  border: 1px solid var(--border-color, #dfe3ea);
  border-radius: 11px;

  background: var(--input-bg, #ffffff);
  color: inherit;

  font-family: inherit;
  font-size: 14px;

  outline: none;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.recorrencia-form-grid input:focus,
.recorrencia-form-grid select:focus {
  border-color: var(--primary, #2563eb);

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.10);
}


/* ==========================================================
   CAIXA INFORMATIVA
   ========================================================== */

.recorrencia-info-box {
  display: flex;
  align-items: center;
  gap: 13px;

  margin-top: 22px;
  padding: 14px 16px;

  border-radius: 13px;

  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.12);
}

.recorrencia-info-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: rgba(37, 99, 235, 0.10);

  font-size: 20px;
}

.recorrencia-info-box strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
}

.recorrencia-info-box p {
  margin: 3px 0 0;

  font-size: 12px;
  line-height: 1.45;

  opacity: 0.65;
}


/* ==========================================================
   BOTÕES
   ========================================================== */

.contas-form-actions {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-top: 22px;
}

.btn-primary-tcs,
.btn-secondary-tcs {
  min-height: 44px;

  padding: 0 18px;

  border-radius: 10px;

  font-family: inherit;
  font-size: 13px;
  font-weight: 750;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease,
    box-shadow 0.15s ease;
}

.btn-primary-tcs {
  border: none;

  background: var(--primary, #2563eb);
  color: #ffffff;

  box-shadow:
    0 5px 14px rgba(37, 99, 235, 0.20);
}

.btn-primary-tcs:hover {
  transform: translateY(-1px);
  opacity: 0.94;
}

.btn-secondary-tcs {
  border: 1px solid var(--border-color, #dfe3ea);

  background: transparent;
  color: inherit;
}

.btn-secondary-tcs:hover {
  background: rgba(0, 0, 0, 0.035);
}


/* ==========================================================
   RESUMO
   ========================================================== */

.recorrencias-resumo-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 18px;

  width: 100%;

  margin-bottom: 20px;
}

.recorrencia-resumo-card {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 14px;

  padding: 18px;

  border-radius: 16px;

  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e7eaf0);

  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.035);
}

.recorrencia-resumo-icon {
  width: 44px;
  height: 44px;

  flex: 0 0 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: rgba(37, 99, 235, 0.08);

  font-size: 21px;
}

.recorrencia-resumo-card div {
  min-width: 0;
}

.recorrencia-resumo-card div span {
  display: block;

  margin-bottom: 3px;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.8px;

  opacity: 0.55;
}

.recorrencia-resumo-card div strong {
  display: block;

  font-size: 24px;
  font-weight: 850;

  line-height: 1.1;
}


/* ==========================================================
   LISTA
   ========================================================== */

.recorrencias-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 16px;

  width: 100%;
}


/* ==========================================================
   CARD INDIVIDUAL DA RECORRÊNCIA
   ========================================================== */

.recorrencia-item {
  position: relative;

  display: flex;
  flex-direction: column;

  min-width: 0;

  padding: 19px;

  border-radius: 15px;

  border: 1px solid var(--border-color, #e7eaf0);

  background: var(--card-bg, #ffffff);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.recorrencia-item:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.06);
}


/* ==========================================================
   CABEÇALHO DO ITEM
   ========================================================== */

.recorrencia-item-topo {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.recorrencia-item-identificacao {
  display: flex;

  align-items: center;

  gap: 12px;

  min-width: 0;
}

.recorrencia-item-icone {
  width: 42px;
  height: 42px;

  flex: 0 0 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: rgba(37, 99, 235, 0.08);

  font-size: 19px;
}

.recorrencia-item-titulo {
  min-width: 0;
}

.recorrencia-item-titulo strong {
  display: block;

  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 14px;
  font-weight: 800;
}

.recorrencia-item-titulo span {
  display: block;

  margin-top: 3px;

  font-size: 11px;

  opacity: 0.58;
}


/* ==========================================================
   STATUS
   ========================================================== */

.recorrencia-status {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  flex: 0 0 auto;

  padding: 5px 9px;

  border-radius: 999px;

  font-size: 10px;
  font-weight: 800;
}

.recorrencia-status.ativa {
  background: rgba(22, 163, 74, 0.10);
  color: #15803d;
}

.recorrencia-status.pausada {
  background: rgba(234, 88, 12, 0.10);
  color: #c2410c;
}


/* ==========================================================
   VALOR
   ========================================================== */

.recorrencia-item-valor {
  margin-top: 18px;

  font-size: 23px;
  font-weight: 850;

  line-height: 1.1;
}


/* ==========================================================
   INFORMAÇÕES
   ========================================================== */

.recorrencia-item-info {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;

  margin-top: 16px;
}

.recorrencia-item-info-bloco {
  min-width: 0;

  padding: 10px;

  border-radius: 10px;

  background: rgba(0, 0, 0, 0.025);
}

.recorrencia-item-info-bloco span {
  display: block;

  font-size: 10px;
  font-weight: 700;

  opacity: 0.52;

  margin-bottom: 4px;
}

.recorrencia-item-info-bloco strong {
  display: block;

  font-size: 12px;

  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}


/* ==========================================================
   PRÓXIMO LANÇAMENTO
   ========================================================== */

.recorrencia-proximo {
  margin-top: 13px;

  padding: 11px 12px;

  border-radius: 10px;

  background: rgba(37, 99, 235, 0.05);
}

.recorrencia-proximo span {
  display: block;

  font-size: 10px;
  font-weight: 700;

  opacity: 0.55;

  margin-bottom: 3px;
}

.recorrencia-proximo strong {
  font-size: 12px;
}


/* ==========================================================
   AÇÕES DO ITEM
   ========================================================== */

.recorrencia-item-acoes {
  display: flex;

  align-items: center;

  gap: 8px;

  margin-top: 17px;

  padding-top: 14px;

  border-top: 1px solid var(--border-color, #edf0f4);
}

.recorrencia-item-acoes button {
  min-height: 35px;

  padding: 0 10px;

  border-radius: 8px;

  border: 1px solid var(--border-color, #dfe3ea);

  background: transparent;

  color: inherit;

  font-family: inherit;

  font-size: 11px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.recorrencia-item-acoes button:hover {
  background: rgba(0, 0, 0, 0.035);

  transform: translateY(-1px);
}

.recorrencia-item-acoes .acao-excluir {
  margin-left: auto;
}


/* ==========================================================
   ESTADO VAZIO
   ========================================================== */

.recorrencias-vazio {
  grid-column: 1 / -1;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  min-height: 210px;

  padding: 25px;

  text-align: center;

  border: 1px dashed var(--border-color, #dfe3ea);

  border-radius: 15px;
}

.recorrencias-vazio-icone {
  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 12px;

  border-radius: 15px;

  background: rgba(37, 99, 235, 0.07);

  font-size: 24px;
}

.recorrencias-vazio strong {
  font-size: 14px;
  font-weight: 800;
}

.recorrencias-vazio p {
  max-width: 420px;

  margin: 6px 0 0;

  font-size: 12px;

  line-height: 1.5;

  opacity: 0.58;
}


/* ==========================================================
   DARK MODE
   ========================================================== */

body.dark .recorrencias-form-card,
body.dark .recorrencias-lista-card,
body.dark .recorrencia-resumo-card,
body.dark .recorrencia-item {
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.16);
}

body.dark .recorrencia-item-info-bloco {
  background: rgba(255, 255, 255, 0.035);
}

body.dark .btn-secondary-tcs,
body.dark .recorrencia-item-acoes button {
  border-color: rgba(255, 255, 255, 0.10);
}


/* ==========================================================
   TABLET
   ========================================================== */

@media (max-width: 1100px) {

  .recorrencia-form-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .recorrencias-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

}


/* ==========================================================
   MOBILE
   ========================================================== */

@media (max-width: 700px) {

  #recorrencias .page-heading {
    margin-bottom: 18px;
  }

  #recorrencias .page-heading h2 {
    font-size: 23px;
  }

  #recorrencias .page-heading p {
    font-size: 12px;
    line-height: 1.45;
  }


  .recorrencias-form-card,
  .recorrencias-lista-card {
    padding: 17px;

    border-radius: 15px;

    margin-bottom: 15px;
  }


  .recorrencias-form-card .section-card-heading,
  .recorrencias-lista-card .section-card-heading {
    margin-bottom: 17px;
  }


  .recorrencias-form-card .section-card-heading h3,
  .recorrencias-lista-card .section-card-heading h3 {
    font-size: 16px;
  }


  .recorrencias-form-card .section-card-heading p,
  .recorrencias-lista-card .section-card-heading p {
    font-size: 11px;
    line-height: 1.4;
  }


  .recorrencia-form-grid {
    grid-template-columns: 1fr;

    gap: 13px;
  }


  .recorrencia-form-grid input,
  .recorrencia-form-grid select {
    height: 45px;

    font-size: 13px;
  }


  .recorrencia-info-box {
    align-items: flex-start;

    padding: 12px;
  }


  .recorrencia-info-icon {
    width: 34px;
    height: 34px;

    flex-basis: 34px;

    font-size: 17px;
  }


  .recorrencia-info-box strong {
    font-size: 12px;
  }


  .recorrencia-info-box p {
    font-size: 11px;
  }


  .contas-form-actions {
    flex-direction: column;

    align-items: stretch;

    width: 100%;
  }


  .btn-primary-tcs,
  .btn-secondary-tcs {
    width: 100%;
  }


  .recorrencias-resumo-grid {
    grid-template-columns: 1fr;

    gap: 10px;

    margin-bottom: 15px;
  }


  .recorrencia-resumo-card {
    padding: 14px;
  }


  .recorrencia-resumo-icon {
    width: 40px;
    height: 40px;

    flex-basis: 40px;
  }


  .recorrencia-resumo-card div strong {
    font-size: 21px;
  }


  .recorrencias-grid {
    grid-template-columns: 1fr;

    gap: 11px;
  }


  .recorrencia-item {
    padding: 15px;
  }


  .recorrencia-item-topo {
    gap: 8px;
  }


  .recorrencia-item-identificacao {
    gap: 9px;
  }


  .recorrencia-item-icone {
    width: 38px;
    height: 38px;

    flex-basis: 38px;

    font-size: 17px;
  }


  .recorrencia-item-titulo strong {
    font-size: 13px;
  }


  .recorrencia-item-titulo span {
    font-size: 10px;
  }


  .recorrencia-status {
    padding: 4px 7px;

    font-size: 9px;
  }


  .recorrencia-item-valor {
    margin-top: 15px;

    font-size: 21px;
  }


  .recorrencia-item-info {
    gap: 7px;

    margin-top: 13px;
  }


  .recorrencia-item-info-bloco {
    padding: 9px;
  }


  .recorrencia-item-info-bloco span {
    font-size: 9px;
  }


  .recorrencia-item-info-bloco strong {
    font-size: 11px;
  }


  .recorrencia-proximo {
    margin-top: 10px;

    padding: 10px;
  }


  .recorrencia-proximo span {
    font-size: 9px;
  }


  .recorrencia-proximo strong {
    font-size: 11px;
  }


  .recorrencia-item-acoes {
    flex-wrap: wrap;

    margin-top: 13px;

    padding-top: 12px;
  }


  .recorrencia-item-acoes button {
    flex: 1;

    min-height: 36px;

    padding: 0 7px;

    font-size: 10px;
  }


  .recorrencia-item-acoes .acao-excluir {
    margin-left: 0;
  }

}


/* ==========================================================
   MOBILE PEQUENO
   ========================================================== */

@media (max-width: 390px) {

  .recorrencias-form-card,
  .recorrencias-lista-card {
    padding: 14px;
  }


  .recorrencia-item {
    padding: 13px;
  }


  .recorrencia-item-topo {
    align-items: flex-start;
  }


  .recorrencia-item-identificacao {
    max-width: calc(100% - 70px);
  }


  .recorrencia-item-info {
    grid-template-columns: 1fr;
  }


  .recorrencia-item-acoes button {
    min-width: 0;

    padding: 0 5px;

    font-size: 9px;
  }

}

/* =========================================================
   TCS FINANCE — RELATÓRIOS SEM RECORRÊNCIAS
   ========================================================= */
.relatorios-cards{margin-top:18px}
.relatorio-resumo>div{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:7px}
.relatorio-resumo span{color:var(--muted);font-size:12px;text-transform:uppercase;font-weight:700;letter-spacing:.04em}
.relatorio-resumo strong{font-size:20px}
@media(max-width:700px){.relatorio-resumo{grid-template-columns:1fr 1fr!important}.relatorios-cards{grid-template-columns:1fr 1fr!important}}



===== ARQUIVO 3 — Script.js =====

/* =========================================================
   TCS FINANCE
   SCRIPT.JS — VERSÃO SEM RECORRÊNCIAS
   25/08/2026
   =========================================================
   Recursos:
   - Login / sessão persistente / logout
   - Cadastro / recuperação de senha
   - Lançamentos: Receita, Despesa, Investimento
   - Categorias por tipo
   - Tipos de investimento detalhados por categoria
   - Editar / excluir lançamentos
   - Filtro mensal
   - Dashboard financeiro
   - Gastos por categoria
   - Investimentos por categoria
   - Gráficos Chart.js
   - Alertas financeiros
   - Exportação PDF
   - Compatível com o HTML atual
   - Sem módulo de recorrências
   ========================================================= */

console.log("TCS Finance: carregando Script.js...");

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     CONFIGURAÇÃO
     ========================================================= */

  const SUPABASE_URL = "https://figkamlmpangolnasaby.supabase.co";
  const SUPABASE_KEY = "sb_publishable_qkDLfEnWNNXyqQVdogQzBQ_Sre7CVBL";

  const LIMITE_FREE = 30;
  const $ = (id) => document.getElementById(id);

  let supabaseClient = null;
  let usuarioAtual = null;
  let dados = [];
  let categoriasFinanceiras = [];
  let idEmEdicao = null;

  let grafico = null;
  let graficoMensal = null;
  let graficoComparativo = null;

  let inicializando = false;
  let sessaoPronta = false;

  /* =========================================================
     ELEMENTOS
     ========================================================= */

  const loginContainer = $("login-container");
  const app = $("app");
  const dashboard = $("dashboard");
  const lancamentos = $("lancamentos");
  const relatorios = $("relatorios");
  const contas = $("contas");
  const categoriasView = $("categorias");

  const emailInput = $("email");
  const senhaInput = $("senha");
  const aceiteTermos = $("aceiteTermos");

  const btnLogin = $("btnLogin");
  const btnCadastro = $("btnCadastro");
  const btnEsqueciSenha = $("btnEsqueciSenha");
  const btnLogout = $("btnLogout");
  const btnLogoutTop = $("btnLogoutTop");

  const btnDashboard = $("btnDashboard");
  const btnLancamentos = $("btnLancamentos");
  const btnRelatorios = $("btnRelatorios");
  const btnContas = $("btnContas");

  const btnSalvar = $("btnSalvar");
  const tipo = $("tipo");
  const categoria = $("categoria");
  const descricao = $("descricao");
  const valor = $("valor");
  const dataInput = $("data");
  const lista = $("listaLancamentos");

  const filtroMes = $("filtroMes");
  const btnLimparFiltro = $("btnLimparFiltro");
  const dashboardPeriodo = $("dashboardPeriodo");
  const tipoGrafico = $("tipoGrafico");

  const totalReceitas = $("totalReceitas");
  const totalDespesas = $("totalDespesas");
  const totalInvestimentos = $("totalInvestimentos");
  const saldo = $("saldo");

  const nomeCliente = $("nomeCliente");
  const topbarUser = $("topbarUser");
  const topbarPlano = $("topbarPlano");
  const planoUsuario = $("planoUsuario");

  const btnExportarPdf = $("btnExportarPdf");

  const btnMenu = $("btnMenu");
  const sidebar = document.querySelector(".sidebar");
  const menuOverlay = $("menuOverlay");

  /* =========================================================
     CATEGORIAS PADRÃO LOCAIS
     =========================================================
     Importante:
     Não gravamos automaticamente essas categorias no banco.
     Isso evita quebrar instalações antigas com CHECK/FK diferentes.
     O lançamento grava o NOME da categoria na coluna "categoria".
     ========================================================= */

  const categoriasPadrao = {
    Receita: [
      "Salário",
      "Renda Extra",
      "Freelance",
      "Vendas",
      "Comissões",
      "Benefícios",
      "Aluguéis",
      "Dividendos",
      "Juros",
      "Reembolsos",
      "Outras Receitas"
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
      "Outras Despesas"
    ],

    Investimento: [
      "Tesouro Direto",
      "CDB",
      "LCI/LCA",
      "Ações",
      "FIIs",
      "ETFs",
      "Criptomoedas",
      "Previdência",
      "Poupança",
      "Renda Fixa",
      "Outros Investimentos"
    ]
  };

  /* =========================================================
     UTILITÁRIOS
     ========================================================= */

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      };
      return map[char];
    });
  }

  function normalizarTipo(value) {
    const texto = String(value ?? "").trim().toLowerCase();

    if (texto === "receita") return "Receita";
    if (texto === "despesa") return "Despesa";
    if (texto === "investimento") return "Investimento";

    return String(value ?? "");
  }

  function numero(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    let texto = String(value ?? "").trim();

    if (!texto) return 0;

    /*
      Aceita:
      1234.56
      1234,56
      1.234,56
    */
    if (texto.includes(",")) {
      texto = texto.replace(/\./g, "").replace(",", ".");
    }

    const n = Number(texto);
    return Number.isFinite(n) ? n : 0;
  }

  function formatarMoeda(value) {
    return numero(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function formatarNumero(value) {
    return numero(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatarData(value) {
    if (!value) return "";

    const texto = String(value).slice(0, 10);
    const partes = texto.split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return texto;
  }

  function obterDataHoje() {
    const hoje = new Date();

    return [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, "0"),
      String(hoje.getDate()).padStart(2, "0")
    ].join("-");
  }

  function obterMesAtual() {
    const hoje = new Date();

    return [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, "0")
    ].join("-");
  }

  function formatarPeriodo(value) {
    if (!value) return "Todos os períodos";

    const partes = String(value).split("-");

    if (partes.length !== 2) return value;

    const data = new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      1
    );

    return data.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric"
    });
  }

  function obterNomeCategoriaDoSelect() {
    if (!categoria) return "";

    const option = categoria.options[categoria.selectedIndex];

    return (
      option?.dataset?.nome ||
      option?.textContent ||
      categoria.value ||
      ""
    ).trim();
  }

  function mostrarErroSupabase(prefixo, error) {
    console.error(prefixo, error);

    const mensagem = error?.message || "Erro desconhecido.";

    alert(`${prefixo}\n\n${mensagem}`);
  }

  /* =========================================================
     VISUAL
     ========================================================= */

  function mostrarLogin() {
    if (app) {
      app.classList.add("hidden");
      app.style.display = "none";
    }

    if (loginContainer) {
      loginContainer.classList.remove("hidden");
      loginContainer.style.display = "flex";
    }
  }

  function mostrarApp() {
    if (loginContainer) {
      loginContainer.classList.add("hidden");
      loginContainer.style.display = "none";
    }

    if (app) {
      app.classList.remove("hidden");
      app.style.display = "flex";
    }
  }

  function mostrarTela(tela) {
    [
      dashboard,
      lancamentos,
      relatorios,
      contas,
      categoriasView
    ].forEach((elemento) => {
      if (elemento) elemento.classList.add("hidden");
    });

    if (tela) tela.classList.remove("hidden");

    fecharMenuMobile();
  }

  function ativarMenu(botao) {
    document
      .querySelectorAll(".sidebar .nav-item, .sidebar button")
      .forEach((elemento) => elemento.classList.remove("active"));

    if (botao) botao.classList.add("active");
  }

  function fecharMenuMobile() {
    if (sidebar) sidebar.classList.remove("active");
    if (menuOverlay) menuOverlay.classList.add("hidden");
  }

  /* =========================================================
     SUPABASE
     ========================================================= */

  function inicializarSupabase() {
    if (
      !window.supabase ||
      typeof window.supabase.createClient !== "function"
    ) {
      console.error("Supabase JS não encontrado.");
      alert(
        "O Supabase não foi carregado. Verifique se o script do Supabase está no HTML antes do script.js."
      );
      return false;
    }

    try {
      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );

      console.log("Supabase inicializado.");
      return true;
    } catch (error) {
      console.error("Erro ao inicializar Supabase:", error);
      alert("Não foi possível inicializar o sistema.");
      return false;
    }
  }

  async function obterUsuarioAtual() {
    if (!supabaseClient) return null;

    try {
      const { data, error } = await supabaseClient.auth.getUser();

      if (error) {
        console.warn("getUser:", error.message);
        return null;
      }

      return data?.user || null;
    } catch (error) {
      console.error("Erro getUser:", error);
      return null;
    }
  }

  /* =========================================================
     CATEGORIAS
     ========================================================= */

  async function carregarCategoriasFinanceiras() {
    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      categoriasFinanceiras = [];
      return;
    }

    /*
      Tentamos buscar as categorias já existentes.
      Se a tabela não existir ou estiver incompatível,
      o sistema continua funcionando com as categorias locais.
    */

    try {
      const resultado = await supabaseClient
        .from("categorias_financeiras")
        .select("id,nome,tipo,ativa")
        .eq("user_id", user.id)
        .eq("ativa", true)
        .order("nome", { ascending: true });

      if (!resultado.error && Array.isArray(resultado.data)) {
        categoriasFinanceiras = resultado.data;
        return;
      }

      console.warn(
        "Tabela categorias_financeiras indisponível. Usando categorias locais."
      );
    } catch (error) {
      console.warn("Erro ao consultar categorias:", error);
    }

    categoriasFinanceiras = [];
  }

  function obterCategoriasParaTipo(tipoSelecionado) {
    const tipoNormalizado = normalizarTipo(tipoSelecionado);

    const categoriasDoBanco = categoriasFinanceiras
      .filter(
        (item) =>
          normalizarTipo(item.tipo) === tipoNormalizado &&
          item.nome
      )
      .map((item) => ({
        id: item.id,
        nome: item.nome
      }));

    if (categoriasDoBanco.length) {
      return categoriasDoBanco;
    }

    return (categoriasPadrao[tipoNormalizado] || []).map((nome) => ({
      id: nome,
      nome
    }));
  }

  function atualizarSelectCategorias(
    tipoSelecionado = "",
    categoriaSelecionada = ""
  ) {
    if (!categoria) return;

    categoria.innerHTML =
      "<option value=''>Selecione uma categoria</option>";

    if (!tipoSelecionado) {
      categoria.disabled = true;
      return;
    }

    categoria.disabled = false;

    const listaCategorias =
      obterCategoriasParaTipo(tipoSelecionado);

    listaCategorias.forEach((item) => {
      const option = document.createElement("option");

      /*
        O valor é o ID somente quando a categoria veio do banco.
        Porém o texto/nome é o que será salvo em lancamentos.
      */
      option.value = item.id ?? item.nome;
      option.textContent = item.nome;
      option.dataset.nome = item.nome;

      if (
        String(categoriaSelecionada) === String(item.id) ||
        String(categoriaSelecionada) === String(item.nome)
      ) {
        option.selected = true;
      }

      categoria.appendChild(option);
    });
  }

  if (tipo) {
    tipo.addEventListener("change", () => {
      atualizarSelectCategorias(tipo.value);
    });
  }

  /* =========================================================
     LANÇAMENTOS — CARREGAR
     ========================================================= */

  async function carregarDados() {
    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      dados = [];
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from("lancamentos")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false });

      if (error) {
        console.error("Erro ao carregar lançamentos:", error);
        dados = [];
        return;
      }

      dados = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro inesperado ao carregar lançamentos:", error);
      dados = [];
    }
  }

  /* =========================================================
     LANÇAMENTOS — LIMPAR
     ========================================================= */

  function limparFormulario() {
    idEmEdicao = null;

    if (tipo) tipo.value = "";

    if (categoria) {
      categoria.innerHTML =
        "<option value=''>Selecione uma categoria</option>";
      categoria.disabled = true;
    }

    if (descricao) descricao.value = "";
    if (valor) valor.value = "";
    if (dataInput) dataInput.value = obterDataHoje();

    if (btnSalvar) btnSalvar.innerText = "Salvar";
  }

  /* =========================================================
     LANÇAMENTOS — SALVAR / EDITAR
     ========================================================= */

  async function salvarLancamento() {
    if (!supabaseClient) {
      alert("Sistema ainda não inicializado.");
      return;
    }

    if (
      !tipo?.value ||
      !categoria?.value ||
      !valor?.value ||
      !dataInput?.value
    ) {
      alert("Preencha tipo, categoria, valor e data.");
      return;
    }

    const valorNumerico = numero(valor.value);

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    if (
      usuarioAtual?.user_metadata?.plano?.toUpperCase?.() === "FREE" &&
      dados.length >= LIMITE_FREE &&
      !idEmEdicao
    ) {
      alert(
        `O plano gratuito permite até ${LIMITE_FREE} lançamentos.`
      );
      return;
    }

    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      alert("Sua sessão expirou. Faça login novamente.");
      mostrarLogin();
      return;
    }

    const nomeCategoria = obterNomeCategoriaDoSelect();

    const registro = {
      tipo: normalizarTipo(tipo.value),
      categoria: nomeCategoria,
      descricao: descricao?.value?.trim() || "",
      valor: valorNumerico,
      data: dataInput.value
    };

    try {
      let resultado;

      if (idEmEdicao) {
        resultado = await supabaseClient
          .from("lancamentos")
          .update(registro)
          .eq("id", idEmEdicao)
          .eq("user_id", user.id);
      } else {
        resultado = await supabaseClient
          .from("lancamentos")
          .insert({
            user_id: user.id,
            ...registro
          });
      }

      if (resultado.error) {
        mostrarErroSupabase(
          "Não foi possível salvar o lançamento.",
          resultado.error
        );
        return;
      }

      limparFormulario();
      await carregarDados();
      atualizarDashboard();
      renderizarLista();

      alert(
        idEmEdicao
          ? "Lançamento atualizado com sucesso!"
          : "Lançamento salvo com sucesso!"
      );
    } catch (error) {
      console.error("Salvar lançamento:", error);
      alert("Ocorreu um erro ao salvar o lançamento.");
    }
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarLancamento);
  }

  /* =========================================================
     FILTRO
     ========================================================= */

  function obterDadosFiltrados() {
    if (!filtroMes?.value) {
      return [...dados];
    }

    return dados.filter((item) =>
      String(item.data || "").startsWith(filtroMes.value)
    );
  }

  /* =========================================================
     RESUMOS
     ========================================================= */

  function calcularResumo(registros) {
    const resumo = {
      receita: 0,
      despesa: 0,
      investimento: 0
    };

    registros.forEach((item) => {
      const valorItem = numero(item.valor);
      const tipoItem = normalizarTipo(item.tipo);

      if (tipoItem === "Receita") resumo.receita += valorItem;
      if (tipoItem === "Despesa") resumo.despesa += valorItem;
      if (tipoItem === "Investimento") resumo.investimento += valorItem;
    });

    resumo.saldo = resumo.receita - resumo.despesa;

    return resumo;
  }

  function agruparPorCategoria(registros, tipoDesejado) {
    const mapa = {};

    registros.forEach((item) => {
      if (normalizarTipo(item.tipo) !== tipoDesejado) return;

      const nome =
        String(item.categoria || "Sem categoria").trim() ||
        "Sem categoria";

      mapa[nome] = (mapa[nome] || 0) + numero(item.valor);
    });

    return Object.entries(mapa)
      .sort((a, b) => b[1] - a[1])
      .map(([categoriaNome, total]) => ({
        categoria: categoriaNome,
        total
      }));
  }

  function agruparPorMes(registros) {
    const mapa = {};

    registros.forEach((item) => {
      const mes = String(item.data || "").slice(0, 7);

      if (!mes) return;

      if (!mapa[mes]) {
        mapa[mes] = {
          receita: 0,
          despesa: 0,
          investimento: 0
        };
      }

      const tipoItem = normalizarTipo(item.tipo);
      const valorItem = numero(item.valor);

      if (tipoItem === "Receita") mapa[mes].receita += valorItem;
      if (tipoItem === "Despesa") mapa[mes].despesa += valorItem;
      if (tipoItem === "Investimento") {
        mapa[mes].investimento += valorItem;
      }
    });

    return mapa;
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */

  function atualizarPeriodoDashboard() {
    if (dashboardPeriodo) {
      dashboardPeriodo.innerText = formatarPeriodo(
        filtroMes?.value || ""
      );
    }
  }

  function destruirGrafico(referencia) {
    if (referencia) {
      try {
        referencia.destroy();
      } catch (_) {}
    }
  }

  function atualizarDashboard() {
    const filtrados = obterDadosFiltrados();
    const resumo = calcularResumo(filtrados);

    if (totalReceitas) {
      totalReceitas.innerText = formatarMoeda(resumo.receita);
    }

    if (totalDespesas) {
      totalDespesas.innerText = formatarMoeda(resumo.despesa);
    }

    if (totalInvestimentos) {
      totalInvestimentos.innerText =
        formatarMoeda(resumo.investimento);
    }

    if (saldo) {
      saldo.innerText = formatarMoeda(resumo.saldo);
    }

    atualizarPeriodoDashboard();

    renderizarGrafico(
      filtrados,
      resumo.receita,
      resumo.despesa,
      resumo.investimento
    );

    renderizarGraficoMensal(filtrados);
    renderizarGraficoComparativo(filtrados);
    renderizarAnaliseCategorias(filtrados);
    renderizarAlertas(filtrados);
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
    const canvas = $("grafico");

    if (!canvas || !window.Chart) return;

    destruirGrafico(grafico);

    const modo = tipoGrafico?.value || "geral";

    let labels = [];
    let valores = [];

    if (modo === "categoria") {
      const despesas = agruparPorCategoria(
        filtrados,
        "Despesa"
      );

      const investimentos = agruparPorCategoria(
        filtrados,
        "Investimento"
      );

      const receitas = agruparPorCategoria(
        filtrados,
        "Receita"
      );

      const todos = [
        ...despesas.map((x) => ({
          label: `Despesa • ${x.categoria}`,
          total: x.total
        })),
        ...investimentos.map((x) => ({
          label: `Investimento • ${x.categoria}`,
          total: x.total
        })),
        ...receitas.map((x) => ({
          label: `Receita • ${x.categoria}`,
          total: x.total
        }))
      ].sort((a, b) => b.total - a.total);

      labels = todos.map((x) => x.label);
      valores = todos.map((x) => x.total);
    } else {
      labels = ["Receitas", "Despesas", "Investimentos"];
      valores = [receita, despesa, investimento];
    }

    grafico = new Chart(canvas, {
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
    });
  }

  /* =========================================================
     GRÁFICO MENSAL
     ========================================================= */

  function renderizarGraficoMensal(filtrados) {
    const canvas = $("graficoMensal");

    if (!canvas || !window.Chart) return;

    destruirGrafico(graficoMensal);

    const mapa = agruparPorMes(filtrados);
    const labels = Object.keys(mapa).sort();

    if (!labels.length) return;

    graficoMensal = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Receitas",
            data: labels.map((mes) => mapa[mes].receita)
          },
          {
            label: "Despesas",
            data: labels.map((mes) => mapa[mes].despesa)
          },
          {
            label: "Investimentos",
            data: labels.map((mes) => mapa[mes].investimento)
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
    });
  }

  /* =========================================================
     GRÁFICO COMPARATIVO
     ========================================================= */

  function renderizarGraficoComparativo(filtrados) {
    const canvas = $("graficoComparativo");

    if (!canvas || !window.Chart) return;

    destruirGrafico(graficoComparativo);

    const mapa = agruparPorMes(filtrados);
    const labels = Object.keys(mapa).sort();

    if (!labels.length) return;

    graficoComparativo = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Receitas",
            data: labels.map((mes) => mapa[mes].receita),
            tension: 0.25,
            borderWidth: 3
          },
          {
            label: "Despesas",
            data: labels.map((mes) => mapa[mes].despesa),
            tension: 0.25,
            borderWidth: 3
          },
          {
            label: "Investimentos",
            data: labels.map((mes) => mapa[mes].investimento),
            tension: 0.25,
            borderWidth: 3
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
    });
  }

  /* =========================================================
     ANÁLISE DE CATEGORIAS
     =========================================================
     Criada dinamicamente para não exigir alteração imediata
     no HTML atual.
     ========================================================= */

  function renderizarAnaliseCategorias(registros) {
    if (!dashboard) return;

    let bloco = $("analiseCategoriasTCS");

    if (!bloco) {
      bloco = document.createElement("div");
      bloco.id = "analiseCategoriasTCS";
      bloco.className = "grafico-box";
      dashboard.appendChild(bloco);
    }

    const despesas = agruparPorCategoria(registros, "Despesa");
    const investimentos = agruparPorCategoria(
      registros,
      "Investimento"
    );

    const totalDespesas = despesas.reduce(
      (soma, item) => soma + item.total,
      0
    );

    const totalInvestimentos = investimentos.reduce(
      (soma, item) => soma + item.total,
      0
    );

    const topDespesas = despesas.slice(0, 5);
    const topInvestimentos = investimentos.slice(0, 5);

    const montarLista = (lista, total) => {
      if (!lista.length) {
        return "<p>Nenhum lançamento no período.</p>";
      }

      return `
        <div class="tcs-analise-lista">
          ${lista
            .map((item, index) => {
              const percentual =
                total > 0
                  ? (item.total / total) * 100
                  : 0;

              return `
                <div class="tcs-analise-item">
                  <div>
                    <strong>${index + 1}. ${escapeHtml(
                item.categoria
              )}</strong>
                    <small>${percentual.toFixed(
                      1
                    )}% do total</small>
                  </div>
                  <strong>${formatarMoeda(
                    item.total
                  )}</strong>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    };

    bloco.innerHTML = `
      <div class="grafico-header">
        <div>
          <h3>Onde seu dinheiro está indo</h3>
          <p>Principais categorias de despesas e investimentos no período.</p>
        </div>
      </div>

      <div style="
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
        gap:20px;
      ">
        <div>
          <h4>🔴 Maiores despesas</h4>
          ${montarLista(topDespesas, totalDespesas)}
        </div>

        <div>
          <h4>🟢 Maiores investimentos</h4>
          ${montarLista(
            topInvestimentos,
            totalInvestimentos
          )}
        </div>
      </div>
    `;
  }

  /* =========================================================
     ALERTAS
     ========================================================= */

  function renderizarAlertas(registros) {
    const container = $("alertasInteligentes");

    if (!container) return;

    const resumo = calcularResumo(registros);
    const alertas = [];

    if (resumo.saldo < 0) {
      alertas.push(
        "🔴 Seu saldo está negativo neste período."
      );
    }

    if (
      resumo.receita > 0 &&
      resumo.despesa > resumo.receita
    ) {
      alertas.push(
        "⚠️ Suas despesas estão maiores que suas receitas."
      );
    } else if (resumo.receita > 0) {
      const percentual =
        (resumo.despesa / resumo.receita) * 100;

      if (percentual > 70) {
        alertas.push(
          `🟡 Suas despesas consomem ${percentual.toFixed(
            0
          )}% das receitas.`
        );
      }
    }

    if (
      resumo.receita > 0 &&
      resumo.investimento === 0
    ) {
      alertas.push(
        "💡 Não há investimentos registrados neste período."
      );
    }

    if (!alertas.length) {
      alertas.push(
        "✅ Nenhum alerta crítico identificado neste período."
      );
    }

    container.innerHTML = alertas
      .map(
        (texto) =>
          `<div class="alerta">${escapeHtml(texto)}</div>`
      )
      .join("");
  }

  /* =========================================================
     LISTA / EXTRATO
     ========================================================= */

  function renderizarLista() {
    if (!lista) return;

    lista.innerHTML = "";

    const filtrados = obterDadosFiltrados();

    if (!filtrados.length) {
      lista.innerHTML =
        "<li>Nenhum lançamento encontrado para o período.</li>";
      return;
    }

    filtrados.forEach((item) => {
      const li = document.createElement("li");

      const tipoItem = normalizarTipo(item.tipo);

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
            ${escapeHtml(tipoItem)}
            •
            ${escapeHtml(
              item.categoria || "Sem categoria"
            )}
            •
            ${formatarData(item.data)}
          </small>
        </div>

        <div>
          <strong>${formatarMoeda(item.valor)}</strong>

          <button
            type="button"
            data-acao="editar"
            data-id="${escapeHtml(item.id)}"
            title="Editar"
          >
            ✏️
          </button>

          <button
            type="button"
            data-acao="excluir"
            data-id="${escapeHtml(item.id)}"
            title="Excluir"
          >
            🗑️
          </button>
        </div>
      `;

      lista.appendChild(li);
    });
  }

  async function editarLancamento(id) {
    const item = dados.find(
      (registro) => String(registro.id) === String(id)
    );

    if (!item) {
      alert("Lançamento não encontrado.");
      return;
    }

    idEmEdicao = item.id;

    if (tipo) {
      tipo.value = normalizarTipo(item.tipo);
    }

    atualizarSelectCategorias(
      tipo?.value || "",
      item.categoria
    );

    if (descricao) {
      descricao.value = item.descricao || "";
    }

    if (valor) {
      valor.value = formatarNumero(item.valor);
    }

    if (dataInput) {
      dataInput.value = String(item.data || "").slice(0, 10);
    }

    if (btnSalvar) {
      btnSalvar.innerText = "Atualizar";
    }

    mostrarTela(lancamentos);
    fecharMenuMobile();
  }

  async function excluirLancamento(id) {
    if (!confirm("Tem certeza que deseja excluir este lançamento?")) {
      return;
    }

    const user = usuarioAtual || (await obterUsuarioAtual());

    if (!user) {
      mostrarLogin();
      return;
    }

    try {
      const { error } = await supabaseClient
        .from("lancamentos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        mostrarErroSupabase(
          "Não foi possível excluir o lançamento.",
          error
        );
        return;
      }

      await carregarDados();
      atualizarDashboard();
      renderizarLista();
    } catch (error) {
      console.error("Excluir lançamento:", error);
      alert("Ocorreu um erro ao excluir.");
    }
  }

  if (lista) {
    lista.addEventListener("click", (event) => {
      const botao = event.target.closest(
        "button[data-acao]"
      );

      if (!botao) return;

      const id = botao.dataset.id;

      if (botao.dataset.acao === "editar") {
        editarLancamento(id);
      }

      if (botao.dataset.acao === "excluir") {
        excluirLancamento(id);
      }
    });
  }

  /* =========================================================
     RELATÓRIOS
     ========================================================= */

  function atualizarRelatorios() {
    const registros = obterDadosFiltrados();
    const resumo = calcularResumo(registros);

    const campos = {
      relatorioReceitas: formatarMoeda(resumo.receita),
      relatorioDespesas: formatarMoeda(resumo.despesa),
      relatorioInvestimentos: formatarMoeda(
        resumo.investimento
      ),
      relatorioSaldo: formatarMoeda(resumo.saldo),
      relatorioResumoReceitas: formatarMoeda(
        resumo.receita
      ),
      relatorioResumoDespesas: formatarMoeda(
        resumo.despesa
      ),
      relatorioResumoInvestimentos: formatarMoeda(
        resumo.investimento
      ),
      relatorioResumoSaldo: formatarMoeda(
        resumo.saldo
      ),
      relatorioPeriodo: formatarPeriodo(
        filtroMes?.value || ""
      )
    };

    Object.entries(campos).forEach(([id, texto]) => {
      const elemento = $(id);
      if (elemento) elemento.innerText = texto;
    });
  }

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */

  if (btnDashboard) {
    btnDashboard.addEventListener("click", () => {
      mostrarTela(dashboard);
      ativarMenu(btnDashboard);
      atualizarDashboard();
    });
  }

  if (btnLancamentos) {
    btnLancamentos.addEventListener("click", () => {
      mostrarTela(lancamentos);
      ativarMenu(btnLancamentos);
      renderizarLista();
    });
  }

  if (btnRelatorios) {
    btnRelatorios.addEventListener("click", () => {
      mostrarTela(relatorios);
      ativarMenu(btnRelatorios);
      atualizarRelatorios();
    });
  }


  /* =========================================================
     FILTROS
     ========================================================= */

  if (filtroMes) {
    filtroMes.value = obterMesAtual();

    filtroMes.addEventListener("change", () => {
      atualizarPeriodoDashboard();
      atualizarDashboard();
      renderizarLista();
    });
  }

  if (btnLimparFiltro) {
    btnLimparFiltro.addEventListener("click", () => {
      if (filtroMes) filtroMes.value = "";

      atualizarPeriodoDashboard();
      atualizarDashboard();
      renderizarLista();
    });
  }

  if (tipoGrafico) {
    tipoGrafico.addEventListener("change", () => {
      atualizarDashboard();
    });
  }

  /* =========================================================
     MENU MOBILE
     ========================================================= */

  if (btnMenu) {
    btnMenu.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("active");
      if (menuOverlay) menuOverlay.classList.toggle("hidden");
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", fecharMenuMobile);
  }

  /* =========================================================
     LOGOUT
     ========================================================= */

  async function fazerLogout() {
    try {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
    } catch (error) {
      console.error("Logout:", error);
    }

    usuarioAtual = null;
    dados = [];
    categoriasFinanceiras = [];
    idEmEdicao = null;
    sessaoPronta = false;

    mostrarLogin();
  }

  if (btnLogoutTop) {
    btnLogoutTop.addEventListener("click", fazerLogout);
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", fazerLogout);
  }

  /* =========================================================
     SESSÃO
     ========================================================= */

  async function iniciarSessao(user) {
    if (!user) return;

    /*
      Evita que SIGNED_IN + login manual façam várias
      inicializações simultâneas.
    */
    if (sessaoPronta && usuarioAtual?.id === user.id) {
      return;
    }

    usuarioAtual = user;
    sessaoPronta = true;

    const nome =
      user.user_metadata?.nome ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Usuário";

    if (topbarUser) topbarUser.innerText = nome;
    if (topbarPlano) topbarPlano.innerText = "FREE";
    if (planoUsuario) planoUsuario.innerText = "Plano Free";
    if (nomeCliente) nomeCliente.innerText = `Olá, ${nome}!`;

    mostrarApp();
    mostrarTela(dashboard);
    ativarMenu(btnDashboard);

    if (filtroMes && !filtroMes.value) {
      filtroMes.value = obterMesAtual();
    }

    atualizarPeriodoDashboard();

    await carregarCategoriasFinanceiras();
    atualizarSelectCategorias(tipo?.value || "");
    await carregarDados();

    atualizarDashboard();
    renderizarLista();
  }

  /* =========================================================
     LOGIN
     ========================================================= */

  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      if (!supabaseClient) {
        alert("Sistema ainda não inicializado.");
        return;
      }

      if (aceiteTermos && !aceiteTermos.checked) {
        alert("Você precisa aceitar os termos.");
        return;
      }

      const email = emailInput?.value?.trim() || "";
      const senha = senhaInput?.value || "";

      if (!email || !senha) {
        alert("Informe email e senha.");
        return;
      }

      btnLogin.disabled = true;
      const textoOriginal = btnLogin.innerText;
      btnLogin.innerText = "Entrando...";

      try {
        const { data, error } =
          await supabaseClient.auth.signInWithPassword({
            email,
            password: senha
          });

        if (error) {
          console.error("Erro de login:", error);
          alert(
            `Não foi possível entrar.\n\n${error.message}`
          );
          return;
        }

        if (!data?.user) {
          alert(
            "O Supabase não retornou um usuário válido."
          );
          return;
        }

        /*
          Em algumas configurações o SIGNED_IN dispara
          imediatamente; chamamos também aqui para garantir
          que a interface seja aberta sem depender do callback.
        */
        await iniciarSessao(data.user);
      } catch (error) {
        console.error("LOGIN:", error);
        alert(
          "Não foi possível realizar o login. Verifique sua conexão, email e senha."
        );
      } finally {
        btnLogin.disabled = false;
        btnLogin.innerText = textoOriginal;
      }
    });
  }

  /* =========================================================
     CADASTRO
     ========================================================= */

  if (btnCadastro) {
    btnCadastro.addEventListener("click", async () => {
      if (!supabaseClient) {
        alert("Sistema ainda não inicializado.");
        return;
      }

      if (aceiteTermos && !aceiteTermos.checked) {
        alert("Você precisa aceitar os termos.");
        return;
      }

      const email = emailInput?.value?.trim() || "";
      const senha = senhaInput?.value || "";

      if (!email || !senha) {
        alert("Informe email e senha.");
        return;
      }

      if (senha.length < 6) {
        alert("A senha deve possuir pelo menos 6 caracteres.");
        return;
      }

      btnCadastro.disabled = true;
      const textoOriginal = btnCadastro.innerText;
      btnCadastro.innerText = "Criando...";

      try {
        const { data, error } =
          await supabaseClient.auth.signUp({
            email,
            password: senha,
            options: {
              data: {
                nome: email.split("@")[0]
              }
            }
          });

        if (error) {
          console.error("Cadastro:", error);
          alert(
            `Não foi possível criar a conta.\n\n${error.message}`
          );
          return;
        }

        if (data?.session && data?.user) {
          await iniciarSessao(data.user);
          return;
        }

        alert(
          "Conta criada com sucesso! Verifique seu email para confirmar o cadastro."
        );
      } catch (error) {
        console.error("CADASTRO:", error);
        alert("Não foi possível criar a conta.");
      } finally {
        btnCadastro.disabled = false;
        btnCadastro.innerText = textoOriginal;
      }
    });
  }

  /* =========================================================
     RECUPERAÇÃO DE SENHA
     ========================================================= */

  if (btnEsqueciSenha) {
    btnEsqueciSenha.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!supabaseClient) {
        alert("Sistema ainda não inicializado.");
        return;
      }

      const email = emailInput?.value?.trim() || "";

      if (!email) {
        alert("Informe seu email primeiro.");
        return;
      }

      try {
        const { error } =
          await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
              redirectTo:
                window.location.origin +
                window.location.pathname
            }
          );

        if (error) {
          alert(
            `Não foi possível enviar a recuperação.\n\n${error.message}`
          );
          return;
        }

        alert(
          "Enviamos as instruções de recuperação para seu email."
        );
      } catch (error) {
        console.error("Recuperação:", error);
        alert(
          "Não foi possível enviar o email de recuperação."
        );
      }
    });
  }

  /* =========================================================
     EXPORTAÇÃO PDF
     ========================================================= */

  if (btnExportarPdf) {
    btnExportarPdf.addEventListener("click", () => {
      try {
        if (
          !window.jspdf ||
          typeof window.jspdf.jsPDF !== "function"
        ) {
          alert(
            "A biblioteca de PDF não foi carregada."
          );
          return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const registros = obterDadosFiltrados();
        const resumo = calcularResumo(registros);

        pdf.setFontSize(16);
        pdf.text(
          "TCS Finance - Extrato Financeiro",
          10,
          15
        );

        pdf.setFontSize(10);
        pdf.text(
          `Período: ${formatarPeriodo(
            filtroMes?.value || ""
          )}`,
          10,
          23
        );

        pdf.text(
          `Receitas: ${formatarMoeda(resumo.receita)}`,
          10,
          31
        );

        pdf.text(
          `Despesas: ${formatarMoeda(resumo.despesa)}`,
          10,
          38
        );

        pdf.text(
          `Investimentos: ${formatarMoeda(
            resumo.investimento
          )}`,
          10,
          45
        );

        pdf.text(
          `Saldo: ${formatarMoeda(resumo.saldo)}`,
          10,
          52
        );

        let y = 65;

        registros.forEach((item) => {
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }

          const linha =
            `${formatarData(item.data)} | ` +
            `${normalizarTipo(item.tipo)} | ` +
            `${item.categoria || ""} | ` +
            `${item.descricao || ""} | ` +
            `${formatarMoeda(item.valor)}`;

          pdf.text(
            linha.substring(0, 105),
            10,
            y
          );

          y += 7;
        });

        pdf.save("TCS-Finance-Extrato.pdf");
      } catch (error) {
        console.error("PDF:", error);
        alert("Não foi possível gerar o PDF.");
      }
    });
  }

  /* =========================================================
     AUTH STATE
     ========================================================= */

  function configurarAuth() {
    if (!supabaseClient) return;

    supabaseClient.auth.onAuthStateChange(
      (evento, session) => {
        console.log(
          "Auth event:",
          evento
        );

        if (
          evento === "SIGNED_IN" &&
          session?.user
        ) {
          /*
            Não fazemos chamadas pesadas diretamente dentro
            do callback do Supabase. Isso evita deadlocks.
          */
          setTimeout(() => {
            iniciarSessao(session.user);
          }, 0);
        }

        if (
          evento === "TOKEN_REFRESHED" &&
          session?.user
        ) {
          usuarioAtual = session.user;
        }

        if (evento === "SIGNED_OUT") {
          usuarioAtual = null;
          sessaoPronta = false;
          dados = [];
          mostrarLogin();
        }
      }
    );
  }

  /* =========================================================
     INICIALIZAÇÃO
     ========================================================= */

  (async function iniciarSistema() {
    if (inicializando) return;
    inicializando = true;

    console.log(
      "TCS Finance — inicializando versão sem recorrências."
    );

    const ok = inicializarSupabase();

    if (!ok) {
      mostrarLogin();
      inicializando = false;
      return;
    }

    fecharMenuMobile();
    mostrarLogin();

    if (filtroMes) {
      filtroMes.value = obterMesAtual();
    }

    if (dataInput) {
      dataInput.value = obterDataHoje();
    }

    if (categoria) {
      categoria.disabled = true;
    }

    if (tipoGrafico && !tipoGrafico.value) {
      tipoGrafico.value = "geral";
    }

    atualizarPeriodoDashboard();
    configurarAuth();

    try {
      /*
        getSession recupera a sessão salva pelo Supabase.
        Isso é o que mantém o usuário logado ao recarregar
        a página.
      */
      const {
        data,
        error
      } = await supabaseClient.auth.getSession();

      if (error) {
        console.warn(
          "Erro ao recuperar sessão:",
          error.message
        );
      }

      if (data?.session?.user) {
        console.log(
          "Sessão existente encontrada."
        );

        await iniciarSessao(
          data.session.user
        );
      } else {
        console.log(
          "Nenhuma sessão existente."
        );

        mostrarLogin();
      }
    } catch (error) {
      console.error(
        "Erro na recuperação da sessão:",
        error
      );

      mostrarLogin();
    }

    console.log(
      "TCS Finance: inicialização concluída."
    );

    inicializando = false;
  })();
});