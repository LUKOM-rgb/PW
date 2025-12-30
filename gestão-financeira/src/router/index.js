import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import BlogView from '../views/BlogView.vue'
import InvestirPesquisa from '../components/InvestirPesquisa.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { usarStoreAuth } from '../stores/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // No meta needed if public by default, or be explicit:
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
      meta: { requiresAuth: false }
    },
    {
      path: '/investir',
      name: 'investir',
      component: InvestirPesquisa,
      // This marks this specific route as protected
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = usarStoreAuth()

  // Check if the route requires auth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    // User needs to login, redirect to login page
    // Optional: Pass the 'to' path as a query to redirect back after login
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    // Allow navigation
    next()
  }
})

export default router
