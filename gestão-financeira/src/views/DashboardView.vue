<template>
  <div class="dashboard-container">
    <div class="dashboard-box">
      <div class="header">
        <h1>Gestão de Contas (Admin)</h1>
        <div class="user-info">
          <p>Olá, <strong>{{ authStore.user?.name }}</strong></p>
          <button @click="fazerLogout" class="btn-logout">Sair</button>
        </div>
      </div>
      <hr>
      <h2>Lista de Utilizadores</h2>

      <div v-if="authStore.listaUsuarios.length === 0" class="empty-state">
        <p>A carregar utilizadores...</p>
      </div>

      <ul v-else class="user-list">
        <li v-for="u in authStore.listaUsuarios" :key="u.id">
          <span class="user-details">
            <strong>{{ u.name }}</strong> ({{ u.email }})
            <small v-if="u.id === authStore.user?.id" class="me-tag"> (TU) </small>
            <p>Senha: {{ u.password }}</p>
          </span>
          <button @click="confirmarApagar(u)" class="btn-del">Eliminar</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAuth } from '../stores/auth';

export default {
  name: 'DashboardView',
  computed: {
    // Cria this.authStore
    ...mapStores(usarStoreAuth)
  },
  methods: {
    fazerLogout() {
      this.authStore.logout();
      this.$router.push('/login');
    },
    confirmarApagar(usuario) {
      if (usuario.id === this.authStore.user?.id) {
        alert('Não pode apagar a sua própria conta.');
        return;
      }
      if (usuario.email === 'admin') {
        alert('Não pode apagar o Admin Supremo.');
        return;
      }
      if (confirm(`Tem a certeza que quer eliminar "${usuario.name}"?`)) {
        this.authStore.removerUsuario(usuario.id);
      }
    }
  },
  mounted() {
    this.authStore.carregarUsuarios();
  }
};
</script>

<style scoped>
/* Mantém os teus estilos do dashboard aqui */
.dashboard-container { padding: 40px 20px; color: #333; display: flex; justify-content: center; }
.dashboard-box { background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 600px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.user-list { list-style: none; padding: 0; margin-top: 20px; }
.user-list li { background: #f8f9fa; border: 1px solid #eee; padding: 15px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
.btn-logout { background-color: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
.btn-del { background-color: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
.me-tag { color: #27ae60; font-weight: bold; background: #e8f5e9; padding: 2px 6px; border-radius: 4px; }
</style>
