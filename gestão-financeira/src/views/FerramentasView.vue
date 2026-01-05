<template>
  <div class="container">
    <h1>Calculadoras Financeiras</h1>
    <p>Ferramentas para te ajudar a gerir o dinheiro e desbloquear conquistas!</p>

    <section class="grid">
      <article class="card">
        <h2>Calculadora de Juros Compostos</h2>
        <form @submit.prevent="calcularJuros">
          <label>Capital inicial (€)</label>
          <input type="number" v-model.number="juros.capital" step="0.01" placeholder="1000" />

          <label>Taxa anual (%)</label>
          <input type="number" v-model.number="juros.taxa" step="0.01" placeholder="5" />

          <label>Períodos por ano</label>
          <select v-model.number="juros.periodos">
            <option value="1">1 (anual)</option>
            <option value="4">4 (trimestral)</option>
            <option value="12">12 (mensal)</option>
            <option value="365">365 (diário)</option>
          </select>

          <label>Anos</label>
          <input type="number" v-model.number="juros.anos" step="1" placeholder="10" />

          <div class="row">
            <button type="submit" class="btn">Calcular</button>
            <button type="button" class="btn btn-outline" @click="limparJuros">Limpar</button>
          </div>

          <div class="result">Resultado: {{ juros.resultado }}</div>
        </form>
      </article>

      <article class="card">
        <h2>Simulador de Crédito Habitação</h2>
        <form @submit.prevent="calcularEmprestimo">
          <label>Valor do empréstimo (€)</label>
          <input type="number" v-model.number="credito.emprestimo" step="0.01" placeholder="200000" />

          <label>Taxa anual (%)</label>
          <input type="number" v-model.number="credito.taxa" step="0.01" placeholder="3.5" />

          <label>Prazo (anos)</label>
          <input type="number" v-model.number="credito.prazo" step="1" placeholder="30" />

          <div class="row">
            <button type="submit" class="btn">Calcular Prestação</button>
            <button type="button" class="btn btn-outline" @click="limparEmprestimo">Limpar</button>
          </div>

          <div class="result">Prestação: {{ credito.resultado }}</div>

          <div v-if="authStore?.userXP" class="gamification-badge">
            Status: Nível {{ authStore.userLevel }} | XP: {{ authStore.userXP }}
          </div>
        </form>
      </article>

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

          <div class="result">Orçamento: {{ orcamento.resultado }}</div>
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

          <div class="result"> {{ divida.meses }} meses para pagar a dívida</div>
        </form>
      </article>
    </section>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAuth } from '../stores/auth'; // Verifique se o caminho está correto

