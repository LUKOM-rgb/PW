import { defineStore } from 'pinia'

// Se for a primeira vez a usar Pinia, certifique-se que cria a pasta 'stores'
// em 'src/'.
const XP_PER_LEVEL = 100

function getLevel(xp) {
    // Cálculo simples: Nível 1 até 99 XP, Nível 2 a partir de 100 XP, etc.
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    // Dados de Gamificação
    userXP: 0,
    userLevel: 1,
    badges: [], // Ex: ['Calculador de Sonhos', 'Mestre de Investimento']

    // Registo de Atividade (Tracking)
    eventLog: [], // Lista de { action, xp, timestamp }
  }),

  // Funções que calculam dados a partir do estado
  getters: {
      currentLevel: (state) => getLevel(state.userXP),
      xpToNextLevel: (state) => XP_PER_LEVEL - (state.userXP % XP_PER_LEVEL)
  },

  actions: {
    // Ação principal para registar uma atividade e dar XP
    // Será chamada em componentes (ex: SimuladorCredito) e no Router
    registerAction(actionDescription, xpAmount) {
      if (!actionDescription || xpAmount === undefined) return // Proteção

      // 1. Criar o Log
      const newEvent = {
        action: actionDescription,
        xp: xpAmount,
        timestamp: new Date().toISOString(),
      }

      this.eventLog.unshift(newEvent) // Adiciona no início (mais recente primeiro)

      // 2. Atualizar XP
      const oldLevel = this.userLevel
      this.userXP += xpAmount
      this.userLevel = getLevel(this.userXP)

      // 3. Lógica de Recompensa
      if (this.userLevel > oldLevel) {
        console.log(`[GAMIFICAÇÃO] 🎉 Parabéns! Subiu para o Nível ${this.userLevel}!`)
      }
      this.checkBadges(actionDescription)

      // IMPORTANTE PARA PERSISTÊNCIA:
      // Quando implementar o json-server, adicione aqui a chamada:
      // this.saveTrackingDataToMockServer()
    },

    // Exemplo de verificação de Badges
    checkBadges(action) {
        // Se já tem a badge, ignora
        if (this.badges.includes('Calculador de Sonhos')) return

        if (action.includes('Simulador de Crédito')) {
            this.badges.push('Calculador de Sonhos')
            console.log('[GAMIFICAÇÃO] 🏆 Badge Desbloqueada: Calculador de Sonhos!')
        }
    },

    // Ação para carregar os dados ao iniciar a aplicação (opcional)
    loadInitialData() {
        // Para implementar no futuro com o json-server
    }
  },
})