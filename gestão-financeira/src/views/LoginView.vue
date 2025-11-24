<template>
  <div class="auth-container">
    
    <div v-if="!usuarioLogado" class="auth-box">
      
      <div v-if="modo === 'login'">
        <h2>Entrar</h2>
        <form @submit.prevent="fazerLogin">
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.senha" type="password" placeholder="Senha" required />
          <button type="submit" class="btn-primary">Login</button>
        </form>
        <p class="toggle-text">
          Não tem conta? <a @click="modo = 'cadastro'">Criar conta</a>
        </p>
      </div>

      <div v-else>
        <h2>Nova Conta</h2>
        <form @submit.prevent="criarConta">
          <input v-model="form.nome" type="text" placeholder="Nome" required />
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.senha" type="password" placeholder="Senha" required />
          <button type="submit" class="btn-success">Cadastrar</button>
        </form>
        <p class="toggle-text">
          Já tem conta? <a @click="modo = 'login'">Voltar ao Login</a>
        </p>
      </div>

      <p v-if="erro" class="error-msg">{{ erro }}</p>
    </div>

    <div v-else class="dashboard-box">
      <h1>Bem-vindo, {{ usuarioLogado.nome }}!</h1>
      <p>Você está logado com: {{ usuarioLogado.email }}</p>
      <button @click="sair" class="btn-danger">Sair (Logout)</button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// --- ESTADO ---
const modo = ref('login'); // Alterna entre 'login' e 'cadastro'
const usuarioLogado = ref(null);
const erro = ref('');

const form = reactive({
  nome: '',
  email: '',
  senha: ''
});

// --- AO INICIAR ---
onMounted(() => {
  // Verifica se já existe alguém logado no navegador
  const sessaoAtual = localStorage.getItem('usuario_logado');
  if (sessaoAtual) {
    usuarioLogado.value = JSON.parse(sessaoAtual);
  }
});

// --- AÇÕES ---

const criarConta = () => {
  const bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];
  
  // Verifica se email já existe
  if (bancoUsers.find(u => u.email === form.email)) {
    erro.value = 'Este email já existe!';
    return;
  }

  // Cria e salva
  const novoUser = { nome: form.nome, email: form.email, senha: form.senha };
  bancoUsers.push(novoUser);
  localStorage.setItem('users_db', JSON.stringify(bancoUsers));

  alert('Conta criada com sucesso! Faça login.');
  modo.value = 'login';
  erro.value = '';
  form.nome = ''; // Limpa campo
};

const fazerLogin = () => {
  const bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];
  
  const userEncontrado = bancoUsers.find(
    u => u.email === form.email && u.senha === form.senha
  );

  if (userEncontrado) {
    usuarioLogado.value = userEncontrado;
    localStorage.setItem('usuario_logado', JSON.stringify(userEncontrado));
    erro.value = '';
  } else {
    erro.value = 'Email ou senha incorretos.';
  }
};

const sair = () => {
  usuarioLogado.value = null;
  localStorage.removeItem('usuario_logado');
  form.email = '';
  form.senha = '';
  modo.value = 'login';
};
</script>

<style scoped>

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