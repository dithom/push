<!--
Index
===
Entrypoint used as redirect
-->

<script>
/**
 * Returns a authenticated response.
 * Method: GET
 */
export default {
  middleware: [
    'auth',
    ({ redirect }) => {
      redirect('/dashboard');
    },
  ],
};
</script>
