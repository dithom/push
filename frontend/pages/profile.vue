<!--
Profile
===
Shows Profile Information of User
-->

<template>
  <div class="container">
    <div>Profile</div>
    <div>Email: {{ userMail }}</div>

    <button class="btn btn-primary" @click="onClickReset">
      Reset Password
    </button>

    <button class="btn btn-primary" @click="onClickBack">Back</button>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      userMail: '',
    };
  },

  // get Data from API
  async fetch() {
    // Username
    const response = await this.$axios.$get('/user/userinformation', {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.userMail = response.email;
  },
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
    // TODO Implement Reset password
    onClickReset() {
      console.log('Reset Password');
    },
  },
};
</script>
