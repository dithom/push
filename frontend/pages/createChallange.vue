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
            v-model="name"
            class="form-control"
            name="name"
            type="name"
            placeholder="Challange Name"
            minlength="6"
            maxlength="255"
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
            minlength="6"
            maxlength="1023"
            :disabled="loading"
            required
          />
          <div class="invalid-feedback">Please enter a description.</div>
        </div>
        <div class="input-group has-validation mb-3">
          <label for="category">Choose a Category: </label>
          <select
            id="category"
            v-model="category"
            name="category"
            required="required"
          >
            <option value="sport">Sport</option>
            <option value="music">Music</option>
            <option value="reading">Reading</option>
            <option value="art">Art</option>
          </select>
          <div class="invalid-feedback">Please choose a category</div>
        </div>
        <div class="input-group has-validation mb-3">
          <input
            v-model="startDate"
            class="form-control"
            name="startDate"
            type="date"
            placeholder=""
            :disabled="loading"
            required
          />
          <div class="invalid-feedback">Please enter a start Date</div>
          <input
            v-model="endDate"
            class="form-control"
            name="endDate"
            type="date"
            placeholder=""
            :disabled="loading"
            required
          />
          <div class="invalid-feedback">Please enter an end date</div>
        </div>
        <div class="input-group has-validation mb-3">
          <div>
            <input
              v-model="repititions"
              class="form-control"
              name="repetitions"
              type="number"
              min="1"
              placeholder="Repitions"
              :disabled="loading"
              required
            />
          </div>
          <div>times per</div>
          <div>
            <select
              id="cars"
              v-model="timespan"
              name="timespan"
              required="required"
            >
              <option value="minute">Minute</option>
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
            <div class="invalid-feedback">Please choose a timespan</div>
          </div>
          <div class="invalid-feedback">Please enter a duration</div>
        </div>
        <div class="input-group has-validation mb-3">
          <p>Visibility:</p>
          <input
            id="public"
            v-model="visibility"
            type="radio"
            name="visibility"
            value="public"
            checked="checked"
            required
          />
          <label for="public">Public</label>
          <input id="private" type="radio" name="visibility" value="private" />
          <label for="private">Private</label>
          <div class="invalid-feedback">Please choose a visibility</div>
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
  // TODO show current Date as starting Date

  middleware: ['auth'],
  data() {
    return {
      name: '',
      description: '',
      category: '',
      startDate: '',
      endDate: '',
      repititions: '',
      frequency: '',
      timespan: '',
      competitors: [],
      interval: false,
      visibility: true,

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
        this.createChallange();
      }
      this.formValidated = true;
    },
    async createChallange() {
      this.loading = true;
      this.wrongCredentials = false;
      this.error = false;
      try {
        const response = await this.$axios.$post(
          '/challange/create',
          {
            name: this.name,
            description: this.description,
            category: this.category,
            startDate: this.startDate,
            endDate: this.endDate,
            repetitions: this.repititions,
            timespan: this.timespan,
            visibility: this.visibility,
            competitors: this.competitors,
          },

          { headers: { 'auth-token': this.$store.state.session.authToken } }
        );

        if (response.name) {
          console.log('Successfully created challange');
          this.$store.commit('session/setCreatedChallange', response.name);
          this.$router.push('/createChallangeAttendees');
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
  onClickBack() {
    this.$router.push('/dashboard');
  },
};
</script>
