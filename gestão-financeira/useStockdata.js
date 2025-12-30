import { ref } from 'vue';
import axios from 'axios';

export function useStockData() {
  // --- ESTADO (Separado) ---
  const stockData = ref(null); // Guarda os preços (Gráfico)
  const newsData = ref([]);    // Guarda as notícias (Blog)

  const loading = ref(false);
  const error = ref(null);

  const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

  // --- FUNÇÃO 1: Buscar Preços (Para o Gráfico) ---
  const fetchStock = async (symbol) => {
    loading.value = true;
    error.value = null;
    stockData.value = null; // Limpa dados antigos

    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: API_KEY
        }
      });

      if (response.data['Error Message']) throw new Error("Símbolo não encontrado.");
      if (response.data['Note']) throw new Error("Limite da API excedido.");

      const timeSeries = response.data['Time Series (Daily)'];
      if (timeSeries) {

        stockData.value = Object.entries(timeSeries).map(([date, values]) => ({
          date: date,
          close: parseFloat(values['4. close'])
        }));
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };


  const fetchNews = async (symbol) => {
    loading.value = true;
    newsData.value = [];

    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'NEWS_SENTIMENT', // Endpoint diferente!
          tickers: symbol,
          limit: 10, // Traz 10 notícias
          sort: 'LATEST',
          apikey: API_KEY
        }
      });

      if (response.data['feed']) {
        // Mapeia apenas os dados de texto/notícia
        newsData.value = response.data['feed'].map(item => ({
          title: item.title,
          url: item.url,
          summary: item.summary,
          source: item.source,
          image: item.banner_image,
          topics: item.topics
        }));
      }
    } catch (err) {
      console.error("Erro notícias:", err);

    } finally {
      loading.value = false;
    }
  };

  return {
    stockData,
    newsData,
    loading,
    error,
    fetchStock,
    fetchNews
  };
}
