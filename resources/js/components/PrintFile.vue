<template>
    <div class="modal-asset-container">
        <transition appear mode="out-in" name="fade">
            <!-- Shown if no customer is selected -->
            <div
                key="pf-search-engine"
                v-if="!customer">
                <b-form-group class="mb-0">
                    <h5 class="subtitle subtitle-sub" md="4">Busca al socio y selecciónalo en la tabla</h5>
                </b-form-group>
                <SearchEngine
                    @input="searchResult = $event"></SearchEngine>
                <TableResults
                    :clicableRows="true"
                    :fields="searchFields"
                    :items="searchResult"
                    :pagination="15"
                    @row-clicked="selectCustomer(...arguments)">
                    <template
                        #actions="row">
                        <b-button
                            class="ig-small-btn"
                            size="sm"
                            variant="outline-primary"
                            @click="selectCustomer(row.row.item)">
                            <span class="text">Usar</span>
                        </b-button>
                    </template>
                    <template
                        #col="fields">
                        <col
                            v-for="field in fields.fields"
                            :key="field.key"
                            :style="{ width:  field.key == 'active' ? '60px' : field.key == 'dni' ? '110px' : field.key == 'customerNumber' ? '75px' : field.key == 'actions' ? '50px' : 'auto' }">
                    </template>
                </TableResults>
            </div>
            <!-- Shown when a customer has been selected -->
            <div
                key="pf-selected-data"
                v-else>
                <b-button
                    class="ig-modal-return-btn"
                    size="sm"
                    variant="outline-secondary"
                    @click="customer = null; paymentSelected = null; searchResult = null">
                    Volver
                </b-button>
                <b-form-group
                    class="mx-0"
                    label="Socio"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    label-for="print-name">
                    <span class="d-inline subtitle subtitle-sub" id="print-name">
                        {{ customer.name }}
                    </span>
                </b-form-group>
                <b-form-group
                    class="mx-0"
                    label="Tipo de documento"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    label-for="print-filetype">
                    <TransitionExpand>
                        <div
                            style="cursor: default"
                            v-if="fileType == null"
                            @click="$giveShortFocus(['print-filetype'])">
                            <b-alert
                                class="py-1"
                                show
                                variant="warning">
                                <fa-icon class="mr-1 text-info" icon="info-circle"></fa-icon>
                                Selecciona un tipo de documento para continuar
                            </b-alert>
                        </div>
                    </TransitionExpand>
                    <!-- When select a file type different to bill reset the payment data selected -->
                    <b-form-radio-group
                        buttons
                        button-variant="outline-secondary"
                        class="w-100"
                        id="print-filetype"
                        size="sm"
                        v-model="fileType"
                        @change="$event != 0 ? paymentSelected = null : ''">
                        <!-- 0: 'Recibo', 1: 'Consentimiento expreso', 2: 'Cesión de imagen' -->
                        <b-form-radio
                            v-for="(k, v) in fileOptions"
                            :disabled="k == 1 && (customer.rightsImage.RIaccept == false || customer.rightsImage.RIaccept == null) || k == 2 && (customer.rightsProtect.RPaccept == false || customer.rightsProtect.RPaccept == null)"
                            :key="v"
                            :value="v">
                            {{ k }}
                        </b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
                <TransitionExpand group>
                    <!-- Advise if the customer doesn't accept some of legal docs -->
                    <div
                        v-if="fileType == 1 && (customer.rightsProtect.RPaccept == false || customer.rightsProtect.RPaccept == null)"
                        :key="'file' + fileType">
                        <b-alert
                            class="py-1"
                            show
                            variant="warning">
                            <fa-icon class="mr-1 text-info" icon="info-circle"></fa-icon>
                            <span
                                v-if="customer.rightsProtect.RPaccept == false">El socio no ha dado su consentimiento expreso, no hay nada que descargar aquí</span>
                            <span
                                v-else>
                                El socio no ha confirmado o denegado su consentimiento expreso.
                                <b-link
                                    target="_blank"
                                    :to="{ name: 'customers.profile', params: { id: customer._id } }">
                                    Revisa la ficha del socio
                                    <fa-icon class="pl-1" icon="external-link-alt"></fa-icon>
                                </b-link>
                            </span>
                        </b-alert>
                    </div>
                    <!-- Advise if the customer doesn't accept some of legal docs -->
                    <div
                        v-else-if="fileType == 2 && (customer.rightsImage.RIaccept == false || customer.rightsImage.RIaccept == null)"
                        :key="'file' + fileType">
                        <b-alert
                            class="py-1"
                            show
                            variant="warning">
                            <fa-icon class="mr-1 text-info" icon="info-circle"></fa-icon>
                            <span
                                v-if="customer.rightsImage.RIaccept == false">El socio no nos ha cedido su imagen, no hay nada que descargar aquí</span>
                            <span
                                v-else>
                                El socio no ha confirmado o denegado si nos cede su imagen.
                                <b-link
                                    target="_blank"
                                    :to="{ name: 'customers.profile', params: { id: customer._id } }">
                                    Revisa la ficha del socio
                                    <fa-icon class="pl-1" icon="external-link-alt"></fa-icon>
                                </b-link>
                            </span>
                        </b-alert>
                    </div>
                    <!-- Advise if the customer doesn't has any confirmed payment -->
                    <div
                        v-else-if="fileType == 0 && paymentsConfirmed.length == 0"
                        :key="'file' + fileType">
                        <b-alert
                            class="py-1"
                            show
                            variant="warning">
                            <fa-icon class="mr-1 text-info" icon="info-circle"></fa-icon>
                            Este socio no tiene ningún pago confirmado, crea o confirma un pago para poder imprimir el recibo
                        </b-alert>
                    </div>
                </TransitionExpand>
                <!-- If a bill print has requested and exist a payment selected or for the rest of the file types shown the data summary -->
                <transition mode="out-in" name="fade">
                    <!-- Shown to search a payment of the selected customer to print its invoice, only shown when a bill is requested to print and the customer has confirmed payments -->
                    <div
                        key="pf-payment-search"
                        v-if="fileType == 0 && paymentsConfirmed.length > 0">
                        <h5 class="subtitle subtitle-sub" md="4">Busca y selecciona entre los pagos realizados</h5>
                        <b-card class="mb-4">
                            <Payments
                                :filters="['interval', 'type', 'paymenttype', 'creationdate', 'confirmationdate']"
                                :itemsPerPage="10"
                                :lite="true"
                                :parentItems="paymentsConfirmed"
                                :tableFields="tableFields">
                                <template
                                    #use="row">
                                    <b-button
                                        class="ig-modal-table-btn"
                                        size="sm"
                                        variant="outline-primary"
                                        @click="selectPayment(row.row.item)">
                                        Seleccionar
                                    </b-button>
                                </template>
                                <template
                                    #col="fields">
                                    <col
                                        v-for="field in fields.fields"
                                        :key="field.key"
                                        :style="{ width: field.key == 'use' ? '70px' : field.key == 'amount' || field.key == 'type' || field.key == 'interval' ? '70px' : field.key == 'paymenttype' ? '110px' : field.key == 'rate' ? '150px' : 'auto' }">
                                </template>

                            </Payments>
                        </b-card>
                        <transition name="fade">
                            <div
                                id="paymentdata-summary"
                                v-if="paymentSelected != null">
                                <h5 class="subtitle subtitle-sub" md="4">Resumen de datos</h5>
                                <GroupList
                                    :customer="customer"
                                    :fileType="fileType"
                                    :paymentData="paymentSelected"></GroupList>
                            </div>
                        </transition>
                        <b-row
                            key="pf-summary-data"
                            class="mx-1 mt-4"
                            no-gutters
                            v-if="fileType == 0 && paymentsConfirmed.length > 0 && paymentSelected != null">
                            <b-button
                                variant="outline-secondary"
                                v-b-modal.preview-downloading-file-modal>
                                Vista previa
                            </b-button>
                            <b-button
                                class="ml-auto mr-0"
                                variant="outline-success"
                                :disabled="downloading"
                                @click="downloadPdf()">
                                <b-spinner
                                    small
                                    type="grow"
                                    v-if="downloading == true"></b-spinner>
                                <fa-icon
                                    icon="file-download"
                                    v-else></fa-icon>
                                <span class="d-inline-block ml-2">
                                    Descargar documento
                                </span>
                            </b-button>
                        </b-row>
                    </div>
                    <div
                        key="pf-summary-data"
                        v-else-if="(fileType == 1 && (customer.rightsProtect.RPaccept != false && customer.rightsProtect.RPaccept != null)) || (fileType == 2 && (customer.rightsImage.RIaccept != false && customer.rightsImage.RIaccept != null))">
                        <h5 class="subtitle subtitle-sub" md="4">Resumen de datos</h5>
                        <GroupList
                            :customer="customer"
                            :fileType="fileType"
                            :paymentData="paymentSelected"></GroupList>
                        <TransitionExpand>
                            <!-- Advice the user that important customer data is missing, this miss doesn't disallow any action -->
                            <b-alert
                                class="mt-4 mx-1 py-1"
                                variant="warning"
                                v-if="(customer.sign == '' || customer.sign == null) || (underage && ((customer.tutor.name == '' || customer.tutor.name == null) || (customer.tutor.dni == '' || customer.tutor.dni == null)))"
                                show>
                                <fa-icon class="mr-1 text-danger" icon="exclamation-triangle"></fa-icon>
                                Falta información importante para generar el documento:
                                <ul class="mb-0">
                                    <li
                                        v-if="customer.sign == '' || customer.sign == null">No hay firma del {{ underage ? ' tutor' : ' socio' }}</li>
                                    <li
                                        v-if="underage && customer.tutor && (customer.tutor.name == '' || customer.tutor.name == null)">No hay nombre del tutor</li>
                                    <li
                                        v-if="underage && customer.tutor && (customer.tutor.dni == '' || customer.tutor.dni == null)">No hay firma del socio</li>
                                </ul>
                            </b-alert>
                        </TransitionExpand>
                        <b-row
                            key="pf-summary-data"
                            class="mx-1 mt-4"
                            no-gutters>
                            <b-button
                                variant="outline-secondary"
                                v-b-modal.preview-downloading-file-modal>
                                Vista previa
                            </b-button>
                            <b-button
                                class="ml-auto mr-0"
                                variant="outline-success"
                                :disabled="downloading"
                                @click="downloadPdf()">
                                <b-spinner
                                    small
                                    type="grow"
                                    v-if="downloading == true"></b-spinner>
                                <fa-icon
                                    icon="file-download"
                                    v-else></fa-icon>
                                <span class="d-inline-block ml-2">
                                    Descargar documento
                                </span>
                            </b-button>
                        </b-row>
                    </div>
                </transition>
                <!-- Modal to show the file preview -->
                <b-modal
                    centered
                    dialog-class="preview-downloading-file"
                    hide-footer
                    id="preview-downloading-file-modal">
                    <div class="printable-wrp-preview">
                        <div
                            class="pr-1 printable-ctn-preview"
                            v-if="customer != null && fileType != null">
                            <RightsProtect
                                v-if="fileType == 1 && ((underage == true && customer.tutor != null) || underage == false)"
                                :customer="customer"></RightsProtect>
                            <RightsImage
                                v-else-if="fileType == 2 && ((underage == true && customer.tutor != null) || underage == false)"
                                :customer="customer"></RightsImage>
                            <Bill
                                v-else-if="fileType == 0 && customer != null && paymentSelected != null"
                                :customer="customer"
                                :printItem="paymentSelected"></Bill>
                        </div>
                    </div>
                </b-modal>
            </div>
        </transition>
        <!-- Hided printable docs -->
        <div class="printable-wrp">
            <div
                class="pr-1 printable-ctn"
                ref="printable"
                v-if="customer != null && fileType != null">
                <RightsProtect
                    v-if="fileType == 1 && ((underage == true && customer.tutor != null) || underage == false)"
                    :customer="customer"></RightsProtect>
                <RightsImage
                    v-else-if="fileType == 2 && ((underage == true && customer.tutor != null) || underage == false)"
                    :customer="customer"></RightsImage>
                <Bill
                    v-else-if="fileType == 0 && customer != null && paymentSelected != null"
                    :customer="customer"
                    :printItem="paymentSelected"></Bill>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    export default {
        data() {
            return {
                customer: null, /* Stores the data of the customer selected */
                downloading: false, /* Userx flag to show */
                fileType: null, /* v-model for the selected filte type */
                fileOptions: {
                    0: 'Recibo',
                    1: 'Consentimiento expreso',
                    2: 'Cesión de imagen',
                },
                interval: null, /* v-model with the payment interval */
                paymentSelected: null, /* The payment select to print */
                searchFields: [
                    { key: 'active', label: 'Activo', sortable: true, class: 'text-center' },
                    { key: 'customerNumber', label: 'Nº Socio', sortable: true, class: 'text-center' },
                    { key: 'name', label: 'Socio', sortable: true, class: 'text-nowrap' },
                    { key: 'dni', label: 'DNI', sortable: true, class: 'text-center' },
                    { key: 'actions', label: '', sortable: true, },
                ], /* Table fields */
                searchResult: null, /* Is the result of a customer search */
                tableFields: [
                    { key: 'type', label: 'Tipo', },
                    { key: 'paymenttype', label: 'Forma de pago', },
                    { key: 'amount', label: 'Importe', },
                    { key: 'interval', label: 'Intervalo', },
                    { key: 'rate', label: 'Tarifa', },
                    { key: 'use', label: '', class: 'text-center', },
                ], /* Fields to the pending payments table */
            }
        },
        computed: {
            ...mapGetters(['getFilteredPaymentsById', 'getUnderage']),
            /**
             * Defines the name of the file to download
             *
             * @return {String} String formed by the current datetime, the file type and the customer name
             */
            filename() {
                return this.customer.name.replace(/\s/g, '-') + '__' + this.fileOptions[this.fileType].toLowerCase().replace(/\s/g, '') + '__' + this.$moment().format('YYYY-MM-DD_HH_mm') + '.pdf';
            },
            /**
             * Returns the pending payments for the current customer/type of payment
             */
            paymentsConfirmed() {
                /* The inactives (last param) always will be true instead of the status of the customer because we can print documents of an inactive customer */
                return this.getFilteredPaymentsById({ _id: this.customer._id, filterStatus: ['Confirmado'], filterType: ['manual', 'periodic'], inactives: true });
            },
            /**
             * Determines if the provided customer is underage checking to vuex customer data
             *
             * @return {Boolean} Boolean that indicates if the customer is or no underage
             */
            underage() {
                return this.getUnderage(this.customer._id);
            },
        },
        methods: {
            ...mapActions(['fetchCustomerImages']),
            /**
             * Calls to the child function wich creates a canvas to fill it with the to print screenshot data
             */
            downloadPdf() {
                NProgress.start();
                /* Active the flag to userx and disallow multiple clicks */
                this.downloading = true;
                this.$printDoc(this.filename, this.$refs.printable/* this.$refs.pdfPrinterRU.$refs.printable */)
                    .then(() => {
                        NProgress.set(0.8);
                        /* Restore the flag to userx and disallow multiple clicks */
                        setTimeout(() => {
                            NProgress.done();
                            this.downloading = false;
                        }, 300);
                    });
            },
            /**
             * Assigns the customer data selected on child
             *
             * @param {Object} customer: the customer data
             */
            async selectCustomer(customer) {
                /* Reset the type of document */
                this.fileType = null;
                NProgress.start();
                /* Fetch the customer sign via vuex */
                await this.fetchCustomerImages({ customer: customer, sign: true, image: false });
                NProgress.set(0.8);
                this.customer = Object.assign({}, customer);
                /* On the customer changes reset the paymentData selected */
                this.paymentSelected = null;
                NProgress.done();
            },
            /**
             * Store the payment selected
             *
             * @param {Object} The payment data to store
             */
            selectPayment(paymentData) {
                /* Store locally the payment selected */
                this.paymentSelected = Object.assign({}, paymentData);
                this.$nextTick(() => {
                    this.$scrollTo('#paymentdata-summary')
                });
            },
        },
    }
</script>
<style>
    /* Customizing the modal to be filled by its document content */
    #preview-downloading-file-modal.modal .modal-dialog.preview-downloading-file {
        max-width: unset;
    }
    #preview-downloading-file-modal.modal .modal-dialog.preview-downloading-file .modal-content {
        left: 50%;
        transform: translateX(-50%);
        width: auto!important;
    }
</style>
<style scoped>
    .ig-btn-close-second {
        cursor: pointer;
        font-size: 1.3rem;
        margin-top: 3.5px;
        right: 2rem;
    }
</style>
