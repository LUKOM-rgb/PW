<template>
  <div class="container">
    <h1>Calculadoras Financeiras</h1>
    <p>Ferramentas para te ajudar a gerir o dinheiro e desbloquear conquistas!</p>

    <section class="grid">
      <div @click="usarFerramenta('juros')" class="wrapper">
        <JurosCompostos />
      </div>

      <div @click="usarFerramenta('credito')" class="wrapper">
        <SimuladorCredito />
      </div>

      <article class="card">
        <h2>Calculadora de Orçamento</h2>
        <form @submit.prevent="calcularOrcamento">
          <label>Rendimento mensal (€)</label>
          <input v-model.number="orcamento.rendimento" type="number" placeholder="2000" />

          <label>Residencia (%)</label>
          <input v-model.number="orcamento.residencia" type="number" placeholder="30" />

          <label>Alimentação (%)</label>
          <input v-model.number="orcamento.alimentacao" type="number" placeholder="15" />

          <label>Investir (%)</label>
          <input v-model.number="orcamento.investir" type="number" placeholder="20" />

          <div class="row">
            <button type="submit" class="btn">Calcular</button>
            <button type="button" @click="limparOrcamento" class="btn btn-outline">Limpar</button>
          </div>

          <div class="result" v-if="orcamento.resultado">
            Sobra: {{ orcamento.resultado }}€
          </div>
        </form>
      </article>

      <article class="card">
        <h2>Tempo para Pagar Dívida</h2>
        <form @submit.prevent="calcularDivida">
          <label>Saldo (€)</label>
          <input v-model.number="divida.saldo" type="number" placeholder="5000" />

          <label>Taxa anual (%)</label>
          <input v-model.number="divida.taxa" type="number" placeholder="18" />

          <label>Pagamento mensal (€)</label>
          <input v-model.number="divida.pagamento" type="number" placeholder="150" />

          <div class="row">
            <button type="submit" class="btn">Calcular</button>
            <button type="button" @click="limparDivida" class="btn btn-outline">Limpar</button>
          </div>

          <div class="result" v-if="divida.meses">
            Tempo estimado: {{ divida.meses }} meses
          </div>
        </form>
      </article>
    </section>
  </div>
</template>

<script>
import JurosCompostos from '../components/JurosCompostos.vue';
import SimuladorCredito from '../components/SimuladorCredito.vue';
import { mapStores } from 'pinia';
import { usarStoreAuth } from '../stores/auth';

export default {
  name: 'FerramentasView',
  components: {
    JurosCompostos,
    SimuladorCredito
  },
  data() {
    return {
      orcamento: {
        rendimento: null, residencia: null, alimentacao: null, investir: null, resultado: null
      },
      divida: {
        saldo: null, taxa: null, pagamento: null, meses: null
      }
    };
  },
  computed: {
    ...mapStores(usarStoreAuth)
  },
  methods: {
    // Método genérico para contar uso das ferramentas importadas
    usarFerramenta(tipo) {
      this.authStore.incrementarEstatistica('calc_total', tipo);
    },

    calcularOrcamento() {
      if (!this.orcamento.rendimento) return;

      const gastos = (this.orcamento.residencia + this.orcamento.alimentacao + this.orcamento.investir) / 100;
      const totalGasto = this.orcamento.rendimento * gastos;
      this.orcamento.resultado = (this.orcamento.rendimento - totalGasto).toFixed(2);

      //Conquista "Mão de Vaca" (específica do orçamento)
      this.authStore.incrementarEstatistica('calc_budget');
      //Contar para o total e tipos diferentes
      this.authStore.incrementarEstatistica('calc_total', 'orcamento');
    },

    limparOrcamento() {
      this.orcamento = { rendimento: null, residencia: null, alimentacao: null, investir: null, resultado: null };
    },

    calcularDivida() {
      if (!this.divida.saldo || !this.divida.pagamento) return;

      // Cálculo simplificado de dívida
      const i = (this.divida.taxa / 100) / 12;
      const p = this.divida.saldo;
      const m = this.divida.pagamento;

      // Evitar loop infinito se o pagamento for menor que os juros
      if (m <= p * i) {
        alert("O pagamento mensal é muito baixo para cobrir os juros!");
        return;
      }

      const n = -Math.log(1 - (i * p) / m) / Math.log(1 + i);
      this.divida.meses = Math.ceil(n);

      // --- GAMIFICAÇÃO ---
      this.authStore.incrementarEstatistica('calc_total', 'divida');
    },

    limparDivida() {
      this.divida = { saldo: null, taxa: null, pagamento: null, meses: null };
    }
  }
};
</script>

<style scoped>
.container { padding: 20px; color: #fff; text-align: center; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}
.card, .wrapper {
  background: #0d2546;
  color: whitesmoke;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

input { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
label { display: block; text-align: left; margin-bottom: 5px; font-weight: bold; font-size: 0.9rem; }
.row { display: flex; gap: 10px; margin-top: 10px; }
.btn { flex: 1; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; }
.btn-outline { background: #95a5a6; }
.result { margin-top: 15px; font-weight: bold; color: #27ae60; font-size: 1.1rem; }
</style>
