<template>
  <div class="stock-container">
    <h1>Analisador de Ações</h1>
    <input v-model="termo" placeholder="Pesquisar..." class="search-input" />

    <div v-if="store.aCarregar">A carregar do servidor...</div>

    <div v-if="store.dadosAcao.length" class="table-wrapper">
      <table>
        <thead><tr><th>Data</th><th>Fecho ($)</th></tr></thead>
        <tbody>
          <tr v-for="dia in store.dadosAcao" :key="dia.date">
            <td>{{ dia.date }}</td>
            <td>{{ dia.close }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { usarStoreAcoes } from '../stores/acoes.js'

export default {
  data() {
    return { termo: '', timer: null }
  },
  computed: {
    ...mapStores(usarStoreAcoes),
    store() { return this.acoesStore }
  },
  watch: {
    termo(novo) {
      clearTimeout(this.timer)
      if(novo) this.timer = setTimeout(() => this.store.buscarAcao(novo), 500)
    }
  }
}
</script>

<style scoped>
.stock-container { color: white; padding: 20px; }
.search-input { padding: 10px; margin-bottom: 20px; width: 100%; max-width: 300px; }
table { width: 100%; color: white; border-collapse: collapse; }
td, th { border: 1px solid #444; padding: 8px; }
</style>
