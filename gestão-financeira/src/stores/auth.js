import { defineStore } from 'pinia'

// --- CONFIGURAÇÃO DAS CONQUISTAS ---
const CONQUISTAS = [
  // Categoria: Simulador
  { id: 'quiz_first_win', titulo: 'Sorte de Principiante', desc: 'Acertou 1 vez no simulador', xp: 50, meta: 1, tipo: 'quiz_win' },
  { id: 'quiz_5_wins', titulo: 'Analista Júnior', desc: 'Acertou 5 vezes no simulador', xp: 150, meta: 5, tipo: 'quiz_win' },
  { id: 'quiz_20_wins', titulo: 'Lobo de Wall Street', desc: 'Acertou 20 vezes no simulador', xp: 500, meta: 20, tipo: 'quiz_win' },

  // Categoria: Ferramentas (Calculadoras)
  { id: 'calc_budget_use', titulo: 'Mão de Vaca', desc: 'Usou a Calculadora de Orçamento', xp: 20, meta: 1, tipo: 'calc_budget' },
  { id: 'calc_10_uses', titulo: 'Matemático', desc: 'Usou calculadoras 10 vezes', xp: 100, meta: 10, tipo: 'calc_total' },
  { id: 'calc_all_types', titulo: 'CFO Pessoal', desc: 'Usou os 4 tipos de calculadoras', xp: 200, meta: 4, tipo: 'calc_types_count' },

  // Categoria: Notícias
  { id: 'news_search_5', titulo: 'Investigador', desc: 'Pesquisou 5 notícias', xp: 50, meta: 5, tipo: 'news_search' },
  { id: 'news_fav_1', titulo: 'Colecionador', desc: 'Adicionou 1 notícia aos favoritos', xp: 30, meta: 1, tipo: 'news_fav' },
  { id: 'news_fav_10', titulo: 'Arquivo Vivo', desc: 'Guardou 10 notícias', xp: 150, meta: 10, tipo: 'news_fav' },

  // Categoria: Mercado
  { id: 'stock_search_5', titulo: 'Explorador', desc: 'Pesquisou 5 empresas diferentes', xp: 100, meta: 5, tipo: 'stock_search' }
]

