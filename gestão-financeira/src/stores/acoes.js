import { defineStore } from 'pinia'
import axios from 'axios'

export const usarStoreAcoes = defineStore('acoes', {
  state: () => ({
    dadosAcao: [],
    dadosNoticias: [],
    aCarregar: false,
    erro: null
  }),
  actions: {
    async buscarAcao(simbolo) {
      this.aCarregar = true
      this.erro = null
      this.dadosAcao = []

      try {
        // Pega sempre os dados fixos do db.json (simulação)
        const resposta = await axios.get('http://localhost:3000/stock')
        const dados = resposta.data[0]
        const serieTemporal = dados['Time Series (Daily)']

        if (serieTemporal) {
          this.dadosAcao = Object.entries(serieTemporal).map(([data, valores]) => ({
            date: data,
            open: parseFloat(valores['1. open']),
            close: parseFloat(valores['4. close']),
            volume: parseInt(valores['5. volume'])
          }))
        }
      } catch (e) {
        this.erro = 'Erro: O servidor json-server está ligado?'
        console.error(e)
      } finally {
        this.aCarregar = false
      }
    },

    async buscarNoticias(topico) {
      this.aCarregar = true
      this.erro = null
      try {
        const resposta = await axios.get('http://localhost:3000/news')
        const dados = resposta.data[0]
        if (dados.feed) this.dadosNoticias = dados.feed
      } catch (e) {
        this.erro = 'Erro ao carregar notícias.'
      } finally {
        this.aCarregar = false
      }
    }
  }
})
