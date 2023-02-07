<template>
    <div class="modal-asset-container">
        <b-form-group class="mb-0">
            <h5 class="subtitle subtitle-sub">Busca al socio</h5>
        </b-form-group>
        <SearchEngine
            @input="searchResult = $event"></SearchEngine>
        <TableResults
            :clicableRows="true"
            :fields="tableFields"
            :items="searchResult"
            :pagination="15"
            @row-clicked="selected(...arguments)">
            <template
                #actions="row">
                <b-button
                    class="ig-small-btn"
                    size="sm"
                    variant="outline-primary"
                    @click="selected(row.row.item)">
                    <span class="text">Ir a la ficha</span>
                </b-button>
            </template>
            <template
                #col="fields">
                <col
                    v-for="field in fields.fields"
                    :key="field.key"
                    :style="{ width:  field.key == 'active' ? '60px' : field.key == 'dni' ? '110px' : field.key == 'customerNumber' ? '75px' : field.key == 'actions' ? '100px' : 'auto' }">
            </template>
        </TableResults>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                searchResult: null, /* The result of the search */
                tableFields: [
                    { key: 'active', label: 'Activo', sortable: true, class: 'text-center' },
                    { key: 'customerNumber', label: 'Nº Socio', sortable: true, class: 'text-center' },
                    { key: 'name', label: 'Socio', sortable: true, class: 'text-nowrap'},
                    { key: 'phones', label: 'Teléfonos', sortable: true, },
                    { key: 'dni', label: 'DNI', sortable: true, class: 'text-center' },
                    { key: 'actions', label: '', class: 'text-center' },
                ], /* Table fields to the search engine results table */
            }
        },
        methods: {
            /**
             * Manage the selection of a customer on the search results, to prevent lose data from the current page
             *
             * @param {Object} customer: the customer requested to view
             */
            selected(customer) {
                if (customer) {
                    /* Go to the customer's page if we are not on it */
                    if (this.$route.path == ('/socio/' + customer._id) || this.$route.path == ('/socio/' + customer._id + '/editar')) {
                        this.$showToast('warning', 'Ya estás en el socio que quieres consultar', 'Aviso', 5000);
                    } else if (this.$route.name == 'customers.edit') {
                        /* Hide the search modal */
                        this.$bvModal.hide('search-nav-modal')
                        return this.$router.push({ path: '/socio/' + customer._id });
                    } else {
                        this.$router.push({ path: '/socio/' + customer._id });
                        /* Hide the search modal */
                        this.$bvModal.hide('search-nav-modal');
                    }
                }
            }
        }
    }
</script>
