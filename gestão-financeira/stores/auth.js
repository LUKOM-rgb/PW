import { defineStore } from 'pinia';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Carrega o usuário se ele já estiver salvo no navegador
    user: JSON.parse(localStorage.getItem('current_user')) || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async register(userData) {
      // Simula delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const usersDB = JSON.parse(localStorage.getItem('users_db')) || [];
      
      if (usersDB.find(u => u.email === userData.email)) {
        throw new Error('Este email já está cadastrado.');
      }

      const newUser = { 
        id: Date.now(), 
        name: userData.name, 
        email: userData.email, 
        password: userData.password 
      };

      usersDB.push(newUser);
      localStorage.setItem('users_db', JSON.stringify(usersDB));
      
      // Loga automaticamente após criar
      this.login(userData);
    },

    async login({ email, password }) {
      await new Promise(resolve => setTimeout(resolve, 300));

      const usersDB = JSON.parse(localStorage.getItem('users_db')) || [];
      const validUser = usersDB.find(u => u.email === email && u.password === password);

      if (validUser) {
        this.user = validUser;
        localStorage.setItem('current_user', JSON.stringify(validUser));
        router.push('/dashboard');
      } else {
        throw new Error('Email ou senha incorretos.');
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem('current_user');
      router.push('/login');
    }
  }
});