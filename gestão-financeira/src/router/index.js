import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegistarView from '../views/RegistarView.vue'
import BlogView from '../views/BlogView.vue'
import FerramentasView from '../views/FerramentasView.vue'
import SobreView from '../views/SobreView.vue'
import InvestirPesquisa from '../components/InvestirPesquisa.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue' // <--- IMPORTAR
import NotFoundView from '../views/NotFoundView.vue'
import { usarStoreAuth } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/registar', name: 'registar', component: RegistarView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/sobre', name: 'sobre', component: SobreView },

    // Rotas Protegidas
    { path: '/investir', name: 'investir', component: InvestirPesquisa, meta: { requiresAuth: true } },
    { path: '/ferramentas', name: 'ferramentas', component: FerramentasView, meta: { requiresAuth: true } },
    { path: '/perfil', name: 'perfil', component: ProfileView, meta: { requiresAuth: true } }, // <--- ROTA NOVA

    // Rota EXCLUSIVA Admin
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, requiresAdmin: true } // <--- Meta Admin
    },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = usarStoreAuth()

  // 1. Bloqueio Geral (Precisa de Login)
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login', query: { semPermissao: 'true' } })
  }

  // 2. Bloqueio de Admin (Dashboard)
  if (to.meta.requiresAdmin && !authStore.eAdmin) {
    alert("Acesso negado: Apenas o Administrador pode ver esta página.")
    return next('/') // Manda para casa
  }

  // 3. Se já logado, não deixa ir para Login/Registo
  if ((to.name === 'login' || to.name === 'registar') && authStore.isAuthenticated) {
    return next('/perfil')
  }

  next()
})

export default router
