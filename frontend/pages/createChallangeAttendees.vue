<!--
Create Challange Attendees Page
===
Lets user add competitors to his challange
-->

<template>
  <div class="container h-100">
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-10 col-md-8 col-lg-6 col-xl-4">
        <h1 class="text-center">Create Challange</h1>
      </div>
      <div class="col-10 col-md-8 col-lg-6 col-xl-4">
        <h3 class="text-center">Deine Challange wurde erfolgreich erstellt</h3>
      </div>
      <div class="col-10 col-md-8 col-lg-6 col-xl-4">
        <h3 class="text-center">
          Do you want to add competitors to your challange?
        </h3>
      </div>
      <div class="input-group has-validation mb-3">
        <input
          v-model="search"
          type="text"
          placeholder="Search for attendees"
        />
        <button class="btn btn-primary w-100 mb-3" @click="onClickSearchButton">
          Search attendees
        </button>
        <div>{{ noUserFound }}</div>
        <div v-for="(item, index) in competitors" :key="item.username">
          {{ index }}. Username: {{ item.username }}. Highscore:
          {{ item.highscore }}
        </div>
      </div>
      <button class="btn btn-primary w-100 mb-3" type="submit">
        {{ addAttendeeButtonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      search: '',
      competitors: [],
      noUserFound: '',
      addAttendeeButtonText: 'Create without attendees',
    };
  },
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
    onClickSearchButton() {
      this.getAttendee();
      this.noUserFound = '';
      // get Data from API
    },
    async getAttendee() {
      try {
        console.log('this.search', this.search);
        const responseAttendee = await this.$axios.$post(
          '/user/getAttendee',
          {
            username: this.search,
          },
          {
            headers: { 'auth-token': this.$store.state.session.authToken },
          }
        );
        this.competitors.push(responseAttendee);
        this.changeAddAttendeeButtonText();
      } catch (error) {
        this.noUserFound = 'Sorry, userName with this credentials not found';
      }
    },
    changeAddAttendeeButtonText() {
      const amountCompetitors = this.competitors.length;

      this.addAttendeeButtonText =
        'Add ' + amountCompetitors + ' users to created challange';
    },
  },
};
</script>
