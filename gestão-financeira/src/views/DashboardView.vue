<template>
  <div class="dashboard-container">
    <div class="dashboard-box">

      <div class="header">
        <h1>Gestão de Contas</h1>
        <div class="user-info">
            <p>Olá, <strong>{{ authStore.user?.nome }}</strong></p>
            <button @click="authStore.logout()" class="btn-logout">Sair</button>
        </div>
      </div>

      <hr>

      <h2>Lista de Utilizadores</h2>

      <div v-if="authStore.listaUsuarios.length === 0" class="empty-state">
        <p>Nenhum utilizador encontrado.</p>
      </div>

      <ul v-else class="user-list">
        <li v-for="u in authStore.listaUsuarios" :key="u.nome">

          <span class="nome">
            Nome: {{ u.nome }}
            <small v-if="u.nome === authStore.user?.nome" class="me-tag">(TUS)</small>
            <p>Palavra-passe: {{ u.senha }}</p>
          </span>

          <button @click="apagarConta(u.nome)" class="btn-del">
            Eliminar
          </button>

        </li>
      </ul>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

// 1. Ao entrar na página, pede à store para ler o localStorage
onMounted(() => {
    authStore.carregarUsuarios();
});

// 2. Função de clique
const apagarConta = (nome) => {
    if (nome === authStore.user?.nome) {
        alert('Não pode apagar a sua própria conta enquanto está logado.');
    }
    else if(authStore.listaUsuarios.length <= 1) {
        alert('Deve haver pelo menos um utilizador na aplicação.');
    }
    else if(nome === 'adamastor') {
        alert('A conta "admin" não pode ser apagada.');
    }

    else if(confirm(`Tem a certeza que quer apagar a conta "${nome}"?`)) {
        // Chama a ação da store. A lista atualiza sozinha.
        authStore.removerUsuario(nome);
    }
};
</script>

