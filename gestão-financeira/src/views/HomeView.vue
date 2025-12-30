<template>
  <div class="body">
    <div class="view home">
      <h1>Bem-vindo à Gestão Financeira</h1>
      <p>Aprenda a gerir melhor o seu dinheiro.</p>
    </div>

    <div class="cards-container">
      <div class="card"><h3>Saldo Atual</h3><p>--</p></div>
      <div class="card"><h3>Receitas</h3><p>--</p></div>
      <div class="card"><h3>Despesas</h3><p>--</p></div>
    </div>

    <div class="view home">
      <label>Digite o símbolo (ex: IBM, AAPL):</label>
      <input
        v-model="searchSymbol"
        placeholder="Escreva aqui..."
        class="search-input"
        @input="handleInput"
      />
      <small v-if="loading">A pesquisar...</small>
      <small v-else>A procura iniciará 1 segundo após parar de escrever.</small>
    </div>

    <div class="chart-wrapper">
      <h2>Evolução Financeira: {{ searchSymbol?.toUpperCase() }}</h2>

      <div v-if="loading" style="text-align:center; padding: 20px;">
        A carregar dados...
      </div>

      <div v-else-if="error" style="color: #ff6b6b; text-align:center; padding: 20px;">
        {{ error }}
      </div>

      <div v-else style="height: 400px; width: 100%;">
        <LineWithLineChart
          v-if="chartData.labels.length > 0"
          :data="chartData"
          :options="chartOptions"
        />
        <div v-else style="text-align: center; padding: 20px;">
          Sem dados para exibir.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 1. Imports normais
import { useStockData } from '../../useStockdata'
import LineWithLineChart from '../components/LineWithLineChart'

// 2. Imports e Registo do Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default {
  name: 'FinanceChart',

  components: {
    LineWithLineChart
  },

  setup() {

    const {
      stockData: stockList,
      loadingStock: loading,
      error,
      fetchStock
    } = useStockData();

    return { stockList, loading, error, fetchStock };
  },

  data() {
    return {
      searchSymbol: 'IBM',
      debounceTimer: null,

      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Evolução do Saldo',
            backgroundColor: 'rgba(7, 204, 255, 0.2)',
            borderColor: '#07C',
            borderWidth: 2,
            data: [],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: true
          }
        ]
      },

      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            intersect: false,
            callbacks: {
              label: (context) => `$ ${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            grid: { color: '#444' },
            ticks: { color: '#fff' }
          }
        }
      }
    }
  },

  // CORREÇÃO 2: Adicionado bloco de métodos
  methods: {
    handleInput(event) {
      this.searchSymbol = event.target.value.toUpperCase();
    }
  },

  watch: {
    searchSymbol(novoSimbolo) {
      clearTimeout(this.debounceTimer);
      if (!novoSimbolo) return;

      this.debounceTimer = setTimeout(() => {
        // 'this.fetchStock' funciona porque o retornámos no setup()
        this.fetchStock(novoSimbolo);
      }, 1000);
    },

    stockList(novosDados) {
      this.chartData.labels = [];
      this.chartData.datasets[0].data = [];

      if (novosDados && novosDados.length > 0) {
        console.log("Dados recebidos:", novosDados.length);

        const dadosOrdenados = [...novosDados].sort((a, b) =>
          new Date(a.date) - new Date(b.date)
        );

        this.chartData.labels = dadosOrdenados.map(item => item.date);
        this.chartData.datasets[0].data = dadosOrdenados.map(item => item.close);
      }
    }
  },

  mounted() {
    if (this.searchSymbol) {
      this.fetchStock(this.searchSymbol);
    }
  },

  beforeUnmount() {
    clearTimeout(this.debounceTimer);
  }
}
</script>

<style scoped>
.body {
  min-height: 100vh;
  color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.view.home {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px;
  width: 100%;
}

.search-input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #222;
  color: #fff;
  margin: 0 10px;
  text-transform: uppercase;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  width: 90%;
  max-width: 1200px;
}

.card {
  background: #333333;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  flex: 1 1 250px;
  text-align: center;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  margin-top: 0;
  color: #07C;
}

.chart-wrapper {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  margin-bottom: 40px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
</style>
