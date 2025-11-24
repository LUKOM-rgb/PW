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

      <div v-if="trackingStore?.userXP" class="result" style="margin-top: 10px; background: #e0f2f7; color: #007bff;">
        Status: Nível {{ trackingStore.userLevel }} | XP: {{ trackingStore.userXP }} (Faltam {{ trackingStore.xpToNextLevel }} XP para o Nível {{ trackingStore.currentLevel + 1 }})
      </div>
    </form>
  </article>
</template>

<script>
// IMPORTAR: Importar a função do Pinia Store
import { useTrackingStore } from '../stores/tracking'

export default {
  name: 'SimuladorCredito',
  data() { // Conteúdo existente
    return {
      emprestimo: null,
      taxa: null,
      prazo: null,
      resultadoTotal: '—',
      // Adicionar a referência ao Pinia Store aqui para ser acessível em methods
      trackingStore: null
    };
  },
  // Hook de ciclo de vida para inicializar o Store
  created() {
      // Cria a instância do store e torna-a acessível via 'this.trackingStore'
      this.trackingStore = useTrackingStore();
  },
  methods: {
    calcularEmprestimo() { // Conteúdo existente
      if (!this.emprestimo || !this.taxa || !this.prazo) {
        this.resultadoTotal = 'Preenche todos os campos.';
        return;
      }
      const i = this.taxa / 100 / 12;
      const n = this.prazo * 12;
      const resultado = (this.emprestimo * i) / (1 - Math.pow(1 + i, -n));
      this.resultadoTotal = `${resultado.toFixed(2)} €`;

      // === ADICIONAR O REGISTO DE TRACKING E XP AQUI ===
      if (this.emprestimo > 0 && this.taxa > 0 && this.prazo > 0) {
        // Recompensa de 10 XP por completar a simulação
        this.trackingStore.registerAction('Simulação de Crédito Habitação Concluída', 10);
      }
      // ================================================
    },
    limparEmprestimo() { // Conteúdo existente
      this.emprestimo = this.taxa = this.prazo = null;
      this.resultadoTotal = '—';
    }
  }
};
</script>

<style scoped>
/* O estilo permanece o mesmo */
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