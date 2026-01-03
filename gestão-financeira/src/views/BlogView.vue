<template>
  <div class="blog-container">
    <div class="header-blog">
      <h1>Blog Financeiro</h1>
      <div class="search-box">
        <input v-model="termoPesquisa" type="text" placeholder="Pesquisar..." />
      </div>
      <div class="filtros">
        <label>
          <input type="checkbox" v-model="verFavoritos"> Ver Apenas Favoritos ❤️
        </label>
      </div>
    </div>

    <div v-if="acoesStore.aCarregar" class="loading">A carregar...</div>

    <div v-else class="grid">
      <div v-for="(n, i) in noticiasExibidas" :key="i" class="card">
        <img :src="n.banner_image || 'https://via.placeholder.com/300'" class="img" />
        <div class="card-content">
          <div class="card-top">
            <h3>{{ n.title }}</h3>
            <button @click="toggleFav(n)" class="btn-fav">
              {{ verificaFav(n) ? '❤️' : '🤍' }}
            </button>
          </div>
          <p class="summary">{{ n.summary?.substring(0, 100) }}...</p>
          <a :href="n.url" target="_blank" class="btn-ler">Ler mais</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAcoes } from '../stores/acoes';
import { usarStoreAuth } from '../stores/auth';

export default {
  name: 'BlogView',
  data() { return { termoPesquisa: '', verFavoritos: false }; },
  computed: {
    ...mapStores(usarStoreAcoes, usarStoreAuth),

    noticiasExibidas() {
      let lista = this.acoesStore.dadosNoticias;
      if (this.termoPesquisa) {
        lista = lista.filter(n => n.title.toLowerCase().includes(this.termoPesquisa.toLowerCase()));
      }
      if (this.verFavoritos) {
        lista = lista.filter(n => this.verificaFav(n));
      }
      return lista;
    }
  },
  methods: {
    verificaFav(noticia) {
      return this.authStore.user?.favoritos?.some(f => f.title === noticia.title);
    },
    toggleFav(noticia) {
      if (!this.authStore.isAuthenticated) return alert("Faz login para guardar favoritos!");
      this.authStore.toggleFavorito(noticia);
    }
  },
  mounted() {
    if (this.acoesStore.dadosNoticias.length === 0) this.acoesStore.buscarNoticias('TECH');
  }
};
</script>

<style scoped>
/* Mantém o teu CSS base e adiciona: */
.blog-container { padding: 20px; color: #333; }
.header-blog { color: white; text-align: center; margin-bottom: 20px; }
.card { background: white; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
.img { width: 100%; height: 150px; object-fit: cover; }
.card-content { padding: 15px; }
.card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.btn-fav { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
.btn-ler { color: #2980b9; font-weight: bold; text-decoration: none; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.filtros { margin-top: 10px; color: #ccc; }
</style>
