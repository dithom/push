<!--
Dashboard
===
Initial page for signed in user. Shows general overview.
-->

<template>
  <div class="container">
    Dashboard
    <pre>{{ $store.state.session }}</pre>
    <button class="btn btn-primary" @click="onClickLogout">Logout</button>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  methods: {
    onClickLogout() {
      this.$store.commit('session/destroy');
    },
  },
};
</script>
