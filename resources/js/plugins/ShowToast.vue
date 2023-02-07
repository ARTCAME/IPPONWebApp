<script>
    export default {
        install (Vue, options) {
            /**
             * Function to show a bootstrap toast globally
             *
             * @param {String} variant: The bootstrap variant for the toast
             * @param {String} text: The content of the toast
             * @param {String} title: Title of the toast
             * @param {Integer} delay: The duration on milisecons
             */
            Vue.prototype.$showToast = function(variant = 'default', text, title, delay) {
                this.$bvToast.toast(text, {
                    autoHideDelay: delay,
                    title: title,
                    toaster: 'b-toaster-bottom-center',
                    variant: variant,
                });
            }
        }
    }
</script>
