<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Criar Nova Conta</h1>

      <form @submit.prevent="fazerRegisto">
        <div class="form-group">
          <label>Nome:</label>
          <input v-model="name" type="text" placeholder="O teu nome" required />
        </div>

        <div class="form-group">
          <label>Senha:</label>
          <input v-model="password" type="password" placeholder="Definir Senha" required />
        </div>

        <button type="submit" class="btn-login">Registar</button>
      </form>

      <p v-if="erro" class="error-msg">{{ erro }}</p>

      <p class="toggle-text">
        Já tens conta?
        <RouterLink to="/login">Entrar aqui</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usarStoreAuth } from '../stores/auth'; // Confirma se o nome do ficheiro é 'auth.js'

const authStore = usarStoreAuth();
const router = useRouter();

const name = ref('');
const password = ref('');
const erro = ref(null);

const fazerRegisto = async () => {
  // Limpar erro anterior
  erro.value = null;

  // Agora recebemos um objeto { success, message }
  const resultado = await authStore.registar(name.value, password.value);

  // Verificamos a propriedade .success
  if (resultado.success) {
    alert('Conta criada com sucesso! Por favor faça login.');
    router.push('/login');
  } else {
   
    erro.value = resultado.message;
  }
};
</script>

<style scoped>
/* Reutilização dos estilos do login para consistência */
.login-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
.login-box { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
.form-group { margin-bottom: 1rem; text-align: left; }
.form-group label { display: block; margin-bottom: 0.5rem; color: #666; }
.form-group input { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.btn-login { width: 100%; padding: 0.8rem; background-color: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
.btn-login:hover { background-color: #219150; }
.error-msg { color: #e74c3c; margin-top: 1rem; }
.toggle-text { margin-top: 1.5rem; color: #666; }
.toggle-text a { color: #27ae60; text-decoration: none; font-weight: bold; }
</style>
