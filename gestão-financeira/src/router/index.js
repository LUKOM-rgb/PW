import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import BlogView from '../views/BlogView.vue'
import InvestirPesquisa from '../components/InvestirPesquisa.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { usarStoreAuth } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/investir', name: 'investir', component: InvestirPesquisa },
    // Rota 404
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

// Proteção de Rotas
router.beforeEach((to, from, next) => {
  const authStore = usarStoreAuth()
  const publicas = ['login', 'not-found']

  if (!publicas.includes(to.name) && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
