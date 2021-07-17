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
      v-for="invitation in invitations"
      :key="invitation.id"
      class="invitationstest"
    >
      <p class="meta">
        {{ invitation.sender }} invited you to the {{ invitation.challange }}
        challange. Do you accept?
      </p>
      <button
        class="btn btn-primary"
        @click="answerInvitation(invitation.id, 0)"
      >
        Yes
      </button>
      <button
        class="btn btn-primary"
        @click="answerInvitation(invitation.id, 1)"
      >
        No
      </button>
    </div>

    <button class="btn btn-primary" @click="onClickBack">Back</button>
  </div>
</template>

<script>
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
    async answerInvitation(invitationid, index) {
      // Check for user answer, which button was pressed
      let userAnswer = '';
      if (index === 0) {
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

      /*
      const routeURl = '/invitation/answer/' + invitationid;
      const response = this.$axios.$patch(routeURl, {
        headers: { 'auth-token': this.$store.state.session.authToken },
      });
      console.log(response);
      */
    },
    onClickBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
