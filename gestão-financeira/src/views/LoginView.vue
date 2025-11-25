<template>
  <div class="auth-container">
    
    <div v-if="!authStore.user" class="auth-box">
      
      <div v-if="modo === 'login'">
        <h2>Entrar</h2>
        <form @submit.prevent="handleLogin">
          <input v-model="form.nome" type="text" placeholder="Nome" required />
          <input v-model="form.senha" type="password" placeholder="Senha" required />
          <button type="submit" class="btn-primary">Login</button>
        </form>
        <p class="toggle-text">
          Não tem conta? <a @click="trocarModo('cadastro')">Criar conta</a>
        </p>
      </div>

      <div v-else>
        <h2>Nova Conta</h2>
        <form @submit.prevent="handleCadastro">
          <input v-model="form.nome" type="text" placeholder="Nome" required />
          <input v-model="form.senha" type="password" placeholder="Senha" required />
          <button type="submit" class="btn-success">Cadastrar</button>
        </form>
        <p class="toggle-text">
          Já tem conta? <a @click="trocarModo('login')">Voltar ao Login</a>
        </p>
      </div>

      <p v-if="erro" class="error-msg">{{ erro }}</p>
    </div>

    <div v-else class="dashboard-box">
      <h1>Você está logado como: {{ authStore.user.nome }}</h1>
      <button @click="authStore.logout()" class="btn-danger">Sair (Logout)</button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../../stores/auth'; // Importamos a store

const authStore = useAuthStore();

// Estado LOCAL (apenas UI)
const modo = ref('login');
const erro = ref('');

const form = reactive({
  nome: '',
  senha: ''
});

// Funções Wrapper para tratar erros e chamar a store
const handleLogin = () => {
  try {
    authStore.login(form.nome,form.senha); // Passa os dados para a store
    erro.value = '';
  } catch (e) {
    erro.value = e.message; // Pega o erro lançado pela store
  }
};

const handleCadastro = () => {
  try {
    authStore.cadastrar(form.nome,form.senha);
    alert('Conta criada com sucesso! Faça login.');
    trocarModo('login');
  } catch (e) {
    erro.value = e.message;
  }
};

const trocarModo = (novoModo) => {
  modo.value = novoModo;
  erro.value = '';
  // Limpar formulário se desejar
  form.nome = ''; form.senha = '';
};
</script>

<style scoped>
/* O CSS permanece exatamente igual ao seu original */
.auth-container { display: flex; justify-content: center; margin-top: 50px; font-family: sans-serif; }
.auth-box, .dashboard-box { width: 300px; padding: 30px; border: 1px solid #ccc; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; border: 1px solid #ddd; border-radius: 5px; }
button { width: 100%; padding: 10px; border: none; border-radius: 5px; color: white; cursor: pointer; font-weight: bold; }
.btn-primary { background-color: #3498db; }
.btn-success { background-color: #2ecc71; }
.btn-danger { background-color: #e74c3c; }
.toggle-text { font-size: 0.9rem; margin-top: 15px; }
a { color: #3498db; cursor: pointer; text-decoration: underline; }
.error-msg { color: red; margin-top: 10px; font-size: 0.9rem; }
</style>