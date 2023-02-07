<template>
    <div>
        <b-alert
            class="py-1"
            show
            variant="info">
            {{ !toEditItem.payment_id ? 'Estás creando un pago nuevo' : 'Estás editando un pago' }}
        </b-alert>
        <b-form-group
            class="mx-0"
            label="Socio"
            label-class="m-0 p-0 subtitle subtitle-sub"
            label-cols="4"
            label-for="edit-name">
            <span class="d-inline subtitle subtitle-sub" id="edit-name">
                {{ editingItem.name }}
            </span>
        </b-form-group>
        <b-form-group
            class="mx-0 pb-2"
            label="Tipo de pago"
            label-class="m-0 p-0 subtitle subtitle-sub"
            label-cols="4"
            label-for="edit-type">
            <TransitionExpand>
                <div
                    style="cursor: default"
                    v-if="editingItem.type == ''"
                    @click="$giveShortFocus(['edit-type'])">
                    <b-alert
                        class="py-1"
                        variant="warning"
                        :show="editingItem.type == ''">
                        <fa-icon class="mr-1 text-info" icon="info-circle"></fa-icon>
                        Selecciona un tipo de pago para continuar
                    </b-alert>
                </div>
            </TransitionExpand>
            <b-form-radio-group
                buttons
                button-variant="outline-secondary"
                class="w-100"
                id="edit-type"
                size="sm"
                v-model="editingItem.type">
                <b-form-radio
                    v-for="type in [{ value: 'periodic', text: 'Cuota periódica' }, { value: 'manual', text: 'Pago manual' }]"
                    :key="type.value"
                    :value="type.value"
                    @change="propagateTypeChanges($event)">
                    {{ type.text }}
                </b-form-radio>
            </b-form-radio-group>
        </b-form-group>
        <transition name="fade">
            <!-- The editingItem.type will be provided always on a payment edition and selected on a payment creation -->
            <div
                style="overflow: visible"
                key="form-edit"
                v-if="editingItem.type != ''">
                <b-form-group
                    class="mx-0 pb-2"
                    label="Tarifa"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    :label-for="'edit-rate-' + (editingItem.type == 'periodic' ? 'periodic' : 'manual')">
                    <div
                        key="edit-rate-periodic"
                        v-show="editingItem.type == 'periodic'">
                        <b-form-radio-group
                            buttons
                            id="edit-rate-periodic"
                            name="edit-rate-periodic"
                            size="sm"
                            v-model="editingItem.rate"
                            v-validate="'required'"
                            :class="'flex-wrap radiocheckgroup-spaced radio-selector sm-radio-group' + (errors.has('edit-rate') ? ' is-invalid' : '')"
                            @change="propagateAmountChanges($event)">
                            <b-form-radio
                                v-b-tooltip.hover.noninteractive
                                v-for="(v, k) in rates"
                                :button-variant="k == customer.paymentData.rate ? 'outline-dark' : 'outline-secondary'"
                                :key="k"
                                :title="k == customer.paymentData.rate ? 'Esta es la tarifa habitual del socio' + (v != '' ? ': ' + v + '€' : '') : (v != '' ? v + '€' : '')"
                                :value="k">
                                {{ k }}
                            </b-form-radio>
                        </b-form-radio-group>
                        <transition mode="in-out" name="liveFeedbacks">
                            <b-form-invalid-feedback>
                                {{ errors.first('edit-rate-periodic') }}
                            </b-form-invalid-feedback>
                        </transition>
                    </div>
                    <div
                        key="edit-rate-manual"
                        v-show="editingItem.type == 'manual'">
                        <small
                            class="label-input-length mr-3 text-muted"
                            v-if="editingItem.rate">
                            {{ (editingItem.rate ? editingItem.rate.length : '0') + '/20' }}
                        </small>
                        <b-form-input
                            id="edit-rate-manual"
                            maxlength="20"
                            name="edit-rate-manual"
                            placeholder="Escribe un concepto"
                            size="sm"
                            v-model="editingItem.rate"
                            v-validate.initial="'required'"
                            :class="{ 'is-invalid' : errors.has('edit-rate-manual') }"></b-form-input>
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-form-invalid-feedback
                                v-for="error in errors.collect('edit-rate-manual')"
                                :key="error">
                                {{ error }}
                            </b-form-invalid-feedback>
                        </transition>
                    </div>
                </b-form-group>
                <b-form-group
                    class="mx-0 pb-2"
                    label="Importe"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    label-for="edit-amount">
                    <b-form-input
                        id="edit-amount"
                        min="0"
                        name="edit-amount"
                        placeholder="Indica un importe"
                        size="sm"
                        step="0.01"
                        type="number"
                        v-model="editingItem.amount"
                        v-validate.initial="'required|decimal|between:0.1,9999.99'"
                        :class="{ 'is-invalid' : errors.has('edit-amount') }"
                        :disabled="editingItem.rate != '' && editingItem.type != 'manual' && (editingItem.rate != 'Personalizada + Karate' && editingItem.rate != 'Personalizada + GYM')"
                        @drop.prevent
                        @keypress="$isNumberDecimal($event)"
                        @paste="editingItem.amount = $isNumberDecimal($event)"></b-form-input>
                    <transition mode="out-in" name="liveFeedbacks">
                        <b-form-invalid-feedback
                            v-for="error in errors.collect('edit-amount')"
                            :key="error">
                            {{ error }}
                        </b-form-invalid-feedback>
                    </transition>
                </b-form-group>
                <b-form-group
                    class="mx-0 pb-2"
                    label="Estado"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    label-for="edit-status">
                    <b-form-radio-group
                        buttons
                        button-variant="outline-secondary"
                        id="edit-status"
                        name="edit-status"
                        size="sm"
                        v-model="editingItem.status"
                        v-validate="'required'"
                        :class="'radio-selector sm-radio-group w-100' + (errors.has('edit-status') ? ' is-invalid' : '')"
                        :options="states"
                        @change.capture="propagateStatusChanges($event)"></b-form-radio-group>
                    <transition mode="in-out" name="liveFeedbacks">
                        <b-form-invalid-feedback>
                            {{ errors.first('edit-status') }}
                        </b-form-invalid-feedback>
                    </transition>
                </b-form-group>
                <b-form-group
                    class="mb-2 mx-0"
                    label="Periodo de pago"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    label-for="edit-interval">
                    <TransitionExpand>
                        <b-row
                            class="mx-0 mb-2"
                            no-gutters
                            v-if="(editingItem.interval == '') && (editingItem.type == 'manual' || editingItem.type == 'periodic')">
                            <b-col>
                                <div
                                    style="cursor: default"
                                    @click="$giveShortFocus(['interval-year', 'alteryear', 'month-dropdown'])">
                                    <TransitionExpand group>
                                        <div
                                            key="trans-interval-unselected"
                                            v-if="editingItem.type == 'periodic' && intervalUnselected">
                                            <b-alert
                                                class="mb-1 py-1"
                                                show
                                                variant="danger">
                                                <fa-icon class="mr-1 text-danger" icon="info-circle"></fa-icon>
                                                El intervalo se ha borrado al existir un pago confirmado para el mismo periodo
                                            </b-alert>
                                        </div>
                                        <div
                                            key="trans-interval-notrequired"
                                            v-else-if="!(editingItem.interval == '') && editingItem.type == 'manual'">
                                            <b-alert
                                                class="mb-1 py-1"
                                                show
                                                variant="warning">
                                                <fa-icon class="mr-1 text-info" icon="info-circle"></fa-icon>
                                                Si el pago está vinculado a un periodo de tiempo indícalo
                                            </b-alert>
                                        </div>
                                        <div
                                            key="trans-interval-required"
                                            v-else-if="(editingItem.interval == '') && editingItem.type == 'periodic'">
                                            <b-alert
                                                class="mb-1 py-1"
                                                show
                                                variant="warning">
                                                <fa-icon class="mr-1 text-danger" icon="exclamation-triangle"></fa-icon>
                                                Selecciona un periodo de pago
                                            </b-alert>
                                        </div>
                                    </TransitionExpand>
                                </div>
                            </b-col>
                        </b-row>
                    </TransitionExpand>
                    <IntervalSelector
                        id="edit-interval"
                        ref="edit-payment-interval"
                        :confirmed="editingItem.type != 'manual' && (editingItem.status == 'Confirmado' || editingItem.status == 'Devuelto')"
                        :customer="customer"
                        :manual="editingItem.type == 'manual'"
                        :parentInterval="editingItem.interval"
                        :paymentId="editingItem.payment_id"
                        @input="$set(editingItem, 'interval', $event)"
                        @unselected="intervalInvalid()"></IntervalSelector>
                </b-form-group>
                <b-form-group
                    class="mx-0 pb-2"
                    label="Fecha de confirmación"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    label-for="edit-dateconfirmed">
                    <!-- The dateconfirmed values will change when changes the state selected -->
                    <TransitionExpand group mode="out-in">
                        <div
                            style="cursor: default"
                            key="trans-datepicker-delete"
                            v-if="!editingItem.status"
                            @click="$giveShortFocus(['edit-status'])">
                            <b-alert
                                class="mb-0 py-1"
                                variant="warning"
                                :show="true">
                                <fa-icon class="mr-1 text-danger" icon="exclamation-triangle"></fa-icon>
                                Indica un estado
                            </b-alert>
                        </div>
                        <div
                            key="trans-datepicker-pendiente"
                            v-else-if="editingItem.status == 'Pendiente'">
                            <b-alert
                                class="mb-0 py-1"
                                variant="warning"
                                :show="true">
                                <fa-icon class="mr-1 text-info" icon="info-circle"></fa-icon>
                                Un pago con el estado pendiente no necesita/tiene fecha de confirmación
                            </b-alert>
                        </div>
                        <!-- It will be shown when the row is showing its details and when the payment status is not 'Pendiente' -->
                        <div
                            key="trans-datepicker-input"
                            v-else-if="editingItem.status == 'Confirmado' || editingItem.status == 'Devuelto'">
                            <div>
                                <!-- Because it is dynamic rendered this input cannot be vee-validated and its validation simulated via conditions -->
                                <b-form-input
                                    class="pl-0"
                                    id="edit-dateconfirmed"
                                    name="edit-dateconfirmed"
                                    size="sm"
                                    type="datetime-local"
                                    v-validate="'required'"
                                    :class="(editingItem.dateconfirmed == null || editingItem.dateconfirmed == '') ? 'is-invalid' : ''"
                                    :value="(editingItem.dateconfirmed != null && editingItem.dateconfirmed != '') ? $moment(editingItem.dateconfirmed, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm') : $moment().format('YYYY-MM-DDTHH:mm')"
                                    @input="editingItem.dateconfirmed = $moment($event, 'YYYY-MM-DDTHH:mm', true).isValid() ? $moment($event, 'YYYY-MM-DDTHH:mm', true).format('DD-MM-YYYY HH:mm:ss') : null"></b-form-input>
                                <transition mode="out-in" name="liveFeedbacks">
                                    <b-form-invalid-feedback
                                        v-if="(editingItem.dateconfirmed == null || editingItem.dateconfirmed == '')">
                                        Campo obligatorio
                                    </b-form-invalid-feedback>
                                </transition>
                            </div>
                        </div>
                    </TransitionExpand>
                </b-form-group>
                <b-form-group
                    class="mx-0 pb-2"
                    label="Forma de pago"
                    label-class="m-0 p-0 subtitle subtitle-sub"
                    label-cols="4"
                    label-for="edit-paymenttype">
                    <b-form-radio-group
                        buttons
                        id="edit-paymenttype"
                        name="edit-paymenttype"
                        size="sm"
                        v-model="editingItem.paymenttype"
                        v-validate="'required'"
                        :class="'radio-selector sm-radio-group w-100' + (errors.has('edit-paymenttype') ? ' is-invalid' : '')">
                        <b-form-radio
                            v-b-tooltip.hover.noninteractive
                            v-for="paymenttype in ['Domiciliación', 'Tarjeta', 'Efectivo']"
                            :button-variant="paymenttype == customer.paymentData.paymenttype ? 'outline-dark' : 'outline-secondary'"
                            :id="paymenttype"
                            :key="paymenttype"
                            :title="paymenttype == customer.paymentData.paymenttype ? 'Esta es la forma de pago habitual del socio' : ''"
                            :value="paymenttype">
                            {{ paymenttype }}
                        </b-form-radio>
                    </b-form-radio-group>
                    <transition mode="in-out" name="liveFeedbacks">
                        <b-form-invalid-feedback>
                            {{ errors.first('edit-paymenttype') }}
                        </b-form-invalid-feedback>
                    </transition>
                </b-form-group>
                <TransitionExpand>
                    <div
                        v-if="editingItem.paymenttype == 'Domiciliación'">
                        <b-form-row class="mb-4">
                            <b-col cols="6" md="4">
                                <b-form-group
                                    class="mb-0"
                                    label="IBAN"
                                    label-for="edit-iban">
                                    <b-form-input
                                        id="edit-iban"
                                        name="edit-iban"
                                        placeholder="ES00 0000 0000 0000 0000"
                                        size="sm"
                                        v-model="editingItem.iban"
                                        v-validate="'required|iban'"
                                        :class="{ 'is-invalid' : errors.has('edit-iban') }"></b-form-input>
                                    <transition mode="out-in" name="liveFeedbacks">
                                        <b-form-invalid-feedback
                                            v-for="error in errors.collect('edit-iban')"
                                            :key="error">
                                            {{ error }}
                                        </b-form-invalid-feedback>
                                    </transition>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6" md="4">
                                <b-form-group
                                    class="mb-0"
                                    label="Titular de la cuenta"
                                    label-for="edit-ibanownername">
                                    <b-form-input
                                        id="edit-ibanownername"
                                        name="edit-ibanownername"
                                        size="sm"
                                        v-model="editingItem.ibanownername"
                                        v-validate="'required|alpha_dash'"
                                        :class="{ 'is-invalid' : errors.has('edit-ibanownername') }"
                                        :disabled="editingItem.paymenttype != 'Domiciliación'"
                                        @drop.prevent
                                        @keypress="$isAlphaDash($event)"
                                        @paste="$set(editingItem, 'ibanownername', $isAlphaDash($event))"></b-form-input>
                                    <transition mode="out-in" name="liveFeedbacks">
                                        <b-form-invalid-feedback
                                            v-for="error in errors.collect('edit-ibanownername')"
                                            :key="error">
                                            {{ error }}
                                        </b-form-invalid-feedback>
                                    </transition>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group
                                    class="mb-0"
                                    label="Dni del titular"
                                    label-for="edit-ibanownerdni">
                                    <!-- V-validate deshabilitado para pruebas  |dnie|lengthDnie' -->
                                    <b-form-input
                                        id="edit-ibanownerdni"
                                        name="edit-ibanownerdni"
                                        size="sm"
                                        v-model="editingItem.ibanownerdni"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid' : errors.has('edit-ibanownerdni') }"
                                        :disabled="editingItem.paymenttype != 'Domiciliación'"
                                        @drop.prevent
                                        @focusout="editingItem.ibanownerdni != '' ? ($set(editingItem, 'ibanownerdni', editingItem.ibanownerdni.toUpperCase())) : ''"
                                        @keypress="$isAlphaNum($event)"
                                        @paste="$set(editingItem, 'ibanownerdni', $isAlphaNum($event))"></b-form-input>
                                    <transition mode="out-in" name="liveFeedbacks">
                                        <b-form-invalid-feedback>
                                            {{ errors.first('edit-ibanownerdni') }}
                                        </b-form-invalid-feedback>
                                    </transition>
                                </b-form-group>
                            </b-col>
                            <b-col cols="auto">
                                <span
                                    class="d-block"
                                    v-b-tooltip.hover.bottom.noninteractive>
                                    <b-button
                                        class="align-unlabeled"
                                        size="sm"
                                        variant="outline-secondary"
                                        @click="fillIbanData($event)">Usar datos del socio</b-button>
                                </span>
                            </b-col>
                        </b-form-row>
                    </div>
                </TransitionExpand>
                <b-row class="mx-1 pt-4" no-gutters>
                    <b-col cols="auto">
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-button
                                class="ml-0 mr-auto"
                                variant="outline-danger"
                                v-if="editingItem.payment_id != ''"
                                @click.once="delPayment()"
                                @hidden="$manageScrollBar(true)"
                                @show="$manageScrollBar(true)">
                                <b-spinner
                                    grow
                                    small
                                    v-if="deleting"></b-spinner>
                                <span
                                    v-else>
                                    Borrar el pago
                                </span>
                            </b-button>
                        </transition>
                    </b-col>
                    <b-col class="text-right">
                        <b-button
                            class="mr-3"
                            variant="outline-warning"
                            @click="cancelEdit()">
                            Cancelar
                        </b-button>
                        <b-tooltip
                            target="btn-save-print-payment"
                            trigger="hover"
                            v-if="editingItem.status != 'Pendiente' && Object.keys(toEditItem).every(key => toEditItem[key] == editingItem[key])">
                            No hay cambios que guardar
                        </b-tooltip>
                        <b-tooltip
                            target="btn-save-print-payment"
                            trigger="hover"
                            v-else-if="editingItem.status != 'Pendiente' && evaluateSaveButton">
                            Revisa los <u style="cursor: help" @click="$validator.validate(); $refs['edit-payment-interval'].validate()">campos incorrectos</u>
                        </b-tooltip>
                        <span
                            id="btn-save-print-payment"
                            class="d-inline-block"
                            tabindex="0"
                            v-if="editingItem.status != 'Pendiente'">
                            <ButtonIcon
                                icon="file-download"
                                variant="outline-success"
                                :disabled="evaluateSaveButton || print || saving"
                                :spin="print"
                                @click.once="save(true)">
                                Guardar y descargar recibo
                            </ButtonIcon>
                        </span>
                        <b-tooltip
                            target="btn-save-payment"
                            trigger="hover"
                            v-if="Object.keys(toEditItem).every(key => toEditItem[key] == editingItem[key])">
                            No hay cambios que guardar
                        </b-tooltip>
                        <b-tooltip
                            target="btn-save-payment"
                            trigger="hover"
                            v-else-if="evaluateSaveButton">
                            Revisa los <u style="cursor: help" @click="$validator.validate(); $refs['edit-payment-interval'].validate()">campos incorrectos</u>
                        </b-tooltip>
                        <span
                            id="btn-save-payment"
                            class="d-inline-block"
                            tabindex="0">
                            <ButtonIcon
                                icon="save"
                                variant="primary"
                                :disabled="evaluateSaveButton || saving || print"
                                :spin="saving"
                                @click.once="save()">
                                Guardar
                            </ButtonIcon>
                        </span>
                    </b-col>
                </b-row>
            </div>
        </transition>
        <!-- Hided printable bill -->
        <div class="printable-wrp">
            <div class="pr-1 printable-ctn" ref="printableNPB">
                <Bill
                    :customer="customer"
                    :printItem="editingItem"></Bill>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import constants from '../utils/constants';
    import NProgress from 'nprogress';
    export default {
        data() {
            return {
                deleting: false, /* Flag to +ux the delete payment button */
                editingItem: Object.assign({}, this.toEditItem), /* Stores a local copy of element passed from the parent */
                print: false, /* Flag to print a bill on save */
                saving: false, /* Flag to improve the UX on the save buttons */
                intervalUnselected: false, /* Flag to improve the UX on alerts of the intervalSelector */
            }
        },
        computed: {
            ...mapGetters(['getCustomerById']),
            /**
             * The vuex customer data
             */
            customer() {
                return this.getCustomerById(this.editingItem._id)
            },
            /**
             * Returns the title and disabled status for the save button
             *
             * @returns {Object} title: for the button title, disabled: for the disabled status
             */
            evaluateSaveButton() {
                return Object.keys(this.toEditItem).every(key => this.toEditItem[key] == this.editingItem[key]) || (this.errors.has('edit-amount') || !this.editingItem.amount) || (this.errors.has('edit-rate-manual') || !this.editingItem.rate) || this.errors.has('edit-rate-periodic') || (this.editingItem.status != 'Pendiente' && !this.editingItem.dateconfirmed) || (this.editingItem.type == 'periodic' && !this.editingItem.interval) || (this.editingItem.paymenttype == 'Domiciliación' && ((this.errors.has('edit-iban') || !this.editingItem.iban) || (this.errors.has('edit-ibanownername') || !this.editingItem.ibanownername) || this.errors.has('edit-ibanownerdni') || !this.editingItem.ibanownerdni));
            },
            /**
             * Initizalize locally the constant imported for the rates
             */
            rates() {
                return constants.RATES;
            },
            /**
             * Returns the possible status for the editing payment.
             */
            states() {
                let states = ['Confirmado', 'Pendiente', 'Devuelto'];
                if (this.editingItem.paymenttype != 'Domiciliación') {
                    states = ['Confirmado', 'Pendiente'];
                }
                return states;
            }
        },
        inject: [
            '$validator', /* Inject the main $validator from the parent */
        ],
        methods: {
            ...mapActions(['addPayment', 'deletePayment', 'fetchCustomerImages', 'updatePaymentData']),
            /**
             * Function to cancel the edition of the new/edit payment
             */
            cancelEdit() {
                if (Object.keys(this.toEditItem).some(key => this.toEditItem[key] != this.editingItem[key])) {
                    /* Create the msxBoxConfirm message */
                    const br = this.$createElement( 'br', );
                    const message =  this.$createElement(
                        'span',
                        [
                            this.$createElement(
                                'span',
                                'Existen cambios que no has guardado.',
                            ),
                            br,
                            this.$createElement(
                                'span',
                                '¿Estás seguro de que quieres salir?',
                            ),
                        ]
                    );
                    /* Confirm to the user that the action can not be undoed */
                    this.$bvModal.msgBoxConfirm(message, {
                        title: 'ATENCIÓN',
                        size: 'sm',
                        buttonSize: 'sm',
                        centered: true,
                        okVariant: 'danger',
                        okTitle: 'Salir',
                        cancelTitle: 'Volver',
                        noCloseOnBackdrop: true,
                        noCloseOnEsc: true,
                    })
                    .then(value => {
                        if (value) {
                            /* The parent manages the modal close */
                            this.$emit('cancel');
                        }
                    })
                } else {
                    /* The parent manages the modal close */
                    this.$emit('cancel');
                }
            },
            /**
             * Function that deletes a payment in the db
             *
             * @param {Object} row: contains the row from the table with the customer data that will be deleted
             */
            delPayment() {
                /* Confirm to the user that the action can not be undoed */
                this.$bvModal.msgBoxConfirm('Estás seguro de que quieres borrar el pago?', {
                    title: 'ATENCIÓN',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'Continuar',
                    cancelTitle: 'Volver',
                    centered: true,
                    noCloseOnBackdrop: true,
                    noCloseOnEsc: true,
                })
                .then(async value => {
                    if (value) {
                        this.deleting = true;
                        try {
                            const response = await this.deletePayment(this.editingItem)
                            /* Show a message to the user when the process is correct */
                            this.$bvModal.msgBoxOk('Pago borrado correctamente' , {
                                    buttonSize: 'sm',
                                    centered: true,
                                    okTitle: 'Aceptar',
                                    size: 'sm',
                                })
                                .then(() => {
                                    /* The parent manages the modal close */
                                    this.$emit('delete');
                                    this.deleting = false;
                                });
                        } catch (error) {
                            this.$bvModal.msgBoxOk('No se ha podido completar la operación. Código de error: FEPaEdFo@DePa', {
                                buttonSize: 'sm',
                                centered: true,
                                okTitle: 'Aceptar',
                                okVariant: 'danger',
                                size: 'sm',
                                title: 'ERROR',
                            })
                            .then(() => {
                                /* The parent manages the modal close */
                                this.$emit('delete')
                                this.deleting = false;
                            });
                            console.error(error.response ? error.response.data : error);
                        }
                    }
                });
            },
            /**
             * Fill the iban owner data with the customer data
             *
             * @param {Event} ev: the click event to allow refer to the object caller, is used on child function
             */
            fillIbanData(ev) {
                const pD = this.customer.paymentData;
                this.$set(this.editingItem, 'iban', pD.iban);
                this.$set(this.editingItem, 'ibanownername', pD.ibanownername != '' && pD.ibanownername != null ? pD.ibanownername : this.customer.name);
                this.$set(this.editingItem, 'ibanownerdni', pD.ibanownerdni != '' && pD.ibanownerdni != null ? pD.ibanownerdni : this.customer.dni);
                if (this.editingItem.iban == '' || this.editingItem.iban == null) {
                    this.$validator.validate('edit-iban');
                }
            },
            /**
             * When a interval was unselected because already exists a payment confirmed on the interval selected, this function actives the flag to show an advice to the user
             */
            intervalInvalid() {
                this.intervalUnselected = true;
                setInterval(() => {
                    this.intervalUnselected = false;
                }, 5000)
            },
            /**
             * Save the form
             */
            async save(print) {
                const self = this;
                /* Activate the print component */
                if (print) {
                    this.print = true;
                } else {
                    /* Activate the flag to improve the UX */
                    this.saving = true;
                }
                /* Will be done at the parent */
                NProgress.start();
                const isNew = this.toEditItem.payment_id == '';
                 if (isNew) {
                    /* Add the payment to the db via vuex */
                    this.addPayment(this.editingItem)
                        .then(async () => {
                            NProgress.set(0.8);
                            /* Show feedback to the user */
                            await successFeedback();
                        })
                        .catch(error => {
                            /* Show feedback to the user */
                            errorFeedback(error);
                        });
                } else {
                    /* Update the payment on the db via vuex */
                    this.updatePaymentData({ items: new Array(this.editingItem), action: 'updating' })
                        .then(async () => {
                            NProgress.set(0.8);
                            /* Show feedback to the user */
                            await successFeedback();
                            /* Trigger a modification on the localStorage to propagate the changes on other windows. Unlike the add payment process, during the update is not propagated on vuex to avoid massive repetitions on mass customers updates */
                            localStorage.setItem('customer_updated', this.editingItem._id);
                            localStorage.removeItem('customer_updated');
                        })
                        .catch(error => {
                            /* Show feedback to the user */
                            errorFeedback(error);
                        });
                }
                async function successFeedback() {
                    /* Show a message to the user when the process is correct */
                    const message = (isNew ? 'Pago registrado correctamente' : 'Pago actualizado correctamente') + (print ? '. El recibo se descargará automáticamente' : '');
                    await self.$bvModal.msgBoxOk(message , {
                        buttonSize: 'sm',
                        centered: true,
                        okTitle: 'Aceptar',
                        size: 'sm',
                    });
                    if (print) {
                        /* The bill child must need this update to reload the print data setted on this function */
                        await self.$forceUpdate();
                        /* Fetch the customer sign via vuex */
                        await self.fetchCustomerImages({ customer: self.customer, sign: true });
                        /* Call the plugin to capture and download the component document */
                        const filename = self.customer.name.replace(/\s/g, '-') + '__recibo__' + self.$moment().format('YYYY-MM-DD_HH_mm') + '.pdf';
                        await self.$printDoc(filename, self.$refs.printableNPB);
                        NProgress.set(0.8);
                        setTimeout(() => {
                            self.print = false;
                        }, 300);
                    }
                    /* Propagate to the parent the sucessfull save */
                    self.$emit('successSaved', self.editingItem);
                    NProgress.done();
                    /* Restore the flag to improve the UX */
                    self.saving = false;
                }
                async function errorFeedback(error) {
                    await self.$bvModal.msgBoxOk('No se ha podido completar la operación. Código de error: FEPaFo@Sa', {
                        buttonSize: 'sm',
                        centered: true,
                        okTitle: 'Aceptar',
                        okVariant: 'danger',
                        size: 'sm',
                        title: 'ERROR',
                    });
                    NProgress.done();
                    console.error(error.response ? error.response.data : error);
                    /* Restore the flag to improve the UX */
                    self.saving = false;
                }
            },
            /**
             * Evaluate the value of the amount field based on the rate field
             *
             * @param {Event} ev: contains the value of the select element wich launch this function
             */
            propagateAmountChanges(ev) {
                this.$set(this.editingItem, 'amount', this.rates[ev]);
            },
            /**
             * Function to propagate changes to involved variables when the status of the payment is changed
             *
             * @param {Event} ev: the string to determine wich status has been set
             */
            propagateStatusChanges(ev) {
                if (ev == 'Pendiente') {
                    this.$set(this.editingItem, 'dateconfirmed', '');
                } else {
                    const originalDate = this.toEditItem.dateconfirmed;
                    /* If the item passed from the paren has a confirmation date use it on change status values to 'reset' the dateconfirmed to its initial value, if not set today as dateconfirmed */
                    if (originalDate != null && originalDate != '') {
                        this.$set(this.editingItem, 'dateconfirmed', originalDate);
                    } else {
                        this.$set(this.editingItem, 'dateconfirmed', this.$moment().format('DD-MM-YYYY HH:mm:ss'));
                    }
                }
            },
            /**
             * Function to propagate changes to involved variables when the type of the payment is changed
             *
             * @param {Event} ev: the string to determine wich type has been set
             */
            propagateTypeChanges(ev) {
                if (ev == 'manual') {
                    this.$set(this.editingItem, 'amount', '');
                    this.$set(this.editingItem, 'rate', '');
                } else if (ev == 'periodic') {
                    this.$set(this.editingItem, 'amount', this.customer.paymentData.amount);
                    this.$set(this.editingItem, 'rate', this.customer.paymentData.rate);
                }
            },
        },
        props: [
            'id', /* The id of the selected customer */
            'toEditItem', /* The selected payment to edit */
        ],
        watch: {
            toEditItem: {
                deep: true,
                immediate: true,
                handler(newVal, oldVal) {
                    /* Set the object passed as a local object */
                    Object.assign(this.editingItem, newVal)
                },
            }
        },
    }
</script>
