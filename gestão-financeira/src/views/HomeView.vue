<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-content">
        <h1 v-if="authStore.user">Olá, {{ authStore.user.name }}! </h1>
        <h1 v-else>Bem-vindo à Gestão Financeira</h1>
        <p>A tua plataforma para dominar o mercado.</p>

        <div v-if="!authStore.isAuthenticated" class="cta-buttons">
          <router-link to="/registar" class="btn-primary">Criar Conta</router-link>
          <router-link to="/login" class="btn-secondary">Entrar</router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="grid">
        <router-link to="/investir" class="card">
          <div class="icon">📈</div>
          <h3>Pesquisar Ações</h3>
          <p>Vê a evolução e gráficos das tuas empresas favoritas.</p>
        </router-link>

        <router-link to="/simulador" class="card">
          <div class="icon">🎮</div>
          <h3>Simulador</h3>
          <p>Joga e ganha XP.</p>
        </router-link>

        <router-link to="/ferramentas" class="card">
          <div class="icon">🧮</div>
          <h3>Calculadoras</h3>
          <p>Orçamentos e Créditos.</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAuth } from '../stores/auth';

export default {
  name: 'HomeView',
  computed: { ...mapStores(usarStoreAuth) }
};
</script>

<style scoped>
/* (Usa os mesmos estilos que te enviei antes para .hero, .card, etc.) */
.home-container { color: white; text-align: center; }
.hero { padding: 50px 20px; background: linear-gradient(135deg, #020B19, #0d2546); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 40px; }
.card { background: white; padding: 20px; border-radius: 10px; color: #333; text-decoration: none; transition: transform 0.3s; }
.card:hover { transform: translateY(-5px); }
.icon { font-size: 2.5rem; }
.btn-primary { background: #27ae60; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-right: 10px; }
.btn-secondary { border: 1px solid white; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
</style>
