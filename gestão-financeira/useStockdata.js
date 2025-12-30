import { ref } from 'vue';
import axios from 'axios';

export function useStockData() {
  // --- ESTADO ---
  const stockData = ref(null);
  const newsData = ref([]);

  // Melhoria: Separar os loadings para controlo fino da UI
  const loadingStock = ref(false);
  const loadingNews = ref(false);

  const error = ref(null);

  const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

  // --- FUNÇÃO 1: Buscar Preços ---
  const fetchStock = async (symbol) => {
    loadingStock.value = true; // Usa loading específico
    error.value = null;
    stockData.value = null;

    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: API_KEY
        }
      });

      // Tratamento de erros específicos da Alpha Vantage
      if (response.data['Error Message']) throw new Error("Símbolo inválido ou não encontrado.");
      if (response.data['Note']) throw new Error("Limite de API excedido (máx 5/min ou 25/dia).");

      const timeSeries = response.data['Time Series (Daily)'];

      if (timeSeries) {
        // Transformação de Objeto para Array
        stockData.value = Object.entries(timeSeries).map(([date, values]) => ({
          date: date,
          close: parseFloat(values['4. close']) // Importante: converter string para número
        }));
      }
    } catch (err) {
      error.value = err.message || "Erro ao buscar dados.";
      console.error(err);
    } finally {
      loadingStock.value = false;
    }
  };

  // --- FUNÇÃO 2: Buscar Notícias ---
  const fetchNews = async (symbol) => {
    loadingNews.value = true; // Usa loading específico
    newsData.value = [];
    // Nota: Não limpamos o erro global aqui para não esconder erros do gráfico se ocorrerem simultaneamente

    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'NEWS_SENTIMENT',
          tickers: symbol,
          limit: 10,
          sort: 'LATEST',
          apikey: API_KEY
        }
      });

      if (response.data['feed']) {
        newsData.value = response.data['feed'].map(item => ({
          title: item.title,
          url: item.url,
          summary: item.summary,
          source: item.source,
          image: item.banner_image,
          topics: item.topics,
          sentiment: item.overall_sentiment_label // Útil para mostrar se é boa/má notícia
        }));
      }
    } catch (err) {
      console.error("Erro notícias:", err);
      // Opcional: Definir um erro específico para notícias se quiseres exibir na UI
    } finally {
      loadingNews.value = false;
    }
  };

  return {
    stockData,
    newsData,
    loadingStock, // Retorna loading separado
    loadingNews,  // Retorna loading separado
    error,
    fetchStock,
    fetchNews
  };

}
