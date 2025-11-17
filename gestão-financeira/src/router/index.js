import { createRouter, createWebHistory } from 'vue-router'
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
    },
    {
      path: '/adicionarinvest',
      name: 'adicionarinvest',
      component: () => import('../views/AdicionarInvestView.vue'),
    },
    // possivel rota para página de 404
  ],
})

export default router
