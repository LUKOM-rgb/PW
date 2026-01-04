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
