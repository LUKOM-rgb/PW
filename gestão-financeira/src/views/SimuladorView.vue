<template>
  <div class="simulador-container">
    <h1>Simulador de Mercado</h1>
    <p>Treina a tua intuição. Tens de adivinhar se a ação subiu ou desceu no dia seguinte.</p>

    <div v-if="loading" class="loading">A preparar desafio...</div>

    <div v-else-if="!resultado && podeJogar" class="game-area">
      <div class="card-desafio">
        <h2>{{ acaoSymbol }}</h2>
        <p class="data">Data Referência: {{ dataReferencia }}</p>
        <div class="preco-box">
          <span>Abertura:</span>
          <strong>${{ precoAbertura }}</strong>
        </div>
        <p class="pergunta">No dia seguinte, fechou em Alta ou Baixa?</p>

        <div class="botoes">
          <button @click="adivinhar('subiu')" class="btn-up">Subiu</button>
          <button @click="adivinhar('desceu')" class="btn-down">Desceu</button>
        </div>
      </div>
      <p class="tentativas">Jogadas hoje: {{ authStore.user?.simulador?.plays || 0 }} / 2</p>
    </div>

    <div v-else-if="resultado" class="resultado-area">
      <h2 :class="ganhou ? 'win' : 'lose'">
        {{ ganhou ? ' Acertaste!' : ' Erraste!' }}
      </h2>
      <p>O preço de fecho foi: <strong>${{ precoFecho }}</strong></p>
      <p v-if="ganhou" class="xp-gain">+50 XP</p>
      <button @click="iniciarJogo" class="btn-again">Jogar Novamente</button>
    </div>

    <div v-else class="limit-area">
      <h2> Mercado Fechado para ti!</h2>
      <p>Já jogaste 2 vezes hoje. Volta amanhã para ganhar mais XP.</p>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAuth } from '../stores/auth';
import { usarStoreAcoes } from '../stores/acoes';

export default {
  name: 'SimuladorView',
  data() {
    return {
      loading: false,
      acaoSymbol: 'IBM', // Podes mudar para AAPL, TSLA, etc.
      dataReferencia: '',
      precoAbertura: 0,
      precoFecho: 0,
      resultado: false,
      ganhou: false
    };
  },
  computed: {
    ...mapStores(usarStoreAuth, usarStoreAcoes),
    podeJogar() {
      return this.authStore.podeJogarHoje();
    }
  },
  methods: {
    async iniciarJogo() {
      if (!this.podeJogar) return;

      this.loading = true;
      this.resultado = false;

      // Buscar dados
      await this.acoesStore.buscarAcao(this.acaoSymbol);
      const dados = this.acoesStore.dadosAcao;

      if (dados && dados.length > 10) {
        // Escolher dia aleatório (evita os primeiros dias que podem ser hoje)
        const indiceAleatorio = Math.floor(Math.random() * (dados.length - 10)) + 5;
        const dia = dados[indiceAleatorio];

        this.dataReferencia = dia.date;
        this.precoAbertura = dia.open;
        this.precoFecho = dia.close;
      }
      this.loading = false;
    },
    async adivinhar(palpite) {
      const subiuRealmente = this.precoFecho > this.precoAbertura;
      const palpiteSubiu = palpite === 'subiu';

      this.ganhou = (subiuRealmente === palpiteSubiu);
      this.resultado = true;

      // Registar (Store dá XP e bloqueia se necessário)
      await this.authStore.registarJogoSimulador(this.ganhou);
    }
  },
  mounted() {
    if (this.podeJogar) {
      this.iniciarJogo();
    }
  }
};
</script>

<style scoped>
.card-desafio { background: #0d2546; color: whitesmoke; padding: 20px; border-radius: 10px; max-width: 400px; margin: 20px auto; }
.botoes { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
.btn-up { background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.btn-down { background: #c0392b; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.win { color: #27ae60; font-size: 2rem; }
.lose { color: #c0392b; font-size: 2rem; }
.xp-gain { color: #f1c40f; font-weight: bold; font-size: 1.2rem; }
.btn-again { margin-top: 20px; padding: 10px 20px; font-size: 1rem; cursor: pointer; }
.limit-area { margin-top: 50px; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; display: inline-block;}
</style>
