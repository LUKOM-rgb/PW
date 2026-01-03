<template>
  <div class="dashboard-container">
    <div class="dashboard-box">
      <h1>Gestão de Contas</h1>
      <hr>

      <div class="controls">
        <label>Ordenar por:</label>
        <select v-model="ordenacao">
          <option value="nome">Nome (A-Z)</option>
          <option value="xp">Nível de XP (Maior primeiro)</option>
        </select>
      </div>

      <ul class="user-list">
        <li v-for="u in listaOrdenada" :key="u.id">
          <span class="user-details">
            <strong>{{ u.name }}</strong>
            <br>
            <small>Nível: {{ u.level || 1 }} ({{ u.xp || 0 }} XP)</small>
          </span>
          <button @click="confirmarApagar(u)" class="btn-del">X</button>
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
  data() { return { ordenacao: 'nome' }; },
  computed: {
    ...mapStores(usarStoreAuth),
    listaOrdenada() {
      const lista = [...this.authStore.listaUsuarios];
      if (this.ordenacao === 'nome') return lista.sort((a, b) => a.name.localeCompare(b.name));
      return lista.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    }
  },
  methods: {
    confirmarApagar(u) {
      if (u.email === 'admin') return alert('Não podes apagar o admin.');
      if (confirm(`Apagar ${u.name}?`)) this.authStore.removerUsuario(u.id);
    }
  },
  mounted() { this.authStore.carregarUsuarios(); }
};
</script>

<style scoped>
.dashboard-container { display: flex; justify-content: center; padding: 40px; }
.dashboard-box { background: white; padding: 30px; border-radius: 10px; width: 500px; color: #333; }
.user-list li { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
.btn-del { background: #e74c3c; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
.controls { margin-bottom: 15px; }
</style>
