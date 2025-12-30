import { defineStore } from 'pinia'
import apiClient from '../api' // Certifica-te que tens o api.js na pasta src/

export const usarStoreAcoes = defineStore('acoes', {
  state: () => ({
    dadosAcao: [],      // Para o gráfico
    dadosNoticias: [],  // Para o blog
    aCarregar: false,
    erro: null
  }),

  actions: {
    // 1. Buscar Preços
    async buscarAcao(simbolo) {
      this.aCarregar = true
      this.erro = null
      this.dadosAcao = []

      try {
        // Usa o apiClient que já tem a API Key configurada
        const resposta = await apiClient.get('/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: simbolo
          }
        })

        if (resposta.data['Error Message']) throw new Error("Símbolo não encontrado.")
        if (resposta.data['Note']) throw new Error("Limite da API excedido.")

        const serieTemporal = resposta.data['Time Series (Daily)']

        if (serieTemporal) {
          this.dadosAcao = Object.entries(serieTemporal).map(([data, valores]) => ({
            date: data,
            open: parseFloat(valores['1. open']),
            close: parseFloat(valores['4. close']),
            volume: parseInt(valores['5. volume'])
          }))
        }
      } catch (e) {
        this.erro = e.message || 'Erro ao buscar dados.'
        console.error(e)
      } finally {
        this.aCarregar = false
      }
    },

    // 2. Buscar Notícias
    async buscarNoticias(topico) {
      this.aCarregar = true
      this.erro = null
      this.dadosNoticias = []

      try {
        const resposta = await apiClient.get('/query', {
          params: {
            function: 'NEWS_SENTIMENT',
            tickers: topico,
            limit: 10,
            sort: 'LATEST'
          }
        })

        if (resposta.data.feed) {
           this.dadosNoticias = resposta.data.feed
        }
      } catch (e) {
        console.error(e)
        this.erro = 'Não foi possível carregar as notícias.'
      } finally {
        this.aCarregar = false
      }
    }
  }
})
