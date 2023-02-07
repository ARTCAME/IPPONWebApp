import moment from 'moment';

export default {
    /**
     * Function to filter by the provided filters the payments provided
     *
     * @param {Array} payments: The array with the payments to filter
     * @param {Array} filterYears: Array with the years to filter
     * @param {Array} filterMonths: Array with the months to filter
     * @param {Array} filterStatus: Array with the states to filter
     * @param {Array} filterPaytype: Array with the paytype to filter
     * @param {Boolean} inactives: Indicates that are requested the inactive customers or not
     *
     * @returns {Array} Array composed by the filtered payments
     */
    filterPayments: (state, getters) => ({ payments, filterYears, filterMonths, filterStatus, filterPaytype, filterType, creationRange, confirmationRange, inactives }) => {
        /* Apply all the filters requested to the builded payments */
        if (!inactives) {
            payments = payments.filter(payment => payment.active == true);
        }
        if (filterYears && filterYears.length > 0) {
            payments = payments.filter(payment => filterYears.includes(moment(payment.interval,'YYYY-MM').year()));
        }
        if (filterMonths && filterMonths.length > 0) {
            payments = payments.filter(payment => filterMonths.includes(moment(payment.interval,'YYYY-MM').month()));
        }
        if (filterStatus && filterStatus.length > 0) {
            payments = payments.filter(payment => filterStatus.includes(payment.status));
        }
        if (filterPaytype && filterPaytype.length > 0) {
            payments = payments.filter(payment => filterPaytype.includes(payment.paymenttype));
        }
        if (filterType && filterType.length > 0) {
            payments = payments.filter(payment => filterType.includes(payment.type));
        }
        if (creationRange && creationRange.startDate != null && creationRange.endDate != null) {
            payments = payments.filter(payment => moment(payment.dategenerated, 'DD/MM/YYYY HH:mm:ss').isSameOrAfter(moment(creationRange.startDate, 'YYYY/MM/DD HH:mm:ss')) && moment(payment.dategenerated, 'DD/MM/YYYY HH:mm:ss').isSameOrBefore(moment(creationRange.endDate, 'YYYY/MM/DD HH:mm:ss')));
        }
        if (confirmationRange && confirmationRange.startDate != null && confirmationRange.endDate != null) {
            payments = payments.filter(payment => moment(payment.dateconfirmed, 'DD/MM/YYYY HH:mm:ss').isSameOrAfter(moment(confirmationRange.startDate, 'YYYY/MM/DD HH:mm:ss')) && moment(payment.dateconfirmed, 'DD/MM/YYYY HH:mm:ss').isSameOrBefore(moment(confirmationRange.endDate, 'YYYY/MM/DD HH:mm:ss')));
        }
        return payments;
    },
    /**
     * @param {Array} filterYears: Array with the years to filter
     * @param {Array} filterMonths: Array with the months to filter
     * @param {Array} filterStatus: Array with the states to filter
     * @param {Array} filterPaytype: Array with the paytype to filter
     * @param {Boolean} inactives: Indicates that are requested the inactive customers or not
     *
     * @return {Array} Array of payments formed by the sum of the certain customer data and the payment data. Return only the payments after apply the filters requested. Every payment has the format to be included on a b-table element
     */
    getFilteredPaymentsAll: (state, getters) => (data) => {
        let payments = [];
        /* Build the array with all the payments by sum customer and payment data */
        getters.getCustomersWithPayments.forEach(customer => {
            if (customer.payments) {
                customer.payments.forEach(payment => {
                    payments = [
                        ...payments,
                        {
                            /* Data from the customer */
                            _id: customer._id,
                            active: customer.active,
                            customerNumber: customer.customerNumber,
                            dni: customer.dni,
                            name: customer.name,
                            /* Payment data */
                            ...payment,
                        }
                    ];
                });
            }
        });
        /* Filter the payments with the filters provided */
        return getters.filterPayments({ ...data, payments: payments });
    },
    /**
     * @param {String} _id: Identificates the customer that we need to obtain her payments
     * @param {Array} filterYears: Array with the years to filter
     * @param {Array} filterMonths: Array with the months to filter
     * @param {Array} filterStatus: Array with the states to filter
     * @param {Array} filterPaytype: Array with the paytype to filter
     * @param {Boolean} inactives: Indicates that are requested the inactive customers or not
     *
     * @return {Array} Array of payments formed by the sum of the certain customer data and the payment data. Return only the payments after apply the filters requested. Every payment has the format to be included on a b-table element. The payments returned are only from the _id passed as param. Is used at the customer profile.
     */
    getFilteredPaymentsById: (state, getters) => (data) => {
        let payments = [];
        const customer = getters.getCustomerById(data._id);
        /* Build the array with all the payments by sum customer and payment data */
        if (customer.payments) {
            customer.payments.forEach(payment => {
                payments = [
                    ...payments,
                    {
                        /* Data from the customer */
                        _id: customer._id,
                        active: customer.active,
                        customerNumber: customer.customerNumber,
                        dni: customer.dni,
                        name: customer.name,
                        /* Payment data */
                        ...payment
                    }
                ];
            });
        }
        /* Filter the payments with the filters provided */
        return getters.filterPayments({ ...data, payments: payments });
    },
    /**
     * @param {String} _id: Identifies the customer to search on it
     * @param {String} paymentId: Identifies the payment to retrieve
     *
     * @return {Object|undefined} If the payment exists returns it if not returns undefined
     */
    getPaymentByPaymentId: (state, getters) => (_id, paymentId) => {
        const customer = getters.getCustomerById(_id);
        if (paymentId == null || !customer.payments) {
            return undefined;
        }
        return customer.payments.find(payment => payment.payment_id == paymentId);
    },
    /**
     * @param {String} _id: Identifies the customer to search on it
     * @param {String} interval: Identifies the payment to search on the customer
     *
     * @return {Array|undefined} If the payment/s exists returns it in array if not undefined
     */
    getPaymentData: (state, getters) => (_id, interval) => {
        const customer = getters.getCustomerById(_id);
        if (interval == null || !customer.payments) {
            return undefined;
        }
        /* The find will only reveal one element because the periodic payments can share its payment interval */
        return customer.payments.find(payment => payment.type == 'periodic' && payment.interval == interval);
    },
    /**
     * @param {String} id: identifies the customer to search on his payments
     * @param {String} payment_id: identifies the payment to search
     *
     * @return {Integer} The index of the payment searched on the customer payments, can be -1 if no payment has founded
     */
    getPaymentIndex: (state, getters) => (id, payment_id) => {
        let customer = getters.getCustomerById(id);
        return customer.payments.indexOf(customer.payments.find(payment => payment.payment_id == payment_id)) || -1;
    },
    /**
     * @return {Array} Array sorted with the years with payments (extracted from the existing payments intervals)
     */
    getPaymentsYears: (state, getters) => {
        let years = [moment().year()];
        /* Iterate over the payments to extract the distinct year that appear in their intervals */
        getters.getCustomersWithPayments.forEach(customer => {
            if (customer.payments) {
                customer.payments.forEach(payment => {
                    moment(payment.interval, 'YYYY-MM').isValid() && !years.includes(moment(payment.interval, 'YYYY-MM').year()) && years.push(moment(payment.interval, 'YYYY-MM').year());
                });
            }
        });
        return years.sort();
    },
}
