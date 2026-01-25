<script>
export default {

  data() {
    return {
      investInput: '',
      investArray: [],
      investId: 1,
    }
  },

  methods: {

    addinvest() {

      if (this.investInput.trim() === '') {
        alert('Por favor, insira o Investimento que quer adicionar.')
        return
      }


      const newinvest = {
        id: this.investId++,
        name: this.investInput,


      }

      this.investArray.push(newinvest)
      this.investInput = ''
    },
  },
}
</script>

<template>

  <div class="app">
    <div class="invest-forms">

      <input
        type="text"
        placeholder="Nome do investimento"
        v-model="investInput"
        @keyup.enter="addinvest"
      />

      <button @click="addinvest">Adicionar</button>
    </div>

    <div class="invest-list">
      <h2 id="invest-list">invest List</h2>
      <ul aria-labelledby="invest-list">
        <li v-for="invest in investArray" :key="invest.id">
          {{ invest.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
