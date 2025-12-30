
<template>
  <div id="app">

    <div class="content-body">

      <nav class="navbar">
        <h1 class="logo">Gestão Financeira</h1>
        <ul>
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/ferramentas">Ferramentas</router-link></li>
          <li><router-link to="/blog">Blog</router-link></li>
          <li><router-link to="/sobre">Sobre Nós</router-link></li>
          <li><router-link to="/investir">Investir</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/Dashboard">Dashboard</router-link></li>
        </ul>
      </nav>

      <main>
        <router-view />
      </main>

    </div> <footer>
      <p>© 2025 Gestão Financeira — Todos os direitos reservados.</p>
    </footer>

  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #020B19;
  font-family: 'Inter', sans-serif;

}


.header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #020B19;
  color: white;
  height: 60px;
  box-sizing: border-box;
}

/* --- NOVO CONTAINER --- */
.content-body {
  display: flex;
  flex: 1;
  color: #ccc;
}

/* NAVBAR (Lateral) */
.navbar {
  width: 200px;
  background-color: #020B19;
  flex-shrink: 0;
}

.navbar ul {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding-inline-start: 0;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  margin: 0;
  list-style: none;
}

.navbar a {
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  display: block;
  padding: 12px;
  border-radius: 4px;
  transition: 0.2s;
}
.navbar a:hover {
  background-color: #002b73;
  color: white;
}
.navbar a.router-link-active {
  background-color: #002b73;
  color: white;
  border-left: 4px solid #4a90e2;
}

/* MAIN CONTENT */
main {
  flex-grow: 1;
  padding: 2rem;

  width: calc(100% - 250px);
}

/* FOOTER */
footer {
  background-color: #020B19;
  color: white;
  text-align: center;
  padding: 1rem;
  flex-shrink: 0;
}
.logo {
  font-size: 1.5rem;
  padding-left: 10px;
}

</style>
