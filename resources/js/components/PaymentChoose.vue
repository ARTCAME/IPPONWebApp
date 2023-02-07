<template>
    <div>
        <b-modal
            centered
            id="previous-pending-modal"
            no-close-on-backdrop
            no-close-on-esc
            size="lg">
            <template #modal-header>
                <h5>Revisa los pagos pendientes</h5>
                <b-button
                    id="previous-payment-return-btn"
                    size="sm"
                    variant="outline-secondary"
                    v-if="selected == true && !loading"
                    @click="selected = false">
                    Volver
                </b-button>
            </template>
            <transition appear mode="out-in" name="fade">
                <!-- Previous payments selector -->
                <!-- Shown when the custmer has any previous pending payment and he hasn't selected one -->
                <b-form-group
                    class="my-2"
                    key="previous-pending-table"
                    v-if="!selected">
                    <b-alert
                        class="py-1"
                        variant="warning"
                        :show="true">
                        <fa-icon class="mr-2 text-danger" icon="exclamation-triangle"></fa-icon>
                        {{ customer.name }} tiene pagos pendientes, revisa si alguno de ellos es el que quieres gestionar
                    </b-alert>
                    <b-card>
                        <TableResults
                            sortBy="interval"
                            :fields="tableFields"
                            :items="previousPending"
                            :pagination="7">
                            <template
                                #actions="row">
                                <b-button
                                    class="ig-small-btn"
                                    size="sm"
                                    variant="outline-primary"
                                    @click="previousPendingSelected(row.row.item);">
                                    <span class="text">Seleccionar</span>
                                </b-button>
                            </template>
                            <template
                                #col="tableFields">
                                <col
                                    v-for="field in tableFields.fields"
                                    :key="field.key"
                                    :style="{ width: field.key == 'actions' || field.key == 'amount' || field.key == 'type' || field.key == 'interval' ? '70px' : field.key == 'paymenttype' ? '110px' : field.key == 'rate' ? '150px' : 'auto' }">
                            </template>
                        </TableResults>
                    </b-card>
                </b-form-group>
                <b-skeleton-wrapper
                    v-else-if="selected && loading"
                    :loading="loading">
                <!-- Loading skeleton -->
                    <template
                        #loading>
                            <b-row align-h="end" class="mb-3 mx-1" no-gutters>
                                <b-col class="col-auto mb-1">
                                    <b-skeleton height="39.75px" type="input" width="200px"></b-skeleton>
                                </b-col>
                                <b-col class="col-auto mb-1 ml-2">
                                    <b-skeleton height="39.75px" type="input" width="200px"></b-skeleton>
                                </b-col>
                            </b-row>
                            <div id="previous-pending-skeleton">
                                <div class="mx-1">
                                    <b-skeleton-img
                                        no-aspect
                                        width="100%"
                                        :height="localItem.paymenttype == 'Domiciliación' ? '311px' : '277px'"></b-skeleton-img>
                                </div>
                            </div>
                    </template>
                </b-skeleton-wrapper>
                <!-- Previous payment actions chooser -->
                <!-- Shown when the customer has previous pending payments and one of they has been selected -->
                <div
                    key="previous-pending-list"
                    v-else-if="selected && !loading">
                    <b-row align-h="end" class="mb-3 mx-1" no-gutters>
                        <b-col class="col-auto mb-1">
                            <ButtonIcon
                                class="px-2 w-100"
                                icon="edit"
                                variant="outline-secondary"
                                :disabled="print || saving || returning"
                                @click="localToEdit()">
                                Editar el pago
                            </ButtonIcon>
                        </b-col>
                        <b-col class="col-auto mb-1 ml-2">
                            <ButtonIcon
                                class="px-2 w-100"
                                icon="save"
                                variant="outline-warning"
                                v-if="localItem.paymenttype == 'Domiciliación'"
                                :disabled="print || saving || returning"
                                :spin="returning"
                                @click="localConfirm(false, true)">
                                Marcar como devuelto
                            </ButtonIcon>
                        </b-col>
                        <b-col class="col-auto mb-1 ml-2">
                            <ButtonIcon
                                class="px-2 w-100"
                                icon="save"
                                variant="outline-primary"
                                :disabled="print || saving || returning"
                                :spin="saving"
                                @click="localConfirm(false)">
                                Marcar como pagado
                            </ButtonIcon>
                        </b-col>
                        <b-col class="col-auto mb-1 ml-2">
                            <ButtonIcon
                                class="px-2 w-100"
                                icon="file-download"
                                variant="outline-success"
                                :disabled="print || saving || returning"
                                :spin="print"
                                @click="localConfirm(true)">
                                Marcar como pagado y descargar recibo
                            </ButtonIcon>
                        </b-col>
                    </b-row>
                    <GroupList
                        :customer="customer"
                        :fileType="0"
                        :paymentData="localItem"></GroupList>
                    <!-- Hided printable bill -->
                    <div class="printable-wrp">
                        <div class="pr-1 printable-ctn" ref="printablePC">
                            <Bill
                                :customer="customer"
                                :printItem="localItem"></Bill>
                        </div>
                    </div>
                </div>
            </transition>
            <template
                #modal-footer="{ ok }">
                <b-button
                    class="ml-2 mr-auto"
                    variant="outline-dark"
                    :disabled="print || saving || returning"
                    @click="ok(); editConfirmed = true;">
                    Omitir y gestionar nuevo pago
                </b-button>
                <b-button
                    class="ml-auto mr-2"
                    variant="outline-danger"
                    :disabled="print || saving || returning"
                    @click="returnToSearch()">
                    Salir
                </b-button>
            </template>
        </b-modal>
        <PaymentForm
            v-if="(previousPending.length > 0 && editConfirmed) || previousPending.length == 0"
            :toEditItem="editingItem"
            @cancel="$bvModal.hide('payments-nav-modal')"
            @delete="$bvModal.hide('payments-nav-modal')"
            @successSaved="$bvModal.hide('payments-nav-modal')">
        </PaymentForm>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    export default {
        data() {
            return {
                fields: ['_id', 'name', 'payment_id', 'status', 'type', 'amount', 'dateconfirmed', 'iban', 'ibanownerdni', 'ibanownername', 'interval', 'paymenttype', 'rate'],
                listFields: {
                    name: 'NOMBRE',
                    dni: 'DNI', /* On underages must check the dni of the customer and the tutor to show the apropiate*/
                    rate: 'TARIFA',
                    amount: 'IMPORTE',
                    paymenttype: 'FORMA DE PAGO',
                    interval: 'PERIODO DE PAGO',
                    iban: 'IBAN',
                    sign: 'FIRMA',
                }, /* Fields to list the payment to confirm */
                loading: false, /* Flag for the loading state */
                localItem: {}, /* Will store the data of a editing payment before the user chooses whether edit it or not */
                editingItem: {}, /* Will store the data of a editing payment that the user choose to edit */
                editConfirmed: false, /* Determine if a edit will be made */
                print: false, /* Flag to determine if a print of a doument is in process */
                returning: false, /* Flag to determine if a saving process is actived */
                saving: false, /* Flag to determine if a saving process is actived */
                selected: false, /* Flag to determine if a previous pending payment was selected */
                tableFields: [
                    { key: 'type', label: 'Tipo', },
                    { key: 'paymenttype', label: 'Forma de pago', },
                    { key: 'amount', label: 'Importe', },
                    { key: 'interval', label: 'Intervalo', sortable: true, },
                    { key: 'rate', label: 'Tarifa', },
                    { key: 'actions', label: '', },
                ], /* Fields to the pending payments table */
            }
        },
        computed: {
            ...mapGetters(['getCustomerById', 'getFilteredPaymentsById']),
            /**
             * To react as expect, search the customer _id passed as prop (we can receive the customer via prop from the parent PaymentsEverywhere (there we obtain the entire customer) but with this steps we loose the reactivity when a customer is edited on his profile page)
             *
             * @return {Object} Object with the customer data
             */
            customer() {
                return this.getCustomerById(this._id);
            },
            /**
             * Returns the pending payments for the current customer/type of payment
             */
            previousPending() {
                return this.getFilteredPaymentsById({ _id: this._id, filterStatus: ['Pendiente'], filterType: ['manual', 'periodic'] });
            },
        },
        methods: {
            ...mapActions(['addPayment', 'fetchCustomerImages', 'updatePaymentData']),
            /**
             * Function partially equal than the declared at the child PaymentForm but only with the functionalities to save confirmed payments
             */
            async localConfirm(print, returned = null) {
                /* Set the confirmation data */
                this.localItem.status = returned === true ? 'Devuelto' : 'Confirmado';
                this.localItem.dateconfirmed = this.$moment().format('DD-MM-YYYY HH:mm:ss');
                /* Activate the flag to improve the buttons UX */
                if (!print) {
                    returned === true ? this.returning = true : this.saving = true;
                } else {
                    this.print = true;
                }
                /* Will be done at the parent */
                NProgress.start();
                /* Update the payment on the db via vuex, the updating action will set the current date on laravel */
                this.updatePaymentData({ items: new Array(this.localItem), action: 'updating' })
                    .then(async () => {
                        NProgress.set(0.8);
                        /* Show feedback to the user */
                        await this.$bvModal.msgBoxOk('Pago actualizado correctamente' + (print ? '. El recibo se descargará automáticamente' : ''), {
                            buttonSize: 'sm',
                            centered: true,
                            okTitle: 'Aceptar',
                            size: 'sm',
                        });
                        if (print) {
                            /* The bill child must need this update to reload the print data setted on this function */
                            await this.$forceUpdate();
                            /* Call the plugin to capture and download the component document */
                            const filename = this.customer.name.replace(/\s/g, '-') + '__recibo__' + this.$moment().format('YYYY-MM-DD_HH_mm') + '.pdf';
                            NProgress.set(0.5);
                            await this.$printDoc(filename, this.$refs.printablePC);
                        }
                        NProgress.done();
                        this.returnToSearch();
                        /* Trigger a modification on the localStorage to propagate the changes on other windows. Unlike the add payment process, during the update is not propagated on vuex to avoid massive repetitions on mass customers updates */
                        localStorage.setItem('customer_updated', this.localItem._id);
                        localStorage.removeItem('customer_updated');
                    })
                    .catch(async error => {
                        /* Show feedback to the user */
                        await this.$bvModal.msgBoxOk('No se ha podido completar la operación. Código de error: FEPaCh@LoCo', {
                            buttonSize: 'sm',
                            centered: true,
                            okTitle: 'Aceptar',
                            okVariant: 'danger',
                            size: 'sm',
                            title: 'ERROR',
                        });
                        NProgress.done();
                        console.error(error.response ? error.response.data : error);
                        this.returnToSearch();
                    });
            },
            /**
             * Sets the editing payment object fields based on the previous payment data that wants to be edited
             */
            localToEdit() {
                /* Assign to the editing payment object the data of the previous payment selected */
                Object.keys(this.editingItem).forEach(async field => {
                    /* Reset the value and add the new one if exists */
                    await this.$set(this.editingItem, field, '');
                    await this.$set(this.editingItem, field, this.localItem[field]);
                });
                this.editConfirmed = true;
                /* Hide the modal to show the edit form */
                this.$bvModal.hide('previous-pending-modal');
            },
            /**
             * Sets the local payment object based on the previous payment data, this object is used locally to confirm its data and then the user chooses if wants to edit or confirm it
             */
            async previousPendingSelected(row) {
                /* Change the flag to move to the next step */
                this.selected = true;
                this.loading = true;
                /* Assign to the object the new data */
                this.fields.forEach(async field => {
                    /* Reset the value and add the new one if exists */
                    await this.$set(this.localItem, field, '');
                    await this.$set(this.localItem, field, row[field]);
                });
                NProgress.set(0.5);
                /* Fetch the customer sign via vuex to allow print it */
                await this.fetchCustomerImages({ customer: this.customer, sign: true });
                NProgress.done();
                this.loading = false;
            },
            /**
             * Returns to the first step of this utility: the search of the customers
             */
            returnToSearch() {
                this.$emit('returnToSearch');
                this.$bvModal.hide('previous-pending-modal');
                this.editingItem = {};
                this.localItem = {};
                this.loading = false;
                this.editConfirmed = false;
                this.print = false;
                this.returning = false;
                this.saving = false;
                this.selected = false;
            },
            /**
             * Set the initial default values to the new payment item based on the customer fields value.
             */
            setEditableFields(customer) {
                this.fields.forEach(field =>  this.$set(this.editingItem, field, ''));
                ['iban', 'ibanownername', 'ibanownerdni', 'paymenttype'].forEach(field => {
                    if (customer.paymentData[field]) this.$set(this.editingItem, field, customer.paymentData[field])
                });
                ['name', '_id'].forEach(field => this.$set(this.editingItem, field, customer[field]));
            },
        },
        mounted() {
            /* If there are some previous pending payments, advise to the user */
            if (this.previousPending.length > 0) {
                this.$bvModal.show('previous-pending-modal');
            }
        },
        props: [
            '_id'
        ],
        watch: {
            _id: {
                immediate: true,
                handler: function (newVal, oldVal) {
                    /* Set the fields data for the new payment */
                    this.setEditableFields(this.customer);
                }
            }
        },
    }
</script>
<style>
    @media screen and (max-width: 992px) {
        #previous-pending-modal.modal .modal-dialog {
            max-width: 90%!important;
            min-width: 90%!important;
            width: 90%!important;
        }
    }
</style>
<style scoped>
    #previous-payment-return-btn {
        line-height: 10px;
        height: 22px;
        position: absolute;
        right: 2.3rem;
        top: 1.3rem;
    }
</style>
