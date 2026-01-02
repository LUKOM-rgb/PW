import { defineStore } from 'pinia'

export const usarStoreAuth = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    listaUsuarios: []
  }),

  getters: {
    // Verifica se o utilizador atual é o admin
    eAdmin: (state) => state.user && state.user.email === 'admin'
  },

  actions: {
    async login(email, password) {
      try {
        const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`)
        const users = await response.json()

        if (users.length > 0) {
          const userFound = users[0]
          this.user = userFound
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(userFound))
          return true
        }
      } catch (error) {
        console.error("Erro no login:", error)
      }
      return false
    },

    async registar(nome, email, password) {
      try {
        const checkRep = await fetch(`http://localhost:3000/users?email=${email}`)
        const users = await checkRep.json()
        if (users.length > 0) return false

        const novoUser = { name: nome, email: email, password: password }

        await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUser)
        })
        return true
      } catch (error) {
        return false
      }
    },

    // --- NOVA AÇÃO: MUDAR DADOS DO PERFIL ---
    async atualizarPerfil(novosDados) {
      try {
        const id = this.user.id
        // PATCH atualiza apenas os campos enviados, sem apagar o resto
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novosDados)
        })

        if (response.ok) {
          const userAtualizado = await response.json()
          this.user = userAtualizado
          localStorage.setItem('user', JSON.stringify(userAtualizado)) // Atualiza o "cookie"
          return true
        }
      } catch (error) {
        console.error("Erro ao atualizar:", error)
      }
      return false
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.listaUsuarios = []
      localStorage.removeItem('user')
    },

    async carregarUsuarios() {
      const response = await fetch('http://localhost:3000/users')
      this.listaUsuarios = await response.json()
    },

    async removerUsuario(id) {
      await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
      this.listaUsuarios = this.listaUsuarios.filter(u => u.id !== id)
    }
  }
})
