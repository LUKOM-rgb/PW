<template>
  <div class="view blog">
    <h1>Blog Financeiro</h1>

    <div class="search-box">
      <input
        v-model="termoPesquisa"
        placeholder="Pesquisar (ex: AAPL, CRYPTO)..."
        @keyup.enter="pesquisar"
      />
      <button @click="pesquisar">Pesquisar</button>
    </div>

    <div v-if="store.aCarregar">A carregar notícias...</div>
    <div v-else-if="store.dadosNoticias.length === 0">Sem notícias para mostrar.</div>

    <div class="news-grid">
      <div v-for="(noticia, index) in store.dadosNoticias" :key="index" class="news-card">
        <img v-if="noticia.banner_image" :src="noticia.banner_image" class="news-img" />

        <div class="news-content">
          <h3>{{ noticia.title }}</h3>
          <small>Fonte: {{ noticia.source }}</small>
          <p>{{ noticia.summary ? noticia.summary.substring(0, 100) + '...' : '' }}</p>
          <a :href="noticia.url" target="_blank" class="read-more">Ler notícia completa</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { usarStoreAcoes } from '../stores/acoes'

export default {
  data() {
    return {
      termoPesquisa: 'AAPL'
    }
  },
  computed: {
    ...mapStores(usarStoreAcoes),
    store() { return this.acoesStore }
  },
  methods: {
    pesquisar() {
      if (this.termoPesquisa) {
        this.store.buscarNoticias(this.termoPesquisa)
      }
    }
  },
  mounted() {
    // Busca inicial
    this.store.buscarNoticias('AAPL')
  }
}
</script>

<style scoped>
/* O teu CSS mantém-se igual */
.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px; }
.news-card { background: white; border-radius: 8px; overflow: hidden; color: #333; display: flex; flex-direction: column; }
.news-img { width: 100%; height: 150px; object-fit: cover; }
.news-content { padding: 15px; }
.read-more { color: #07C; font-weight: bold; margin-top: 10px; display: block; }
</style>
