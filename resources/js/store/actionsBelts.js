import constants from '../utils/constants';
import exceptions from '../Exceptions';
import NProgress from 'nprogress';
import { http } from '../utils/http';

/* Note: Exists action updateFormBelts that is used on the MainForm component to save the belts on form modifications, this modifications are saved to the db via the main save of the form */
export default {
    /**
     * Delete the belts of a specific belt from the bels main page AND THE FORM PAGE
     *
     * @param {String} id: the id of the customer to edit, references her/one row
     * @param {Array} selectedBelts: array of belts to delete
     *
     * @return Object with the response data of the api call: the customer data. Is necessary at the component to refill the customer edited data
     */
    async deleteBelts({ commit, getters }, { id, selectedBelts }) {
        try {
            const customer = getters.getCustomerById(id);
            if (!customer) {
                throw new exceptions.ExceptionCustomerDoesNotExist('El socio no existe: ' + id);
            }
            const response = await http.post('/api/deleteBelts', ({ id: id, belts: selectedBelts }));
            if (!response || !response.data || Object.keys(response.data).length == 0) {
                throw new exceptions.ExceptionResponseDataNotPresent('No se han podido borrar los datos');
            }
            /* Commit the changes on the customer */
            commit('UPDATE_BELTS', { customer: customer, newVal: response.data.deletedBelts });
            /* Trigger a modification on the localStorage to propagate the changes on other windows */
            localStorage.setItem('customer_updated', id);
            localStorage.removeItem('customer_updated');
            return response.data;
        } catch(error) {
            console.error(error.response ? error.response.data : error);
            this.$app.$showToast('danger', 'No se han podido completar el proceso. FeVX@DeBe', 'Ha ocurrido un error');
            NProgress.done(true);
        }
    },
    /**
     * Update the belts of a specific belt from the bels main page AND THE FORM PAGE
     *
     * @param {String} id: the id of the customer to edit, references her/one row
     * @param {Array} selectedBelts: array of belts to update
     * @param {String} date: date formatted to apply to the selectedBelts
     *
     * @return Object with the response data of the api call: the customer data. Is necessary at the component to refill the customer edited data
     */
    async updateBelts({ commit, getters }, { id, selectedBelts, date }) {
        try {
            const customer = getters.getCustomerById(id);
            if (!customer) {
                throw new exceptions.ExceptionCustomerDoesNotExist('El socio no existe: ' + id);
            }
            const response = await http.post('/api/updateBelts', ({ id: id, belts: selectedBelts, date: date }));
            if (!response || !response.data || Object.keys(response.data).length == 0) {
                throw new exceptions.ExceptionResponseDataNotPresent('No se han podido actualizar los datos');
            }
            /* Commit the changes on the customer */
            commit('UPDATE_BELTS', { customer: customer, newVal: response.data.updatedBelts });
            /* Trigger a modification on the localStorage to propagate the changes on other windows */
            localStorage.setItem('customer_updated', id);
            localStorage.removeItem('customer_updated');
            return response.data;
        } catch(error) {
            console.error(error.response ? error.response.data : error);
            this.$app.$showToast('danger', 'No se han podido completar el proceso. FeVX@UpBe', 'Ha ocurrido un error');
            NProgress.done(true);
        }
    },
    async updateBeltsMassive({ commit, getters }, { newDate, customers }) {
        try {
            const response = await http.post('/api/autoBelts', constants.QS.stringify({ date: newDate, customers: customers }))
            let beltsUpdated  = [];
            response.data.forEach(async item => {
                console.log(item);
                await commit('UPDATE_BELTS', { customer: getters.getCustomerById(item.customer._id), newVal: item.customer.belts });
                /* Trigger a modification on the localStorage to propagate the changes on other windows */
                /* DOESN'T USED FOR NOW, THIS WILL TRIGGER A LOT OF UNUSEFUL ACTIONS */
                // localStorage.setItem('customer_updated', item.customer._id);
                // localStorage.removeItem('customer_updated');
                /* If the updated was made on the db add the current edited element to the edited arr with wich create a csv file */
                if (item.status == 'success') {
                    beltsUpdated.push({ name: item.customer.name, grade: item.nextGrade, date: newDate });
                }
            });
            return beltsUpdated;
        } catch(error) {
            this.$app.$showToast('danger', 'No se han podido guardar los datos. Código de error: FEVX@UpBeMa', 'Ha ocurrido un error')
            console.error(error.response ? error.response.data : error);
        }
    },
}
