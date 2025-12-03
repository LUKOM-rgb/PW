<script setup>
import { ref, watch } from 'vue';
import { useStockData } from '../../useStockdata'; // Importa a lógica que criamos acima

// Variável ligada ao Input
const searchSymbol = ref('');
let debounceTimer = null;

// Trazendo as funcionalidades do nosso Composable
const { data, loading, error, fetchStock } = useStockData();

// O "Vigia" (Watcher)
watch(searchSymbol, (newValue) => {
  // 1. Limpa o timer anterior se o utilizador ainda estiver a escrever
  clearTimeout(debounceTimer);

  // 2. Se o campo estiver vazio, não faz nada
  if (!newValue) return;

  // 3. Inicia um novo timer. Só chama a API se o utilizador parar por 1 segundo (1000ms)
  debounceTimer = setTimeout(() => {
    console.log(`Buscando dados para: ${newValue}`);
    fetchStock(newValue.toUpperCase()); // Converte para maiúsculas (ex: apple -> AAPL)
  }, 1000); 
});
</script>

<template>
  <div class="stock-container">
    <h1>Analisador de Ações</h1>
    
    <div class="input-group">
      <label>Digite o símbolo (ex: IBM, AAPL, GOOG):</label>
      <input 
        v-model="searchSymbol" 
        placeholder="Escreva aqui..." 
        class="search-input"
      />
      <small>A busca iniciará 1 segundo após parar de escrever.</small>
    </div>

    <div v-if="loading" class="status loading">🔄 A carregar dados da API...</div>
    <div v-if="error" class="status error">⚠️ {{ error }}</div>

    <div v-if="data && data.length > 0" class="results">
      <h3>Resultados para: {{ searchSymbol.toUpperCase() }}</h3>
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
            <tr v-for="day in data.slice(0, 5)" :key="day.date">
              <td>{{ day.date }}</td>
              <td :class="{'text-green': day.close > day.open, 'text-red': day.close < day.open}">
                {{ day.close.toFixed(2) }}
              </td>
              <td>{{ day.volume.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock-container { max-width: 600px; margin: 0 auto; font-family: sans-serif; }
.input-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px; }
.search-input { padding: 10px; font-size: 16px; border: 2px solid #ddd; border-radius: 4px; }
.search-input:focus { border-color: #42b983; outline: none; }
.status { padding: 10px; border-radius: 4px; margin-bottom: 10px; }
.error { background-color: #fee; color: #d00; }
.loading { background-color: #eef; color: #00d; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px; border-bottom: 1px solid #eee; text-align: left; }
.text-green { color: green; font-weight: bold; }
.text-red { color: red; font-weight: bold; }
</style>