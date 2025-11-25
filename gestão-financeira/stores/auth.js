import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // ESTADO (State)
    // Inicializa verificando se já existe salvo no storage
    const user = ref(JSON.parse(localStorage.getItem('usuario_logado')) || null);

    // AÇÕES (Actions)
    
    function cadastrar(nome,senha) {
        // Simula o banco de dados
        const bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];

        if (bancoUsers.find(u => u.nome === nome)) {
            throw new Error('Este email já existe!');
        }

        const novoUser = { nome, senha };
        bancoUsers.push(novoUser);
        localStorage.setItem('users_db', JSON.stringify(bancoUsers));
    }

    function login(nome, senha) {
        const bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];
        
        const userEncontrado = bancoUsers.find(
            u => u.nome === nome && u.senha === senha
        );

        if (userEncontrado) {
            user.value = userEncontrado;
            localStorage.setItem('usuario_logado', JSON.stringify(userEncontrado));
        } else {
            throw new Error('Nome ou senha incorretos.');
        }
    }

    function logout() {
        user.value = null;
        localStorage.removeItem('usuario_logado');
    }

    return { user, cadastrar, login, logout };
});