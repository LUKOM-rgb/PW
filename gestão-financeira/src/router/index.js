import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import BlogView from '../views/BlogView.vue'
import FerramentasView from '../views/FerramentasView.vue'
import SobreView from '../views/SobreView.vue'
import InvestirPesquisa from '../components/InvestirPesquisa.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { usarStoreAuth } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/investir', name: 'investir', component: InvestirPesquisa },
    { path: '/ferramentas', name: 'ferramentas', component: FerramentasView },
    { path: '/sobre', name: 'sobre', component: SobreView },
    // Rota 404
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})



export default router
