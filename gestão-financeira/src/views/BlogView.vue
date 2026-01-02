<template>
  <div class="blog-container">
    <div class="header-blog">
      <h1>Blog Financeiro</h1>

      <div class="search-box">
        <input
          v-model="termoPesquisa"
          type="text"
          placeholder="Pesquisar título da notícia..."
        />
        <button @click="recarregar" class="btn-refresh">🔄</button>
      </div>
    </div>

    <div v-if="acoesStore.aCarregar" class="loading">
      <p>A carregar notícias...</p>
    </div>

    <div v-else-if="noticiasFiltradas.length === 0" class="no-results">
      <p>Nenhuma notícia encontrada.</p>
    </div>

    <div v-else class="grid">
      <div v-for="(n, i) in noticiasFiltradas" :key="i" class="card">
        <img
          :src="n.banner_image || 'https://via.placeholder.com/300x150?text=Notícia'"
          class="img"
        />
        <div class="card-content">
          <h3>{{ n.title }}</h3>
          <p class="summary">{{ truncarTexto(n.summary, 100) }}</p>
          <a v-if="n.url" :href="n.url" target="_blank" class="btn-ler">Ler mais</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAcoes } from '../stores/acoes';

export default {
  name: 'BlogView',
  data() {
    return {
      termoPesquisa: ''
    };
  },
  computed: {
    // Isto cria automaticamente "this.acoesStore"
    ...mapStores(usarStoreAcoes),

    noticiasFiltradas() {
      // Se a caixa estiver vazia, devolve tudo da store
      if (!this.termoPesquisa) return this.acoesStore.dadosNoticias;

      const termo = this.termoPesquisa.toLowerCase();
      return this.acoesStore.dadosNoticias.filter(noticia =>
        noticia.title && noticia.title.toLowerCase().includes(termo)
      );
    }
  },
  methods: {
    truncarTexto(texto, tamanho) {
      if (!texto) return '';
      if (texto.length <= tamanho) return texto;
      return texto.substring(0, tamanho) + '...';
    },
    recarregar() {
      this.termoPesquisa = '';
      this.acoesStore.buscarNoticias('TECH');
    }
  },
  mounted() {
    // Chama a ação da store ao carregar a página
    if (this.acoesStore.dadosNoticias.length === 0) {
      this.acoesStore.buscarNoticias('TECH');
    }
  }
};
</script>

<style scoped>
/* O CSS mantém-se exatamente igual ao anterior */
.blog-container { padding: 20px; color: #333; }
.header-blog { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; color: white; }
.search-box { display: flex; gap: 10px; margin-top: 15px; width: 100%; max-width: 500px; }
.search-box input { flex: 1; padding: 10px; border-radius: 5px; border: 1px solid #ddd; }
.btn-refresh { padding: 0 15px; background-color: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
.card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
.img { width: 100%; height: 180px; object-fit: cover; }
.card-content { padding: 15px; display: flex; flex-direction: column; flex-grow: 1; }
h3 { margin: 0 0 10px 0; font-size: 1.1rem; color: #2c3e50; }
.summary { font-size: 0.9rem; color: #666; flex-grow: 1; }
.btn-ler { margin-top: 15px; color: #4a90e2; font-weight: bold; text-decoration: none; }
.no-results, .loading { text-align: center; color: #ccc; margin-top: 50px; }
</style>
