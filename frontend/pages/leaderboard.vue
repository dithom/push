<!--
Leaderboard
===
Leaderboard of all Users
-->

<template>
  <div class="container">
    <div>Leaderboard</div>
    <button class="btn btn-primary" @click="onClickBack">Back</button>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
