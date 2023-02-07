<script>
    export default {
        install (Vue, options) {
            /**
             * Change the text of an element
             *
             * @param {Array} id: The id of the elements to change
             */
            Vue.prototype.$changeText = function(id, newText, ms) {
                const elem = document.getElementById(id);
                const prevText = elem.innerText;
                elem.innerText = newText;
                setTimeout(() => {
                    elem.innerText = prevText;
                }, ms)
            }
        }
    }
</script>
