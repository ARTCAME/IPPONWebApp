<script>
    export default {
        install (Vue, options) {
            /**
             * Generates a 2 color to right random gradient
             *
             * @param {Object} element: The element to gradient
             */
            Vue.prototype.$randomGradient = function(element) {
                /* Define a gradient not white and black */
                element.style.background = " linear-gradient(to right, " + '#' + (Math.random()*0xFFFFFF<<0).toString(16) + " " + Math.floor(Math.random() * 25) + "%, " + '#' + (Math.random()*0xFFFFFF<<0).toString(16) +  " " + (Math.floor(Math.random() * 100) + 50) + "%)";
                element.style.webkitBackgroundClip = "text";
                element.style.backgroundClip = "text";
                element.style.webkitTextFillColor = "transparent";
            }
        }
    }
</script>
