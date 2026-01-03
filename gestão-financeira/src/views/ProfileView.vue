<template>
  <div class="profile-container">
    <div class="profile-box">
      <div class="header-profile">
        <h1>{{ authStore.user?.name }}</h1>
        <button @click="sair" class="btn-logout-mini">Sair</button>
      </div>

      <div class="gamification-section">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ authStore.user?.level || 1 }}</span>
            <span class="stat-label">Nível</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ authStore.user?.xp || 0 }}</span>
            <span class="stat-label">XP Total</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ conquistasFeitas }} / {{ totalConquistas }}</span>
            <span class="stat-label">Conquistas</span>
          </div>
        </div>

        <div class="xp-bar-wrapper">
          <div class="xp-info">
            <small>Progresso Nível {{ (authStore.user?.level || 1) + 1 }}</small>
            <small>Falta {{ authStore.xpFaltante }} XP</small>
          </div>
          <div class="progress-bg">
            <div class="progress-fill" :style="{ width: authStore.progressoBarra + '%' }"></div>
          </div>
        </div>
      </div>

      <hr class="divider">

      <h3>✏️ Editar Dados Pessoais</h3>
      <form @submit.prevent="atualizarPerfil" class="edit-form">
        <div class="form-group">
          <label>Nome:</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input v-model="form.email" type="email" disabled class="disabled-input"/>
          <small>O email não pode ser alterado.</small>
        </div>

        <div class="form-group">
          <label>Nova Password:</label>
          <input v-model="form.password" type="text" required />
        </div>

        <button type="submit" class="btn-save">Guardar Alterações</button>
      </form>

      <hr class="divider">

      <div class="accordion">
        <button @click="mostrarConquistas = !mostrarConquistas" class="btn-toggle">
          {{ mostrarConquistas ? '🔽 Esconder Conquistas' : '▶️ Ver as Minhas Conquistas' }}
        </button>

        <div v-if="mostrarConquistas" class="conquistas-list">
          <div
            v-for="c in authStore.conquistasPossiveis"
            :key="c.id"
            class="conquista-item"
            :class="{ 'unlocked': verificaConquista(c.id) }"
          >
            <span class="icon">{{ verificaConquista(c.id) ? '🥇' : '🔒' }}</span>
            <div class="info">
              <strong>{{ c.titulo }}</strong>
              <small>{{ c.desc }}</small>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAuth } from '../stores/auth';

export default {
  name: 'ProfileView',
  data() {
    return {
      mostrarConquistas: false,
      form: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  computed: {
    ...mapStores(usarStoreAuth),
    totalConquistas() { return this.authStore.conquistasPossiveis.length; },
    conquistasFeitas() { return this.authStore.user?.conquistas?.length || 0; }
  },
  methods: {
    verificaConquista(id) {
      return this.authStore.user?.conquistas?.includes(id);
    },

    // Ação para salvar o formulário
    async atualizarPerfil() {
      if (!this.authStore.user) return;

      // 1. Atualiza o estado local na store
      this.authStore.user.name = this.form.name;
      this.authStore.user.password = this.form.password;

      // 2. Manda guardar tudo no servidor (chama a função que corrigimos no auth.js)
      const sucesso = await this.authStore.atualizarUserAPI();

      if (sucesso) alert('Perfil atualizado com sucesso! ✅');
      else alert('Erro ao atualizar perfil. ❌');
    },

    sair() {
      this.authStore.logout();
      this.$router.push('/login');
    }
  },
  mounted() {
    // Preenche o formulário com os dados atuais quando a página abre
    if (this.authStore.user) {
      this.form.name = this.authStore.user.name;
      this.form.email = this.authStore.user.email;
      this.form.password = this.authStore.user.password;
    }
  }
};
</script>

<style scoped>
.profile-container { display: flex; justify-content: center; padding: 40px 20px; }
.profile-box { background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 500px; color: #333; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

/* Header & Gamification */
.header-profile { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-logout-mini { background: #e74c3c; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; }
.stat-card { background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #eee; }
.stat-value { font-size: 1.4rem; font-weight: bold; color: #27ae60; display: block; }
.stat-label { font-size: 0.8rem; color: #7f8c8d; text-transform: uppercase; }

.xp-bar-wrapper { margin-bottom: 20px; }
.progress-bg { background: #eee; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 5px; }
.progress-fill { background: #27ae60; height: 100%; transition: width 0.5s; }
.xp-info { display: flex; justify-content: space-between; color: #666; font-size: 0.85rem; }

.divider { margin: 25px 0; border: 0; border-top: 1px solid #eee; }

/* Formulário */
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.9rem; }
.form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
.disabled-input { background: #eee; color: #777; cursor: not-allowed; }
.btn-save { width: 100%; background: #2980b9; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px; }
.btn-save:hover { background: #3498db; }

/* Lista Conquistas */
.btn-toggle { background: none; border: none; color: #555; cursor: pointer; font-weight: bold; width: 100%; text-align: left; padding: 0; }
.conquistas-list { margin-top: 15px; display: flex; flex-direction: column; gap: 8px; }
.conquista-item { display: flex; align-items: center; gap: 10px; padding: 8px; border: 1px solid #eee; border-radius: 6px; opacity: 0.5; }
.conquista-item.unlocked { opacity: 1; border-color: #f1c40f; background: #fffdf0; }
.icon { font-size: 1.5rem; }
</style>
