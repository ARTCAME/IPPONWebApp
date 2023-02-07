import constants from '../utils/constants';

export default {
    /**
     * @param {String} stateName: the name of the object to serve
     *
     * @return {Object} Object with the state requesteds
     */
    getDefaultState: (state) => (stateName) => {
        switch (stateName) {
            case 'form':
                return constants.DEFAULT_FORM;
            case 'tutor':
                return constants.DEFAULT_TUTOR;
            case 'contacts':
                return constants.DEFAULT_CONTACT;
            case 'phones':
                return constants.DEFAULT_PHONE;
            case 'emails':
                return "";
            case 'belts':
                return constants.DEFAULT_BELTS;
        }
    },
}
