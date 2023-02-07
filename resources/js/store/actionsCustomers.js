import constants from '../utils/constants';
import exceptions from '../Exceptions';
import moment from 'moment';
import NProgress from 'nprogress';
import router from '../router/router';
import { http } from '../utils/http';

export default {
    /**
     * Clean certain data of the customers passed. This function is called during the first load and manage the api response data
     *
     * @param {Array} customers: Contains the objects with the data of every customer
     *
     * @return {Array} Array with the customers builded with the app neededs formats
     */
    constructCustomers({ dispatch }, customers) {
        customers.forEach(customer => {
            /* Reveal the id of every customer before fill the store */
            customer._id = customer._id.$oid ? customer._id.$oid : customer._id;
            /* Call to the payments cleaner */
            customer.payments && customer.payments.length > 0 && dispatch('initPayments', customer.payments);
            /* Clean the dates */
            customer.created_at = customer.created_at.$date ? moment(parseInt(customer.created_at.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss') : customer.created_at;
            customer.updated_at = customer.updated_at.$date ? moment(parseInt(customer.updated_at.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss') : customer.updated_at;
            /* Sort the notes */
            customer.notes && customer.notes.sort((a, b) => {
                return moment(b.date, 'DD-MM-YYYY HH:mm:ss').diff(moment(a.date, 'DD-MM-YYYY HH:mm:ss'));
            });
        });
        return customers;
    },
    /**
     * Initialize the dependencies of the customers passed. This function is called during the first load and manage the api response data
     *
     * @param {Object} customers: The customers to find the fetch data
     */
    fetchCustomerDependencies({}, customers) {
        /* Search the customer with tutor and the tutor at the same array of customers received */
        customers.filter(customer => customer.tutor && customer.tutor._id).forEach(customerWithTutor => {
            let tutorData = customers.find(customer => customer._id == customerWithTutor.tutor._id);
            constants.TUTOR_KEYS.forEach(key => customerWithTutor.tutor[key] = tutorData[key]);
        });
        /* Search the customer with contacts and the contact at the same array of customers received */
        customers.filter(customer => customer.contacts && customer.contacts.length > 0 && customer.contacts.some(contact => contact._id)).forEach(customerWithContacts => {
            customerWithContacts.contacts.forEach((contact, index) => {
                if (contact._id) {
                    let contactData = customers.find(tfc => tfc._id == contact._id);
                    constants.CONTACT_KEYS.forEach(key => customerWithContacts.contacts[index][key] = contactData[key]);
                }
            })
        });
        return customers;
    },
    /**
     * Function to fetch the images of a specific customer. On the initial load, to save bandwith and improve speed, the customers doesn't include their images and turns necessary load they on demand on certain context like before print a document that includes the customer signature or before load the customer profile
     *
     * @param {Object} customer: the state customer object to update
     * @param {Boolean} sign: flag to determine if is needed
     * @param {Boolean} image: flag to determine if is needed
     */
    async fetchCustomerImages({ commit, getters }, { customer, sign, image}) {
        try {
            const response = await http.get('/api/customer/' + customer._id + '/images', { params: { sign: sign, image, image } });
            if (!response || !response.data || Object.keys(response.data).length == 0) {
                throw new exceptions.ExceptionResponseDataNotPresent('No se han podido cargar las imágenes del socio del socio')
            }
            if (sign) {
                commit('UPDATE_FIELD', { target: customer, field: 'sign', newVal: response.data.sign });
            }
            if (image) {
                commit('UPDATE_FIELD', { target: customer, field: 'image', newVal: response.data.image });
            }
            return customer;
        } catch(error) {
            console.error(error.response ? error.response.data : error);
            this.$app.$showToast('danger', 'No se han podido cargar los datos del socio. Recarga la página. Código de error: FeVX@FeCuIm', 'Ha ocurrido un error');
            NProgress.done(true);
        }
    },
    /**
     * Gets all the customers and call to the fetcher/formatter action. This function is called from app.js on the initial load
     */
    async getCustomers({ dispatch }) {
        try {
            const response = await http.get('/api/customers');
            if (!response || !response.data || Object.keys(response.data).length == 0) {
                throw new exceptions.ExceptionResponseDataNotPresent('No se han podido cargar los socios')
            }
            await dispatch('initCustomers', response.data);
        } catch(error) {
            console.error(error.response ? error.response.data : error);
            NProgress.done(true);
        }
    },
    /**
     * Initialize the customers with the db data to store it at vuex. This function is called during the first load and manage the api response data
     *
     * @param {Array} customers: Contains the objects with the data of every customer
     */
    async initCustomers({ commit, dispatch }, customers) {
        /* Clean certain data of each customer from the db */
        let newCustomers = await dispatch('constructCustomers', customers);
        /* Before store to the state, fetch its dependencies for tutors and contacts */
        newCustomers = await dispatch('fetchCustomerDependencies', newCustomers);
        /* Save at the state the builded, cleaned and dependencied filled customers */
        commit('SET_CUSTOMERS', newCustomers);
    },
    /**
     * Initilizes updated customers. Usually called from the main app when a localStorage event was ocurred. Is created to avoid treat all the customer on minor updates
     *
     * @param {Array} ids: Array of ids wich identifies the updated customers
     */
    async initCustomersEdited({ commit, dispatch, state }, id) {
        try {
            /* Get the customer from the db */
            let response = await http.get('/api/customer/' + id);
            /* Check if the data provided is valid or thrown an error */
            if (!response || !response.data || Object.keys(response.data).length == 0) {
                throw new exceptions.ExceptionCustomerDoesNotExist('No existe el socio solicitado: ' + id)
            }
            /* Construct every customer individually */
            const customer = await dispatch('constructCustomers', [response.data]);
            /* Commit the mutation on the customers state */
            const index = state.customers.findIndex(customer => customer._id == id);
            commit('UPDATE_FIELD', { target: state.customers, field: index, newVal: customer[0] });
            /* If the form state is using the customer, update it */
            if (state.form._id == id) {
                dispatch('initForm', id);
            }
            if (state.editform._id == id) {
                dispatch('initEditForm', id);
            }
        } catch(error) {
            console.error(error.response ? error.response.data : error);
            this.$app.$showToast('danger', 'No se han podido completar la carga de datos. FeVX@InCuEd', 'Ha ocurrido un error');
            NProgress.done(true);
            if (error instanceof exceptions.ExceptionCustomerDoesNotExist) {
                return router.push('/404');
            }
        }
    },
    /**
     * To simplify the in components operations, convert certain payment data
     *
     * @param {Array} payments: Contains the objects with every payment of a customer (this actions is usually called in a for each customer function)
     */
    initPayments({}, payments) {
        payments.forEach(payment => {
            /* Convert the mongo dates */
            payment.dategenerated = payment.dategenerated != null ? payment.dategenerated.$date && moment(parseInt(payment.dategenerated.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss') : payment.dategenerated;
            payment.dateconfirmed = (payment.status == 'Devuelto' || payment.status == 'Confirmado') ? (payment.dateconfirmed != null && payment.dateconfirmed.$date && moment(parseInt(payment.dateconfirmed.$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss')) : payment.dateconfirmed;
        });
    },
}
