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
          v-model.trim="search"
          type="text"
          placeholder="Search people..."
          @keyup="getAllStarWarsPeople"
        /><br />
        <ul>
          <li v-for="person in people" :key="person.id">
            {{ person.name }}
          </li>
        </ul>
      </div>
      <button
        class="btn btn-primary w-100 mb-3"
        type="submit"
        :disabled="loading"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      challangeName: '',
      description: '',
      category: '',
      duration: '',
      interval: false,
      visibility: true,
    };
  },
  methods: {
    onClickBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
