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
          <div><img src="../assets/negociacao.png" class="imgHome"></div>
          <h3>Pesquisar Ações</h3>
          <p>Vê a evolução e gráficos das tuas empresas favoritas.</p>
        </router-link>

        <router-link to="/simulador" class="card">
          <div><img src="../assets/economist.png" class="imgHome"></div>
          <h3>Simulador</h3>
          <p>Joga e ganha XP.</p>
        </router-link>

        <router-link to="/ferramentas" class="card">
          <div><img src="../assets/calculator.png" class="imgHome"></div>
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

