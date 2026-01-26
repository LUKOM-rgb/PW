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
  mounted() { this.authStore.carregarUtilizador(); }
};
</script>

<style scoped>
.dashboard-container { display: flex; justify-content: center; padding: 40px;  }
.user-list li { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
.btn-del { background: #e74c3c; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
/* 1. O Container */
/* Alinha o label e o select na mesma linha */
.controls {
  display: flex;
  align-items: center; /* Centraliza verticalmente */
  gap: 12px;           /* Espaço entre o texto e a caixa */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin-bottom: 20px; /* Espaço para o próximo elemento */
}

/* 2. O Texto (Label) dentro de .controls */
.controls label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4b5563; /* Cinza escuro */
  white-space: nowrap; /* Impede que o texto quebre linha */
}

/* 3. O Select dentro de .controls */
.controls select {
  /* Remove o estilo padrão feio */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Estilização da caixa */
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 36px 8px 12px;
  font-size: 0.95rem;
  color: #1f2937;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  /* A Seta Mágica */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1rem;
}
.controls select:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}
.controls select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}


</style>
