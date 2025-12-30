<template>
  <div class="view blog">
    <h1>Blog Financeiro</h1>

    <div class="search-box">
      <input v-model="searchTopic" placeholder="Pesquisar notícias (ex: AAPL, CRYPTO)..." @keyup.enter="pesquisar" />
      <button @click="pesquisar">Pesquisar</button>
    </div>

    <div v-if="loading">A carregar notícias...</div>
    <div v-if="newsData.length === 0 && !loading">Sem notícias para mostrar.</div>

    <div class="news-grid">
      <div v-for="(news, index) in newsData" :key="index" class="news-card">

        <img v-if="news.image" :src="news.image" alt="Imagem da notícia" class="news-img" />

        <div class="news-content">
          <h3>{{ news.title }}</h3>
          <small>Fonte: {{ news.source }}</small>
          <p>{{ news.summary.substring(0, 100) }}...</p> <a :href="news.url" target="_blank" class="read-more">Ler notícia completa</a>

          <div class="topics">
            <span v-for="t in news.topics" :key="t.topic" class="topic-tag">
              {{ t.topic }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStockData } from '../../useStockdata';

// Importamos APENAS as ferramentas de notícias
const { newsData, loading, fetchNews } = useStockData();

const searchTopic = ref('AAPL');

const pesquisar = () => {
  if(searchTopic.value) {
    fetchNews(searchTopic.value);
  }
};

onMounted(() => {
  fetchNews('AAPL');
});
</script>

<style scoped>

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.news-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  color: #333;
  display: flex;
  flex-direction: column;
}

.news-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.news-content {
  padding: 15px;
}

.topic-tag {
  background: #eee;
  padding: 2px 6px;
  font-size: 0.7em;
  border-radius: 4px;
  margin-right: 5px;
}

.read-more {
  display: block;
  margin-top: 10px;
  color: #07C;
  text-decoration: none;
  font-weight: bold;
}
</style>
