<template>
    <div>
        <transition appear name="blur-in">
            <span class="mb-3">
                <b-form-group
                    class="wrapper-for-badge"
                    description="Puedes buscar por el dato que quieras: nombre, dni, teléfono, etc."
                    size="lg">
                    <b-form-input
                        autocomplete="off"
                        autofocus
                        debounce="100"
                        id="search"
                        name="search"
                        type="search"
                        @input="search($event)">
                    </b-form-input>
                </b-form-group>
            </span>
        </transition>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters(['getCustomerByField', 'searchCustomer']),
        },
        methods: {
            /**
             * Provides the result of the search by the fields _id, name, address, dni, emails, phones on the customers state
             *
             * @return {Array} Array of objects with the items for the table results
             */
            search(search) {
                if (search != '') {
                    /* Discard the provided ids that are used at other places in the form */
                    let result = this.idDiscard && this.idDiscard.length > 0 ? this.searchCustomer(search).filter(customer => !this.idDiscard.includes(customer._id)) : this.searchCustomer(search);
                    /* Discard the under 18 customer of the results */

                    if (this.onlyAdult) {
                        result = result.filter(customer => this.$moment().diff(this.$moment(customer.dateofbirth, 'YYYY-MM-DD'), 'years') >= 18);
                    }
                    return this.$emit('input', result);
                }
                /* Emtpy array if no search has been inserted */
                return this.$emit('input', []);
            },
        },
        props: [
            'idDiscard', /* Array of Strings with the ids to discard because they are used on other entities at the same form */
            'onlyAdult', /* For search only adults customers (+18) useful to seek a tutors that must be +18 */
        ],
    }
</script>


