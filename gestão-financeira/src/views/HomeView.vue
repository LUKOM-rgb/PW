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
      />
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
      </div>
    </div>
  </div>
</template>

<script>
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
        }
      }
    }
  },
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
  }
}
</script>

<style scoped>
/* O teu CSS mantém-se igual */
.body { min-height: 100vh; color: #fff; width: 100%; display: flex; flex-direction: column; align-items: center; }
.cards-container { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 40px; justify-content: center; width: 90%; max-width: 1200px; }
.card { background: #333; border-radius: 8px; padding: 1.5rem; flex: 1 1 250px; text-align: center; }
.chart-wrapper { background-color: #2a2a2a; padding: 20px; border-radius: 12px; width: 90%; max-width: 1200px; }
.search-input { padding: 10px; margin: 10px 0; border-radius: 4px; border: none; width: 200px; }
</style>
