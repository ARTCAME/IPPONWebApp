<template>
    <b-row>
        <!-- Year selector -->
        <b-col class="pr-0" cols="12" md="auto">
            <b-row no-gutters>
                <b-form-group class="mr-2">
                    <b-form-radio-group
                        buttons
                        button-variant="outline-secondary"
                        id="interval-year"
                        name="interval-year"
                        size="sm"
                        title="Año"
                        v-b-tooltip.hover.noninteractive
                        v-model="selectedYear"
                        v-validate="!manual ? (selectedAlterYear == null || (selectedAlterYear != null && errors.has('alteryear')) ? 'required' : '') : ''"
                        :class="'mr-2 w-100 radio-selector' + (errors.has('interval-year') ? ' is-invalid' : '')">
                        <b-form-radio
                            class="btn-year"
                            v-for="btnYear in btnYears"
                            :key="btnYear"
                            :value="btnYear"
                            @change="selectedAlterYear = null">
                            {{ btnYear }}
                        </b-form-radio>
                    </b-form-radio-group>
                    <transition mode="out-in" name="liveFeedbacks">
                        <b-form-invalid-feedback
                            v-if="errors.has('interval-year')">
                            {{ errors.first('interval-year') }}
                        </b-form-invalid-feedback>
                    </transition>
                </b-form-group>
                <b-form-group >
                    <b-form-input
                        id="alteryear"
                        name="alteryear"
                        placeholder="Otro año..."
                        size="sm"
                        title="Indica un año diferente..."
                        v-b-tooltip.hover.noninteractive
                        v-model="selectedAlterYear"
                        v-validate="!manual ? 'year' + (selectedYear == null ? '|required' : '') : ''"
                        :class="{ 'is-invalid' : errors.has('alteryear') }"
                        @input="selectedYear = null"
                        @keypress="$isNumber($event)"></b-form-input>
                    <transition mode="out-in" name="liveFeedbacks">
                        <b-form-invalid-feedback
                            v-if="errors.has('alteryear')">
                            {{ errors.first('alteryear') }}
                        </b-form-invalid-feedback>
                    </transition>
                </b-form-group>
            </b-row>
        </b-col>
        <b-col cols="12" md="auto">
            <!-- Month selector -->
            <b-row no-gutters>
                <b-col>
                    <b-form-group>
                        <!-- Vee-validate needs a custom validation here for validate the dropdown using a local flag -->
                        <b-dropdown
                            id="month-dropdown"
                            name="interval-month"
                            no-caret
                            size="sm"
                            variant="outline-secondary"
                            :class="'ig-dropdown w-100' + (!manual && selectedMonth == null && validated == true ? ' is-invalid' : '')">
                            <!-- The month will be disabled when is already used at a confirmed payment -->
                            <template #button-content>
                                <b-row class="flex-nowrap" no-gutters>
                                    <b-col>
                                        {{ selectedMonth != null ? btnMonths[selectedMonth].text : 'Selecciona un mes' }}
                                    </b-col>
                                    <b-col align-self="end" cols="2">
                                        <fa-icon icon="caret-down"></fa-icon>
                                    </b-col>
                                </b-row>
                            </template>
                            <!-- Disable the radio and show the tooltip in a radio btn group is not possible for now
                                <b-dropdown-form>
                                <b-form-radio-group buttons button-variant="outline-secondary" size="sm" stacked>
                                    <b-form-radio
                                        v-b-tooltip.hover.right.noninteractive
                                        v-for="btn in btnMonths"
                                        :class="(manual ? 'ig-dropdown-item' : 'ig-dropdown-item' + (((confirmed == true && isConfirmed(btn.value)) || (confirmed == false && !isConfirmed(btn.value))) ? ' ig-select-disabled' : ''))"
                                        :disabled="manual || ((confirmed == true && isConfirmed(btn.value)) || (confirmed == false && !isConfirmed(btn.value)))"
                                        :key="btn.value"
                                        :title="manual ? '' : confirmed == true && isConfirmed(btn.value) ? 'Ya existe un pago confirmado para este mes y año' : ''"
                                        :value="btn.value"
                                        :style="((confirmed == true && isConfirmed(btn.value)) || (confirmed == false && !isConfirmed(btn.value))) ? 'pointer-events: auto' : ''"
                                        @click="selectedMonth = btn.value;">
                                        <b-row align-h="between" no-gutters>
                                            {{ btn.text }}
                                            Shown when the payment is confirmed
                                            <fa-icon
                                                class="mt-1 text-success"
                                                icon="check-double"
                                                v-if="!manual && confirmed == true && isConfirmed(btn.value)"></fa-icon>
                                        </b-row>
                                    </b-form-radio>
                                </b-form-radio-group>
                            </b-dropdown-form> -->
                            <b-dropdown-form
                                form-class="btn-group-toggle btn-group-vertical btn-group-sm">
                                <b-dropdown-item
                                    variant="outline-secondary"
                                    v-b-tooltip.hover.right.noninteractive
                                    v-for="btn in btnMonths"
                                    :title="manual ? '' : confirmed == true && isConfirmed(btn.value) ? 'Ya existe un pago confirmado para este mes y año' : ''"
                                    :class="(manual ? 'ig-dropdown-item' : 'ig-dropdown-item' + (confirmed == true && isConfirmed(btn.value) ? ' ig-select-disabled' : ''))"
                                    :disabled="manual || confirmed === false ? false : confirmed == true && isConfirmed(btn.value)"
                                    :key="btn.value"
                                    :value="btn.value"
                                    @click="selectedMonth = btn.value">
                                    <b-row align-h="between">
                                        {{ btn.text }}
                                        <!-- Shown when the payment is confirmed -->
                                        <fa-icon
                                            class="mt-1 text-success"
                                            icon="check-double"
                                            v-if="!manual && confirmed == true && isConfirmed(btn.value)"></fa-icon>
                                    </b-row>
                                </b-dropdown-item>
                            </b-dropdown-form>
                        </b-dropdown>
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-form-invalid-feedback
                                v-if="!manual && selectedMonth == null && validated == true">
                                Campo obligatorio
                            </b-form-invalid-feedback>
                        </transition>
                    </b-form-group>
                </b-col>
                <b-col class="ml-2">
                    <b-button
                        class="d-inline-block"
                        size="sm"
                        title="Borrar el intervalo"
                        variant="outline-danger"
                        v-b-tooltip.hover.noninteractive
                        @click="resetInterval()">
                        <fa-icon icon="eraser"></fa-icon>
                    </b-button>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>
