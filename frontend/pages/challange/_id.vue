<!--
challange feed
===
Shows challange feed 
-->

<template>
  <div class="container">
    <div>ChallangeName: {{ challange.name }}</div>
    <div>Category: {{ challange.category }}</div>
    <div>Description: {{ challange.description }}</div>
    <div>Remaining Days of the Challange: {{ remainingDays }}</div>
    <div>
      Interval: {{ challange.repetitions }} Repetitions per
      {{ challange.timespan }}
    </div>
    <div>Creator: {{ creator }}</div>
    <div>{{ amountOfCompetitors }} Competitors:</div>
    <div>
      <div v-for="(item, index) in attendees" :key="item">
        {{ index + 1 }}. : {{ item }} -
      </div>

      <div v-for="(item, index) in userTotalRepetitionsMap" :key="index">
        {{ index }} - Total Repetitions: {{ item }}
      </div>
      <div v-if="loaded" class="grid">
        <div
          v-for="(item, index) in datacollection"
          :key="index"
          class="grid-item"
        >
          <PieChart :data="item" />
        </div>
      </div>
      <!--
      <div class="chart-container">
         eslint-disable-next-line vue/attribute-hyphenation x
        <pie-chart
          v-if="loaded"
          ref="chart"
          :data="datacollection[1]"
        ></pie-chart>
      </div>
      -->
    </div>
    <div class="container">
      <div class="chat-container">
        <header class="chat-header">
          <h1><i class="fas fa-smile"></i> ChallangeFeed</h1>
        </header>
        <main class="chat-main">
          <div class="chat-messages"></div>
        </main>
        <div class="chat-form-container">
          <form id="chat-form" @submit="onFormSubmit">
            <input
              id="msg"
              type="text"
              placeholder="Enter Message"
              required
              autocomplete="off"
            />
            <button class="btn btn-primary" type="submit">
              <i class="fas fa-paper-plane"></i> Send
            </button>
          </form>
          <button class="btn btn-primary" @click="onLogActivity">
            Log Activity
          </button>
        </div>
      </div>
      <button class="btn btn-primary" @click="onClickBack">Back</button>
    </div>
  </div>
</template>

