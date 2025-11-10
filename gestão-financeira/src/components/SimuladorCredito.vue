<template>
  <article class="card">
    <h2>Simulador de Crédito Habitação</h2>
    <form @submit.prevent>
      <label>Valor do empréstimo (€)</label>
      <input type="number" v-model.number="emprestimo" step="0.01" placeholder="200000" />

      <label>Taxa anual (%)</label>
      <input type="number" v-model.number="taxa" step="0.01" placeholder="3.5" />

      <label>Prazo (anos)</label>
      <input type="number" v-model.number="prazo" step="1" placeholder="30" />

      <div class="row">
        <button type="button" class="btn" @click="calcularEmprestimo">Calcular Prestação</button>
        <button type="reset" class="btn" @click="limparEmprestimo">Limpar</button>
      </div>

      <div class="result">Prestação: {{ resultadoTotal }}</div>
    </form>
  </article>
</template>

<script>
export default {
  name: 'SimuladorCredito',
  data() {
    return {
      emprestimo: null,
      taxa: null,
      prazo: null,
      resultadoTotal: '—'
    };
  },
  methods: {
    calcularEmprestimo() {
      if (!this.emprestimo || !this.taxa || !this.prazo) {
        this.resultadoTotal = 'Preenche todos os campos.';
        return;
      }
      const i = this.taxa / 100 / 12;
      const n = this.prazo * 12;
      const resultado = (this.emprestimo * i) / (1 - Math.pow(1 + i, -n));
      this.resultadoTotal = `${resultado.toFixed(2)} €`;
    },
    limparEmprestimo() {
      this.emprestimo = this.taxa = this.prazo = null;
      this.resultadoTotal = '—';
    }
  }
};
</script>

<style scoped>
.card { background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06); }
label { font-size: 0.9rem; display: block; margin-top: 8px; }
input, select { width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; margin-bottom: 6px; }
.row { display: flex; gap: 8px; margin-top: 8px; }
.btn { padding: 8px 12px; border-radius: 8px; border: 0; background: #111827; color: #fff; cursor: pointer; }
.result { margin-top: 8px; padding: 10px; border-radius: 8px; background: #f1f5f9; border: 1px dashed #cbd5e1; }
</style>
