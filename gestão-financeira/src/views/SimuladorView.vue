<template>
  <div class="simulador-container">
    <h1>Simulador de Mercado</h1>
    <p>Treina a tua intuição. Tens de adivinhar se a ação subiu ou desceu no dia seguinte.</p>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p>A carregar simulador...</p>
      </div>
    </div>

    <div v-else-if="!resultado && podeJogar" class="game-area">
      <div class="card-desafio">
        <h2>{{ acaoSymbol }}</h2>
        <p class="data">Data Referência: {{ dataReferencia }}</p>

        <div class="preco-box">
          <strong>${{ precoAbertura }}</strong>
        </div>

        <p class="pergunta">No dia seguinte, fechou em Alta ou Baixa?</p>

        <div class="game-buttons">

          <button @click="adivinhar('subiu')" class="btn-game btn-up" title="Subiu">
            <img src="../assets/up-trend-round-svgrepo-com.svg" alt="Subiu" />
          </button>

          <button @click="adivinhar('desceu')" class="btn-game btn-down" title="Desceu">
            <img src="../assets/down-trend-svgrepo-com.svg" alt="Desceu" />
          </button>

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
      acaoSymbol: 'IBM',
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

      return this.authStore.user ? this.authStore.podeJogarHoje() : false;
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
        // Escolher dia aleatório
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

      // Registar
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
.simulador-container {
  text-align: center;
  color: white;
  padding: 20px;
}

.card-desafio {
  background: #0d2546;
  color: whitesmoke;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  margin: 20px auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.preco-box {
  background: rgba(255,255,255,0.1);
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 1.7rem;
}

/* --- ESTILO DOS BOTÕES COM IMAGEM --- */
.game-buttons {
  display: flex;
  gap: 30px; /* Espaço entre botões */
  justify-content: center;
  margin-top: 30px;
}

.btn-game {
  width: 80px;  /* Tamanho do círculo */
  height: 80px; /* Tamanho do círculo */
  border-radius: 50%; /* Faz ser redondo */
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  background: #2c3e50; /* Cor base se a imagem falhar */
}


.btn-game img {
  width: 45px;  /* Tamanho do ícone */
  height: 45px;
  pointer-events: none; /* Garante que o clique vai para o botão */
}

/* Hover e Cores Específicas */
.btn-up { background: rgba(39, 174, 96, 0.2); border: 2px solid #27ae60; }
.btn-up:hover {
  background: #27ae60;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(39, 174, 96, 0.6);
}

.btn-down { background: rgba(192, 57, 43, 0.2); border: 2px solid #c0392b; }
.btn-down:hover {
  background: #c0392b;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(192, 57, 43, 0.6);
}

/* --- RESULTADOS --- */
.win { color: #2ecc71; font-size: 2.5rem; margin-bottom: 10px; }
.lose { color: #e74c3c; font-size: 2.5rem; margin-bottom: 10px; }
.xp-gain { color: #f1c40f; font-weight: bold; font-size: 1.4rem; animation: pulse 1s infinite; }

.btn-again {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
}
.btn-again:hover { background: #2980b9; }

.limit-area { margin-top: 50px; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 10px; display: inline-block;}

/* --- SPINNER DE CARREGAMENTO --- */
.loading-overlay {
  display: flex; justify-content: center; padding: 40px;
}
.spinner {
  width: 40px; height: 40px;
  border: 4px solid rgba(255,255,255,0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px auto;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
