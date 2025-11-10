<template>
  <div class="container">
    <h1>Calculadoras Financeiras</h1>
    <p>Ferramentas: juros compostos, crédito habitação, reforma, orçamento e tempo para pagar dívida.</p>

    <section class="grid">
      <!-- Juros Compostos -->
      <article class="card">
        <h2>Calculadora de Juros Compostos</h2>
        <form @submit.prevent>
          <label>Capital inicial (€)</label>
          <input type="number" step="0.01" placeholder="1000" />

          <label>Taxa anual (%)</label>
          <input type="number" step="0.01" placeholder="5" />

          <label>Períodos por ano</label>
          <select>
            <option value="1">1 (anual)</option>
            <option value="4">4 (trimestral)</option>
            <option value="12">12 (mensal)</option>
            <option value="365">365 (diário)</option>
          </select>

          <label>Anos</label>
          <input type="number" step="1" placeholder="10" />

          <div class="row">
            <button type="button" class="btn">Calcular</button>
            <button type="reset" class="btn">Limpar</button>
          </div>

          <div class="result">Resultado: —</div>
        </form>
      </article>

      <!-- Crédito Habitação -->
      <article class="card">
        <h2>Simulador de Crédito Habitação</h2>
        <form @submit.prevent>
          <label>Valor do empréstimo (€)</label>
          <input type="number" step="0.01" placeholder="200000" />

          <label>Taxa anual (%)</label>
          <input type="number" step="0.01" placeholder="3.5" />

          <label>Prazo (anos)</label>
          <input type="number" step="1" placeholder="30" />

          <div class="row">
            <button type="button" class="btn">Calcular Prestação</button>
            <button type="reset" class="btn">Limpar</button>
          </div>

          <div class="result">Prestação: —</div>
        </form>
      </article>

      <!-- Reforma -->
      <article class="card">
        <h2>Calculadora de Reforma</h2>
        <form @submit.prevent>
          <label>Total desejado (€)</label>
          <input type="number" step="0.01" placeholder="300000" />

          <label>Anos até à reforma</label>
          <input type="number" placeholder="25" />

          <label>Taxa anual (%)</label>
          <input type="number" step="0.01" placeholder="4" />

          <label>Saldo atual (€)</label>
          <input type="number" step="0.01" placeholder="10000" />

          <div class="row">
            <button type="button" class="btn">Calcular</button>
            <button type="reset" class="btn">Limpar</button>
          </div>

          <div class="result">Poupança mensal: —</div>
        </form>
      </article>

      <!-- Orçamento -->
      <article class="card">
        <h2>Calculadora de Orçamento</h2>
        <form @submit.prevent>
          <label>Rendimento mensal (€)</label>
          <input type="number" placeholder="2000" />

          <label>Moradia (%)</label>
          <input type="number" placeholder="30" />

          <label>Alimentação (%)</label>
          <input type="number" placeholder="15" />

          <label>Poupança (%)</label>
          <input type="number" placeholder="20" />

          <div class="row">
            <button type="button" class="btn">Calcular</button>
            <button type="reset" class="btn">Limpar</button>
          </div>

          <div class="result">—</div>
        </form>
      </article>

      <!-- Dívida -->
      <article class="card">
        <h2>Tempo para Pagar Dívida</h2>
        <form @submit.prevent>
          <label>Saldo (€)</label>
          <input type="number" placeholder="5000" />

          <label>Taxa anual (%)</label>
          <input type="number" placeholder="18" />

          <label>Pagamento mensal (€)</label>
          <input type="number" placeholder="150" />

          <div class="row">
            <button type="button" class="btn">Calcular</button>
            <button type="reset" class="btn">Limpar</button>
          </div>

          <div class="result">Tempo estimado: —</div>
        </form>
      </article>
    </section>
  </div>
</template>

<style scoped>
.container{max-width:1100px;
  margin:0 auto;
  padding:24px;
  font-family:system-ui;
  background:#f7fafc;
  color:#0f172a}
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:18px}
.card{background:#fff;
  border-radius:12px;
  padding:16px;
  box-shadow:0 6px 18px rgba(2,6,23,0.06)}
label{font-size:.9rem;display:block;margin-top:8px}
input,select{
  width:100%;
  padding:8px;
  border:1px solid #e2e8f0;
  border-radius:8px;
  font-size:1rem;
  margin-bottom:6px}
.row{display:flex;gap:8px;margin-top:8px}
.btn{padding:8px 12px;border-radius:8px;border:0;background:#111827;color:#fff;cursor:pointer}
.result{margin-top:8px;padding:10px;border-radius:8px;background:#f1f5f9;border:1px dashed #cbd5e1}
</style>