export const usarStoreAuth = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    listaUsuarios: [],
    conquistasPossiveis: CONQUISTAS
  }),

  getters: {
    eAdmin: (state) => state.user && state.user.nome === 'admin',

    // Total de favoritos
    totalFavoritos: (state) => state.user?.favoritos?.length || 0,

    // --- CÁLCULO DE NÍVEL PROGRESSIVO ---
    progressoBarra: (state) => {
      if (!state.user) return 0;
      const nivelAtual = state.user.level || 1;

      // Definição dos patamares (quanto XP total é preciso para chegar ao nível X)
      const xpBaseAtual = calcularXPTotalParaNivel(nivelAtual);
      const xpBaseProximo = calcularXPTotalParaNivel(nivelAtual + 1);

      const xpNoNivel = state.user.xp - xpBaseAtual;
      const necessario = xpBaseProximo - xpBaseAtual;

      let percentagem = (xpNoNivel / necessario) * 100;
      return Math.min(Math.max(percentagem, 0), 100);
    },

    xpFaltante: (state) => {
       if (!state.user) return 0;
       const nivelAtual = state.user.level || 1;
       const xpBaseProximo = calcularXPTotalParaNivel(nivelAtual + 1);
       return xpBaseProximo - state.user.xp;
    }
  },

  actions: {
    // --- LOGIN ---
    async login(nome, password) {
      try {
        const response = await fetch(`http://localhost:3000/users?name=${nome}&password=${password}`)
        const users = await response.json()
        if (users.length > 0) {
          this.user = this._inicializarUser(users[0])
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(this.user))
          return { success: true }
        } else {
          return { success: false, message: "Nome ou password incorretos." }
        }
      } catch (error) { console.error("Erro login:", error) }
      return { success: false, message: "Erro de conexão ao servidor." }
    },

    // --- REGISTO ---
    async registar(nome,  password) {
        try {
          const check = await fetch(`http://localhost:3000/users?name=${nome}`)
          const users = await check.json()
          if (users.length > 0) {
            return { success: false, message: "Este nome de utilizador já existe." }
          } 
          // Cria user já com estrutura de gamificação a zeros
          const novoUser = {
              name: nome,  
              password: password,
              xp: 0, level: 1,
              stats: { quiz_win: 0, calc_budget: 0, calc_total: 0, news_search: 0, news_fav: 0, stock_search: 0, types_used: [] },
              conquistas: [], favoritos: [],
              simulador: { lastDate: null, plays: 0 }
          }

          await fetch('http://localhost:3000/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(novoUser)
          })
          return { success: true }
        } catch (error){ return { success: false, message: "Erro ao tentar registar." }
      }
    },

    // --- INICIALIZADOR DE DADOS (Evita erros em users antigos) ---
    _inicializarUser(user) {
      if (!user.xp) user.xp = 0;
      if (!user.level) user.level = 1;
      if (!user.stats) user.stats = { quiz_win: 0, calc_budget: 0, calc_total: 0, news_search: 0, news_fav: 0, stock_search: 0, types_used: [] };
      if (!user.conquistas) user.conquistas = [];
      if (!user.favoritos) user.favoritos = [];
      if (!user.simulador) user.simulador = { lastDate: null, plays: 0 };
      return user;
    },

    // --- SISTEMA DE ESTATÍSTICAS E CONQUISTAS ---
    async incrementarEstatistica(tipo, subtipo = null) {
      if (!this.user) return;

      // 1. Atualiza Stats
      if (!this.user.stats) this._inicializarUser(this.user);
      if (!this.user.stats[tipo]) this.user.stats[tipo] = 0;
      this.user.stats[tipo]++;

      // 2. Lógica Especial: Tipos de Calculadora
      if (tipo === 'calc_total' && subtipo) {
         if (!this.user.stats.types_used) this.user.stats.types_used = [];
         if (!this.user.stats.types_used.includes(subtipo)) {
             this.user.stats.types_used.push(subtipo);
         }
      }

      // 3. Verifica Conquistas
      let ganhouXp = 0;
      this.conquistasPossiveis.forEach(c => {
        if (this.user.conquistas.includes(c.id)) return; // Já tem

        let atingiu = false;
        // Verifica metas normais
        if (c.tipo === tipo && this.user.stats[tipo] >= c.meta) atingiu = true;
        // Verifica conquista especial "CFO Pessoal"
        if (c.tipo === 'calc_types_count' && this.user.stats.types_used?.length >= c.meta) atingiu = true;
        // Verifica conquista especial "Mão de Vaca"
        if (c.tipo === 'calc_budget' && tipo === 'calc_budget') atingiu = true;

        if (atingiu) {
          this.user.conquistas.push(c.id);
          ganhouXp += c.xp;
          alert(`🏆 CONQUISTA: ${c.titulo}\n"${c.desc}"\n+${c.xp} XP`);
        }
      });

      if (ganhouXp > 0) await this.ganharXP(ganhouXp);
      else await this.atualizarUserAPI();
    },

    // --- FAVORITOS ---
    async toggleFavorito(noticia) {
      if (!this.user) return;
      if (!this.user.favoritos) this.user.favoritos = [];

      const index = this.user.favoritos.findIndex(f => f.title === noticia.title);

      if (index === -1) {
        this.user.favoritos.push({ title: noticia.title, url: noticia.url, date: new Date() });
        this.incrementarEstatistica('news_fav');
      } else {
        this.user.favoritos.splice(index, 1);
        await this.atualizarUserAPI();
      }
    },

    // --- SIMULADOR ---
    podeJogarHoje() {
      if (!this.user) return false;
      const hoje = new Date().toISOString().split('T')[0];
      if (this.user.simulador.lastDate !== hoje) {
        this.user.simulador.lastDate = hoje;
        this.user.simulador.plays = 0;
        return true;
      }
      return this.user.simulador.plays < 2;
    },

    async registarJogoSimulador(ganhou) {
      if (!this.podeJogarHoje()) return;
      this.user.simulador.plays++;

      if (ganhou) {
        this.incrementarEstatistica('quiz_win');
        await this.ganharXP(50);
      } else {
        await this.atualizarUserAPI();
      }
    },

    // --- GANHAR XP E SUBIR DE NÍVEL (Progressivo) ---
    async ganharXP(qtd) {
      this.user.xp += qtd;

      let nivelCalculado = 1;
      // Loop para descobrir o nível atual baseado no XP total
      while (true) {
         let totalParaProximo = calcularXPTotalParaNivel(nivelCalculado + 1);
         if (this.user.xp >= totalParaProximo) {
             nivelCalculado++;
         } else {
             break;
         }
      }

      if (nivelCalculado > this.user.level) {
        this.user.level = nivelCalculado;
        alert(`🎉 SUBIU DE NÍVEL!\nAgora é Nível ${this.user.level}`);
      }

      await this.atualizarUserAPI();
    },

    // --- API & AUXILIARES ---
    async atualizarUserAPI() {
      // 1. Atualiza o LocalStorage
      localStorage.setItem('user', JSON.stringify(this.user));

      try {
        // 2. Atualiza o Servidor (db.json)
        await fetch(`http://localhost:3000/users/${this.user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Campos de Perfil
            name: this.user.name,
            password: this.user.password,
            nome: this.user.nome,

            // Campos de Gamificação
            xp: this.user.xp,
            level: this.user.level,
            stats: this.user.stats,
            conquistas: this.user.conquistas,
            favoritos: this.user.favoritos,
            simulador: this.user.simulador
          })
        });
        return true;
      } catch (e) {
        console.error("Erro ao guardar dados:", e);
        return false;
      }
    },

    async carregarUsuarios() {
        const res = await fetch('http://localhost:3000/users');
        this.listaUsuarios = await res.json();
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
    },

    async removerUsuario(id) {
      await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
      this.listaUsuarios = this.listaUsuarios.filter(u => u.id !== id);
    }
  }
})

// Função auxiliar (Fórmula de progressão: Nível * 200)
function calcularXPTotalParaNivel(nivelAlvo) {
    let total = 0;
    for (let i = 1; i < nivelAlvo; i++) {
        total += i * 200;
    }
    return total;
}
