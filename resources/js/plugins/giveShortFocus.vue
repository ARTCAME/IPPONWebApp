<script>
    export default {
        install (Vue, options) {
            /**
             * Give a class to show focus on a specified element
             *
             * @param {Array} ids: The ids of the elements to focus
             */
            Vue.prototype.$giveShortFocus = function(ids) {
                ids.forEach(id => {
                    const list = document.getElementById(id).classList;
                    if (list.contains('short-focus')) {
                        setTimeout(() => {
                            document.getElementById(id).classList.remove('short-focus');
                        }, 1000);
                    } else {
                        list.add('short-focus');
                        setTimeout(() => {
                            document.getElementById(id).classList.remove('short-focus');
                        }, 1000);
                    }
                })
            }
        }
    }
</script>
