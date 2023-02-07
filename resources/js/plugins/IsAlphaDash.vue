<script>
    export default {
        install (Vue, options) {
            /**
             * Function to prevent type/copy symbols on alphabetical and dash field
             *
             * @param {Event} event: The typing event
             */
            Vue.prototype.$isAlphaDash = function(event) {
                event = (event) ? event : window.event;
                if (event.type == 'paste') {
                    event.preventDefault();
                    let input = event.clipboardData.getData('text');
                    input = input.replace(/[^A-Za-z-\s]/g, '');
                    return input;
                } else {
                    var charCode = (event.which) ? event.which : event.keyCode;
                    /* This condition only allow letters, spaces, quotes and spanish language letters  */
                    if ((charCode != 45 /* Dash */) && (charCode != 32 /* Space */) && (charCode != 219 /* quote */) && (charCode < 65 || charCode > 90 /* A-Z */) && (charCode < 97 || charCode > 122 /* a-z */) && (charCode < 192 || charCode > 214 /* À-Ö */) && (charCode < 216 || charCode > 246 /* Ø-ö */) && (charCode < 248 || charCode > 255 /* ø-ÿ */)) {
                        event.preventDefault();
                    } else {
                        return true;
                    }
                }
            }
        }
    }
</script>
