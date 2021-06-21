<!--
Profile
===
Shows Profile Information of User
-->

<template>
  <div class="container">
    <div>ChallangeName: {{ challange.name }}</div>
    <div>Category: {{ challange.category }}</div>
    <div>Remaining Days: {{ remainingDays }}</div>
    <div>{{ amountOfCompetitors }} competitors:</div>
    <div v-for="(item, index) in attendees" :key="item">
      {{ index }}. Username: {{ item }}
    </div>
    <button class="btn btn-primary" @click="onClickBack">Back</button>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      challange: '',
      amountOfCompetitors: 0,
      attendees: [],
      remainingDays: 0,
    };
  },

  // get Data from API
  async fetch() {
    // get challange information from API
    const routeURl = '/challange/' + this.$route.params.id;
    const response = await this.$axios.$get(routeURl, {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.challange = response;

    // get attendees names from API
    this.amountOfCompetitors = this.challange.competitors.length;
    const amountCompetitors = this.amountOfCompetitors;
    if (amountCompetitors > 0) {
      for (let i = 0; i < amountCompetitors; i++) {
        const routeURl =
          '/user/userinformation/' + this.challange.competitors[i];
        const response = await this.$axios.$get(routeURl, {
          headers: { 'auth-token': this.$store.state.session.authToken },
        });
        this.attendees.push(response.username);
      }
    }
    this.calculateRemainingTime(this.challange.endDate);
  },
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
    calculateRemainingTime(endDate) {
      endDate = new Date(endDate.split('T')[0]);
      // const currentDate = new Date().toLocaleDateString('en-GB');
      const currentDate = new Date();
      console.log(currentDate);
      console.log(endDate);
      // calculate time difference
      const timeDifference = endDate.getTime() - currentDate.getTime();

      // calculate days difference by dividing total milliseconds in a day
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      this.remainingDays = Math.floor(daysDifference);
    },
  },
};
</script>
