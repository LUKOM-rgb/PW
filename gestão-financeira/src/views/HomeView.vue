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
        v-model="simboloPesquisa"
        placeholder="Escreva aqui..."
        class="search-input"
        @input="handleInput"
      />
<<<<<<< HEAD
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
=======
      <small>A pesquisa iniciará 1 segundo após parar de escrever.</small>
    </div>

    <div class="chart-wrapper">
      <h2>Evolução Financeira: {{ simboloPesquisa.toUpperCase() }}</h2>

      <div v-if="store.aCarregar" style="text-align:center; padding: 20px;">A carregar dados...</div>
      <div v-else-if="store.erro" style="color: #ff6b6b; text-align:center;">{{ store.erro }}</div>

      <div v-else style="height: 400px; width: 100%;">
        <LineWithLineChart
            v-if="dadosGrafico.labels.length > 0"
            :data="dadosGrafico"
            :options="opcoesGrafico"
        />
>>>>>>> dc79b7701327ece834ae36428c6684c50c6a279c
      </div>
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
// 1. Imports normais
import { useStockData } from '../../useStockdata'
import LineWithLineChart from '../components/LineWithLineChart'

// 2. Imports e Registo do Chart.js (Ficam fora do export default)
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
  name: 'FinanceChart', // Opcional, bom para debugging

  // Registo de Componentes
  components: {
    LineWithLineChart
  },

  // --- INTEGRAÇÃO DO COMPOSABLE ---
  // Para usar o teu 'useStockData' na Options API, precisamos disto aqui.
  // Tudo o que retornares aqui fica disponível no 'this'.
  setup() {
    const {
      stockData: stockList,
      loadingStock: loading,
      error,
      fetchStock
    } = useStockData();

    return { stockList, loading, error, fetchStock };
  },

  // --- DADOS REATIVOS (Estado) ---
  data() {
    return {
      searchSymbol: 'IBM',
      debounceTimer: null,

      // Configuração dos dados do gráfico
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

      // Opções visuais (pode ficar no data ou computed)
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
=======
import { mapStores } from 'pinia'
// Tenta navegar para trás duas vezes para ter a certeza que sais da pasta views
import { usarStoreAcoes } from '../../stores/acoes.js'
import LineWithLineChart from '../components/LineWithLineChart'

export default {
  components: { LineWithLineChart },
  data() {
    return {
      simboloPesquisa: 'IBM',
      temporizador: null, // Para o Debounce

      // Estrutura do Gráfico
      dadosGrafico: {
        labels: [],
        datasets: [{
          label: 'Preço de Fecho',
          backgroundColor: '#333333',
          borderColor: '#07C',
          data: [],
          tension: 0.4,
          pointRadius: 0 // Melhor performance visual
        }]
      },
      opcoesGrafico: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: '#fff' } } },
        scales: {
          x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
          y: { ticks: { color: '#fff' }, grid: { color: '#444' } }
>>>>>>> dc79b7701327ece834ae36428c6684c50c6a279c
        }
      }
    }
  },
<<<<<<< HEAD

  // --- OBSERVADORES (Watchers) ---
  watch: {
    // Observar a barra de pesquisa
    searchSymbol(novoSimbolo) {
      clearTimeout(this.debounceTimer); // Nota o uso do 'this'

      if (!novoSimbolo) return;

      this.debounceTimer = setTimeout(() => {
        this.fetchStock(novoSimbolo);
      }, 1000);
    },

    // Observar os dados que vêm da API (stockList vem do setup)
    stockList(novosDados) {
      // Limpar arrays
      this.chartData.labels = [];
      this.chartData.datasets[0].data = [];

      if (novosDados && novosDados.length > 0) {
        console.log("Dados recebidos (Options API):", novosDados.length);

        // Ordenar
        const dadosOrdenados = [...novosDados].sort((a, b) =>
          new Date(a.date) - new Date(b.date)
        );

        // Atualizar Gráfico
        this.chartData.labels = dadosOrdenados.map(item => item.date);
        this.chartData.datasets[0].data = dadosOrdenados.map(item => item.close);
      }
    }
  },

  // --- CICLO DE VIDA (Lifecycle Hooks) ---
  mounted() {
    if (this.searchSymbol) {
      this.fetchStock(this.searchSymbol);
    }
  },

  beforeUnmount() { // Equivalente ao onUnmounted
    clearTimeout(this.debounceTimer);
=======
  computed: {
    ...mapStores(usarStoreAcoes),
    store() { return this.acoesStore }, // Atalho
    // Helper para observar mudanças na lista da store
    listaAcoes() { return this.store.dadosAcao }
  },
  watch: {
    // 1. Debounce da Pesquisa (Espera o utilizador parar de escrever)
    simboloPesquisa(novoValor) {
      clearTimeout(this.temporizador)
      if (!novoValor) return

      this.temporizador = setTimeout(() => {
        this.store.buscarAcao(novoValor)
      }, 1000)
    },

    // 2. Atualizar o Gráfico quando a Store mudar
    listaAcoes(novosDados) {
      if (novosDados && novosDados.length > 0) {
        // Ordenar data (Antigo -> Novo)
        const ordenado = [...novosDados].sort((a, b) => new Date(a.date) - new Date(b.date))

        this.dadosGrafico.labels = ordenado.map(d => d.date)
        this.dadosGrafico.datasets[0].data = ordenado.map(d => d.close)
      } else {
          this.dadosGrafico.labels = []
          this.dadosGrafico.datasets[0].data = []
      }
    }
  },
  mounted() {
    // Carrega dados iniciais
    this.store.buscarAcao(this.simboloPesquisa)
>>>>>>> dc79b7701327ece834ae36428c6684c50c6a279c
  }
}
</script>

<style scoped>
<<<<<<< HEAD
.body {
  min-height: 100vh;
  color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Fonte padrão agradável */
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
  text-transform: uppercase; /* Visualmente em maiúsculas */
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
  transform: translateY(-5px); /* Efeito visual ao passar o rato */
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
=======
/* O teu CSS mantém-se igual */
.body { min-height: 100vh; color: #fff; width: 100%; display: flex; flex-direction: column; align-items: center; }
.cards-container { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 40px; justify-content: center; width: 90%; max-width: 1200px; }
.card { background: #333; border-radius: 8px; padding: 1.5rem; flex: 1 1 250px; text-align: center; }
.chart-wrapper { background-color: #2a2a2a; padding: 20px; border-radius: 12px; width: 90%; max-width: 1200px; }
.search-input { padding: 10px; margin: 10px 0; border-radius: 4px; border: none; width: 200px; }
>>>>>>> dc79b7701327ece834ae36428c6684c50c6a279c
</style>
