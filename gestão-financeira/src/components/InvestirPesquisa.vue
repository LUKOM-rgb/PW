<template>
  <div class="stock-container">
    <h2>Analisador de Ações</h2>

    <div class="search-box">
      <input
        v-model="termo"
        placeholder="Escreve o símbolo (ex: AAPL, TSLA)..."
        class="search-input"
      />
      <span v-if="aDigitar" class="typing-indicator">Wait...</span>
    </div>

    <div v-if="acoesStore.aCarregar" class="loading">A carregar dados...</div>
    <div v-if="acoesStore.erro" class="error">{{ acoesStore.erro }}</div>

    <div v-if="!acoesStore.aCarregar && acoesStore.dadosAcao.length > 0" class="results-area">
      <h3>Evolução: {{ termo.toUpperCase() }}</h3>

      <div class="chart-wrapper">
        <canvas id="stockChart"></canvas>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Fecho ($)</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dia in acoesStore.dadosAcao.slice(0, 5)" :key="dia.date">
              <td>{{ dia.date }}</td>
              <td>{{ dia.close }}</td>
              <td>{{ dia.volume }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { usarStoreAcoes } from '../stores/acoes.js'
import { usarStoreAuth } from '../stores/auth.js'
import Chart from 'chart.js/auto'

export default {
  name: 'InvestirPesquisa',
  data() {
    return {
      termo: '',
      chartInstance: null,
      timer: null,      // Para guardar o temporizador
      aDigitar: false   // Para mostrar efeito visual
    }
  },
  computed: {
    ...mapStores(usarStoreAcoes, usarStoreAuth)
  },
  watch: {
    // Vigia o campo de pesquisa
    termo(novoValor) {
      clearTimeout(this.timer); // Cancela a pesquisa anterior se ainda estiveres a escrever
      this.acoesStore.erro = null; // Limpa erros antigos

      if (novoValor && novoValor.length > 1) {
        this.aDigitar = true;

        // Espera 800ms (quase 1 segundo) após parares de escrever
        this.timer = setTimeout(() => {
          this.pesquisar();
          this.aDigitar = false;
        }, 800);
      } else {
        this.aDigitar = false;
      }
    }
  },
  methods: {
    async pesquisar() {
      if (!this.termo) return;

      await this.acoesStore.buscarAcao(this.termo);

      // Se encontrou dados válidos
      if (!this.acoesStore.erro && this.acoesStore.dadosAcao.length > 0) {
        this.renderChart();

        // Gamificação: Só dá XP se for uma pesquisa válida
        if (this.authStore.user) {
             this.authStore.incrementarEstatistica('stock_search');
        }
      }
    },

    renderChart() {
      const ctx = document.getElementById('stockChart');
      if (!ctx) return;
      if (this.chartInstance) this.chartInstance.destroy();

      const dadosGrafico = this.acoesStore.dadosAcao.slice(0, 30).reverse();

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dadosGrafico.map(d => d.date),
          datasets: [{
            label: 'Preço de Fecho',
            data: dadosGrafico.map(d => d.close),
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: 'white' } } },
          scales: {
            y: { ticks: { color: '#ccc' }, grid: { color: '#444' } },
            x: { ticks: { color: '#ccc' }, grid: { display: false } }
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.stock-container { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; width: 100%; max-width: 800px; color: white; text-align: center; margin: 0 auto; }

.search-box { margin-bottom: 20px; position: relative; display: inline-block; }

.search-input {
  padding: 12px;
  width: 300px;
  border-radius: 25px;
  border: 1px solid #444;
  background: #222;
  color: white;
  font-size: 1rem;
  text-align: center;
  outline: none;
  transition: border 0.3s;
}

.search-input:focus { border-color: #27ae60; }

.typing-indicator {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 0.8rem;
  font-style: italic;
}

.chart-wrapper { padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 20px; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
td, th { border: 1px solid #444; padding: 8px; }
th { background-color: #333; }
.loading { color: #f1c40f; font-weight: bold; margin-bottom: 15px; }
.error { color: #e74c3c; background: rgba(231, 76, 60, 0.1); padding: 10px; border-radius: 5px; }
</style>
