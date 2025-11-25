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
      meta: { requiresAuth: true } 
    }
  ],
})

// --- O GUARDIÃO (Faltava isto) ---
router.beforeEach((to, from, next) => {
  // Inicializamos a store DENTRO do guard para evitar erros de inicialização
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login'); // Manda para o login
  } else {
    next(); // Deixa passar
  }
});

export default router