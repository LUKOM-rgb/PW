import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usarStoreAcoes } from '../stores/acoes'
import { usarStoreAuth } from '../stores/auth'

// --- DADOS FALSOS PARA AÇÕES (MOCKS) ---
const mockAcaoResponse = {
  "Time Series (Daily)": {
    "2023-10-25": { "1. open": "100.00", "4. close": "105.00", "5. volume": "500" },
    "2023-10-24": { "1. open": "98.00", "4. close": "99.00", "5. volume": "400" }
  }
}

describe('Testes Completos do Projeto', () => {

  // O beforeEach corre antes de CADA teste individual
  beforeEach(() => {
    setActivePinia(createPinia()) // Limpa o Pinia (reseta estados)

    // Reseta o fetch para uma função vazia antes de cada teste
    global.fetch = vi.fn()

    // Simula a API Key para as ações não falharem
    vi.stubGlobal('import.meta', { env: { VITE_ALPHA_VANTAGE_API_KEY: 'teste-key' } })

    // Silencia os 'alerts' do navegador (usados na gamificação)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  // ======================================================
  // GRUPO 1: TESTES DA STORE DE AÇÕES (API EXTERNA)
  // ======================================================
  describe('Store de Ações (acoes.js)', () => {

    it('1. Deve iniciar com o estado vazio', () => {
      const store = usarStoreAcoes()
      expect(store.dadosAcao).toEqual([])
      expect(store.dadosNoticias).toEqual([])
      expect(store.erro).toBe(null)
    })

    it('2. Deve registar um erro se a API falhar (ex: sem internet)', async () => {
      const store = usarStoreAcoes()
      global.fetch.mockRejectedValue(new Error('Erro de Rede'))
      await store.buscarAcao('AAPL')

      expect(store.erro).not.toBe(null)
      expect(store.dadosAcao.length).toBe(0)
    })

    it('3. buscarAcao: Deve chamar a API e receber dados', async () => {
      const store = usarStoreAcoes()
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve(mockAcaoResponse)
      })
      await store.buscarAcao('AAPL')

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(store.dadosAcao.length).toBe(2)
    })

    it('4. Rate Limit: Deve detetar bloqueio da API', async () => {
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

  // ======================================================
  // GRUPO 2: TESTES DA STORE DE AUTH (LÓGICA DO JOGO)
  // ======================================================
  describe('Store de Auth (Lógica e Gamificação)', () => {

    // Simula resposta padrão do servidor local para não dar erro
    beforeEach(() => {
        global.fetch.mockResolvedValue({ json: () => Promise.resolve({}) })
    })

    it('1. Simulador: Bloqueia após 2 jogadas no mesmo dia', () => {
      const store = usarStoreAuth()
      const hoje = new Date().toISOString().split('T')[0]

      // Simula utilizador que já jogou
      store.user = { id: 1, simulador: { lastDate: hoje, plays: 2 } }

      expect(store.podeJogarHoje()).toBe(false)
    })

    it('2. Simulador: Permite jogar se for um novo dia', () => {
      const store = usarStoreAuth()
      store.user = { id: 1, simulador: { lastDate: '2020-01-01', plays: 2 } }

      expect(store.podeJogarHoje()).toBe(true)
    })

    it('3. Gamificação: Deve subir de nível ao ganhar XP suficiente', async () => {
      const store = usarStoreAuth()
      // Nível 1 com 0 XP
      store.user = { id: 1, level: 1, xp: 0, stats: {} }

      // Ganha 500 XP (passa o nível 1 que pede 200)
      await store.ganharXP(500)

      expect(store.user.level).toBeGreaterThan(1)
      expect(store.user.xp).toBe(500)
    })

    it('4. Registo: Cria novo utilizador com stats a zero', async () => {
      const store = usarStoreAuth()
      const spyFetch = vi.spyOn(global, 'fetch')

      // Mock 1: User não existe (Check)
      spyFetch.mockResolvedValueOnce({ json: () => Promise.resolve([]) })
      // Mock 2: Sucesso ao criar (Post)
      spyFetch.mockResolvedValueOnce({ ok: true })

      await store.registar('NovoGamer', '1234')

      // Verifica os dados enviados no POST (segunda chamada)
      const corpoEnvio = JSON.parse(spyFetch.mock.calls[1][1].body)

      expect(corpoEnvio.level).toBe(1)
      expect(corpoEnvio.xp).toBe(0)
    })
  })
})
