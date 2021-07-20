<!--
Invitations
===
Shows Inivitations of user
-->

<template>
  <div class="container">
    <div>Your Invitations:</div>
    <div>You currently have {{ invitations.length }} invitations</div>
    <div class="invitations"></div>

    <div
      v-for="(item, index) in invitations"
      :key="item.id"
      class="invitationstest"
    >
      <p class="meta">
        {{ item.sender }} invited you to the {{ item.challange }}
        challange. Do you accept?
      </p>
      <button
        class="btn btn-primary"
        @click="answerInvitation(item.id, 0, index)"
      >
        Yes
      </button>
      <button
        class="btn btn-primary"
        @click="answerInvitation(item.id, 1, index)"
      >
        No
      </button>
    </div>

    <button class="btn btn-primary" @click="onClickBack">Back</button>
  </div>
</template>

<script>
// TODO Create dialog window when no or yes is clicked
export default {
  middleware: ['auth'],
  data() {
    return {
      invitations: [],
    };
  },

  // get Data from API
  async fetch() {
    // Username
    const routeURl = '/invitation/' + this.$store.state.session.userid;
    const response = await this.$axios.$get(routeURl, {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.invitations = response;
  },
  methods: {
    async answerInvitation(invitationid, indexButton, indexArray) {
      // Check for user answer, which button was pressed
      let userAnswer = '';
      if (indexButton === 0) {
        userAnswer = 'accepted';
      } else {
        userAnswer = 'declined';
      }
      console.log('answer', userAnswer);
      console.log('invidtationid', invitationid);
      const response = await this.$axios.$patch(
        '/invitation/answer',
        {
          id: invitationid,
          answer: userAnswer,
        },
        { headers: { 'auth-token': this.$store.state.session.authToken } }
      );
      console.log(response);
      // TODO update invitation status in html , buttons must vanish
      this.invitations.splice(indexArray, 1);
    },
    onClickBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
