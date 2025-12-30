<template>
  <div class="body">

    <div class="view home">
      <h1>Bem-vindo à Gestão Financeira</h1>
      <p>Aprenda a gerir melhor o seu dinheiro com as nossas ferramentas e guias práticos.</p>
    </div>

    <div class="cards-container">
      <div class="card">
        <h3>Saldo Atual</h3>
        <p>Visualize o saldo de todas as suas contas.</p>
      </div>
      <div class="card">
        <h3>Receitas</h3>
        <p>Controle total das suas entradas mensais.</p>
      </div>
      <div class="card">
        <h3>Despesas</h3>
        <p>Monitore onde você está gastando mais.</p>
      </div>
    </div>
    <div class="view home">
      <label>Digite o símbolo (ex: IBM, AAPL, GOOG):</label>
      <input
        v-model="searchSymbol"
        placeholder="Escreva aqui..."
        class="search-input"
      />
      <small>A procurá iniciará 1 segundo após parar de escrever.</small>
    </div>


    <div class="chart-wrapper">
      <h2>Evolução Financeira :{{ searchSymbol.toUpperCase() }}</h2>

      <div v-if="loading" style="text-align:center; padding: 20px;">A carregar dados...</div>
      <div v-else-if="error" style="color: #ff6b6b; text-align:center;">{{ error }}</div>

      <div v-else style="height: 400px; width: 100%;">
        <LineWithLineChart :data="chartData" :options="chartOptions" />
      </div>
    </div>

  </div>
</template>
.touppercase
<script setup>
import { reactive, watch, onMounted, ref } from 'vue'
import { useStockData } from '../../useStockdata'
import LineWithLineChart from '../components/LineWithLineChart'

// --- VARIÁVEIS DE ESTADO --- //
const { data: stockList, loading, error, fetchStock } = useStockData();
const searchSymbol = ref('IBM');
let debounceTimer = null;

const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: 'Evolução do Saldo',
      backgroundColor: '#333333',
      borderColor: '#07C',
      data: [],
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
})

// --- WATCHER 1 : Pesquisa com "Debounce" (Espera 1s) ---//
watch(searchSymbol, (novoSimbolo) => {

  clearTimeout(debounceTimer);

  if (!novoSimbolo) return;

  // Inicia nova contagem de 1 segundo
  debounceTimer = setTimeout(() => {
    console.log(`A pesquisar: ${novoSimbolo}`);
    fetchStock(novoSimbolo);
  }, 1000);
});

// --- WATCHER 2: Atualizar Gráfico quando chegam dados ---
watch(stockList, (novosDados) => {
  if (novosDados && novosDados.length > 0) {

    // Ordenar: Antigo -> Novo
    const dadosOrdenados = [...novosDados].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    // Atualizar Gráfico
    chartData.labels = dadosOrdenados.map(item => item.date);
    chartData.datasets[0].data = dadosOrdenados.map(item => item.close);
  }
});


onMounted(() => {

  fetchStock(searchSymbol.value);
});


const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    tooltip: {
      enabled: true,
      intersect: false,
      backgroundColor: 'rgba(51, 51, 51, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      position: 'nearest'
    },
    legend: {
      display: true,
      labels: { color: '#fff' }
    }
  },
  scales: {
    x: {
      grid: { color: '#444' },
      ticks: { color: '#fff' }
    },
    y: {
      grid: { color: '#444' },
      ticks: { color: '#fff' }
    }
  }
})
</script>
<style scoped>
.body {
  min-height: 100vh;
  color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view.home {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  width: 90%; /* Ajustado para não colar nas bordas */
  max-width: 1200px;
}

.card {
  background: #333333;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  flex: 1 1 250px; /* Cartões responsivos */
  text-align: center;
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
