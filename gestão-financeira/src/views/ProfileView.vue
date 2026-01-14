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

      <h3>Editar Dados Pessoais</h3>
      <form @submit.prevent="atualizarPerfil" class="edit-form">
        <div class="form-group">
          <label>Nome:</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label>Nova Password:</label>
          <input v-model="form.password" type="password" required />
        </div>

        <button type="submit" class="btn-save">Guardar Alterações</button>
      </form>

      <hr class="divider">

      <div class="accordion">
        <button @click="mostrarConquistas = !mostrarConquistas" class="btn-toggle">
          {{ mostrarConquistas ? 'Esconder Conquistas' : 'Ver as Minhas Conquistas' }}
        </button>

        <div v-if="mostrarConquistas" class="conquistas-list">
          <div
            v-for="c in authStore.conquistasPossiveis"
            :key="c.id"
            class="conquista-item"
            :class="{ 'unlocked': verificaConquista(c.id) }">

            <div class="info">
              <strong>{{ c.titulo }}</strong> - <small>{{ c.desc }}</small>
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

      if (this.form.password.length < 6) {
        alert('A password deve ter pelo menos 6 caracteres.');
        return;
      }

      if (this.form.name.trim() === '') {
        alert('O nome não pode estar vazio.');
        return;
      }

      if (this.form.name === this.authStore.user.name &&
          this.form.password === this.authStore.user.password) {
        alert('Nenhuma alteração feita.');
        return;
      }



      // 1. Atualiza o estado local na store
      this.authStore.user.name = this.form.name;
      this.authStore.user.password = this.form.password;

      // 2. Manda guardar tudo no servidor (chama a função que corrigimos no auth.js)
      const sucesso = await this.authStore.atualizarUserAPI();

      if (sucesso) alert('Perfil atualizado com sucesso!');
      else alert('Erro ao atualizar perfil.');
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

