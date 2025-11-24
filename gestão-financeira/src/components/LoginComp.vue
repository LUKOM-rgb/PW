<template>
    <form>
        <h2> Criar Login</h2>
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Criar</button>
    </form>
</template>
<script>
import CriarloginView from '../views/criarloginView.vue';

export default {
    name: 'CriarLoginComp',
    components: CriarloginView,
    data () {
        return {
           name: '',
           password: ''
        };
    },
};

</script>