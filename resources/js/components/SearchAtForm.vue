<template>
    <div>
        <b-row
            class="mb-4"
            no-gutters>
            <ButtonIcon
                class="ml-auto"
                icon="search-plus"
                variant="ig-gradient2-reverse"
                :id="'sat-' + field + (contactIndex ? '-' + contactIndex : '')">
                Buscar socio
            </ButtonIcon>
        </b-row>
        <b-popover
            placement="left"
            :id="'sat-popover-search' + field + (contactIndex ? '-' + contactIndex : '')"
            :show.sync="searchActive"
            :target="'sat-' + field + (contactIndex ? '-' + contactIndex : '')"
            :title="null">
            <b-button-close
                @click="searchActive = false"></b-button-close>
            <SearchEngine
                :idDiscard="idDiscard"
                :onlyAdult="field == 'tutor'"
                @input="searchResult = $event"></SearchEngine>
            <TableResults
                :fields="tableFields"
                :items="searchResult"
                :pagination="7">
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
                        @click="chooseAction(row.row.item)">
                        <span class="text">Añadir {{ field }}</span>
                    </b-button>
                </template>
                <template
                    #col="fields">
                    <col
                        v-for="field in fields.fields"
                        :key="field.key"
                        :style="{ width: field.key == 'active' ? '40px' : field.key == 'actions' ? '150px' : 'auto' }">
                </template>
            </TableResults>
        </b-popover>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            searchActive: false, /* Flag to hide the popover */
            searchResult: null, /* The result of the search */
            tableFields: [
                { key: 'active', label: '', class: 'text-center'},
                { key: 'name', label: '', class: 'text-nowrap' },
                { key: 'actions', label: '', class: 'text-nowrap text-right' },
            ], /* Table fields to the search engine results table */
        }
    },
    computed: {
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
    },
    inject: [
        '$validator', /* Inject the main $validator from the parent */
    ],
    methods: {
        /**
         * Execute the emit to the parent and close the popover on select an element of the results provided
         *
         * @param {Object} customer: the customer data that has to be setted on the parent
         */
        chooseAction(customer) {
            this.$emit('chosen', customer);
            this.$root.$emit('bv::hide::popover', 'sat-popover-search' + this.field + (this.contactIndex ? '-' + this.contactIndex : ''));
            /* Reset the result of the previous search when an action was maded */
            this.searchResult = null;
        },
    },
    props: [
        'contactIndex', /* The index of the contact, is provided when the parent is a contact */
        'field', /* The field to use on the search to search on it */
    ],
}
</script>
<style scoped>
    button.close {
        position: absolute;
        right: 1rem;
        top: .2rem;
    }
    [id^=sat-popover-search] {
        min-width: 400px;
        padding-top: 1.75rem;
    }
</style>
