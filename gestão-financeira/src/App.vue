<template>
  <div class="app-wrap">
    <header class="header">
      <div class="brand">
        <div class="logo">GF</div>
        <div>
          <div class="site-title">Gestão Financeira</div>
          <div class="muted">Conteúdo prático e ferramentas</div>
        </div>
      </div>
      <nav class="nav">
        <a href="#poupar">Poupar</a>
        <a href="#investir">Investir</a>
        <a href="#dividas">Dívidas</a>
        <a href="#ferramentas">Ferramentas</a>
        <a href="#blog" class="primary">Blog</a>
      </nav>
    </header>

    <main>
      <section class="hero card">
        <div class="hero-left">
          <span class="pill">Educativo • Prático</span>
          <h1>Aprenda a gerir o seu dinheiro com confiança</h1>
          <p class="muted">Guias, calculadoras e planos passo a passo — desde orçamentação até planeamento da reforma.</p>
          <div class="hero-cta">
            <button class="btn btn-primary">Usar Calculadoras</button>
            <button class="btn btn-outline">Sobre nós</button>
          </div>
        </div>
        <aside class="hero-right card small">
          <strong>Checklist rápida</strong>
          <ul class="muted small">
            <li>Fundo de emergência &gt; 3 meses</li>
            <li>Pagar dívidas de maior juro primeiro</li>
            <li>Investir com horizonte e diversificação</li>
          </ul>
        </aside>
      </section>

      <section id="ferramentas" class="grid two-col">
        <div>
          <section class="card">
            <h3>Calculadora de Juros Compostos</h3>
            <p class="muted small">Estimador rápido — insira capital inicial, contribuição periódica, taxa anual e anos.</p>

            <div class="tool card">
              <form>
                <div class="row">
                  <label class="small">Capital inicial (€)</label>
                  <input type="number" min="0" />

                  <label class="small">Contribuição anual (€)</label>
                  <input type="number" min="0" />

                  <label class="small">Taxa anual (%)</label>
                  <input type="number" step="0.01" min="0" />

                  <label class="small">Anos</label>
                  <input type="number" min="0" />
                </div>

                <div class="row" style="margin-top:10px">
                  <button class="btn btn-primary">Calcular</button>
                  <button class="btn">Limpar</button>
                </div>
              </form>
            </div>
          </section>

          <section class="card" style="margin-top:12px">
            <h3>Modelos e Templates</h3>
            <p class="muted small">Links para descarregar folhas de cálculo de orçamento e checklists (exemplo estática).</p>
            <ul class="small">
              <li><a href="#">Planilha - Orçamento Mensal (Excel)</a></li>
              <li><a href="#">Checklist - Comprar Casa</a></li>
            </ul>
          </section>
        </div>

        <aside>
          <section id="sobre" class="card">
            <h3>Sobre Nós</h3>
            <p class="muted small">Missão: Ajudar os portugueses a tomar melhores decisões financeiras — conteúdo educativo e ferramentas práticas.</p>
            <p class="small">Transparência: Este conteúdo é educativo e não constitui aconselhamento financeiro.</p>
          </section>

          <section class="card" style="margin-top:12px">
            <h4>Newsletter</h4>
            <div class="newsletter">
              <input type="email" placeholder="o@exemplo.com" />
              <button class="btn btn-primary">Subscrever</button>
            </div>
          </section>
        </aside>
      </section>
    </main>

    <footer class="muted small">© 2025 Gestão Financeira — Política de Privacidade • Aviso Legal</footer>
  </div>
</template>

<style scoped>
:root{ --accent:#0f766e; --accent-2:#064e3b; --bg:#f7f8fa }
*{box-sizing:border-box}
.app-wrap{max-width:1100px;margin:20px auto;padding:0 16px;font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.brand{display:flex;gap:12px;align-items:center}
.logo{width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;color:white;font-weight:700}
.site-title{font-weight:700}
.muted{color:#6b7280}
.nav{display:flex;gap:12px}
.nav a{color:var(--accent-2);text-decoration:none;padding:8px 10px;border-radius:8px;font-weight:600}
.nav a.primary{background:var(--accent);color:white}
.hero{display:grid;grid-template-columns:1fr;gap:12px;background:#fff;padding:16px;border-radius:12px;box-shadow:0 6px 18px rgba(15,23,42,0.06)}
.hero-left h1{margin:8px 0}
.pill{display:inline-block;padding:6px 10px;background:rgba(0,0,0,0.03);border-radius:999px;font-weight:700;color:var(--accent-2);font-size:13px}
.hero-cta{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.btn{padding:8px 12px;border-radius:10px;border:0;cursor:pointer}
.btn-primary{background:var(--accent);color:white}
.btn-outline{background:transparent;border:2px solid var(--accent);color:var(--accent)}
.card{background:#fff;padding:12px;border-radius:12px}
.small{font-size:13px}
.grid.two-col{display:grid;grid-template-columns:1fr;gap:16px;margin-top:16px}
.tool input[type=number], input[type=email], input[type=text]{padding:8px;border-radius:8px;border:1px solid #e6eef0}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.result{background:#f8fffd;padding:10px;border-radius:8px}
.newsletter{display:flex;gap:8px;align-items:center}
footer{margin-top:18px;color:#6b7280;font-size:14px}

@media(min-width:760px){
  .hero{grid-template-columns:1fr 320px}
  .grid.two-col{grid-template-columns:2fr 1fr}
}
</style>