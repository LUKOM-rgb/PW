import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usarStoreAcoes } from '../stores/acoes'
import { usarStoreAuth } from '../stores/auth'

// Mock data
const mockAcaoResponse = {
  "Time Series (Daily)": {
    "2023-10-25": { "1. open": "100.00", "4. close": "105.00", "5. volume": "500" },
    "2023-10-24": { "1. open": "98.00", "4. close": "99.00", "5. volume": "400" }
  }
}

describe('Testes Completos do Projeto', () => {
  beforeEach(() => {// O beforeEach corre antes de cada teste individual
    setActivePinia(createPinia()) // Limpa o Pinia (reseta estados)
    global.fetch = vi.fn()    // Reseta o fetch para uma função vazia antes de cada teste
    vi.stubGlobal('import.meta', { env: { VITE_ALPHA_VANTAGE_API_KEY: 'teste-key' } })// Simula a API Key para as ações não falharem
    vi.spyOn(window, 'alert').mockImplementation(() => {}) // Silencia os 'alerts' do navegador (usados na gamificação)
  })

  // Teste acoes.js
  describe('Store de Ações', () => {

    it('Deve iniciar com o estado vazio', () => {
      const store = usarStoreAcoes()
      expect(store.dadosAcao).toEqual([])
      expect(store.dadosNoticias).toEqual([])
      expect(store.erro).toBe(null)
    })

    it('Registar um erro se a API falhar (exemplo: sem internet)', async () => {
      const store = usarStoreAcoes()
      global.fetch.mockRejectedValue(new Error('Erro de Rede'))
      await store.buscarAcao('AAPL')

      expect(store.erro).not.toBe(null)
      expect(store.dadosAcao.length).toBe(0)
    })

    it('Chamar a API e receber dados', async () => {
      const store = usarStoreAcoes()
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve(mockAcaoResponse)
      })
      await store.buscarAcao('AAPL')

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(store.dadosAcao.length).toBe(2)
    })

    it('Detetar bloqueio da API', async () => {
      const store = usarStoreAcoes()
      const respostaLimite = {
        "Note": "Thank you for using Alpha Vantage!..."
      }
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve(respostaLimite)
      })
      await store.buscarAcao('IBM')
      expect(store.erro).toBeTruthy()
    })

    it('5. Loading: Deve alterar o estado de "aCarregar"', async () => {
      const store = usarStoreAcoes()
      const dadosFalsos = { "Time Series (Daily)": {} }
      let resolverFetch
      const promessaLenta = new Promise(r => { resolverFetch = r })
      global.fetch.mockReturnValue(Promise.resolve({
        json: () => promessaLenta
      }))
      const promessaAcao = store.buscarAcao('AAPL')
      expect(store.aCarregar).toBe(true)
      resolverFetch(dadosFalsos)
      await promessaAcao
      expect(store.aCarregar).toBe(false)
    })
  })

  // Testes Auth.js
  describe('Gamificação', () => {
    beforeEach(() => {   // Simula resposta padrão do servidor local para não dar erro
        global.fetch.mockResolvedValue({ json: () => Promise.resolve({}) })
    })

    it('1. Simulador: Bloqueia após 2 jogadas no mesmo dia', () => {
      const store = usarStoreAuth()
      const hoje = new Date().toISOString().split('T')[0]
      store.user = { id: 1, simulador: { lastDate: hoje, plays: 2 } } // Simula utilizador que já jogou

      expect(store.podeJogarHoje()).toBe(false)
    })

    it('2. Simulador: Permite jogar se for um novo dia', () => {
      const store = usarStoreAuth()
      store.user = { id: 1, simulador: { lastDate: '2020-01-01', plays: 2 } }

      expect(store.podeJogarHoje()).toBe(true)
    })

    it('3. Gamificação: Deve subir de nível ao ganhar XP suficiente', async () => {
      const store = usarStoreAuth()
      store.user = { id: 1, level: 1, xp: 0, stats: {} } // Nível 1 com 0 XP
      await store.ganharXP(500)       // Ganha 500 XP (passa o nível 1 que pede 200)

      expect(store.user.level).toBeGreaterThan(1)
      expect(store.user.xp).toBe(500)
    })
  })
})
