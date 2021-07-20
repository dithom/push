<!--
Dashboard
===
Initial page for signed in user. Shows general overview.
-->

<template>
  <div class="container">
    <div>Hi {{ userName }} !</div>
    <div>Your current score is {{ score }} !</div>
    <button class="btn btn-primary" @click="onClickLogout">Logout</button>

    <button class="btn btn-primary" @click="onClickProfile">Profile</button>

    <button class="btn btn-primary" @click="onClickLeaderboard">
      Leaderboard
    </button>

    <button class="btn btn-primary" @click="onClickArchive">Archive</button>

    <button class="btn btn-primary" @click="onClickCreateChallenge">
      Create new Challenge
    </button>

    <button
      id="btn-invitation"
      class="btn btn-primary"
      @click="onClickInvitation"
    >
      Invitations
    </button>
    <p v-if="$fetchState.pending">Fetching Challanges</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <h1>Active Challanges</h1>
      <p v-for="item in activeChallanges" :key="item.username">
        <NuxtLink :to="'/challange/' + item._id">{{ item.name }}</NuxtLink>
      </p>
      <!--
      <div v-for="(item, index) in activeChallanges" :key="item.username">
        {{ index }}. {{ item.name }}. {{ item.repetitions }} left, today
      </div>
      -->
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      activeChallanges: [],
      invitations: [],
      score: 0,
    };
  },

  // get Data from API
  async fetch() {
    // Username

    const responseUsername = await this.$axios.$get('/user/userinformation', {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.$store.commit('session/setUserName', responseUsername.username);
    // UserScore
    const responseUserScore = await this.$axios.$get('/user/highscore', {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.score = responseUserScore.highscore;
    // active Challanges
    const responseActiveChallanges = await this.$axios.$get(
      '/challange/active',
      {
        headers: { 'auth-token': this.$store.state.session.authToken },
      }
    );
    this.activeChallanges = responseActiveChallanges;

    // get pending invitations for changing invitation button color
    const routeURl = '/invitation/' + this.$store.state.session.userid;
    const response = await this.$axios.$get(routeURl, {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.invitations = response;

    this.checkInvitations();
  },
  // get Userscore
  /*
  async getUserscore() {
    this.score = await this.$axios.$get('/user/highscore', {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
  },
  */

  computed: {
    userName() {
      return this.$store.state.session.username;
    },
  },
  methods: {
    checkInvitations() {
      if (this.invitations.length > 0) {
        document.getElementById('btn-invitation').style.backgroundColor = 'Red';
      }
    },

    onClickLogout() {
      this.$store.commit('session/destroy');
    },

    onClickProfile() {
      this.$router.push('/profile');
    },

    onClickLeaderboard() {
      this.$router.push('/leaderboard');
    },

    onClickArchive() {
      this.$router.push('/archive');
    },

    onClickCreateChallenge() {
      this.$router.push('/createChallange');
    },
    onClickInvitation() {
      this.$router.push('/invitations');
    },
  },
};
</script>
