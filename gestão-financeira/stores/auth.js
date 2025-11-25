import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Opcional: Para redirecionar automático

export const useAuthStore = defineStore('auth', () => {
    // ESTADO (State)
    const user = ref(JSON.parse(localStorage.getItem('usuario_logado')) || null);
    
    // Opcional: Para usar o router dentro da store
    // const router = useRouter(); 

    // AÇÕES (Actions)
    
    function cadastrar(nome, senha) {
        const bancoUsers = JSON.parse(localStorage.getItem('users_db')) || [];

        // CORREÇÃO: A mensagem deve dizer "nome" e não "email"
        if (bancoUsers.find(u => u.nome === nome)) {
            throw new Error('Este nome de utilizador já existe!');
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
        // Se quiser redirecionar aqui direto, precisaria importar o router
        // mas fazer isso no componente (View) também está correto.
    }

    return { user, cadastrar, login, logout };
});