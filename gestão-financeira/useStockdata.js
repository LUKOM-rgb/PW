import { ref } from 'vue';
import axios from 'axios';


export function useStockData() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

  const fetchStock = async (symbol) => {
    // Limpar estados anteriores
    data.value = null;
    error.value = null;
    
    if (!symbol) return;

    loading.value = true;

    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: API_KEY
        }
      });

      // Validar erros da API (Alpha Vantage retorna 200 mesmo com erro)
      if (response.data['Error Message']) {
        throw new Error(`Símbolo '${symbol}' não encontrado.`);
      }
      if (response.data['Note']) {
        throw new Error("Limite da API excedido. Aguarde 1 minuto.");
      }

      // --- TRATAMENTO DOS DADOS ---
      const timeSeries = response.data['Time Series (Daily)'];
      if (timeSeries) {
        data.value = Object.entries(timeSeries).map(([date, values]) => ({
          date: date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        }));
      }

    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    fetchStock
  };
}