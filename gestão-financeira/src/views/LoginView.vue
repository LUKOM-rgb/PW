<template>
  <div class="login-container">
    <h1>Acesso Reservado</h1>
    <form @submit.prevent="fazerLogin">
      <input v-model="email" type="text" placeholder="Utilizador (aluno)" required />
      <input v-model="password" type="password" placeholder="Senha (123)" required />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="erro" class="error">{{ erro }}</p>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { usarStoreAuth } from '../stores/auth.js'

export default {
  data() {
    return {
      email: '',
      password: '',
      erro: null
    }
  },
  computed: {
    ...mapStores(usarStoreAuth)
  },
  methods: {
    async fazerLogin() {
      const sucesso = await this.authStore.login(this.email, this.password)
      if (sucesso) {
        this.$router.push('/')
      } else {
        this.erro = 'Dados incorretos.'
      }
    }
  }
}
</script>

<style scoped>
.login-container { display: flex; flex-direction: column; align-items: center; padding-top: 50px; color: white; }
input { margin: 10px; padding: 10px; width: 200px; }
button { padding: 10px 20px; background: #07C; color: white; border: none; cursor: pointer; }
.error { color: red; margin-top: 10px; }
</style>
