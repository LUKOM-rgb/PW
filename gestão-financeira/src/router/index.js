import { createRouter, createWebHistory } from 'vue-router'
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
          apenasPara: 'adamastor' 
      } 
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  
  if (to.meta.requiresAuth && !authStore.user) {
    return next('/login');
  }

  
  if (to.meta.apenasPara) {
    
    
    if (authStore.user.nome !== to.meta.apenasPara) {
      
      
      alert('Acesso negado! Esta página é apenas para: ' + to.meta.apenasPara);
      return next('/'); 
    }
  }

  
  next();
});

export default router