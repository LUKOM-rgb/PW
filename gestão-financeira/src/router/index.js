import { createRouter, createWebHistory } from 'vue-router'
// Importação da Store para verificar se o user existe
import { useAuthStore } from '../../stores/auth.js'
import HomeView from '../views/HomeView.vue'
import FerramentasView from '../views/FerramentasView.vue'
import BlogView from '../views/BlogView.vue'
import SobreView from '../views/SobreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/ferramentas',
      name: 'ferramentas',
      component: FerramentasView,
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: SobreView,
    },
    {
      path: '/investir',
      name: 'investir',
      component: () => import('../views/InvestirView.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/adicionarinvest',
      name: 'adicionarinvest',
      component: () => import('../views/AdicionarInvestView.vue'),
      // ⚠️ ATENÇÃO: Provavelmente você quer proteger esta também!
      meta: { requiresAuth: true } 
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: "/Dashboard",
      name: "Dashboard",
      component: () => import('../views/DashboardView.vue'),
      meta: { 
          requiresAuth: true, 
          apenasPara: 'admin' // <--- AQUI ESTÁ A REGRA
      } 
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 1. VERIFICAÇÃO DE LOGIN (Autenticação)
  // Se a rota exige auth e não temos user -> Login
  if (to.meta.requiresAuth && !authStore.user) {
    return next('/login');
  }

  // 2. VERIFICAÇÃO DE NOME (Autorização)
  // Se a rota tem a regra 'apenasPara' definida...
  if (to.meta.apenasPara) {
    
    // ...verificamos se o nome do user logado é diferente do exigido
    if (authStore.user.nome !== to.meta.apenasPara) {
      
      // Se for diferente, barramos a entrada!
      alert('Acesso negado! Esta página é apenas para: ' + to.meta.apenasPara);
      return next('/'); // Manda de volta para uma página segura
    }
  }

  // 3. Se passou por tudo, deixa entrar
  next();
});

export default router