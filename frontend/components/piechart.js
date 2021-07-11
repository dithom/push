import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: ['data', 'options'],
  mounted() {
    this.renderChart(this.data, this.options);
  },
  watch: {
    // Rerender when data changes
    data() {
      console.log('data changed');
      // eslint-disable-next-line no-underscore-dangle
      this.$data._chart.destroy();
      this.renderChart(this.data, this.options);
    },
  },
};
