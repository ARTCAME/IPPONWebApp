<template>
    <div class="pt-2">
        <TransitionExpand>
            <div
                key="form-warning-phones"
                v-if="!inPhones || (inPhones && inPhones.length == 0)">
                <b-alert
                    class="py-1"
                    show
                    variant="info">
                    No has añadido ningún teléfono y es muy recomendable que el {{ target == 'customer' ? 'socio' : target == 'tutor' ? 'tutor' : 'contacto'}} tenga por lo menos uno
                </b-alert>
            </div>
        </TransitionExpand>
        <TransitionExpand group>
            <div
                class="expandable"
                v-for="(phone, phoneIndex) in inPhones"
                :key="target + '_phone_' + phoneIndex">
                <div class="wrapper-dismissible">
                    <div class="form-agrupation">
                        <b-btn-close
                            class="wrapper-dismissible-close"
                            tabindex="-1"
                            v-if="!isDisabled"
                            @click="delFormElement({ _id: form._id, entity: target, entityIndex: targetIndex, field: 'phones', fieldIndex: phoneIndex, })"></b-btn-close>
                        <b-form-row>
                            <b-form-group class="col-12 col-md-3" label="Teléfono">
                                <b-form-input
                                    autocomplete="off"
                                    debounce="500"
                                    type="tel"
                                    v-validate="{ required: true, regex: /^[6-9]{1}\d{8}/, length: 9 }"
                                    :class="{ 'is-invalid' : errors.has(validateName(phoneIndex)) }"
                                    :disabled="isDisabled"
                                    :name="validateName(phoneIndex)"
                                    :value="phone.phone"
                                    @drop.prevent
                                    @keypress="$isNumber($event)"
                                    @paste="$emit('input', { newVal: { phone: $isNumber($event), notes: phone.notes }, arrayIndex: phoneIndex, targetIndex: targetIndex })"
                                    @input="$emit('input', { newVal: { phone: $event, notes: phone.notes }, arrayIndex: phoneIndex, targetIndex: targetIndex })"></b-form-input>
                                <transition mode="out-in" name="liveFeedbacks">
                                    <b-form-invalid-feedback
                                        v-if="errors.has(validateName(phoneIndex))">
                                        {{ errors.first(validateName(phoneIndex)) }}
                                    </b-form-invalid-feedback>
                                </transition>
                            </b-form-group>
                            <b-form-group class="col-12 col-md-9" label="Notas">
                                <b-form-input
                                    autocomplete="off"
                                    debounce="500"
                                    placeholder="Si es del trabajo, de casa, horario o persona de contacto, etc"
                                    type="text"
                                    :disabled="isDisabled"
                                    :value="phone.notes"
                                    @input="$emit('input', { newVal: { phone: phone.phone, notes: $event }, arrayIndex: phoneIndex, targetIndex: targetIndex })"></b-form-input>
                            </b-form-group>
                        </b-form-row>
                    </div>
                </div>
            </div>
        </TransitionExpand>
        <b-row
            class="mb-2"
            no-gutters
            v-if="!isDisabled">
            <ButtonIcon
                icon="plus"
                variant="ig-gradient"
                :class="'ig-add-button ml-auto' + (!inPhones || (inPhones && inPhones.length == 0) ? ' expanded' : '')"
                @click="addNewElement({ _id: form._id, element: 'phones', entity: target, entityIndex: targetIndex })">
                <span class="ml-1">
                    Añadir teléfono
                </span>
            </ButtonIcon>
        </b-row>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
export default {
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
    },
    inject: [
        '$validator', /* Inject the main $validator from the parent */
    ],
    methods: {
        ...mapActions(['addNewElement', 'delFormElement']),
        /**
         * Returns a name builded based on the target to use it at the validation process
         *
         * @return {String} The name to use at the validator
         */
        validateName(phoneIndex) {
            return this.target + (this.targetIndex ? '-' + this.targetIndex : '') + '-phone-' + phoneIndex;
        },
    },
    props: [
        'isDisabled', /* Boolean that indicates if the form is being edited */
        'inPhones', /* The phone data to render */
        'target', /* The parent (customer, tutor or contact) */
        'targetIndex', /* When the parent is an array of parents (ie contacts) will receive its index */
    ],
}
</script>
