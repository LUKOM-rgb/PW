import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    
    // --- ESTADO (STATE) ---
    // 1. Utilizador logado atualmente
    const user = ref(JSON.parse(localStorage.getItem('usuario_logado')) || null);
    
    // 2. Lista de todos os utilizadores (O ecrã vai "olhar" para esta variável)
    const listaUsuarios = ref([]);

    const router = useRouter();

    // --- AÇÕES (ACTIONS) ---

    // A. Cadastrar Novo Utilizador
    function cadastrar(nome, senha) {
        const bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];

        if (bancoUsers.find(u => u.nome === nome)) {
            throw new Error('Este nome de utilizador já existe!');
        }

        const novoUser = { nome, senha };
        bancoUsers.push(novoUser);
        localStorage.setItem('users_db', JSON.stringify(bancoUsers));
    }

    // B. Fazer Login
    function login(nome, senha) {
        const bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];
        const userEncontrado = bancoUsers.find(u => u.nome === nome && u.senha === senha);

        if (userEncontrado) {
            user.value = userEncontrado;
            localStorage.setItem('usuario_logado', JSON.stringify(userEncontrado));
        } else {
            throw new Error('Nome ou senha incorretos.');
        }
    }

    // C. Fazer Logout
    function logout() {
        user.value = null;
        localStorage.removeItem('usuario_logado');
        router.push('/login');
    }

    // D. Carregar Lista (Chamado ao entrar no Dashboard)
    function carregarUsuarios() {
        const dados = localStorage.getItem('users_db');
        listaUsuarios.value = dados ? JSON.parse(dados) : [];
    }

    // E. Remover Utilizador (Elimina do Disco + Memória)
    function removerUsuario(nomeAlvo) {
        // 1. Atualizar o Banco de Dados (LocalStorage)
        let bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];
        const novaListaBanco = bancoUsers.filter(u => u.nome !== nomeAlvo);
        localStorage.setItem('users_db', JSON.stringify(novaListaBanco));

        // 2. Atualizar a Memória (Aqui acontece a mágica visual)
        listaUsuarios.value = listaUsuarios.value.filter(u => u.nome !== nomeAlvo);

        // 3. Se eu apaguei a minha própria conta, faz logout forçado
        if (user.value && user.value.nome === nomeAlvo) {
            logout();
        }
    }

    return { 
        user, 
        listaUsuarios, 
        cadastrar, 
        login, 
        logout, 
        carregarUsuarios, 
        removerUsuario 
    };
});