/**
 * Authentication middleware
 * Checks for valid auth state or token stored in cookie
 */

import cookie from 'js-cookie';

export default ({ store, $axios, redirect }) => {
  if (store.state.session.authenticated) {
    return;
  }

  const cookieToken = cookie.get('session');

  if (cookieToken) {
    store.commit('session/init', cookieToken);
    return;
  }

  return redirect('/signin');
};
