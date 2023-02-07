<script>
    export default {
        install (Vue, options) {
            /**
             * Function to prevent type/copy on numeric form fields
             *
             * @param {Event} event: The typing event
             */
            Vue.prototype.$isNumber = function(event) {
                event = (event) ? event : window.event;
                if (event.type == 'paste') {
                    event.preventDefault();
                    let input = event.clipboardData.getData('text');
                    // input = input.replace(new RegExp('[^0-9]', 'g'), '');
                    input = input.replace(/[^0-9]/g, '');
                    return input;
                } else {
                    var charCode = (event.which) ? event.which : event.keyCode;
                    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                        event.preventDefault();
                    } else {
                        return true;
                    }
                }
            }
            /**
             * Function to prevent type/copy on decimal form fields
             *
             * @param {Event} event: The typing event
             */
            Vue.prototype.$isNumberDecimal = function(event) {
                event = (event) ? event : window.event;
                if (event.type == 'paste') {
                    event.preventDefault();
                    let input = event.clipboardData.getData('text');
                    // input = input.replace(new RegExp('[^0-9,]', 'g'), '');
                    input = input.replace(/^\d{1,4}((\,|\.)\d{1,2})?$/g, '');
                    return input;
                } else {
                    var charCode = (event.which) ? event.which : event.keyCode;
                    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
                        event.preventDefault();
                    } else {
                        return true;
                    }
                }
            }
        }
    }
</script>
