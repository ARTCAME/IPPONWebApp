<template>
    <transition appear name="slide-fade">
        <!-- Shown when the search gives some result -->
        <div
            class="label-badge"
            v-if="searchResult.length > 0">
            <b-badge
                pill
                variant="success"
                :id="id">
                <AnimatedNum
                    :numFounded="searchResult.length">
                </AnimatedNum>
            </b-badge>
            <b-popover
                custom-class="p-0"
                placement="topleft"
                triggers="hover"
                :id="'sb-popover-' + field + (contactIndex ? '-' + contactIndex : '')"
                :target="id"
                :title="'Coinciden con el ' + field + ' introducido'">
                <TableResults
                    :fields="tableFields"
                    :items="searchResult"
                    :lite="true">
                    <template
                        #actions="row">
                        <b-link
                            class="btn btn-outline-secondary btn-sm ig-small-btn unformated-link"
                            target="_blank"
                            title="Consulta la ficha del socio en una ventana nueva"
                            v-b-tooltip.top.hover.noninteractive
                            :to="{ name: 'customers.profile', params: { id: row.row.item._id } }">
                            <span class="text text-secondary">Abrir</span>
                        </b-link>
                        <b-button
                            class="ig-small-btn"
                            size="sm"
                            variant="outline-primary"
                            v-if="contact || tutor"
                            @click="chooseAction(row.row.item)">
                            <span class="text">Añadir {{ tutor ? 'tutor' : 'contacto' }}</span>
                        </b-button>
                    </template>
                    <template
                        #col="fields">
                        <col
                            v-for="field in fields.fields"
                            :key="field.key"
                            :style="{ width: field.key == 'active' ? '40px' : field.key == 'actions' ? contact || tutor ? '150px' : '50px' : 'auto' }">
                    </template>
                </TableResults>
                <b-form-text class="text-center">
                    Solo se muestran los cinco primeros resultados
                </b-form-text>
            </b-popover>
        </div>
    </transition>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
    data() {
        return {
            tableFields: [
                { key: 'active', label: '', },
                { key: 'name', label: '', },
                { key: 'actions', label: '', class: 'text-nowrap text-right' },
            ], /* Table fields for the TableResults child */
        }
    },
    computed: {
        ...mapGetters(['getCustomerByField']),
        ...mapState({
            newCustomerForm: state => state.form,
            editCustomerForm: state => state.editform,
        }),
        /**
         * Defines the current form state (edit or new customer)
         *
         * @return {Object} The object with the form data from the customers state
         */
        form() {
            return this.$route.name == 'customers.new' ? this.newCustomerForm : this.editCustomerForm;
        },
        /**
         * Get an array of ids that no need to be searched because are used as the form customer, contact or tutor
         *
         * @return {Array} Array of strings with the ids used on the form
         */
        idDiscard() {
            let ids = [];
            /* If the form is fetched with an existing customer store his _id */
            if (this.form._id) {
                ids.push(this.form._id);
            }
            /* If exists some tutor on the form and is a customer too store his _id */
            if (this.form.tutor && this.form.tutor._id) {
                ids.push(this.form.tutor._id);
            }
            /* If exists any contact and any of their is customer too store his _id */
            if (this.form.contacts && this.form.contacts.length > 0) {
                this.form.contacts.forEach(contact => {
                    if (contact._id) {
                        ids.push(contact._id);
                    }
                });
            }
            return ids;
        },
        /**
         * Search at the store by the value on the name field and filter the result discarting the used customers on other entities. Used at the search badge
         *
         * @return {Array} Array of objects with the list of valid customers to use
         */
        searchResult() {
            let result = this.idDiscard && this.idDiscard.length > 0 ? this.getCustomerByField(this.searchField, this.searchValue).filter(customer => !this.idDiscard.includes(customer._id)) : this.getCustomerByField(this.searchField, this.searchValue);
            /* If the parent is a tutor search only the no underage customers */
            if (this.tutor == true) {
                return result.filter(customer => this.$moment().diff(this.$moment(customer.dateofbirth, 'YYYY-MM-DD'), 'years') >= 18);
            }
            return result;
        }
    },
    methods: {
        /**
         * Execute the emit to the parent and close the popover on select an element of the results provided
         *
         * @param {Object} customer: the customer data that has to be setted on the parent
         */
        async chooseAction(customer) {
            this.$emit('chosen', customer);
            this.$root.$emit('bv::hide::popover', 'sb-popover-' + this.field + (this.contactIndex ? '-' + this.contactIndex : ''));
        }
    },
    props: [
        'contact', /* Boolean to determine if the parent is a contact */
        'contactIndex', /* The index of the contact parent */
        'customer', /* Boolean to determine if the parent is a customer */
        'field', /* String with the name of the field in spanish to use on view messages */
        'id', /* The dynamic id created at the parent, necessary to styles on the popovers */
        'searchField', /* The field to use for search */
        'searchValue', /* The value to use on the search */
        'tutor', /* Boolean to determine if the parent is a tutor */
    ],
}
</script>
<style scoped>
    .label-badge {
        position: absolute;
        right: 1rem;
        top: 0;
    }
    .badge {
        cursor: pointer;
    }
    [id^=sb-popover] {
        min-width: 400px;
    }
</style>



