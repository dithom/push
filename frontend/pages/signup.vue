<!--
Register
===
Form for registering user
-->

<template>
  <div class="container h-100">
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-10 col-md-8 col-lg-6 col-xl-4">
        <h1 class="text-center">Sign up</h1>
        <div v-if="wrongCredentials || error" class="alert alert-danger">
          <span v-if="wrongCredentials">Email address or password wrong.</span>
          <span v-if="error"
            >Sorry, there seems to be an issue on our side. Please try again
            later.</span
          >
        </div>
        <form
          method="post"
          class="needs-validation"
          :class="{ 'was-validated': formValidated }"
          novalidate
          @submit="onFormSubmit"
        >
          <div class="input-group has-validation mb-3">
            <input
              v-model="username"
              class="form-control"
              name="username"
              type="username"
              placeholder="Username"
              :disabled="loading"
              required
            />
            <div class="invalid-feedback">
              Please enter a valid email address.
            </div>
          </div>
          <div class="input-group has-validation mb-3">
            <input
              v-model="email"
              class="form-control"
              name="email"
              type="email"
              placeholder="Email"
              :disabled="loading"
              required
            />
            <div class="invalid-feedback">Please enter a valid user name.</div>
          </div>
          <div class="input-group has-validation mb-3">
            <input
              v-model="password"
              class="form-control"
              name="password"
              type="password"
              placeholder="Password"
              minlength="6"
              :disabled="loading"
              required
            />
            <div class="invalid-feedback">Please enter a password.</div>
          </div>
          <button
            class="btn btn-primary w-100 mb-3"
            type="submit"
            :disabled="loading"
          >
            Sign up
          </button>
        </form>
        <div class="text-center">
          <p>Already an account? <NuxtLink to="/signin">Sign in</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      username: '',
      password: '',
      formValidated: false,
      loading: false,
      wrongCredentials: false,
      error: false,
    };
  },
  methods: {
    onFormSubmit(event) {
      event.preventDefault();
      event.stopPropagation();

      const form = event.target;

      if (form.checkValidity()) {
        this.getToken();
      }

      this.formValidated = true;
    },
    async getToken() {
      this.loading = true;
      this.wrongCredentials = false;
      this.error = false;

      try {
        const response = await this.$axios.$post('/signin', {
          email: this.email,
          password: this.password,
        });

        if (response.authToken) {
          this.$store.commit('session/init', response.authToken);
          this.$router.push('/dashboard');
          return;
        }

        this.error = true;
      } catch (error) {
        if (
          error.response &&
          error.response.status &&
          error.response.status === 400
        ) {
          this.wrongCredentials = true;
        } else {
          this.error = true;
        }
      }
      this.loading = false;
    },
  },
};
</script>
