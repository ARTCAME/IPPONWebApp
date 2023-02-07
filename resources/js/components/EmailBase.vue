<template>
    <div class="pt-2">
        <TransitionExpand>
            <div
                key="form-warning-emails"
                v-if="!inEmails || (inEmails && inEmails.length == 0)">
                <b-alert
                    class="py-1"
                    show
                    variant="info">
                    No has añadido ningún email y es muy recomendable que el {{ target == 'customer' ? 'socio' : target == 'tutor' ? 'tutor' : 'contacto'}} tenga por lo menos uno
                </b-alert>
            </div>
        </TransitionExpand>
        <TransitionExpand group>
            <div
                v-for="(email, emailIndex) in inEmails"
                :key="target + '_email_' + emailIndex">
                <div class="wrapper-dismissible">
                    <div class="form-agrupation">
                        <!-- Shown when the form is being edited -->
                        <b-btn-close
                            class="wrapper-dismissible-close"
                            tabindex="-1"
                            v-if="!isDisabled"
                            @click="delFormElement({ _id: form._id, entity: target, entityIndex: targetIndex, field: 'emails', fieldIndex: emailIndex, })"></b-btn-close>
                        <b-form-group label="Correo electrónico">
                            <b-form-input
                                autocomplete="off"
                                debounce="500"
                                type="email"
                                v-validate="{ required: true, email }"
                                :class="{ 'is-invalid' : errors.has(validateName(emailIndex)) }"
                                :disabled="isDisabled"
                                :name="validateName(emailIndex)"
                                :value="email"
                                @input="$emit('input', { email: $event, emailIndex: emailIndex, contactIndex: targetIndex })"></b-form-input>
                            <transition mode="out-in" name="liveFeedbacks">
                                <b-form-invalid-feedback
                                    v-if="errors.has(validateName(emailIndex))">
                                    {{ errors.first(validateName(emailIndex)) }}
                                </b-form-invalid-feedback>
                            </transition>
                        </b-form-group>
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
                :class="'ig-add-button ml-auto' + (!inEmails || (inEmails && inEmails.length == 0) ? ' expanded' : '')"
                @click="addNewElement({ _id: form._id, element: 'emails', entity: target, entityIndex: targetIndex })">
                <span class="ml-1">
                    Añadir email
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
        validateName(emailIndex) {
            return this.target + (this.targetIndex ? '-' + this.targetIndex : '') + '-email-' + emailIndex;
        },
    },
    props: [
        'isDisabled', /* Boolean that indicates if the form is being edited */
        'inEmails', /* The email data to render */
        'target', /* The parent (customer, tutor or contact) */
        'targetIndex', /* When the parent is an array of parents (ie contacts) will receive its index */
    ],
}
</script>