export default {
  name: 'FerramentasView',
  data() {
    return {
      // Objeto Juros Compostos
      juros: {
        capital: null,
        taxa: null,
        periodos: 1, 
        anos: null,
        resultado: ''
      },
      // Objeto Crédito Habitação
      credito: {
        emprestimo: null,
        taxa: null,
        prazo: null,
        resultado: ''
      },
      // Objeto Orçamento
      orcamento: {
        rendimento: null,
        residencia: null,
        alimentacao: null,
        investir: null,
        resultado: null
      },
      // Objeto Dívida
      divida: {
        saldo: null,
        taxa: null,
        pagamento: null,
        meses: null
      }
    };
  },
  computed: {
    ...mapStores(usarStoreAuth)
  },
  methods: {
    // --- Lógica Juros Compostos ---
    calcularJuros() {
      if (!this.juros.capital || !this.juros.taxa || !this.juros.anos) {
        this.juros.resultado = 'Preenche todos os campos.';
        return;
      }
      const r = this.juros.taxa / 100;
      const n = this.juros.periodos;
      const t = this.juros.anos;
      
      // Fórmula: A = P(1 + r/n)^(nt)
      const montante = this.juros.capital * Math.pow((1 + r / n), n * t);
      this.juros.resultado = `${montante.toFixed(2)} €`;

      this.usarFerramenta('juros_compostos');
    },
    limparJuros() {
      this.juros = { capital: null, taxa: null, periodos: 1, anos: null, resultado: '—' };
    },

    // --- Lógica Crédito Habitação ---
    calcularEmprestimo() {
      if (!this.credito.emprestimo || !this.credito.taxa || !this.credito.prazo) {
        this.credito.resultado = 'Preenche todos os campos.';
        return;
      }
      const principal = this.credito.emprestimo;
      const taxaMensal = (this.credito.taxa / 100) / 12;
      const totalMeses = this.credito.prazo * 12;

      // Fórmula Prestação: (P * i) / (1 - (1+i)^-n)
      const x = Math.pow(1 + taxaMensal, totalMeses);
      const prestacao = (principal * x * taxaMensal) / (x - 1);

      if (isFinite(prestacao)) {
        this.credito.resultado = `${prestacao.toFixed(2)} € / mês`;
        this.usarFerramenta('credito_habitacao');
      } else {
        this.credito.resultado = 'Erro no cálculo';
      }
    },
    limparEmprestimo() {
      this.credito = { emprestimo: null, taxa: null, prazo: null, resultado: '—' };
    },

    // --- Lógica Orçamento ---
    calcularOrcamento() {
      if (!this.orcamento.rendimento) return;

      const gastosPercentual = (this.orcamento.residencia + this.orcamento.alimentacao + this.orcamento.investir) / 100;
      const totalGasto = this.orcamento.rendimento * gastosPercentual;
      this.orcamento.resultado = (this.orcamento.rendimento - totalGasto).toFixed(2);

      // Gamificação específica
      if (this.authStore) {
        this.authStore.incrementarEstatistica('calc_budget');
        this.usarFerramenta('orcamento');
      }
    },
    limparOrcamento() {
      this.orcamento = { rendimento: null, residencia: null, alimentacao: null, investir: null, resultado: null };
    },

    // --- Lógica Dívida ---
    calcularDivida() {
      if (!this.divida.saldo || !this.divida.pagamento) return;

      const i = (this.divida.taxa / 100) / 12;
      const p = this.divida.saldo;
      const m = this.divida.pagamento;

      if (m <= p * i) {
        alert("O pagamento mensal é muito baixo para cobrir os juros! A dívida nunca será paga.");
        return;
      }

      // Fórmula Nper: -log(1 - (i*p)/m) / log(1+i)
      const n = -Math.log(1 - (i * p) / m) / Math.log(1 + i);
      this.divida.meses = Math.ceil(n);

      this.usarFerramenta('divida');
    },
    limparDivida() {
      this.divida = { saldo: null, taxa: null, pagamento: null, meses: null };
    },

    // --- Método Utilitário ---
    usarFerramenta(tipo) {
      if (this.authStore) {
        this.authStore.incrementarEstatistica('calc_total', tipo);
      }
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
.card {
  background: #0d2546;
  color: whitesmoke;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

input, select { 
  width: 100%; 
  padding: 10px; 
  margin-bottom: 15px; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  box-sizing: border-box;
  font-size: 1rem;
}

label { 
  display: block; 
  text-align: left; 
  margin-bottom: 5px; 
  font-weight: bold; 
  font-size: 0.9rem; 
  color: #a8d5e2;
}

.row { display: flex; gap: 10px; margin-top: auto; } /* margin-top auto empurra botões para baixo se os cards tiverem alturas diferentes */

.btn { 
  flex: 1; 
  padding: 12px; 
  background: #27ae60; 
  color: white; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  font-weight: bold;
  transition: background 0.3s;
}
.btn:hover { background: #219150; }

.btn-outline { 
  background: transparent; 
  border: 1px solid #95a5a6; 
  color: #bdc3c7;
}
.btn-outline:hover { background: #95a5a6; color: #fff; }

.result { 
  margin-top: 20px; 
  padding: 10px;
  background: rgba(39, 174, 96, 0.1);
  border-radius: 5px;
  font-weight: bold; 
  color: #2ecc71; 
  font-size: 1.2rem; 
}

.gamification-badge {
  margin-top: 10px; 
  padding: 8px;
  border-radius: 4px;
  background: #e0f2f7; 
  color: #007bff;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>