import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: ['data', 'options'],
  mounted() {
    this.renderChart(this.data, this.options);
  },
  watch: {
    data() {
      console.log('data changed');
      // eslint-disable-next-line no-underscore-dangle
      this.$data._chart.destroy();
      this.renderChart(this.data, this.options);
    },
    //   deep: true,
    // immediate: true,
  },
  /*
  methods: {
    render(newData) {
      console.log('moin');
      // eslint-disable-next-line no-underscore-dangle
      this.$data._chart.destroy();
      this.renderChart(newData, this.options);
    },
  },
  */
};
