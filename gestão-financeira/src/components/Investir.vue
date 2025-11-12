<script setup>
import { ref } from 'vue';
// 1. Importar a nossa instância configurada!
import apiClient from '../views/InvestirView.vue'; // Ajuste o caminho se necessário

const stockData = ref(null);
const isLoading = ref(false);
const error = ref(null);

async function fetchStockData() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // 2. Usar o apiClient
    const response = await apiClient.get('/query', {
      // 3. Repare como SÓ precisamos de passar os parâmetros
      // específicos desta chamada. O 'baseURL' e 'apikey'
      // são tratados automaticamente.
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: 'IBM',
        interval: '5min'
      }
    });
    
    stockData.value = response.data;
    console.log(stockData.value);
    
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    error.value = "Falha ao carregar dados.";
  } finally {
    isLoading.value = false;
  }
}

// Chamar a função para carregar os dados
fetchStockData();

</script>

<template>
  <div>
    <h2>Dados da Alpha Vantage</h2>
    <div v-if="isLoading">A carregar...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    
    <pre v-if="stockData">{{ stockData }}</pre>
  </div>
</template>