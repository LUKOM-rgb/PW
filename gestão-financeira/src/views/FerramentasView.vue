<template>
  <div class="container">
    <h1>Calculadoras Financeiras</h1>
    <p>Ferramentas: juros compostos, crédito habitação, reforma, orçamento e tempo para pagar dívida.</p>

    <section class="grid">
      <!-- Componentes separados -->
      <JurosCompostos />
      <SimuladorCredito />


      <!-- Orçamento -->
      <article class="card">
        <h2>Calculadora de Orçamento</h2>
        <form @submit.prevent>
          <label>Rendimento mensal (€)</label>
          <input type="number" placeholder="2000" />

          <label>Residencia  (%)</label>
          <input type="number" placeholder="30" />

          <label>Alimentação (%)</label>
          <input type="number" placeholder="15" />

          <label>Investir (%)</label>
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

<script>
import JurosCompostos from '../components/juroscompostos.vue';
import SimuladorCredito from '../components/SimuladorCredito.vue';

export default {
  name: 'FerramentasView',
  components: {
    JurosCompostos,
    SimuladorCredito
  }
};
</script>


