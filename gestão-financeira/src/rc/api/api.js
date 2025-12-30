import axios from 'axios';


const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;


const apiClient = axios.create({
  baseURL: 'https://www.alphavantage.co',

});


apiClient.interceptors.request.use(config => {

  config.params = config.params || {};


  config.params['apikey'] = apiKey;

  return config;
}, error => {

  return Promise.reject(error);
});

export default apiClient;
