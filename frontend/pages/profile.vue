<!--
Profile
===
Shows Profile Information of User
-->

<template>
  <div class="container">
    <div>Profile</div>
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
