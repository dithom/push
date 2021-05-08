/**
 * Authentication middleware
 * Checks for valid auth state or token stored in cookie
 */

import cookie from 'js-cookie';

export default async ({ store, $axios, redirect }) => {
  if (store.state.session.authenticated) {
    return;
  }

  const cookieToken = cookie.get('session');

  if (cookieToken) {
    try {
      await $axios.$get('/auth', {
        headers: { 'auth-token': cookieToken },
      });

      store.commit('session/init', cookieToken);

      return;
    } catch (error) {
      return redirect('/signin');
    }
  }

  return redirect('/signin');
};
