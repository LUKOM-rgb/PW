<template>
  <div class="stock-container">
    <h2>Analisador de Ações</h2>

    <div class="search-box">
      <input
        v-model="termo"
        placeholder="Escreve um símbolo:"
        class="search-input"
      />
      <span v-if="aDigitar" class="typing-indicator">Wait...</span>
    </div>

    <div v-if="acoesStore.aCarregar" class="loading-overlay">
  <div class="spinner-container">
    <div class="spinner"></div>
    <p>A carregar o grafico...</p>
  </div>
</div>

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

    <div v-else-if="!acoesStore.aCarregar && !acoesStore.erro" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
          <polyline points="6 12 10 9 14 13 18 8"></polyline>
        </svg>
      </div>
      <p>Pesquisa um símbolo para ver o gráfico.</p>
      <small>Exemplos populares: NVDA, MSFT, AMZN</small>
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
      timer: null,
      aDigitar: false
    }
  },
  computed: {
    ...mapStores(usarStoreAcoes, usarStoreAuth)
  },
  watch: {
    termo(novoValor) {
      clearTimeout(this.timer);
      this.acoesStore.erro = null;
      if (!novoValor) {// Se o utilizador apagar o texto, limpamos os dados antigos para mostrar a imagem padrão
          this.acoesStore.dadosAcao = [];
          if (this.chartInstance) {
              this.chartInstance.destroy();
              this.chartInstance = null;
          }
          this.aDigitar = false;
          return;
      }

      if (novoValor && novoValor.length > 1) {
        this.aDigitar = true;
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
      if (!this.acoesStore.erro && this.acoesStore.dadosAcao.length > 0) {
        this.$nextTick(() => { // Usamos $nextTick para garantir que o HTML do gráfico existe antes de desenhar
            this.renderChart();
        });

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
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(52, 152, 219, 0.4)');
              gradient.addColorStop(1, 'rgba(52, 152, 219, 0.0)');
              return gradient;
            },
            fill: true,
            tension: 0.3,
            pointRadius: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { color: '#888' }, grid: { color: '#333' } },
            x: { ticks: { color: '#888' }, grid: { display: false } }
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #666;
  text-align: center;
  border: 2px dashed #333;
  border-radius: 12px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.02);
}

.empty-icon svg {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
  opacity: 0.3;
  color: #3498db;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.empty-state small {
  color: #444;
}

/* Garante que o container do gráfico tem altura fixa */
.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
