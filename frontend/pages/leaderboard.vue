<!--
Leaderboard
===
Leaderboard of all Users
-->

<template>
  <div class="container">
    <div>Leaderboard</div>
    <button class="btn btn-primary" @click="onClickBack">Back</button>
    <p v-if="$fetchState.pending">Fetching Leaderboard</p>
    <p v-else-if="$fetchState.error">An error occurred</p>
    <div v-else>
      <h1>Leaderboard</h1>
      <div v-for="(item, index) in leaderboard" :key="item.username">
        {{ index }}. Username: {{ item.username }}. Highscore:
        {{ item.highscore }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      leaderboard: [],
    };
  },

  // TODO show attendees with current score in specific challange

  // get Data from API
  async fetch() {
    // Username
    const responseLeaderboard = await this.$axios.$get('/user/leaderboard', {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.leaderboard = responseLeaderboard;
    console.log(this.leaderboard);
  },
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
