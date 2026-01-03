<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Entrar</h1>

      <div v-if="mostrarAviso" class="aviso-box">
        ⚠️ Precisas de fazer login para aceder a essa página!
      </div>

      <form @submit.prevent="fazerLogin">
        <div class="form-group">
          <label>Email:</label>
          <input v-model="email" type="text" placeholder="Digite seu email" required />
        </div>
        <div class="form-group">
          <label>Senha:</label>
          <input v-model="password" type="password" placeholder="Digite sua senha" required />
        </div>
        <button type="submit" class="btn-login">Entrar</button>
      </form>

      <p v-if="erro" class="error-msg">Email ou senha incorretos!</p>

      <p class="toggle-text">
        Ainda não tens conta?
        <RouterLink to="/registar">Criar uma agora</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'; // Importar computed
import { useRouter, useRoute } from 'vue-router'; // Importar useRoute
import { usarStoreAuth } from '../stores/auth';

const authStore = usarStoreAuth();
const router = useRouter();
const route = useRoute(); // Para ler os parâmetros do link

const email = ref('');
const password = ref('');
const erro = ref(false);

// Verifica se no link existe "?semPermissao=true"
const mostrarAviso = computed(() => route.query.semPermissao === 'true');

const fazerLogin = async () => {
  const sucesso = await authStore.login(email.value, password.value);

  if (sucesso) {
    // --- CÓDIGO NOVO AQUI ---
    // Verifica se o email é 'admin' (ou usa authStore.eAdmin se tiveres criado o getter)
    if (authStore.user?.email === 'admin') {
      router.push('/dashboard'); // Admin vai para o Dashboard
    } else {
      router.push('/perfil');    // Outros vão para o Perfil (ou '/' para a Home)
    }
    // ------------------------
  } else {
    erro.value = true;
  }
};
</script>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
.login-box { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }

/* Estilo novo para o aviso */
.aviso-box {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.form-group { margin-bottom: 1rem; text-align: left; }
.form-group label { display: block; margin-bottom: 0.5rem; color: #666; }
.form-group input { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.btn-login { width: 100%; padding: 0.8rem; background-color: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
.error-msg { color: #e74c3c; margin-top: 1rem; }
.toggle-text { margin-top: 1.5rem; color: #666; }
.toggle-text a { color: #27ae60; text-decoration: none; font-weight: bold; }
</style>
