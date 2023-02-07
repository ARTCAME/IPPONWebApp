<script>
    import { Bar, mixins } from "vue-chartjs"; /* https://vue-chartjs.org/ */
    // import { ReactiveDataMixin } from 'vue-chartjs/types/mixins';
    const { reactiveProp } = mixins;
    Chart.defaults.global.defaultFontFamily = 'myriad';
    export default {
        extends: Bar,
        mixins: [reactiveProp],
        //   gradient: null,
        props: ['options'],
        mounted() {
            // this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(200, 0, 0, 0)
            // this.gradient.addColorStop(0, '#00100A')
            // this.gradient.addColorStop(0.5, '#008351');
            // this.gradient.addColorStop(1, '#9FD1BE');
            // this.chartData.datasets.forEach(dataset => dataset.backgroundColor = this.gradient );
            // this.renderChart({
            //     labels: this.chartData.labels,
            //     datasets: this.chartData.datasets,
            // }, this.options);
            this.renderChart(this.chartData,this.options)
        },
    }
</script>

