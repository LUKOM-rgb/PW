<script setup>
import { ref, watch } from 'vue';
import { useStockData } from '../../useStockdata'; // Importa a lógica que criamos acima

// Variável ligada ao Input
const searchSymbol = ref('');
let debounceTimer = null;

// Trazendo as funcionalidades do nosso Composable
const { data, loading, error, fetchStock } = useStockData();
const popularStocks = [
  { 
    symbol: 'IBM', 
    name: 'International Business Machines', 
    description: 'Conhecida por avanços em hardware, software e serviços de TI e consultoria.' 
  },
  { 
    symbol: 'AAPL', 
    name: 'Apple Inc.', 
    description: 'Gigante da tecnologia famosa pelo iPhone, Mac e serviços digitais.' 
  },
  { 
    symbol: 'TSLA', 
    name: 'Tesla, Inc.', 
    description: 'Líder em veículos elétricos, energia limpa e inteligência artificial.' 
  }
];

// --- 2. Função para quando clicam num Card ---
const selectStock = (symbol) => {
  searchSymbol.value = symbol; // Atualiza o input visualmente
  fetchStock(symbol); // Busca direto (sem esperar o timer)
};
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
<div class="suggestions-grid" v-if="!data && !loading">
      <div 
        v-for="stock in popularStocks" 
        :key="stock.symbol" 
        class="stock-card"
        @click="selectStock(stock.symbol)"
      >
        <div class="card-top">
          <h3>{{ stock.symbol }}</h3>
          <span class="stock-name">{{ stock.name }}</span>
        </div>
        <p>{{ stock.description }}</p>
        <button class="btn-select">Ver Análise →</button>
      </div>
    </div>
  
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

