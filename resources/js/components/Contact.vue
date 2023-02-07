<template>
    <div class="wrapper-dismissible">
        <div class="form-agrupation">
            <!-- Shown when the form is being edited  -->
            <b-btn-close
                tabindex="-1"
                v-if="!isDisabled"
                @click="delFormElement({ _id: form._id, entity: 'customer', field: 'contacts', fieldIndex: index })"></b-btn-close>
            <b-form-group>
                <h5 md="4" class="subtitle">Persona de contacto</h5>
            </b-form-group>
            <br>
            <!-- Shown when the form is being edited  -->
            <SearchAtForm
                field="contacto"
                v-if="!isDisabled"
                :contactIndex="index"
                @chosen="chooseAction(...arguments)"></SearchAtForm>
            <!-- Shown when the form is being edited and the contact is a customer too -->
            <b-button
                class="mb-2"
                size="sm"
                title="Doble click para restablecer los datos"
                v-b-tooltip.hover.noninteractive
                v-if="_id && !isDisabled"
                @dblclick="resetContact()">Restablecer</b-button>
            <!-- Shown when the contact is a customer too -->
            <b-form-group
                v-if="_id">
                <b-alert class="py-1" show variant="secondary">
                    Si quieres editar los datos del socio seleccionado
                    <b-link
                        target="_blank"
                        :to="{ name: 'customers.profile', params: { id: _id } }">
                        visita su ficha
                        <fa-icon class="ig-fa-inlinetext" icon="external-link-alt"></fa-icon>
                    </b-link>
                </b-alert>
                <b-form-row>
                    <b-col cols="6">
                        <small class="text-muted">
                            Número de socio:
                        </small>
                        <b-form-input
                            class="ig-background"
                            disabled
                            size="sm"
                            v-model="customerNumber"></b-form-input>
                    </b-col>
                    <b-col cols="6">
                        <small class="text-muted">
                            Identificador del socio:
                        </small>
                        <b-form-input
                            class="ig-background"
                            disabled
                            size="sm"
                            v-model="_id"></b-form-input>
                    </b-col>
                </b-form-row>
            </b-form-group>
            <b-form-group class="wrapper-for-badge col-lg p-0" label="Nombre y apellidos del contacto">
                <b-form-input
                    autocomplete="off"
                    debounce="500"
                    type="text"
                    v-model="name"
                    v-validate="(!_id && !isDisabled) ? 'alpha_spaces|required' : ''"
                    :class="{ 'is-invalid' : errors.has('contacts-' + index + '-name') && (!_id && !isDisabled) }"
                    :disabled="!!_id || isDisabled"
                    :name="'contacts-' + index + '-name'"></b-form-input>
                <transition mode="out-in" name="liveFeedbacks">
                    <b-form-invalid-feedback
                        v-if="errors.has('contacts-' + index + '-name')">
                        {{ errors.first('contacts-' + index + '-name') }}
                    </b-form-invalid-feedback>
                </transition>
                <!-- Shown when the form is being edited -->
                <SearchBadge
                    class="label-badge"
                    searchField="name"
                    field="nombre"
                    v-if="!_id && !isDisabled"
                    :contact="true"
                    :contactIndex="index"
                    :id="'sb-contacto-name-' + index"
                    :searchValue="name"
                    @chosen="chooseAction(...arguments)"></SearchBadge>
            </b-form-group>
            <PhoneBase
                target="contacts"
                :inPhones="contact.phones"
                :isDisabled="!!_id || isDisabled"
                :targetIndex="index"
                @input="setContactFields({ _id: form._id, field: 'phones', fieldIndex: $event.arrayIndex, contactIndex: $event.targetIndex, newVal: $event.newVal })"></PhoneBase>
            <EmailBase
                target="contacts"
                :inEmails="contact.emails"
                :isDisabled="!!_id || isDisabled"
                :targetIndex="index"
                @input="setContactFields({ _id: form._id, field: 'emails', fieldIndex: $event.emailIndex, contactIndex: $event.contactIndex, newVal: $event.email })"></EmailBase>
            <NotesBase
                target="contacts"
                :_id="form._id"
                :inNotes="contact.notes"
                :isDisabled="isDisabled"
                :targetIndex="index"></NotesBase>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
/**
 * Add the getters and setters of the base fields provided
 *
 * @param {Array} keys: Array of Strings with the name of the fields to treat
 *
 * @return {Object} Object with the getters and setters
 */
function computeBaseFields(keys) {
    let result = {};
    keys.forEach((key) => {
        result[key] = {
            get() {
                return this.contact[key];
            },
            set(value) {
                if (key == 'name') {
                    value = value.toUpperCase();
                }
                this.setContactFields({ _id: this.form._id, field: key, contactIndex: this.index, newVal: value });
            }
        }
    });
    return result;
};
export default {
    data() {
        return {
            newNote: '',
        }
    },
    computed: {
        ...computeBaseFields(['_id', 'customerNumber', 'name']),
        ...mapGetters(['getDefaultState']),
        ...mapState({
            newCustomerForm: state => state.form,
            editCustomerForm: state => state.editform,
        }),
        /**
         * Serves the contact state from the store
         *
         * @return {Object} Object with the current contact data
         */
        contact() {
            return this.form.contacts[this.index];
        },
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
        ...mapActions(['delFormElement', 'setContact', 'setContactFields', 'updateFormData']),
        /**
         * Defines the customer chosed as a contact for the customer edited on the form parent
         *
         * @param {Object} customer: the customer data from the customers state received via the search badge
         */
        async chooseAction(customer) {
            let result = false;
            if (this.contact.notes && this.contact.notes.length > 0) {
                /* Advise the user that the notes will be deleted */
                result = await this.$bvModal.msgBoxOk('Las notas del contacto se borrarán', {
                    buttonSize: 'sm',
                    centered: true,
                    okTitle: 'Aceptar',
                    cancelTitle: 'Volver',
                    size: 'sm',
                    title: '¿Seguro que quieres continuar?',
                })
            }
            if ((this.contact.notes && this.contact.notes.length > 0 && result) || !this.contact.notes) {
                /* Pause the current validator instance to avoid errors with the dynamic elements */
                this.$validator.pause();
                /* Call to the vuex action to set the chosen contact */
                await this.setContact({ _id: this.form._id, customer: customer, index: this.index })
                /* Resume the validator */
                this.$validator.resume();
            }
        },
        /**
         * Resets the contact filled, is called from the MainForm parent when the contact is a customer too
         */
        resetContact() {
            /* Pause the current validator instance to avoid errors on dynamic components */
            this.$validator.pause();
            this.updateFormData({ _id: this.form._id, field: 'contacts', arrayIndex: this.index, newVal: this.getDefaultState('contacts') });
            /* After fetch the data, reactive the current validator */
            this.$nextTick(() => {
                this.$validator.resume();
            });
        },
        /**
         * Validate the form, usually called from the parent
         */
        async validate() {
            await this.$validator.validate()
            return this.errors.all();
        }
    },
    props: [
        'index', /* The contact index on the array of contacts of the parent */
        'isDisabled', /* Indicates if the form is being edited */
    ],
}
</script>
