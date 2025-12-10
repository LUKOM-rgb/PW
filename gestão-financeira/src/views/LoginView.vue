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

