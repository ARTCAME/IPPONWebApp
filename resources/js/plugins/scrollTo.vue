<script>
    export default {
        install (Vue, options) {
            /**
             * Function to smooth the scroll transition
             *
             * @param {String} anchor: The id of the element to scroll to it
             */
            Vue.prototype.$scrollTo = function(anchor) {
                document.querySelector(anchor).scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
</script>
