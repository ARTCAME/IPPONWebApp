import constants from '../utils/constants';
import exceptions from '../Exceptions';
import moment from 'moment';
import NProgress from 'nprogress';
import router from '../router/router';
import { http } from '../utils/http';
export default {
    /**
     * Add a new element to the dynamic elements of the form object (belts, phones, notes, tutor, tutor notes, tutor phones, contacts, contact notes and contact phones)
     *
     * @param {String} _id (optional): identifies the customer setted on the form to modify, if is not provided is a new customer
     * @param {String} element: identifies the element in wich a new element is to be added
     * @param {String} entity: can be 'customer', 'tutor' or 'contact', is the destination of the added element
     * @param {Integer} entityIndex (optional): the array index of the entity with an element to add
     * @param {Object} value (optional): new value to add on a entity, ie used to add a new note data filled object instead of a pristine note object
     */
    addNewElement({ commit, getters, state }, { _id = null, element, entity, entityIndex = null, value = null }) {
        const form = _id == null ? state.form : state.editform; /* New or existing customer */
        let newVal = element == 'phones' ? constants.DEFAULT_PHONE : element == 'contacts' ? constants.DEFAULT_CONTACT : element == 'tutor' ? constants.DEFAULT_TUTOR : element == 'notes' ? value : element == 'belts' ? constants.DEFAULT_BELTS : '';
        let target = null;
        /* Get the target in the deep of every type of entity and if the element doesn't exist create it as an array with the newVal, if exists add the newVal to the existing values */
        if (entity == 'contacts') {
            newVal = form[entity][entityIndex][element] ? [...form[entity][entityIndex][element], newVal] : [newVal];
            target = form[entity][entityIndex];
        }
        if (entity == 'tutor') {
            newVal = form[entity][element] ? [...form[entity][element], newVal] : [newVal];
            target = form[entity];
        }
        if (entity == 'customer') {
            /* The customer tutor and belts elements are not arrays */
            newVal = form[element] ? [...form[element], newVal] : element == 'tutor' || element == 'belts' ? newVal : [newVal];
            target = form;
        }
        /* The notes of a customer, tutor or contact must be date sorted (on the load from api they are sorted before being fetched state) */
        if (element == 'notes') {
            newVal.sort((a, b) => {
                return moment(b.date, 'DD-MM-YYYY HH:mm:ss').diff(moment(a.date, 'DD-MM-YYYY HH:mm:ss'));
            });
        }
        commit('ADD_FORM_ELEMENT', { form: target, target: element, newVal: newVal });
    },
    /**
     * Check if a contact(s) or tutor are customers too and leave at vuex only their id and notes, the rest of data remains linked and will be setted when the profile of the main customer is being loaded.
     */
    async cleanFormOnSubmit({ commit, dispatch, getters }, form) {
        /* Iterate over the contacts (if there is someone) to clean the contact's phones, emails and the contact itself if there is added but on its pristine value  */
        if (form.contacts && form.contacts.length > 0) {
            const contacts = form.contacts;
            for (let i = 0; i < contacts.length; i++) {
                let contactToSave = {};
                /* If the contact has id store only it as reference and delete the rest of data, also store the notes because there are not of the linked customer */
                if (contacts[i]._id) {
                    contactToSave._id = contacts[i]._id;
                    if (contacts[i].notes) {
                        contactToSave.notes = contacts[i].notes;
                    }
                } else {
                    contactToSave = contacts[i];
                }
                /* If the recent cleaned contact is also empty, delete it or if is not, store at the state the new value */
                if (JSON.stringify(getters.getDefaultState('contacts')) === JSON.stringify(contactToSave)) {
                    await dispatch('delFormElement', { _id: form._id, field: 'contacts', index: i });
                    i--;
                } else {
                    await commit('UPDATE_FIELD', { target: form.contacts, field: i, newVal: contactToSave });
                }
            }
        }
        /* If the tutor has its pristine state and the customer is not underage, delete the tutor */
        if (form.tutor) {
            let tutorToSave = {};
            /* If the tutor has id store only it as reference, also store the notes because there are not of the linked customer */
            if (form.tutor._id) {
                tutorToSave._id = form.tutor._id;
                if (form.tutor.notes) {
                    tutorToSave.notes = form.tutor.notes;
                }
            } else {
                tutorToSave = form.tutor;
            }
            await commit('UPDATE_FIELD', { target: form, field: 'tutor', newVal: tutorToSave });
        }
    },
    /**
     * Function to clear the entire form
     *
     * @param {String} form: the name of the form to clear
     */
    clearForm({ commit }, form) {
        commit('CLEAR_FORM', form);
    },
    /**
     * Delete elements on the dynamic elements of the form object requested, if an _id is passed will be an element of an existing customer, if not will be state.form element
     *
     * @param {String} _id (optional): identifies the customer setted on the form to modify, if is not provided is a new customer
     * @param {String} entity: can be 'customer', 'tutor' or 'contact'
     * @param {Integer} entityIndex (optional): the array index of the entity with an element to delete
     * @param {String} field: identifies the field to delete
     * @param {Integer} fieldIndex: identifies the fieldIndex object to delete
     */
    delFormElement({ commit, dispatch, state }, { _id = null, entity, entityIndex = null, field, fieldIndex }) {
        const form = _id == null ? state.form : state.editform; /* New or existing customer form */
        let target = null;
        /* Get the deep target in every type of entity */
        if (entity == 'contacts') {
            target = form[entity][entityIndex];
        }
        if (entity == 'tutor') {
            target = form[entity];
        }
        if (entity == 'customer') {
            target = form;
        }
        if (target[field].length == 1) {
            /* If the element to delete is the last one delete the entire key from the form state */
            dispatch('delFormObjElement', { state: target, target: field })
        } else {
            commit('DEL_FORM_ELEMENT', { target: target[field], index: fieldIndex });
        }
    },
    /**
     * Function to delete the object dynamic form elements
     *
     * @param {Object} data.state.form | data.state.editform will be the target on the delete will be executed and data.target is the element to delete
     */
    delFormObjElement({ commit }, data) {
        commit('DEL_OBJ_KEY', { ...data });
    },
    /**
     * Fetch the edit form with the customer identified by the id received via param
     *
     * @param {String} id: identifies the customer to use at the form
     */
    async initEditForm({ commit, getters, dispatch }, id) {
        try {
            let customer =  getters.getCustomerById(id);
            /* Check if the customer exists or thrown an error */
            if (!customer || Object.keys(customer).length == 0) {
                throw new exceptions.ExceptionCustomerDoesNotExist('No existe el socio solicitado: ' + id);
            }
            /* The form starts with a copy of the customer, preventing the propagation of the changes maded on the form before store it */
            customer =  JSON.parse(JSON.stringify(customer));
            /* The initial load of the customers doesn't include its images, load they to render on the form */
            customer = await dispatch('fetchCustomerImages', { customer: customer, sign: true, image: true });
            await commit('INIT_FORM', { customer: customer, form: 'editform' });
            setTimeout(() => NProgress.done(true), 500);
        } catch(error) {
            NProgress.done(true);
            console.error(error.response ? error.response.data : error);
            this.$app.$showToast('danger', 'No se han podido completar la carga de datos. Código de error: FeVX@InEdFo', 'Ha ocurrido un error');
            if (error instanceof exceptions.ExceptionCustomerDoesNotExist) {
                return router.push('/404');
            }
        }
    },
    /**
     * Fetch the form with the customer identified by the id received via param
     *
     * @param {String} id: identifies the customer to use at the form
     */
    async initForm({ commit, getters, dispatch }, id) {
        try {
            let customer =  getters.getCustomerById(id);
            /* Check if the customer exists or thrown an error */
            if (!customer || Object.keys(customer).length == 0) {
                throw new exceptions.ExceptionCustomerDoesNotExist('No existe el socio solicitado: ' + id);
            }
            /* The form starts with a copy of the customer, preventing the propagation of the changes maded on the form before store it */
            customer = JSON.parse(JSON.stringify(customer));
            customer = await dispatch('fetchCustomerImages', { customer: customer, sign: true, image: true });
            await commit('INIT_FORM', { customer: customer, form: 'form' });
            setTimeout(() => NProgress.done(true), 500);
        } catch(error) {
            NProgress.done(true);
            console.error(error.response ? error.response.data : error);
            this.$app.$showToast('danger', 'No se han podido completar la carga de datos. Código de error: FeVX@InFo', 'Ha ocurrido un error');
            if (error instanceof exceptions.ExceptionCustomerDoesNotExist) {
                return router.push('/404');
            }
        }
    },
    /**
     * Sets the contact data from the customer data passed, useful when a customer has a contact that is a customer too on the render of the customer profile
     *
     * @param {String} _id (optional): identificates the customer that are being modified, if it's null the customer is still on creation
     * @param {Object} customer: the object with the data to use as a contact
     * @param {Integer} index: identifies the index of the contact to set
     */
    setContact({ commit, getters, state }, { _id = null, customer, index }) {
        const target = _id == null ? state.form.contacts : state.editform.contacts;
        /* Create the contact object on the fly with the customer passed data */
        const contact = Object.assign({}, ...constants.CONTACT_KEYS.map(key => ({ [key]: customer[key] }) ));
        commit('UPDATE_FIELD', { target: target, field: index, newVal: contact });
    },
    /**
     * Sets the contact fields data individually on modifications at the component
     *
     * @param {String} _id (optional): identificates the customer that are being modified, if it's null the customer is still on creation
     * @param {String} field: identifies the contact field to update
     * @param {Integer} fieldIndex (optional): identifies the index of the field to update
     * @param {Integer} contactIndex: identifies the contact to update
     * @param {any} newVal: the value to assign
     */
    setContactFields({ commit, getters, state}, { _id = null, field, fieldIndex = null, contactIndex, newVal}) {
        let inField = field;
        let target = _id == null ? state.form.contacts[contactIndex] : state.editform.contacts[contactIndex];
        /* If the field to update is an array change the target from: contact[contactIndex].field to contact[contactIndex].field[fieldIndex] */
        if (target[inField] instanceof Array) {
            target = target[inField];
            inField = fieldIndex;
        }
        commit('UPDATE_FIELD', { target: target, field: inField, newVal: newVal });
    },
    /**
     * Used on local storage changes to fetch customers edited
     *
     * @param {Object} form: the form data to set as customer
     */
    async setCustomerEdited({ commit, dispatch, getters, state }, form) {
        /* Set a local form */
        let localForm = JSON.parse(JSON.stringify(form));
        const index = state.customers.findIndex(customer => customer._id == localForm._id);
        /* Before store too, fetch the customer dependencies for tutors and contacts getting its data from the customers state */
        localForm = await dispatch('setDependenciesOnSubmit', { customer: localForm });
        commit('SET_CUSTOMER_EDITED', { index: index, newVal: localForm });
    },
    /**
     * When a customer is being saved after its creation or update, before store it to the state of customers is necessary to fill its dependencies
     *
     * @param {Object} customer: the customer data to look for its dependencies
     */
    setDependenciesOnSubmit({ getters }, { customer }) {
        if (customer.tutor && customer.tutor._id) {
            const relatedCustomer = getters.getCustomerById(customer.tutor._id);
            constants.TUTOR_KEYS.forEach(key => customer.tutor[key] = relatedCustomer[key]);
        }
        if (customer.contacts && customer.contacts.length > 0 && customer.contacts.some(contact => contact._id)) {
            customer.contacts.forEach((contact, index) => {
                if (contact._id) {
                    const relatedCustomer = getters.getCustomerById(contact._id);
                    constants.CONTACT_KEYS.forEach(key => customer.contacts[index][key] = relatedCustomer[key]);
                }
            });
        }
        return customer
    },
    /**
     * Sets the tutor data from the customer data passed, useful when a customer has a tutor that is a customer too on the render of the customer profile
     *
     * @param {String} _id (optional): identificates the customer that are being modified, if it's null the customer is still on creation
     * @param {Object} customer: the object with the data to use at the tutor
     */
    setTutor({ commit, getters, state }, { _id = null, customer }) {
        const target = _id == null ? state.form : state.editform;
        const tutor = Object.assign({}, ...constants.TUTOR_KEYS.map(key => ({ [key]: customer[key] }) ));
        commit('UPDATE_FIELD', { target: target, field: 'tutor', newVal: tutor });
    },
    /**
     * Sets the tutor fields data individually on modifications at the component
     *
     * @param {String} _id (optional): identificates the customer that are being modified, if it's null the customer is still on creation
     * @param {String} field: identifies the tutor field to update
     * @param {Integer} fieldIndex (optional): identifies the index of the field to update
     * @param {any} newVal: the value to assign
     */
    setTutorFields({ commit, getters, state }, { _id = null, field, fieldIndex = null, newVal}) {
        let inField = field;
        let target = _id == null ? state.form.tutor : state.editform.tutor;
        /* If the field to update is an array change the target from: tutor.field to tutor.field[index] */
        if (target[inField] instanceof Array) {
            target = target[inField];
            inField = fieldIndex;
        }
        commit('UPDATE_FIELD', { target: target, field: inField, newVal: newVal });
    },
    /**
     * Stores at the db the new customer data on the state.form
     */
    async submitFormAddCustomer({ commit, dispatch, state }) {
        /* Clean the form to store it */
        await dispatch('cleanFormOnSubmit', state.form);
        /* Save the form on the database */
        const response = await http.post('/api/newCustomer', state.form);
        let localCustomer = response.data.newCustomer;
        /* Before store the new customer data from the db to the state, clean and construct its data */
        localCustomer = await dispatch('constructCustomers', [localCustomer]);
        /* Before store too, fetch the customer dependencies for tutors and contacts getting its data from the customers state */
        localCustomer = await dispatch('setDependenciesOnSubmit', { customer: localCustomer[0] });
        /* Commit the mutation on the customers state */
        commit('ADD_CUSTOMER', localCustomer);
        /* Clear the actual form state */
        commit('CLEAR_FORM', 'form');
        router.push({ name: 'customers.profile', params: { id : localCustomer._id } });
        /* Propagate the modification with localStorage to apply the changes on other windows */
        localStorage.setItem('customer_updated', localCustomer._id);
        localStorage.removeItem('customer_updated');
        this.$app.$showToast(response.data.status, response.data.message, response.data.title);
    },
    /**
     * Stores at the db the edited customer data on the state.editform
     */
    async submitFormEditCustomer({ commit, dispatch, state }) {
        /* Clean the form to store it */
        await dispatch('cleanFormOnSubmit', state.editform);
        /* Save the form on the database */
        const response = await http.put('/api/customer/' + state.editform._id + '/edit', state.editform);
        let localCustomer = response.data.editedCustomer;
        if (!response.data.no_changes) {
            /* Before store the new customer data from the db to the state, clean and construct its data */
            localCustomer = await dispatch('constructCustomers', [localCustomer]);
            /* Before store too, fetch the customer dependencies for tutors and contacts getting its data from the customers state */
            localCustomer = await dispatch('setDependenciesOnSubmit', { customer: localCustomer[0] });
            const index = state.customers.findIndex(customer => customer._id == localCustomer._id);
            commit('SET_CUSTOMER_EDITED', { index: index, newVal: localCustomer });
            /* Propagate the modification with localStorage to apply the changes on other windows */
            localStorage.setItem('customer_updated', localCustomer._id);
            localStorage.removeItem('customer_updated');
        }
        /* Go to the customers profile */
        router.push({ name: 'customers.profile', params: { id : localCustomer._id } });
        this.$app.$showToast(response.data.status, response.data.message, response.data.title);
    },
    /**
     * Update inputs of the form on a new or edit customer
     *
     * @param {String} field: identifies the field to update
     * @param {Integer} arrayIndex (optional): identifies the array index of the element to set
     * @param {String} objectKey (optional): identifies the key on the object to set
     * @param {any} newVal: the new value to apply
     * @param {String} _id (optional): identificates the customer to modify if exists a customer to modify, if not, is creating a new customer and not exists _id yet
     */
    updateFormData({ commit, getters, state }, { field, arrayIndex = null, objectKey = null, newVal, _id = null }) {
        /* If the _id is provided we edit form with a customer identified by it, if not we are creating a new customer */
        let target = _id == null ? state.form : state.editform;
        /* If an array index is provided, apply the changes with the array params */
        if (arrayIndex != null) {
            commit('UPDATE_FIELD_ARRAY', { target: target, field: field, index: arrayIndex, newVal: newVal });
            return;
        }
        /* If an object key is provided, apply the changes with the object params */
        if (objectKey != null) {
            commit('UPDATE_FIELD_OBJECT', { target: target, field: field, key: objectKey, newVal: newVal });
            return;
        }
        /* If a base element is edited apply the changes */
        if (arrayIndex == null && objectKey == null) {
            commit('UPDATE_FIELD', { target: target, field: field, newVal: newVal });
            return;
        }
    },
    /**
     * Update the form belts of a existing customer or a new (defined by if the id para is provided. The newVal param defines the action: if a newVal is provided the current value is updated to it, if its value is null set it too because a delete was required)
     *
     * @param {String} id (optional): Identifies the id of a customer loaded at the form, if is not provided a new customer is being created
     * @param {Array} selectedBelts: Is the array of the selected belts to modify
     * @param {String} newVal (optional): Can contains a date or null for the deletions
     */
    updateFormBelts({ commit, state }, { id = null, selectedBelts, newVal = null }) {
        /* If the id is provided we edit the customer identified by it, if not we are creating a new customer */
        let form = id == null ? state.form : state.editform;
        let belts = JSON.parse(JSON.stringify(form.belts)); /* Local copy of the customer belts */
        /* Assign the new dates */
        belts.forEach(belt => {
            if (selectedBelts.some(sb => sb.grade == belt.grade)) {
                belt.date = newVal;
            }
        });
        /* If a existing customer is edited, propagate the changes */
        if (id) {
            localStorage.setItem('customer_updated', id);
            localStorage.removeItem('customer_updated');
        }
        /* If every dates are deleted and the form doesn't needs the belts delete it from the state else update the belts field on the target */
        if (!form.paymentData.rate.includes('Karate') && belts.every(belt => belt.date == null)) {
            commit('DEL_OBJ_KEY', { state: form, target: 'belts' });
        } else {
            commit('UPDATE_FIELD', { target: form, field: 'belts', newVal: belts });
        }
    },
}
