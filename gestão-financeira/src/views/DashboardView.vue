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
            {{ u.nome }}
            <small v-if="u.nome === authStore.user?.nome" class="me-tag">(Você)</small>
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
    if(confirm(`Tem a certeza que quer apagar a conta "${nome}"?`)) {
        // Chama a ação da store. A lista atualiza sozinha.
        authStore.removerUsuario(nome);
    }
};
</script>

<style scoped>
.dashboard-container { display: flex; justify-content: center; padding-top: 50px; font-family: sans-serif; }
.dashboard-box { width: 500px; padding: 25px; border: 1px solid #ddd; border-radius: 10px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header h1 { margin: 0; font-size: 1.5rem; }
.user-info { text-align: right; }

.user-list { list-style: none; padding: 0; margin-top: 20px; }
.user-list li { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 12px; 
    border-bottom: 1px solid #eee; 
}
.user-list li:last-child { border-bottom: none; }

.nome { font-weight: bold; color: #333; }
.me-tag { color: #3498db; font-weight: normal; margin-left: 5px; font-size: 0.8rem; }

.btn-logout { background: #333; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; margin-top: 5px; }
.btn-del { background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: 0.2s; }
.btn-del:hover { background: #c0392b; }
.empty-state { text-align: center; color: #777; margin-top: 20px; }
</style>