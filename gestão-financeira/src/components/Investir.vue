<script setup>
import { ref } from 'vue';
// 1. Corrigir o import: Deve ser do arquivo de serviço, não de um .vue
import apiClient from '../rc/api/api.js'; // Ajuste o caminho se necessário

const stockData = ref(null);
const isLoading = ref(false);
const error = ref(null);

async function fetchStockData() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // 2. Usar o apiClient
    const response = await apiClient.get('/query', {
      // 3. Parâmetros específicos da chamada (baseURL e apikey são automáticos)
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: 'AMZN',  // Pode ser dinâmico, ex.: ref('AAPL')
        interval: '5min'
      }
    });
    
    stockData.value = response.data;
    console.log(stockData.value);  // Para depuração
    
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    error.value = "Falha ao carregar dados. Verifique a chave da API ou a conexão.";
  } finally {
    isLoading.value = false;
  }
}

// Chamar a função para carregar os dados automaticamente
fetchStockData();
</script>

<template>
  <div>
    <h2>Dados da Alpha Vantage</h2>
    <div v-if="isLoading">A carregar...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    
    <!-- Exibir dados brutos para depuração -->
    <pre v-if="stockData">{{ JSON.stringify(stockData, null, 2) }}</pre>
    
    <!-- Exemplo de exibição formatada (opcional) -->
    <div v-if="stockData && stockData['Time Series (5min)']">
      <h3>Série Temporal Intradiária (IBM)</h3>
      <ul>
        <li v-for="(value, key) in Object.entries(stockData['Time Series (5min)']).slice(0, 5)" :key="key">
          {{ key }}: Preço de Fechamento - ${{ value['4. close'] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Estilos opcionais */
pre {
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
}
</style>