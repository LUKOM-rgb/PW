<script>
export default {
  // Data: estado reativo do componente
  data() {
    return {
      investInput: '', // Input ligado ao v-model
      investArray: [], // Array que armazena os filmes (agora objetos)
      investId: 1, // ID incremental para cada filme
    }
  },

  methods: {
    // Método para adicionar filme à lista
    addinvest() {
      // Verificar se o input não está vazio
      if (this.investInput.trim() === '') {
        alert('Por favor, insira o nome de um filme ou série!')
        return // Sai do método sem adicionar
      }

      // Cria objeto com nome e ID único
      const newinvest = {
        id: this.investId++, // Incrementa após cada utilização
        name: this.investInput,
        // Alternativa com UUID (mais robusto):
        // id: self.crypto.randomUUID(), -> https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
      }

      this.investArray.push(newinvest) // Adiciona objeto ao array
      this.investInput = '' // Limpa o input após adicionar
    },
  },
}
</script>

<template>

  <div class="app">
    <div class="invest-forms">
      <!-- v-model: liga input ao estado -->
      <!-- @keyup.enter: executa método ao pressionar Enter -->
      <input
        type="text"
        placeholder="Nome da série ou filme"
        v-model="investInput"
        @keyup.enter="addinvest"
      />
      <!-- @click: executa método ao clicar -->
      <button @click="addinvest">Adicionar</button>
    </div>

    <div class="invest-list">
      <h2 id="invest-list">invest List</h2>
      <!-- v-for: renderiza lista dinamicamente -->
      <!-- :key: utiliza ID único (não o nome, que nesta lógica pode ser duplicado) -->
      <ul aria-labelledby="invest-list">
        <li v-for="invest in investArray" :key="invest.id">
          {{ invest.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* scoped: CSS apenas para este componente */
h1 {
  color: red;
}

div.invest-forms {
  display: flex;
  gap: 10px;
}
</style>