<script>
    export default {
        data() {
            return {
                btnMonths: [
                    { text: 'Enero', value: 0, },
                    { text: 'Febrero', value: 1, },
                    { text: 'Marzo', value: 2, },
                    { text: 'Abril', value: 3, },
                    { text: 'Mayo', value: 4, },
                    { text: 'Junio', value: 5, },
                    { text: 'Julio', value: 6, },
                    { text: 'Agosto', value: 7, },
                    { text: 'Septiembre', value: 8, },
                    { text: 'Octubre', value: 9, },
                    { text: 'Noviembre', value: 10, },
                    { text: 'Diciembre' ,value: 11, },
                ], /* Months selector */
                btnYears: [ this.$moment().year() - 1, this.$moment().year(), this.$moment().year() + 1 ], /* Years selector only provides the current and +-1, is assumed that the user never would add a payment out of this ranges */
                selectedAlterYear: null, /* v-model for the editable input year */
                selectedMonth: null, /* v-model of the payment month */
                selectedYear: this.$moment().year(), /* v-model of the new payment year */
                validated: null, /* Dirty flag to determine if the validation was requested and fake the validation ux on dropdown */
            }
        },
        computed: {
            /**
             * Sets the interval to the format YYYY-MM
             *
             * @return {String} String with the interval formatted to YYYY-MM
             */
            interval() {
                if (this.selectedMonth != null) {
                    return  this.year + '-' + ((this.selectedMonth + 1) < 10 ? '0' + (this.selectedMonth + 1) : this.selectedMonth + 1);
                }
            },
            /**
             * Determine the year to use as selected year to the new payment checking the radio button and the input fields to extract the selected
             *
             * @return {Integer} Integer with the year selected or introduced (the input value is validated with vee)
             */
            year() {
                if (this.selectedAlterYear != null) {
                    if (this.selectedAlterYear == this.$moment().year() || this.selectedAlterYear == this.$moment().year() + 1 || this.selectedAlterYear == this.$moment().year() - 1) {
                        this.selectedYear = this.selectedAlterYear;
                    } else  {
                        this.selectedYear = null;
                    }
                    /* ¿VEE-VALIDATE BUG? - IN THIS COMPONENT THE errors.has('alteryear') EXISTS, ON THE PARENT NewPayment EXISTS AS IN errors BUT NOT IN errors.has('alteryear'), instead of unuseful vee-validation this check confirm the correct value */
                    /* Return only the year if the introduced value is on a valid range */
                    if (this.selectedAlterYear < (this.$moment().year() + 100) && this.selectedAlterYear > (this.$moment().year() - 100) && this.$moment(this.selectedAlterYear, 'YYYY', true).isValid()) {
                        return this.selectedAlterYear;
                    }
                } else if (this.selectedYear != null) {
                    this.selectedAlterYear = null;
                    return this.selectedYear;
                }
                return null;
            }
        },
        inject: [
            '$validator', /* Inject the main $validator from the parent */
        ],
        methods: {
            /**
             * Disables the options unselectable of the select months options. This functions can be called with '!' to obtain the inverse selectable: disable the confirmed payments will be useful when we need to confirm a new payment (to don't select an existing interval) and enable the confirmed will be useful to print a bill of a interval with payment confirmed
             *
             * @param {Integer} btnMonth: is the value of the select option
             *
             * @return {Boolean} Boolean that indicates if the option of the select element needs to be disabled
             */
            isConfirmed(btnMonth) {
                /* Reveal if the customer has a payment confirmed with the month-year selected and if a paymentId is provided check if its different to this payment interval */
                const result = this.customer.payments && this.customer.payments.filter(payment => payment.type != 'manual' && this.$moment(payment.interval, 'YYYY-MM').year() == this.year && this.$moment(payment.interval, 'YYYY-MM').month() == btnMonth && (payment.status == 'Confirmado' || payment.status == 'Devuelto') && (payment.payment_id != this.paymentId)).length > 0;
                /* Unselect the month if it is selected previously */
                if ((result && this.confirmed == true && this.selectedMonth == btnMonth) || (!result && this.confirmed == false && this.selectedMonth == btnMonth)) {
                    this.selectedMonth = null;
                    this.$emit('unselected');
                }
                return result;
            },
            /**
             * Resets the selected year and month, is called from the parent
             */
            resetInterval() {
                this.selectedAlterYear = null;
                this.selectedMonth = null;
                this.selectedYear = null;
                this.$nextTick(() => {
                    this.validate();
                })
            },
            /**
             * Function to validate the fields, is called from the parents too
             */
            validate() {
                /* Dirty validation for dropdown */
                this.validated = true;
                this.$validator.validate();
            },
        },
        mounted() {
            /* Emit the null interval on mounted */
            this.$emit('input', this.interval || '');
            /* Assign the parent interval value if exists */
        },
        props: [
            'customer', /* The customer to treat */
            'confirmed', /* The status of the payments to evaluate */
            'manual', /* Flag for the manual payments wich no need validation */
            'parentInterval', /* The interval setted on the parent */
            'paymentId', /* Is the payment_id of a payment editing on the parent wich needs to be discarted on editions */
        ],
        /**
         * Provide the same $validator to the childs
         */
        provide() {
            return {
                $validator: this.$validator,
            }
        },
        watch: {
            interval(newVal, oldVal) {
                if (newVal != oldVal) {
                    if (this.$moment(this.interval, 'YYYY-MM', true).isValid()) {
                        this.$emit('input', this.interval)
                    } else {
                        this.$emit('input', '');
                    }
                }
            },
            parentInterval: {
                immediate: true,
                handler(newVal, oldVal) {
                    /* Assign the parent interval value if exists */
                    const parentDate = this.$moment(newVal, 'YYYY-MM', true);
                    this.selectedAlterYear = parentDate.isValid() ? parentDate.year() : null;
                    this.selectedMonth = parentDate.isValid() ? parentDate.month() : null;
                },
            }
        }
    }
</script>
<style>
    #month-dropdown.dropdown-item.active, .dropdown-item:active {
        background-color: rgba(218, 218, 218, 1)!important;
    }
</style>
<style scoped>
    #month-dropdown {
        min-width: 125px;
    }
    #alteryear {
        display: inline-flex;
        height: 32.5px;
        width: 80px;
    }
</style>
