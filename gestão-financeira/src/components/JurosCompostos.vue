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

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}
label {
  font-size: 0.9rem;
  display: block;
  margin-top: 8px;
}
input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 6px;
}
.row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  background: #111827;
  color: #fff;
  cursor: pointer;
}
.result {
  margin-top: 8px;
  padding: 10px;
  border-radius: 8px;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
}
</style>
