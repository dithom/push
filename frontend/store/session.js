/**
 * Session store
 * Stores all session relevant data
 */

import cookie from 'js-cookie';

export const state = () => ({
  authToken: null,
  userid: null,
  authenticated: false,
  username: null,
});

export const mutations = {
  init(state, payload) {
    state.authToken = payload.authToken;
    state.userid = payload.userid;
    state.authenticated = true;
    cookie.set('session', payload.authToken, { expires: 90 });
  },
  setUserName(state, username) {
    state.username = username;
  },
  destroy() {
    state.authToken = null;
    state.authenticated = false;
    cookie.remove('session');
    this.$router.push('/signin');
  },
};

export const getters = {
  getuserid: (state) => {
    return state.userid;
  },
};
