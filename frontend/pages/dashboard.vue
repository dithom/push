<!--
Dashboard
===
Initial page for signed in user. Shows general overview.
-->

<template>
  <div class="container">
    Dashboard
    <pre>{{ $store.state.session }}</pre>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
};
</script>
