import axios from 'axios';

// 1. Aceder à sua chave de API a partir das variáveis de ambiente
const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

// 2. Criar a instância com o baseURL correto
const apiClient = axios.create({
  baseURL: 'https://www.alphavantage.co',
  // Note: Não precisamos de 'Content-Type' aqui,
  // pois estamos apenas a fazer pedidos GET
});

// 3. Usar um Interceptor para adicionar a API key a CADA pedido
apiClient.interceptors.request.use(config => {
  // 'config.params' são os parâmetros da URL (ex: ?function=TIME_SERIES)
  config.params = config.params || {};
  
  // Adiciona a nossa chave de API aos parâmetros de qualquer pedido
  // que sair deste 'apiClient'
  config.params['apikey'] = apiKey;
  
  return config;
}, error => {
  // Lidar com erros de pedido
  return Promise.reject(error);
});

export default apiClient;