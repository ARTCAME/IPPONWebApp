import constants from '../utils/constants';

export default {
    /**
     * @return {Array} Array with the objects with the sum of the customer relevant data and the customers belts data. Also added some variables usefuls to the reactivity of the table
     */
    getBelts: (state, getters) => (filterGrades, inactives) => {
        let belts = [];
        /* Build the array with all the belts and customer data necessary */
        getters.getCustomersWithBelts.forEach(customer => {
            belts = [
                ...belts,
                {
                    /* Data from the customer */
                    _id: customer._id,
                    active: customer.active,
                    customerNumber: customer.customerNumber,
                    belts: customer.belts,
                    name: customer.name,
                    /* Row variables, are modified at the view */
                    grade: getters.getLastBelts(customer.belts).grade,
                    nextGrade: getters.getLastBelts(customer.belts).nextGrade,
                }
            ];
        });
        /* Apply the filters requested to the builded belts */
        if (!inactives) {
            belts = belts.filter(belt => belt.active == true);
        }
        if (filterGrades.length > 0) {
            belts = belts.filter(belt => filterGrades.includes(belt.grade));
        }
        return belts;
    },
    /**
     * @param {Array} belts: Array of objects with a individual customer belts data
     *
     * @return {Object} Object with the current and next grades calculated on the belts passed
     */
    getLastBelts: state => belts => {
        /* If the customer doesn't has any belt return the initial values */
        if (belts.every(belt => belt.date == null)) {
            return { grade: 'blbl', nextGrade: 'blam' };
        }
        /* Get the reached belts (them are filled with a date) */
        const inBelts = belts.filter(belt => belt.date != null);
        /* Determine the last belt reached to get the grade and nextGrade attributes */
        let lastBelt = 'blam';
        inBelts.forEach(belt => {
            lastBelt = constants.GRADES.indexOf(lastBelt) >= constants.GRADES.indexOf(belt.grade) ? lastBelt : belt.grade;
        });
        /* Determine the next grade, check if is the last possible 'nene' */
        const nextGrade = lastBelt == 'nene' ? '' : constants.GRADES[constants.GRADES.indexOf(lastBelt) + 1];
        return { grade: lastBelt, nextGrade: nextGrade };
    },
}
