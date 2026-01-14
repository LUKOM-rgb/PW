<template>
  <div id="app">
    <div class="content-body">
      <nav class="navbar">
        <h1 class="logo">Gestão Financeira</h1>
        <ul>
          <li>
            <router-link to="/" class="link-com-icone">
              <img :src="imgHome" alt="Início" class="nav-icon">
              <span>Início</span>
            </router-link>
          </li>
          <li><router-link to="/ferramentas" class="link-com-icone">
            <img :src="imgTools" alt="Ferramentas" class="nav-icon">
            <span>Ferramentas</span>
          </router-link></li>
          <li><router-link to="/simulador" class="link-com-icone">
            <img :src="imgConsole" alt="Simulador" class="nav-icon">
            <span>Simulador</span>
          </router-link></li>
          <li><router-link to="/blog" class="link-com-icone">
            <img :src="imgBlog" alt="Blog" class="nav-icon">
            <span>Blog</span>
          </router-link></li>
          <li><router-link to="/sobre" class="link-com-icone">
    <img :src="imgAbout" alt="Sobre Nós" class="nav-icon">
    <span>Sobre Nós</span>
</router-link></li>

<li v-if="authStore.isAuthenticated"><router-link to="/investir" class="link-com-icone">
    <img :src="imgInvest" alt="Investir" class="nav-icon">
    <span>Investir</span>
</router-link></li>

<li v-if="authStore.eAdmin">
    <router-link to="/dashboard" class="link-com-icone">
        <img :src="imgDashboard" alt="Dashboard" class="nav-icon">
        <span>Admin</span>
    </router-link>
</li>

          <li v-if="!authStore.isAuthenticated"><router-link to="/login">Login</router-link></li>

          <li v-else><router-link to="/perfil">
            <img :src="imgPerfil" alt="Perfil" class="nav-icon">
            <span>Perfil</span>
          </router-link></li>
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
import { RouterLink, RouterView } from 'vue-router'
import { usarStoreAuth } from './stores/auth'

import imgHome from './assets/house-chimney.png'
import imgTools from './assets/calculator2.png'
import imgConsole from './assets/console-controller.png'
import imgBlog from './assets/blog-text.png'
import imgAbout from './assets/book-user.png'
import imgInvest from './assets/growth-chart-invest.png'
import imgPerfil from './assets/user.png'
import  imgDashboard from './assets/dashboard-panel.png'
const authStore = usarStoreAuth()
</script>

<style scoped>
#app { display: flex; flex-direction: column; min-height: 100vh; background-color: #0c0e13; font-family: 'Inter', sans-serif; }
.content-body { display: flex; flex: 1; color: #ccc; }
.navbar { width: 200px; background-color: #0a0b0e; flex-shrink: 0; }
.navbar ul { position: -webkit-sticky; position: sticky; top: 0; padding-inline-start: 0; display: flex; flex-direction: column; padding-left: 10px; margin: 0; list-style: none; }
.navbar a { color: #ccc; text-decoration: none; font-weight: 500; display: block; padding: 12px; border-radius: 4px; transition: 0.2s; }
.navbar a:hover { background-color: #002b73; color: white; }
.navbar a.router-link-active { background-color: #002b73; color: white; border-left: 4px solid #4a90e2; }
main { flex-grow: 1; padding: 2rem; width: calc(100% - 250px); }
footer {margin-top: 200px;  color: white; text-align: center; padding: 1rem; flex-shrink: 0; font-size: 0.500rem; }
.logo { font-size: 1.5rem; padding-left: 10px; }
.nav-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; margin-bottom: 2px; color:white }
</style>
