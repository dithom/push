<!--
Archive Page
===
Archived Challange of User
-->

<template>
  <div class="container">
    <div>Create Challange</div>
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
