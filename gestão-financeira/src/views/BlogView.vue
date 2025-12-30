<template>
  <div class="blog">
    <h1>Últimas Notícias</h1>
    <div class="grid">
      <div v-for="(n, i) in store.dadosNoticias" :key="i" class="card">
        <img :src="n.banner_image" class="img" />
        <h3>{{ n.title }}</h3>
        <p>{{ n.summary }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { usarStoreAcoes } from '../stores/acoes.js'

export default {
  computed: {
    ...mapStores(usarStoreAcoes),
    store() { return this.acoesStore }
  },
  mounted() {
    this.store.buscarNoticias('TECH')
  }
}
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px; }
.card { background: white; color: black; border-radius: 8px; overflow: hidden; }
.img { width: 100%; height: 150px; object-fit: cover; }
h3, p { padding: 10px; }
</style>
