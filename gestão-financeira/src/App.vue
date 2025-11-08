<template>
  <div id="app">
    <header>
      <nav class="navbar">
        <h1 class="logo">Gestão Financeira</h1>
        <ul>
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/ferramentas">Ferramentas</router-link></li>
          <li><router-link to="/blog">Blog</router-link></li>
          <li><router-link to="/sobre">Sobre Nós</router-link></li>
        </ul>
      </nav>
    </header>

    <!-- Aqui é onde as páginas (views) vão ser renderizadas -->
    <main>
      <router-view />
    </main>

    <footer>
      <p>© 2025 Gestão Financeira — Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7fa;
  color: #333;
  font-family: 'Inter', sans-serif;
}

/* NAVBAR */
header {
  background-color: #004aad;
  color: white;
  padding: 1rem 2rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.navbar a.router-link-active {
  border-bottom: 2px solid white;
}

/* MAIN CONTENT */
main {
  flex: 1;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

/* FOOTER */
footer {
  background-color: #002b73;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
