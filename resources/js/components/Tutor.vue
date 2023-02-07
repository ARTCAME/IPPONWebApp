<template>
    <div class="wrapper-dismissible">
        <div class="form-agrupation">
            <!-- Shown when the form customer is not underage and the form is being edited -->
            <b-btn-close
                tabindex="-1"
                v-if="underage == false && !isDisabled"
                @click="delFormObjElement({ state: form, target: 'tutor' })"></b-btn-close>
            <b-form-group>
                <h5 md="4" class="subtitle">Tutor</h5>
            </b-form-group>
            <!-- Shown when the form dateofbirth is a valid date and renders a text if the customer is or not underage -->
            <b-alert
                class="py-1"
                show
                variant="warning"
                v-if="underage != null">
                {{ underage == true ? 'El socio es menor de edad y es obligatorio rellenar los datos del tutor.' : 'El socio no es menor de edad y los datos del tutor son opcionales, se pueden borrar. Deberás actualizar la firma de la ficha de socio si estuviera asociada al tutor.' }}
            </b-alert>
            <!-- Shown when the form is being edited -->
            <SearchAtForm
                field="tutor"
                v-if="!isDisabled"
                @chosen="chooseAction(...arguments)"></SearchAtForm>
            <b-button
                class="mb-2"
                size="sm"
                title="Doble click para restablecer los datos"
                v-b-tooltip.hover.noninteractive
                v-if="_id && !isDisabled"
                @dblclick="resetTutor()">Restablecer</b-button>
            <!-- Shown when the tutor is a customer too -->
            <b-form-group
                v-if="_id">
                <b-alert class="py-1" show variant="secondary">
                    Si quieres editar los datos del socio seleccionado como tutor
                    <b-link
                        target="_blank"
                        :to="{ name: 'customers.edit', params: { id: _id } }">
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
            <span class="form-row"> <!-- BUG -> Parent trigger the validation and the b-form-row don't show this validation, on events the validation its correct -->
                <b-form-group class="wrapper-for-badge col-lg" label="Nombre y apellidos del tutor">
                    <b-form-input
                        autocomplete="off"
                        debounce="500"
                        name="tutor-name"
                        type="text"
                        v-model="name"
                        v-validate="(!_id && !isDisabled) ? 'alpha_spaces|required' : ''"
                        :class="{ 'is-invalid' : errors.has('tutor-name') && (!_id && !isDisabled) }"
                        :disabled="!!_id || isDisabled"></b-form-input>
                    <transition mode="out-in" name="liveFeedbacks">
                        <b-form-invalid-feedback
                            v-if="errors.has('tutor-name') && (!_id && !isDisabled)">
                            {{ errors.first('tutor-name') }}
                        </b-form-invalid-feedback>
                    </transition>
                    <!-- Shown when the form is being edited -->
                    <SearchBadge
                        class="label-badge"
                        field="nombre"
                        id="sb-tutor-name"
                        searchField="name"
                        v-if="!_id && !isDisabled"
                        :tutor="true"
                        :searchValue="name"
                        @chosen="chooseAction(...arguments)"></SearchBadge>
                </b-form-group>
                <!-- Validation needs extra validation when the tutor is fetched from other customer and disabled because of this -->
                <b-form-group class="wrapper-for-badge col-lg-4" label="Dni del tutor">
                    <b-form-input
                        autocomplete="off"
                        debounce="500"
                        name="tutor-dni"
                        type="text"
                        v-model="dni"
                        v-validate="!_id && !isDisabled ? (underage == true && !form.dni ? 'required' : '') + '|dnie|lengthDnie|dniTutorFounded:' + ($route.name != 'customers.new' ? getCustomerByField('dni', dni).filter(el => el._id != form._id).length : getCustomerByField('dni', dni).length) : ''"
                        :class="{ 'is-invalid' : (errors.has('tutor-dni') && (!_id && !isDisabled)) }"
                        :disabled="!!_id || isDisabled"
                        @drop.prevent
                        @focusout="dni = dni.toUpperCase()"
                        @keypress="$isAlphaNum($event)"
                        @paste="dni = $isAlphaNum($event)"></b-form-input>
                    <transition mode="out-in" name="liveFeedbacks">
                        <b-form-invalid-feedback
                            v-for="error in errors.collect('tutor-dni')"
                            :key="error">
                            {{ error }}
                        </b-form-invalid-feedback>
                    </transition>
                    <!-- Shown when the form is being edited -->
                    <SearchBadge
                        class="label-badge"
                        field="dni"
                        id="sb-tutor-dni"
                        searchField="dni"
                        v-if="!_id && !isDisabled"
                        :searchValue="dni"
                        :tutor="true"
                        @chosen="chooseAction(...arguments)"></SearchBadge>
                </b-form-group>
            </span>
            <b-form-group label="Dirección del tutor">
                <b-form-input
                    autocomplete="off"
                    debounce="500"
                    name="tutor-address"
                    type="text"
                    v-model="address"
                    v-validate="(!_id && !isDisabled) ? 'required' : ''"
                    :class="{ 'is-invalid' : errors.has('tutor-address') && (!_id && !isDisabled) }"
                    :disabled="!!_id || isDisabled"></b-form-input>
                <transition mode="out-in" name="liveFeedbacks">
                    <b-form-invalid-feedback
                        v-if="errors.has('tutor-address') && (!_id && !isDisabled)">
                        {{ errors.first('tutor-address') }}
                    </b-form-invalid-feedback>
                </transition>
            </b-form-group>
            <PhoneBase
                target="tutor"
                :inPhones="tutor.phones"
                :isDisabled="!!_id || isDisabled"
                @input="setTutorFields({ _id: form._id, field: 'phones', fieldIndex: $event.arrayIndex, newVal: $event.newVal })"></PhoneBase>
            <EmailBase
                target="tutor"
                :inEmails="tutor.emails"
                :isDisabled="!!_id || isDisabled"
                @input="setTutorFields({ _id: form._id, field: 'emails', fieldIndex: $event.emailIndex, newVal: $event.email })"></EmailBase>
            <NotesBase
                target="tutor"
                :_id="form._id"
                :inNotes="tutor.notes"
                :isDisabled="isDisabled"></NotesBase>
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
                return this.tutor[key];
            },
            set(value) {
                if (['name', 'address', 'dni'].includes(key)) {
                    value = value.toUpperCase();
                }
                this.setTutorFields({ _id: this.form._id, field: key, newVal: value })
            }
        }
    });
    return result;
};
export default {
    computed: {
        ...computeBaseFields(['_id', 'customerNumber', 'name', 'address', 'dni']),
        ...mapGetters(['getCustomerByField', 'getDefaultState']),
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
         * Serves the tutor state from the store
         *
         * @return {Object} Object with the current tutor data
         */
        tutor() {
            return this.form.tutor;
        },
    },
    inject: [
        '$validator', /* Inject the main $validator from the parent */
    ],
    methods: {
        ...mapActions(['delFormObjElement', 'setTutor', 'setTutorFields', 'updateFormData']),
        /**
         * Defines the customer chosed as a tutor for the customer edited on the form parent
         *
         * @param {Object} customer: the customer data from the customers state received via the search badge
         */
        async chooseAction(customer) {
            let result = false;
            if (this.tutor.notes && this.tutor.notes.length > 0) {
                /* Advise the user that the notes will be deleted */
                result = await this.$bvModal.msgBoxOk('Las notas del tutor se borrarán', {
                    buttonSize: 'sm',
                    centered: true,
                    okTitle: 'Aceptar',
                    cancelTitle: 'Volver',
                    size: 'sm',
                    title: '¿Seguro que quieres continuar?',
                })
            }
            if ((this.tutor.notes && this.tutor.notes.length > 0 && result) || !this.tutor.notes) {
                /* Pause the current validator instance to avoid errors with the dynamic elements */
                this.$validator.pause();
                /* Call to the vuex action to set the chosen tutor */
                await this.setTutor({ _id: this.form._id, customer: customer })
                /* Resume the validator */
                this.$validator.resume();
            }
        },
        /**
         * Reset every field of the tutor
         */
        resetTutor() {
            /* Pause the current validator instance to avoid errors on dynamic components */
            this.$validator.pause();
            this.updateFormData({ _id: this.form._id, field: 'tutor', newVal: this.getDefaultState('tutor') });
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
        'isDisabled', /* Indicates if the form is being edited */
        'underage', /* Informs if the dateofbirth on the parent is underage */
    ],
    /**
     * Provide the same $validator to the childs
     */
    provide() {
        return {
            $validator: this.$validator,
        }
    },
}
</script>
