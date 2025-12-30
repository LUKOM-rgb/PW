import { defineStore } from 'pinia'

export const usarStoreAuth = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  actions: {
    async login(email, password) {
      // Simulação simples de validação
      if (email === 'aluno' && password === '123') {
        this.user = { name: 'Estudante', email: email }
        this.isAuthenticated = true
        return true
      }
      return false
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
    }
  }
})
