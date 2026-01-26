<template>
  <div class="about-page">

    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">Dominando o Mercado, <span class="highlight">Um Nível de Cada Vez.</span></h1>
        <p class="hero-subtitle">
          Unimos a inteligência dos dados financeiros com a tecnologia para criar o ecossistema definitivo para os investidores. Notícias, cálculos precisos e uma jornada gamificada para o seu sucesso financeiro.
        </p>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>A Nossa Plataforma</h2>
          <p>Tudo o que precisa para tomar as melhores decisões financeiras.</p>
        </div>

        <div class="features-grid">

          <div class="feature-card">
            <h3>Informação em Tempo Real</h3>
            <p>Acompanhe as últimas notícias do mundo dos investimentos e as inovações tecnológicas que impactam o mercado financeiro global.</p>
          </div>

          <div class="feature-card">
            <h3>Ferramentas Poderosas</h3>
            <p>Simuladores precisos para planear sua vida:</p>
            <ul class="feature-list">
              <li>Calculadora de Juros Compostos</li>
              <li>Simulador de Crédito Habitação</li>
              <li>Gestão de Orçamento</li>
              <li>Tempo para Pagar Dívidas</li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>Análise de Ativos</h3>
            <p>Digite o símbolo da ação e obtenha dados fundamentais instantâneos para decidir se é hora de comprar ou de vender.</p>
          </div>

        </div>
      </div>
    </section>

    <section class="gamification-banner">
      <div class="container gamification-content">
        <div class="gami-text">
          <span class="badge">Nível UP! </span>
          <h2>Aprenda e Ganhe XP</h2>
          <p>
            Aqui, conhecimento rende juros. Crie o seu perfil e complete missões: use as calculadoras, leia notícias e analise ações para ganhar <strong>XP</strong>.
            Suba de nível e desbloqueie recursos exclusivos de investidor veterano.
          </p>
        </div>
        <div class="gami-visual">
          <div class="level-card">
            <div class="xp-bar">
              <div class="xp-fill" style="width: 70%"></div>
            </div>
            <p class="level-text">Nível 5: Analista Júnior</p>
          </div>
        </div>
      </div>
    </section>

    <section class="footer-cta">
      <div class="container">
        <h3>Pronto para assumir o controle?</h3>
        <p>Junte-se a milhares de investidores que usam a tecnologia a seu favor.</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* --- CONFIGURAÇÕES GERAIS --- */
.about-page {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #cbd5e1;
  line-height: 1.6;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- HERO SECTION --- */
.hero-section {
  text-align: center;
  padding: 80px 0 60px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: #cbd5e1;
}

.highlight {
  color: #2563eb;
  background: linear-gradient(120deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0) 100%);
  padding: 0 5px;
  border-radius: 4px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto;
}


.features-section {
  padding: 60px 0;

}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: #1e293b;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 30px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #bfdbfe;
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: #cbd5e1;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.feature-list li {
  padding: 5px 0;
  color: #475569;
  font-size: 0.9rem;
  border-bottom: 1px dashed ;
}

.feature-list li:last-child {
  border-bottom: none;
}


.gamification-banner {
  background-color: #1e293b; /* Fundo escuro para destaque */
  color: #fff;
  padding: 60px 0;
  margin: 40px 0;
  border-radius: 0; /* Full width visualmente, mas content containerizado */
}

.gamification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.badge {
  background-color: #fcd764;
  color: #78350f;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}

.gami-text h2 {
  font-size: 2rem;
  margin: 15px 0;
}

.gami-text p {
  color: #cbd5e1;
  margin-bottom: 25px;
  max-width: 500px;
}

.btn-start {
  background-color: #9cd7f5;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-start:hover {
  background-color: #2563eb;
}


.level-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 200px;
  text-align: center;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  background-color: #475569;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.xp-bar {
  height: 8px;
  background-color: #334155;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  background-color: #fbbf24;
}

.level-text {
  font-size: 0.85rem;
  color: #e2e8f0;
  margin: 0;
}


.footer-cta {
  text-align: center;
  padding: 40px 0 80px;
}

@media (max-width: 768px) {
  .gamification-content {
    flex-direction: column;
    text-align: center;
  }

  .gami-text p {
    margin: 0 auto 25px;
  }

  .hero-title {
    font-size: 2rem;
  }
}
</style>
