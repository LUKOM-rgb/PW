# Grupo 14 - Programação Web I - Sistema de Gestão Financeira (Finance Tracker)

## Informação do Grupo

**Número do Grupo:** group_14
**Data de Submissão:** 2026-01-26

### Membros da Equipa

| Nome              | ID de Estudante       | Email                 | Contribuição % |
| ----------------- | --------------------- | --------------------- | -------------- |
| Gonçalo Duarte    | 40240223              | 40240223@esmad.ipp.pt | 50%            |
| Lucas Silva       | 40240224              | 40240224@esmad.ipp.pt | 50%            |

**Total:** 100%

## Visão Geral do Projeto

Este projeto implementa uma aplicação web de **Gestão e Literacia Financeira** desenvolvida com **Vue.js**. A plataforma oferece um ecossistema completo para investidores iniciantes, incluindo consulta de ações em tempo real, análise de notícias com sentimento, ferramentas de cálculo financeiro (juros compostos) e uma componente de gamificação ("Simulador de Mercado") para incentivar a aprendizagem contínua.

A aplicação consome a API da **Alpha Vantage** para dados de mercado e utiliza um **JSON Server** para simular uma base de dados de utilizadores e persistência de progresso.

## Objetivos de Aprendizagem Alcançados

- **Arquitetura SPA (Single Page Application):** Implementação robusta de navegação no lado do cliente usando **Vue Router**;
- **Gestão de Estado Centralizada:** Domínio do **Pinia** para gerir dados complexos como sessões de utilizador, favoritos e histórico de ações entre componentes;
- **Integração de APIs Externas:** Consumo de APIs RESTful com **Axios**, tratando parâmetros de autenticação e limites de pedidos;
- **Gamificação e Lógica de Negócio:** Desenvolvimento de algoritmos para atribuição de XP, níveis e bloqueios temporais (jogadas diárias);
- **Visualização de Dados:** Implementação de gráficos interativos com **Chart.js** para análise de tendências de mercado.

## Desafios e Soluções

Durante o desenvolvimento, encontrámos vários desafios técnicos que exigiram soluções específicas:

### Desafio 1: Persistência de Estado e Preferências
- **Problema**: Ao recarregar a página, as preferências do utilizador (como filtros de "Ver Favoritos" no Blog) e o estado da autenticação perdiam-se, prejudicando a experiência do utilizador.
- **Solução**: Implementámos uma estratégia de sincronização entre o **Pinia** e o `localStorage` do navegador, utilizando `watchers` do Vue para gravar automaticamente qualquer alteração nas preferências e recuperar o estado ao iniciar a aplicação.

### Desafio 2: Limites da API Externa (Rate Limiting)
- **Problema**: A API gratuita da Alpha Vantage tem um limite rigoroso de pedidos por minuto, o que causava erros na aplicação durante testes intensivos ou navegação rápida.
- **Solução**: Criámos um sistema de tratamento de erros global e estados de carregamento (`loading states`) informativos. Adicionalmente, otimizámos as chamadas à API, garantindo que os dados só são pedidos quando estritamente necessários.

### Desafio 3: Segurança e Proteção de Rotas
- **Problema**: Impedir que utilizadores não autenticados acedessem a páginas privadas (Perfil, Simulador) ou que utilizadores comuns acedessem à área de Administração.
- **Solução**: Utilizámos **Navigation Guards** (`router.beforeEach`) no Vue Router para interceptar a navegação, verificar o nível de permissão do utilizador na Store e redirecionar para o Login ou Home conforme necessário.

## Testes e Validação

- **Testes de Fluxo de Utilizador:** Validação completa dos processos de Registo, Login e Logout.
- **Validação de Dados:** Verificação de formulários (passwords curtas, nomes duplicados) antes do envio para o servidor.
- **Testes de Integração:** Confirmação de que os dados recebidos da API Alpha Vantage são corretamente transformados e renderizados nos gráficos.
- **Cross-Browser:** Verificação da responsividade e layout em diferentes navegadores (Chrome, Firefox, Edge).

## Resultados de Aprendizagem

Através deste projeto, adquirimos experiência prática em:

- Desenvolver interfaces reativas e modulares com **Vue 3 (Composition e Options API)**.
- Configurar e consumir dados de APIs de terceiros num contexto real.
- Gerir o ciclo de vida de componentes e o fluxo de dados unidirecional.
- Implementar lógicas de autenticação e autorização no frontend.
- Utilizar fluxos de trabalho colaborativos com Git e GitHub.

## Project Setup

```bash
npm install
```

### Compile and Hot-Reload for Development

```bash
npm run start
```

## Contribuidores

Gonçalo Duarte, Lucas Silva.
Grupo 14 - 2026