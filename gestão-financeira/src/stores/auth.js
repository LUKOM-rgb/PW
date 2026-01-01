import { defineStore } from 'pinia'

export const usarStoreAuth = defineStore('auth', {
  state: () => ({
    // 1. Ao iniciar, tenta logo recuperar do localStorage
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user')
  }),

  actions: {
    async login(email, password) {
      // Podes manter a tua validação ou consultar o json-server aqui
      // Exemplo com a tua validação atual:
      if (email === 'aluno' && password === '123') {

        const userData = { name: 'Estudante', email: email }

        // Atualiza o estado do Pinia
        this.user = userData
        this.isAuthenticated = true

        // 2. O Passo Mágico: Guarda no "disco" do navegador
        localStorage.setItem('user', JSON.stringify(userData))

        return true
      }
      return false
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      // 3. Limpa do navegador ao sair
      localStorage.removeItem('user')
    }
  }
})
