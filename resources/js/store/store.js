import auth from './modules/auth';
import actionsCustomers from './actionsCustomers';
import actionsBelts from './actionsBelts';
import actionsForms from './actionsForms';
import actionsPayments from './actionsPayments';
import gettersCustomers from './gettersCustomers';
import gettersBelts from './gettersBelts';
import gettersForms from './gettersForms';
import gettersPayments from './gettersPayments';
import mutations from './mutations';
import constants from '../utils/constants';
import navbar from './modules/navbar';
import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    // actions: actionsCustomers,
    actions: { ...actionsBelts, ...actionsCustomers, ...actionsForms, ...actionsPayments },
    getters: { ...gettersCustomers, ...gettersBelts, ...gettersForms, ...gettersPayments },
    modules: {
        auth,
        navbar,
    },
    mutations: mutations,
    name: 'customers',
    namespaced: true,
    state: {
        customers: [],
        form: constants.DEFAULT_FORM,
        editform: constants.DEFAULT_FORM,
    },
    strict: true,
});
