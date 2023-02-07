<script>
    import BottomAlert from '../components/BottomAlert';
    export default {
        methods: {
            /**
             * Create and fill an alert element to add it to the DOM
             *
             * @param {String} content: then content for the element
             */
            addBottomAlert(content) {
                /* Create an instance of the component and add it the content */
                let CompClass = Vue.extend(BottomAlert);
                let instance = new CompClass({
                    propsData: { content: content }
                });
                /* Mount the component */
                instance.$mount()
                /* Append to the requester view (it's necessary to add the container ref on the requester) */
                let alert = this.$refs.container.querySelector('#ls-mutation-alert');
                alert ? alert = instance.$el : this.$refs.container.appendChild(instance.$el)
            }
        }
    }
</script>
