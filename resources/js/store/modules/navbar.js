import Vue from 'vue';

const actions = {
    /**
     * Stop all the stoppable procedures
     *
     * @param {String} group (optional): the name of the group to manage, if its null all the procedures are managed
     */
    endProcedures({ commit, state }, group = null) {
        /* Filter the elements by group like belts* or payments* or whatever */
        let elements = group != null ? Object.keys(state).filter(key => key.includes(group)) : Object.keys(state);
        elements.forEach(procedure => {
            /* Remains actived 'paymentsCharts, is not a procedure but we need to active it globally*/
            if (procedure != 'paymentsCharts' && state[procedure] == true) {
                commit('SET_PROCEDURE_STATE', { target: procedure, newVal: false });
            }
        });
    },
    /**
     * Active/Deactive procedures
     *
     * @param {String} procedure: the name of the procedure to change its value
     * @param {Boolean} newVal (optional): if its provided will be a boolean with the new value, if is not provided the new value is the opposite to the current
     */
    setProcedureState({ commit, dispatch, state }, { procedure, newVal = null }) {
        /* If a new value is not provided the new value is the opposite to the current procedure value */
        const value = newVal === null ? !state[procedure] : newVal;
        /* End the rest of procedures only when the caller is not compatible with the rest (paymentsCharts is the uniq that can be started with other at same time) */
        if (procedure != 'paymentsCharts') {
            dispatch('endProcedures');
        }
        commit('SET_PROCEDURE_STATE', { target: procedure, newVal: value });
    }
}
const getters = {
    /**
     * @return {Boolean} Boolean that indicates if some belts procedure was started
     */
    getIsProcedureBeltsStarted: state => {
        let result = false;
        Object.keys(state).forEach(procedure => {
            if (procedure.includes('belts') && state[procedure] == true) {
                result = true;
            }
        });
        return result;
    },
    /**
     * @return {Boolean} Boolean that indicates if some payments procedure was started
     */
    getIsProcedurePaymentsStarted: state => {
        let result = false;
        Object.keys(state).forEach(procedure => {
            if (procedure != 'paymentsCharts' && procedure.includes('payments') && state[procedure] == true) {
                result = true;
            }
        });
        return result;
    },
    /**
     * @return {Boolean} Boolean that is the procedure state
     */
    getProcedureState: state => procedure => {
        return state[procedure];
    },
}
const mutations = {
    /**
     * Store the procedure state changes
     *
     * @param {String} target: the name of the procedure to change
     * @param {Boolean} newVal: the boolean new value
     */
    SET_PROCEDURE_STATE(state, { target, newVal }) {
        Vue.set(state, target, newVal);
    }
}
const state = {
    paymentsCharts: false,
    paymentsConfirming: false,
    paymentsPrinting: false,
    beltsUpdating: false,
    beltsPrinting: false,
}
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}
