/**
 * Session store
 * Stores all session relevant data
 */

import cookie from 'js-cookie';

export const state = () => ({
  authToken: null,
  authenticated: false,
});

export const mutations = {
  init(state, authToken) {
    state.authToken = authToken;
    state.authenticated = true;
    cookie.set('session', authToken, { expires: 90 });
  },
  destroy() {
    state.authToken = null;
    state.authenticated = false;
    cookie.remove('session');
    this.$router.push('/signin');
  },
};
