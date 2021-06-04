<!--
Archive Page
===
Archived Challange of User
-->

<template>
  <div class="container">
    <div>Archive</div>
    <button class="btn btn-primary" @click="onClickBack">Back</button>
    <p v-if="$fetchState.pending">Fetching archived Challangess</p>
    <p v-else-if="$fetchState.error">An error occurred</p>
    <div v-else>
      <h1>Archived Challanges</h1>
      <div v-for="(item, index) in archivedChallanges" :key="item.username">
        {{ index }}. Name: {{ item.name }}. Von {{ item.startDate }} -
        {{ item.endDate }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      archivedChallanges: [],
    };
  },

  // get Data from API
  async fetch() {
    // Username
    const responseArchived = await this.$axios.$get('/challange/archived', {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.archivedChallanges = responseArchived;
  },
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
