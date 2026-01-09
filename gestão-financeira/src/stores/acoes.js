import { defineStore } from 'pinia'

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY

export const usarStoreAcoes = defineStore('acoes', {
  state: () => ({
    dadosAcao: [],
    dadosNoticias: [],
    aCarregar: false,
    erro: null
  }),

  actions: {
    //função para procurar a ação no api
    async buscarAcao(simbolo) {
      this.aCarregar = true
      this.erro = null
      this.dadosAcao = []

      if (!API_KEY) {
        this.erro = 'Erro: Chave de API não encontrada no .env'
        this.aCarregar = false
        return
      }

      try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${simbolo}&apikey=${API_KEY}`
        const response = await fetch(url)
        const dados = await response.json()

        
        if (dados['Error Message']) throw new Error('Símbolo inválido.')
        if (dados['Note']) throw new Error('Limite de pedidos excedido (espera 1 min).')

        const serieTemporal = dados['Time Series (Daily)']

        if (serieTemporal) {
          //formatação dos dados do gráfico
          this.dadosAcao = Object.entries(serieTemporal).map(([data, valores]) => ({
            date: data,
            open: parseFloat(valores['1. open']),
            close: parseFloat(valores['4. close']),
            volume: parseInt(valores['5. volume'])
          }))
        } else {
          this.erro = 'Dados não encontrados.'
        }
      } catch (e) {
        this.erro = e.message || 'Erro de ligação.'
        console.error(e)
      } finally {
        this.aCarregar = false
      }
    },

    //noticias para o blog
    async buscarNoticias(topico) {
      this.aCarregar = true
      this.erro = null

      if (!API_KEY) return

      try {
        let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}&limit=10`

        // Se houver tópico específico, adiciona filtro
        if (topico && topico !== 'Geral') {
             url += `&tickers=${topico}`
        }
        
        

        const response = await fetch(url)
        const dados = await response.json()

        if (dados.feed) {
          this.dadosNoticias = dados.feed.map(noticia => {
            if (!noticia.banner_image || noticia.banner_image === "null" || noticia.banner_image === "") {
           noticia.banner_image = null; 
        }
            return noticia
          });
        } else if (dados['Note']) {
            this.erro = 'Limite de API atingido.'
        }
      } catch (e) {
        this.erro = 'Erro ao carregar notícias.'
      } finally {
        this.aCarregar = false
      }
    }
  }
})
