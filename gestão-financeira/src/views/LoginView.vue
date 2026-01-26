<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Entrar</h1>

      <div v-if="mostrarAviso" class="aviso-box">
         Precisas de fazer login para aceder a essa página!
      </div>

      <form @submit.prevent="fazerLogin">
        <div class="form-group">
          <label>Nome:</label>
          <input v-model="nome" type="text" placeholder="Digite seu nome" required />
        </div>
        <div class="form-group">
          <label>Senha:</label>
          <input v-model="password" type="password" placeholder="Digite sua senha" required />
        </div>
        <button type="submit" class="btn-login">Entrar</button>
      </form>

      <p v-if="erro" class="error-msg">Nome ou senha incorretos!</p>
      <p class="toggle-text">
        Ainda não tens conta?
        <RouterLink to="/registar">Criar uma agora</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usarStoreAuth } from '../stores/auth';

const authStore = usarStoreAuth();
const router = useRouter();
const route = useRoute();

const nome = ref('');
const password = ref('');
const erro = ref(null);

// Verifica se no link existe "?semPermissao=true"
const mostrarAviso = computed(() => route.query.semPermissao === 'true');

const fazerLogin = async () => {
  // Limpar erros anteriores
  erro.value = null;

  // 1. Receber o objeto da store
  const resultado = await authStore.login(nome.value, password.value);

  // 2. Verificar a propriedade .success
  if (resultado.success) {

    // Redirecionar do admin
    if (authStore.user?.name === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/perfil');
    }

  } else {
    // 3. Mostrar a mensagem de erro que vem da Store
    erro.value = resultado.message;
  }
};
</script>

