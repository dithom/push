<!--
Create Challange Page
===
Lets user create a challange
-->

<template>
  <div class="container h-100">
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-10 col-md-8 col-lg-6 col-xl-4">
        <h1 class="text-center">Create Challange</h1>
      </div>
      <div class="col-10 col-md-8 col-lg-6 col-xl-4">
        <h3 class="text-center">Define your Challange</h3>
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
            v-model="challangeName"
            class="form-control"
            name="challangeName"
            type="name"
            placeholder="Challange Name"
            minlength="6"
            :disabled="loading"
            required
          />
          <div class="invalid-feedback">Please enter a Name</div>
        </div>
        <div class="input-group has-validation mb-3">
          <input
            v-model="description"
            class="form-control"
            name="description"
            type="description"
            placeholder="Challange Description"
            :disabled="loading"
            required
          />
          <div class="invalid-feedback">Please enter a description.</div>
        </div>
        <div class="input-group has-validation mb-3">
          <label for="cars">Choose a Category: </label>
          <select id="cars" name="cars">
            <option value="sport">Sport</option>
            <option value="music">Music</option>
            <option value="literature">Literature</option>
            <option value="gaming">Gaming</option>
          </select>
        </div>
        <div class="input-group has-validation mb-3">
          <input
            v-model="duration"
            class="form-control"
            name="duration"
            type="duration"
            placeholder="Duration (in days)"
            :disabled="loading"
            required
          />
          <div class="invalid-feedback">Please enter a duration</div>
        </div>
        <div class="input-group has-validation mb-3">
          <div>
            <input
              v-model="repition"
              class="form-control"
              name="repition"
              type="repition"
              placeholder="Repitions"
              :disabled="loading"
              required
            />
          </div>
          <div>times per</div>
          <div>
            <select id="cars" name="cars">
              <option value="day">Day</option>
              <option value="month">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div class="invalid-feedback">Please enter a duration</div>
        </div>
        <div class="input-group has-validation mb-3">
          <p>Visibility:</p>
          <input
            id="public"
            type="radio"
            name="visibility"
            value="public"
            checked="checked"
          />
          <label for="public">Public</label>
          <input id="private" type="radio" name="visibility" value="private" />
          <label for="private">Private</label>
        </div>
        <button
          class="btn btn-primary w-100 mb-3"
          type="submit"
          :disabled="loading"
        >
          Next
        </button>
      </form>
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
    onFormSubmit(event) {
      this.$router.push('/createChallangeAttendees');
    },
    onClickBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
