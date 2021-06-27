<!--
Profile
===
Shows Profile Information of User
-->

<template>
  <div class="container">
    <div>ChallangeName: {{ challange.name }}</div>
    <div>Category: {{ challange.category }}</div>
    <div>Remaining Days: {{ remainingDays }}</div>
    <div>{{ amountOfCompetitors }} competitors:</div>
    <div v-for="(item, index) in attendees" :key="item">
      {{ index }}. Username: {{ item }}
    </div>
    <div class="chat-container">
      <header class="chat-header">
        <h1><i class="fas fa-smile"></i> ChatCord</h1>
        <a href="index.html" class="btn">Leave Room</a>
      </header>
      <main class="chat-main">
        <div class="chat-sidebar">
          <h3><i class="fas fa-comments"></i> Room Name:</h3>
          <h2 id="room-name">JavaScript</h2>
          <h3><i class="fas fa-users"></i> Users</h3>
          <ul id="users">
            <li>Brad</li>
            <li>John</li>
            <li>Mary</li>
            <li>Paul</li>
            <li>Mike</li>
          </ul>
        </div>
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
      </div>
    </div>
    <button class="btn btn-primary" @click="onClickBack">Back</button>
  </div>
</template>

<script>
import formatMessage from '../../utils/messageFormatService';
export default {
  middleware: ['auth'],
  data() {
    return {
      challange: '',
      amountOfCompetitors: 0,
      attendees: [],
      remainingDays: 0,
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

    // get attendees names from API
    this.amountOfCompetitors = this.challange.competitors.length;
    const amountCompetitors = this.amountOfCompetitors;
    if (amountCompetitors > 0) {
      for (let i = 0; i < amountCompetitors; i++) {
        const routeURl =
          '/user/userinformation/' + this.challange.competitors[i];
        const response = await this.$axios.$get(routeURl, {
          headers: { 'auth-token': this.$store.state.session.authToken },
        });
        this.attendees.push(response.username);
      }
    }
    // get challangeFeed from API
    routeURl = '/challangeFeed/' + this.$route.params.id;
    response = await this.$axios.$get(routeURl, {
      headers: { 'auth-token': this.$store.state.session.authToken },
    });
    console.log('ilst of messages', response);

    // create div of past chatmessages
    for (let i = 0; i < response.length; i++) {
      routeURl = 'user/userinformation/' + response[i].user;
      const user = await this.$axios.$get(routeURl, {
        headers: { 'auth-token': this.$store.state.session.authToken },
      });
      const message = {
        // get challangeFeed from API
        username: user.username,
        time: response[i].date,
        text: response[i].message,
      };
      this.outputMessage(message);
    }

    this.calculateRemainingTime(this.challange.endDate);
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'home',
    });
    // Join Chatroom
    this.socket.emit('joinRoom', this.$store.state.session.username);

    /* Listen for events on socket: */
    this.socket.on('message', (msg, cb) => {
      console.log(msg);
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

      // Create Json for message

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

    getMessage() {
      this.socket.on('getMessage', { id: 'abc123' }, (resp) => {
        this.messageRxd = resp;
      });
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
  },
};
</script>
