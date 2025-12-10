<template>
  <article class="card">
    <h2>Calculadora de Juros Compostos</h2>
    <form @submit.prevent>
      <label>Capital inicial (€)</label>
      <input type="number" v-model.number="capital" step="0.01" placeholder="1000" />

      <label>Taxa anual (%)</label>
      <input type="number" v-model.number="taxa" step="0.01" placeholder="5" />

      <label>Períodos por ano</label>
      <select v-model.number="periodos">
        <option value="1">1 (anual)</option>
        <option value="4">4 (trimestral)</option>
        <option value="12">12 (mensal)</option>
        <option value="365">365 (diário)</option>
      </select>

      <label>Anos</label>
      <input type="number" v-model.number="anos" step="1" placeholder="10" />

      <div class="row">
        <button type="button" class="btn" @click="calcularJuros">Calcular</button>
        <button type="reset" class="btn" @click="limparJuros">Limpar</button>
      </div>

      <div class="result">Resultado: {{ resultadoJuros }}</div>
    </form>
  </article>
</template>

<script>
export default {
  name: 'JurosCompostos',
  data() {
    return {
      capital: null,
      taxa: null,
      periodos: 1,
      anos: null,
      resultadoJuros: '—'
    };
  },
  methods: {
    calcularJuros() {
      if (!this.capital || !this.taxa || !this.anos) {
        this.resultadoJuros = 'Preenche todos os campos.';
        return;
      }
      const taxaDecimal = this.taxa / 100;
      const resultado = this.capital * Math.pow((1 + taxaDecimal / this.periodos), this.periodos * this.anos);
      this.resultadoJuros = `${resultado.toFixed(2)} €`;
    },
    limparJuros() {
      this.capital = this.taxa = this.anos = null;
      this.periodos = 1;
      this.resultadoJuros = '—';
    }
  }
};
</script>