<script>
import formatMessage from '../../utils/messageFormatService';
import createDataOject from '../../utils/chartDataService';
import PieChart from '../../components/piechart.js';

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    PieChart,
  },
  middleware: ['auth'],
  data() {
    return {
      loaded: false,
      challange: '',
      amountOfCompetitors: 0,
      attendees: [],
      creator: '',
      remainingDays: 0,
      userTotalRepetitionsMap: [],
      datacollection: [],
    };
  },

  // get Data from API
  async fetch() {
    // get challange information from API
    let routeURl = '/challange/' + this.$route.params.id;
    let response = await this.$axios.$get(routeURl, {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    this.challange = response;
    this.timespan =
      // get attendees names from API
      this.amountOfCompetitors = this.challange.competitors.length;
    const amountCompetitors = this.amountOfCompetitors;
    if (amountCompetitors > 0) {
      for (let i = 0; i < amountCompetitors; i++) {
        console.log('user id', this.challange.competitors[i]);
        const routeURl =
          '/user/userinformation/' + this.challange.competitors[i];
        const response = await this.$axios.$get(routeURl, {
          headers: { 'auth-token': this.$store.state.session.authToken },
        });
        console.log('response.username', response.username);
        this.attendees.push(response.username);
      }
      // get creator of the challange
      const routeURl = '/user/userinformation/' + this.challange.creator;
      const response = await this.$axios.$get(routeURl, {
        headers: { 'auth-token': this.$store.state.session.authToken },
      });
      this.creator = response.username;
    }
    // get challangeFeed from API
    routeURl = '/challangeFeed/' + this.$route.params.id;
    response = await this.$axios.$get(routeURl, {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });

    // create div of past chatmessages and activity logs and display them

    const userIdMap = {};

    for (let i = 0; i < response.length; i++) {
      routeURl = 'user/userinformation/' + response[i].user;
      const user = await this.$axios.$get(routeURl, {
        headers: { 'auth-token': this.$store.state.session.authToken },
      });
      userIdMap[user.username] = response[i].user;
      const message = {
        // get challangeFeed from API
        username: user.username,
        time: response[i].date,
        text: response[i].message,
      };
      this.outputMessage(message);
    }

    // get leaderboard from api with current Interval Repetitions
    routeURl = 'challangeLeaderboard/' + this.$route.params.id;
    const challangeLeaderboard = await this.$axios.$get(routeURl, {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });

    this.userTotalRepetitionsMap = challangeLeaderboard;
    console.log('leaderboard', challangeLeaderboard);

    // create pie charts with remaining activities for all users
    this.updateData();

    // this.outputchart(challangeLeaderboard[i].username, i);

    this.loaded = true;
    this.calculateRemainingTime(this.challange.endDate);
  },
  mounted() {
    this.loaded = false;
    this.socket = this.$nuxtSocket({
      name: 'home',
    });
    // Join Chatroom
    this.socket.emit('joinRoom', this.$store.state.session.username);

    /* Listen for events on socket: */
    this.socket.on('message', (msg, cb) => {
      this.outputMessage(msg);

      // Scroll down
      /*
      const chatMessages = document.querySelector('.chat-messages');
      chatMessages.scrollTop = chatMessages.scrollHeight;
      */
    });
  },
  methods: {
    // receive chat message from form
    onFormSubmit(event) {
      event.preventDefault(); // then it does not submit to a file
      event.stopPropagation();

      // get message text from chat form
      const messageText = event.target.elements.msg.value;

      // Send Chat Message to server
      this.socket.emit(
        'chatMessage',
        formatMessage(
          'message',
          messageText,
          this.$store.state.session.userid,
          this.$route.params.id
        )
      );

      // clear input
      event.target.elements.msg.value = '';
      event.target.elements.msg.focus();
    },
    // Output message to DOM
    outputMessage(message) {
      // create message div
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;
      // add new div (message) to div chat messages
      document.querySelector('.chat-messages').appendChild(div);
    },

    /*
    // Output message to DOM
    outputchart(username, i) {
      // create message div
      const div = document.createElement('div');
      console.log(' make pie chart of ', username);
      // eslint-disable-next-line no-unused-vars
      const data = this.datacollection[i];
      // div.innerHTML = `<pie-chart :chart-data=${data}></pie-chart>`;
      // add new div (message) to div chat messages
      document.querySelector('.chart-container').appendChild(div);
      const newCan = document.createElement('canvas');
      div.appendChild(newCan);
      newCan.id = 'canvas' + [i];
      // const canv = 'canvas' + [i];
      // this.create_chart(data, canv);
    },
    create_chart(setData, canvas) {
      const ctx = document.getElementById(canvas).getContext('2d');
      // eslint-disable-next-line no-new
      new PieChart(ctx, { data: setData });

      
    }, */
    getMessage() {
      this.socket.on('getMessage', { id: 'abc123' }, (resp) => {
        this.messageRxd = resp;
      });
    },
    onLogActivity() {
      // Send Chat Message to server
      this.socket.emit(
        'logMessage',
        formatMessage(
          'accomplishedActivity',
          'accomplishedActivity',
          this.$store.state.session.userid,
          this.$route.params.id
        )
      );

      // increase amount of Repetitions of user in UI
      for (let i = 0; i < this.userTotalRepetitionsMap.length; i++) {
        if (
          this.userTotalRepetitionsMap[i].username ===
          this.$store.state.session.username
        ) {
          this.userTotalRepetitionsMap[i].totalrepetitions =
            this.userTotalRepetitionsMap[i].totalrepetitions + 1;
          this.userTotalRepetitionsMap[i].currentIntervalRepetitions =
            this.userTotalRepetitionsMap[i].currentIntervalRepetitions + 1;
        }
      }
      this.updateData();
      console.log('activity logged');
    },
    onClickBack() {
      this.$router.push('/dashboard');
    },
    calculateRemainingTime(endDate) {
      endDate = new Date(endDate.split('T')[0]);
      // const currentDate = new Date().toLocaleDateString('en-GB');
      const currentDate = new Date();
      // calculate time difference
      const timeDifference = endDate.getTime() - currentDate.getTime();

      // calculate days difference by dividing total milliseconds in a day
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      this.remainingDays = Math.floor(daysDifference);
    },
    // update data of pie charts
    updateData() {
      this.datacollection = [];
      for (let i = 0; i < this.userTotalRepetitionsMap.length; i++) {
        // fill data object for pie charts
        const remainingActivities =
          this.challange.repetitions -
          this.userTotalRepetitionsMap[i].currentIntervalRepetitions;
        this.datacollection.push(
          createDataOject(
            this.userTotalRepetitionsMap[i].currentIntervalRepetitions,
            remainingActivities,
            this.userTotalRepetitionsMap[i].username
          )
        );
      }
    },
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.chat-container {
  height: 50px;
  overflow: 'auto';
}
</style>
