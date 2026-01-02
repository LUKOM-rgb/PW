<template>
  <div class="profile-container">
    <div class="profile-box">
      <h1>O Meu Perfil</h1>

      <div class="form-group">
        <label>Nome:</label>
        <input v-model="form.name" type="text" />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input v-model="form.email" type="text" disabled style="background: #eee; cursor: not-allowed;"/>
      </div>

      <div class="form-group">
        <label>Nova Password:</label>
        <input v-model="form.password" type="text" />
      </div>

      <div class="buttons">
        <button @click="atualizar" class="btn-save">Guardar</button>
        <button @click="sair" class="btn-logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { usarStoreAuth } from '../stores/auth';

export default {
  name: 'ProfileView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  computed: {
    ...mapStores(usarStoreAuth)
  },
  methods: {
    async atualizar() {
      const sucesso = await this.authStore.atualizarPerfil({
        name: this.form.name,
        password: this.form.password
      });

      if (sucesso) alert('Perfil atualizado!');
      else alert('Erro ao atualizar.');
    },
    sair() {
      this.authStore.logout();
      this.$router.push('/login');
    }
  },
  mounted() {
    // Preenche o formulário com os dados do user logado
    if (this.authStore.user) {
      this.form.name = this.authStore.user.name;
      this.form.email = this.authStore.user.email;
      this.form.password = this.authStore.user.password;
    }
  }
};
</script>

<style scoped>
.profile-container { display: flex; justify-content: center; padding-top: 50px; }
.profile-box { background: white; padding: 30px; border-radius: 10px; width: 400px; color: #333; }
.form-group { margin-bottom: 15px; }
.form-group input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}
.buttons { display: flex; justify-content: space-between; margin-top: 20px; }
.btn-save { background: #27ae60; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; }
.btn-logout { background: #c0392b; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; }
</style>
