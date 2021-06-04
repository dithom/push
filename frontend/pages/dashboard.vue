<!--
Dashboard
===
Initial page for signed in user. Shows general overview.
-->

<template>
  <div class="container">
    Dashboard
    <div>Hi {{ userName }} !</div>
    <button class="btn btn-primary" @click="onClickLogout">Logout</button>
    <p v-if="$fetchState.pending">Fetching mountains...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <h1>Nuxt Mountains</h1>
      <div v-for="(item, index) in mountains" :key="item.username">
        {{ index }}. {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      mountains: [],
    };
  },

  async fetch() {
    const response = await this.$axios.$get('/user/username', {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.$store.commit('session/setUserName', response.username);
  },

  computed: {
    userName() {
      return this.$store.state.session.username;
    },
  },
  methods: {
    onClickLogout() {
      this.$store.commit('session/destroy');
    },
  },
};
</script>
