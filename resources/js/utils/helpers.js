import constants from './constants';

/**
 * Converts the special characters on the passed strings to regular to compare it properly and transparent to the user
 *
 * @param {String} value: string used to search data
 */
function manageSpecialCharacters(value) {
    let result = '';
    for (let i = 0; i < value.length; i++) {
        result += constants.SPECIAL_CHARACTERS[value.charAt(i)] || value.charAt(i);
    }
    return result;
}
/**
 * Check if the value passed exists and has coincidences with the filter applied
 *
 * @param {String} value: data to be converted to string and to lower case then to check if has coincidences
 * @param {String} filter: filter typed by the user
 */
function checkCoincidence(value, filter) {
    const inFilter = manageSpecialCharacters(filter.toString().toLowerCase());
    const inValue = manageSpecialCharacters(value.toString().toLowerCase());
    if (value) {
        return inValue.includes(inFilter);
    }
    return false;
}
/**
 * Clean the object|array stringify chars and the object keys knowed to avoid dirty results
 *
 * @param {String} fieldValue: the value of the customer[key] to compare with the data typed by the users
 */
function cleanData(fieldValue) {
    return fieldValue.replace(/[\'\"\]\[\(\)\,\:\{\}]|\bnull|\bphone|\bnotes|\biban|\bibanownername|\bibanownerdni|\brate|\bamount|\bpaymenttype+/g, '')
}

export default {
    cleanData,
    checkCoincidence,
    manageSpecialCharacters,
}
