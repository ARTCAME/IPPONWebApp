const CONTACT_KEYS = ['_id', 'customerNumber', 'emails', 'name', 'phones'];
const QS = require('qs'); /* Needed at post function to pass arrays as params to the controller */
const TUTOR_KEYS = ['_id', 'address', 'customerNumber', 'dni', 'emails', 'name', 'phones'];
const GRADES = [ /* 'blbl',  */'blam', 'amam', 'amna', 'nana', 'nave', 'veve', 'veaz', 'azaz', 'azma', 'mama', 'nene', ];
const SPECIAL_CHARACTERS = { 'Ã': 'A', 'À': 'A', 'Á': 'A', 'Ä': 'A', 'Â': 'A', 'È': 'E', 'É': 'E', 'Ë': 'E', 'Ê': 'E', 'Ì': 'I', 'Í': 'I', 'Ï': 'I', 'Î': 'I', 'Ò': 'O', 'Ó': 'O', 'Ö': 'O', 'Ô': 'O', 'Ù': 'U', 'Ú': 'U', 'Ü': 'U', 'Û': 'U', 'ã': 'a', 'à': 'a', 'á': 'a', 'ä': 'a', 'â': 'a', 'è': 'e', 'é': 'e', 'ë': 'e', 'ê': 'e', 'ì': 'i', 'í': 'i', 'ï': 'i', 'î': 'i', 'ò': 'o', 'ó': 'o', 'ö': 'o', 'ô': 'o', 'ù': 'u', 'ú': 'u', 'ü': 'u', 'û': 'u', 'Ñ': 'N', 'ñ': 'n', 'Ç': 'c', 'ç': 'c' };
const DEFAULT_BELTS = [
    { grade: 'blam', date: null, },
    { grade: 'amam', date: null, },
    { grade: 'amna', date: null, },
    { grade: 'nana', date: null, },
    { grade: 'nave', date: null, },
    { grade: 'veve', date: null, },
    { grade: 'veaz', date: null, },
    { grade: 'azaz', date: null, },
    { grade: 'azma', date: null, },
    { grade: 'mama', date: null, },
    { grade: 'nene', date: null, }
];
const DEFAULT_CONTACT = {
    // _id: null,
    // customerNumber: null,
    // emails: [],
    name: '',
    // notes: '',
    // phones: [],
};
const DEFAULT_PHONE = {
    phone: '',
    notes: '',
};
const DEFAULT_FORM = {
    _id: null,
    customerNumber: null,
    active: true,
    // sign: '',
    // image: '',
    name: '',
    address: '',
    dni: '',
    dateofbirth: '',
    gender: '',
    // emails: [],
    phones: [ DEFAULT_PHONE ],
    // contacts: [],
    paymentData: {
        amount: '',
        // iban: '',
        // ibanownerdni: '',
        // ibanownername: '',
        paymenttype: '',
        rate: '',
        type: '',
        payment_id: '',
    },
    // payments: [],
    // belts: [
    //     { grade: 'blam', date: null, },
    //     { grade: 'amam', date: null, },
    //     { grade: 'amna', date: null, },
    //     { grade: 'nana', date: null, },
    //     { grade: 'nave', date: null, },
    //     { grade: 'veve', date: null, },
    //     { grade: 'veaz', date: null, },
    //     { grade: 'azaz', date: null, },
    //     { grade: 'azma', date: null, },
    //     { grade: 'mama', date: null, },
    //     { grade: 'nene', date: null, }
    // ],
    rightsProtect: {
        RPaccept: null,
        date: null,
    },
    rightsImage: {
        RIaccept: null,
        date: null,
    },
    // notes: [],
};
const DEFAULT_TUTOR = {
    // _id: null,
    // customerNumber: null,
    address: '',
    dni: '',
    // emails: [],
    name: '',
    // notes: '',
    // phones: [],
};

const RATES = {
    '1 día semana': 26,
    '2 días semana': 37,
    '3 días Karate': 41,
    //21/22 --> 'Karate 1': 25,// 20/21 --> 24,
    //21/22 --> 'Karate 2': 35,// 20/21 --> 34,
    //21/22 --> 'Karate 3': 39,// 20/21 --> 38,
    //21/22 -->  'GYM 1': 25,// 20/21 --> 24,
    //21/22 -->  'GYM 2': 36,// 20/21 --> 35,
    'GYM Libre': 43, //21/22 -->  'GYM Libre': 41,// 20/21 --> 40,
    'Personalizada + Karate': '',
    'Personalizada + GYM': ''
}
    // DEFAULT_BELTS() {
    //     return [
    //         { grade: 'blam', date: null, },
    //         { grade: 'amam', date: null, },
    //         { grade: 'amna', date: null, },
    //         { grade: 'nana', date: null, },
    //         { grade: 'nave', date: null, },
    //         { grade: 'veve', date: null, },
    //         { grade: 'veaz', date: null, },
    //         { grade: 'azaz', date: null, },
    //         { grade: 'azma', date: null, },
    //         { grade: 'mama', date: null, },
    //         { grade: 'nene', date: null, }
    //     ]
    // },
    // DEFAULT_CONTACT() {
    //     return {
    //         // _id: null,
    //         // customerNumber: null,
    //         // emails: [],
    //         name: '',
    //         // notes: '',
    //         // phones: [],
    //     }
    // },
    // DEFAULT_FORM() {
    //     return {
    //         _id: null,
    //         customerNumber: null,
    //         active: true,
    //         // sign: '',
    //         // image: '',
    //         name: '',
    //         address: '',
    //         dni: '',
    //         dateofbirth: '',
    //         gender: '',
    //         // emails: [],
    //         phones: [ this.DEFAULT_PHONE() ],
    //         // tutor: null,
    //         // contacts: [],
    //         paymentData: {
    //             amount: '',
    //             // iban: '',
    //             // ibanownerdni: '',
    //             // ibanownername: '',
    //             paymenttype: '',
    //             rate: '',
    //             type: '',
    //             payment_id: '',
    //         },
    //         // payments: [],
    //         // belts: [
    //         //     { grade: 'blam', date: null, },
    //         //     { grade: 'amam', date: null, },
    //         //     { grade: 'amna', date: null, },
    //         //     { grade: 'nana', date: null, },
    //         //     { grade: 'nave', date: null, },
    //         //     { grade: 'veve', date: null, },
    //         //     { grade: 'veaz', date: null, },
    //         //     { grade: 'azaz', date: null, },
    //         //     { grade: 'azma', date: null, },
    //         //     { grade: 'mama', date: null, },
    //         //     { grade: 'nene', date: null, }
    //         // ],
    //         rightsProtect: {
    //             RPaccept: null,
    //             date: null,
    //         },
    //         rightsImage: {
    //             RIaccept: null,
    //             date: null,
    //         },
    //         // notes: [],
    //     }
    // },
    // DEFAULT_PHONE() {
    //     return {
    //         phone: '',
    //         notes: '',
    //     }
    // },
    // DEFAULT_TUTOR() {
    //     return {
    //         // _id: null,
    //         // customerNumber: null,
    //         address: '',
    //         dni: '',
    //         // emails: [],
    //         name: '',
    //         // notes: '',
    //         // phones: [],
    //     }
    // },
export default  {
    CONTACT_KEYS,
    DEFAULT_BELTS,
    DEFAULT_CONTACT,
    DEFAULT_FORM,
    DEFAULT_PHONE,
    DEFAULT_TUTOR,
    GRADES,
    QS,
    RATES,
    SPECIAL_CHARACTERS,
    TUTOR_KEYS,
}
