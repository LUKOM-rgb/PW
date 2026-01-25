<template>
  <div id="app">
    <div class="content-body">
      <nav class="navbar">
        <div class="nav-header">
          <h1 class="logo">Gestão Financeira</h1>

          <button class="hamburger" @click="toggleMenu" :class="{ 'is-active': menuAberto }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <ul :class="{ 'active': menuAberto }">
          <li>
            <router-link to="/" class="link-com-icone" @click="fecharMenu">
              <img :src="imgHome" alt="Início" class="nav-icon">
              <span>Início</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ferramentas" class="link-com-icone" @click="fecharMenu">
              <img :src="imgTools" alt="Ferramentas" class="nav-icon">
              <span>Ferramentas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/simulador" class="link-com-icone" @click="fecharMenu">
              <img :src="imgConsole" alt="Simulador" class="nav-icon">
              <span>Simulador</span>
            </router-link>
          </li>
          <li>
            <router-link to="/blog" class="link-com-icone" @click="fecharMenu">
              <img :src="imgBlog" alt="Blog" class="nav-icon">
              <span>Blog</span>
            </router-link>
          </li>
          <li>
            <router-link to="/sobre" class="link-com-icone" @click="fecharMenu">
              <img :src="imgAbout" alt="Sobre Nós" class="nav-icon">
              <span>Sobre Nós</span>
            </router-link>
          </li>

          <li v-if="authStore.isAuthenticated">
            <router-link to="/investir" class="link-com-icone" @click="fecharMenu">
              <img :src="imgInvest" alt="Investir" class="nav-icon">
              <span>Investir</span>
            </router-link>
          </li>

          <li v-if="authStore.eAdmin">
            <router-link to="/dashboard" class="link-com-icone" @click="fecharMenu">
              <img :src="imgDashboard" alt="Dashboard" class="nav-icon">
              <span>Admin</span>
            </router-link>
          </li>

          <li v-if="!authStore.isAuthenticated">
            <router-link to="/login" @click="fecharMenu">
              <img :src="imgPerfil" alt="Login" class="nav-icon">
              <span>Login</span>
            </router-link>
          </li>

          <li v-else>
            <router-link to="/perfil" @click="fecharMenu">
              <img :src="imgPerfil" alt="Perfil" class="nav-icon">
              <span>Perfil</span>
            </router-link>
          </li>

          <footer>
            <p>© 2025 Gestão Financeira — Todos os direitos reservados.</p>
          </footer>
        </ul>
      </nav>

      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { usarStoreAuth } from './stores/auth'
import imgHome from './assets/house-chimney.png'
import imgTools from './assets/calculator2.png'
import imgConsole from './assets/console-controller.png'
import imgBlog from './assets/blog-text.png'
import imgAbout from './assets/book-user.png'
import imgInvest from './assets/growth-chart-invest.png'
import imgPerfil from './assets/user.png'
import imgDashboard from './assets/dashboard-panel.png'

const authStore = usarStoreAuth()

// Menu Mobile
const menuAberto = ref(false)

function toggleMenu() {
  menuAberto.value = !menuAberto.value
}

// Fecha o menu quando se clica num link
function fecharMenu() {
  menuAberto.value = false
}
</script>

<style scoped>
#app { display: flex; flex-direction: column; min-height: 100vh; background-color: #0c0e13; font-family: 'Inter', sans-serif; padding-left: 200px; box-sizing: border-box;}
.content-body { display: flex; flex: 1; color: #ccc; }

/* Navbar Desktop (Padrão) */
.navbar { width: 200px; background-color: #0a0b0e; flex-shrink: 0; display: flex;
flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh;overflow-y: auto; }
.navbar ul { position: -webkit-sticky; position: sticky; top: 0; padding-inline-start: 0; display: flex; flex-direction: column; padding-left: 10px; margin: 0; list-style: none; }
.navbar a { color: #ccc; text-decoration: none; font-weight: 500; display: block; padding: 12px; border-radius: 4px; transition: 0.2s; }
.navbar a:hover { background-color: #002b73; color: white; }
.navbar a.router-link-active { background-color: #002b73; color: white; border-left: 4px solid #4a90e2; }

/* Main Content Desktop */
main { flex-grow: 1; padding: 2rem; width: calc(100% - 250px); }

/* Footer e Logos */
footer { margin-top: auto; color: white; text-align: center; padding: 1rem; flex-shrink: 0; font-size: 0.500rem; }
.logo { font-size: 1.5rem; padding: 20px 10px; margin: 0; }
.nav-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; margin-bottom: 2px; color: white }
.nav-header { display: flex; justify-content: space-between; align-items: center; }


.hamburger { display: none; background: none; border: none; cursor: pointer; padding: 10px; }
.hamburger span { display: block; width: 25px; height: 3px; background-color: white; margin: 5px 0; transition: 0.3s; }

/* --- VERSÃO MOBILE --- */
@media (max-width: 768px) {
  .content-body { flex-direction: column; }

  .navbar { width: 100%; height: auto; position: relative; }

  .nav-header { padding: 0 10px; background-color: #0a0b0e; z-index: 101; }

  /* Mostrar botão Hambúrguer */
  .hamburger { display: block; }

  /* Animação do ícone X quando aberto */
  .hamburger.is-active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .hamburger.is-active span:nth-child(2) { opacity: 0; }
  .hamburger.is-active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -6px); }

  /* Esconder o menu por padrão no mobile */
  .navbar ul {
    display: none;
    flex-direction: column;
    width: 100%;
    background-color: #0a0b0e;
    padding-bottom: 20px;
    padding-left: 0;
  }

  /* Mostrar menu quando estiver aberto */
  .navbar ul.active {
    display: flex; /* Aparece */
    animation: slideDown 0.3s ease-out;
  }

  /* Ajustes dos links no mobile */
  .navbar li { text-align: center; width: 100%; }
  .navbar a { padding: 15px; border-left: none; border-bottom: 1px solid #1a1c23; }
  .navbar a.router-link-active { border-left: none; border-bottom: 4px solid #4a90e2; }

  /* Footer ajustado para mobile */
  footer { margin-top: 20px; }

  main { width: 100%; padding: 1rem; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
