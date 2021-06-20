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
        <div>{{ noSearchEntryMessage }}</div>
        <button class="btn btn-primary w-100 mb-3" @click="onClickSearchButton">
          Search attendee
        </button>
        <div>{{ noUserFound }}</div>
        <div v-for="(item, index) in competitors" :key="item.username">
          {{ index }}. Username: {{ item.username }}. Highscore:
          {{ item.highscore }}
        </div>
      </div>
      <button
        class="btn btn-primary w-100 mb-3"
        type="submit"
        @click="onClickAddAttendees"
      >
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
      noSearchEntryMessage: '',
      noUserFound: '',
      addAttendeeButtonText: 'Create without attendees',
    };
  },
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
    onClickSearchButton() {
      if (this.search) {
        this.getAttendee();
        this.noUserFound = '';
        this.noSearchEntryMessage = '';
      } else {
        this.noSearchEntryMessage = 'Bitte gib einen Username ein';
      }

      // get Data from API
    },
    async getAttendee() {
      try {
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
        console.log(
          'his.$store.state.session',
          this.$store.state.session.createdChallangeName
        );
      } catch (error) {
        this.noUserFound = 'Sorry, userName with this credentials not found';
      }
    },
    changeAddAttendeeButtonText() {
      const amountCompetitors = this.competitors.length;
      this.addAttendeeButtonText =
        'Add ' + amountCompetitors + ' users to created challange';
    },
    onClickAddAttendees() {
      this.getAttendee();
      this.noUserFound = '';
      this.addAttendee();
    },
    async addAttendee() {
      try {
        await this.$axios.$patch(
          '/challange/addattendees',
          {
            competitors: this.competitors,
            name: this.$store.state.session.createdChallangeName,
          },
          {
            headers: { 'auth-token': this.$store.state.session.authToken },
          }
        );
        this.$router.push('/dashboard');
      } catch (error) {
        this.noUserFound = 'Sorry, userName with this credentials not found';
      }
    },
  },
};
</script>
