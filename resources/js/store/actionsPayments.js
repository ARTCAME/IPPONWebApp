import constants from '../utils/constants';
import moment from 'moment';
import { http } from '../utils/http';

export default {
    /**
     * Adds the new payment to the db and store. Propagate the changes to every window and to the editform state
     *
     * @param {Object} item: is the payment data to add
     */
    addPayment({ commit, dispatch, getters, state }, item) {
        return new Promise((resolve, reject) => {
            /* Call to the db to add the payment */
            http.post('/api/newPayment', { item })
                .then(apiResponse => {
                    /* Get the customer updated */
                    const customer = getters.getCustomerById(item._id);
                    // /* Get if the payment already exitsts */
                    // const exists = customer.payments && customer.payments.some(payment => payment.payment_id == apiResponse.data.payment_id);
                    /* Convert the apiResponse dates */
                    apiResponse.data.dategenerated = apiResponse.data.dategenerated != null && apiResponse.data.dategenerated.$date ? moment(parseInt(apiResponse.data.dategenerated.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss') : apiResponse.data.dategenerated;
                    apiResponse.data.dateconfirmed = apiResponse.data.dateconfirmed != null && apiResponse.data.dateconfirmed.$date ? moment(parseInt(apiResponse.data.dateconfirmed.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss') : apiResponse.data.dateconfirmed;
                    // if (!exists) {
                    commit('ADD_PAYMENT', { target: customer, newPayment: apiResponse.data });
                    /* Trigger a modification on the localStorage to propagate the changes on other windows */
                    localStorage.setItem('customer_updated', item._id);
                    localStorage.removeItem('customer_updated');
                    /* If the current state form contains the same customer update it */
                    if (state.editform._id == item._id) {
                        dispatch('initEditForm', customer._id);
                    }
                    // }
                    resolve(apiResponse.data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },
    /**
     * Delete a specific payment
     *
     * @param {Object} item: the payment data to delete
     */
    deletePayment({ commit, getters }, item) {
        return new Promise((resolve, reject) => {
            /* Get the api response */
            http.post('/api/deletePayments', { item })
                .then(apiResponse => {
                    /* Get the customer */
                    const customer = getters.getCustomerById(item._id);
                    /* Get the payment index */
                    const paymentIndex = getters.getPaymentIndex(item._id, item.payment_id);
                    /* Commit the mutation */
                    commit('DELETE_PAYMENT', { customer: customer, paymentIndex: paymentIndex });
                    /* Trigger a modification on the localStorage to propagate the changes on other windows */
                    localStorage.setItem('customer_updated', item._id);
                    localStorage.removeItem('customer_updated');
                    resolve(apiResponse);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    /**
     * Update the entire payment data
     *
     * @param {Object} item: is the payment data to update
     */
    updatePaymentData({ commit, getters }, { items, action }) {
        return new Promise((resolve, reject) => {
            /* Call to the db to update the payments */
            http.post('/api/updatePayments', constants.QS.stringify({ data: items, action: action }))
                .then(apiResponse => {
                    apiResponse.data.updated.forEach(item => {
                        /* Get the customer */
                        const customer = getters.getCustomerById(item._id);
                        /* Get the payment index */
                        const paymentIndex = getters.getPaymentIndex(item._id, item.payment_id);
                        /* Convert the apiResponse dates */
                        item.dategenerated = item.dategenerated != null && item.dategenerated.$date ? moment(parseInt(item.dategenerated.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss') : item.dategenerated;
                        item.dateconfirmed = item.dateconfirmed != null && item.dateconfirmed.$date ? moment(parseInt(item.dateconfirmed.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss') : item.dateconfirmed;
                        commit('UPDATE_PAYMENT', { customer: customer, paymentIndex: paymentIndex, newVal: item });
                    });
                    resolve(apiResponse.data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },
}
