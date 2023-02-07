import { Validator } from 'vee-validate'; // 2.x version
import moment from 'moment';

const dictionary = {
    es: {
        custom: {
            'sign': {
                required: () => 'El cliente debe firmar'
            }
        },
        messages: {
            alpha: () => 'Este campo solo puede contener letras',
            alpha_dash: () => 'Este campo solo puede contener letras',
            alpha_spaces: () => 'Este campo solo puede contener letras',
            between: () => 'El importe no es correcto',
            click: () => 'Selecciona una opción',
            confirmed: () => 'Las contraseñas no coinciden',
            date_custom_rule: () => 'Fecha inválida o fuera de rango',
            decimal: () => 'Valor incorrecto',
            dnie: () => 'El dni o nie no es correcto',
            dniFounded: () => 'Este dni ya existe, no puedes dar de alta este dni',
            dniTutorFounded: () => 'Este dni es de un socio, seleccionalo para vincularlo',
            email: () => 'Formato incorrecto',
            existingUsername: () => 'El nombre de usuario no es correcto',
            iban: () => 'El IBAN no es correcto',
            included: () => 'Selecciona una opción correcta',
            length: () => 'Número de carácteres incorrecto',
            lengthDnie: () => 'Un dni o nie tiene siempre 9 dígitos',
            max_value: () => 'Valor máximo excedido',
            min: () => 'Mínimo 3 carácteres',
            min_value: () => 'Valor incorrecto',
            numeric: () => 'Este campo debe ser numérico',
            picRequired: () => 'Añade una foto',
            regex: () => 'Formato incorrecto',
            required: () => 'Campo obligatorio',
            uniqueEmail: () => 'Este e-mail ya está siendo utilizado',
            uniqueUsername: () => 'Este nombre de usuario ya está siendo utilizado',
            year: () => 'Año inválido',
        },
    }
}
Validator.localize(dictionary);

Validator.extend('alpha_dash', {
    validate(value) {
        const reg = new RegExp(/[A-z-\s]/g)
        return reg.test(value)
    }
})
Validator.extend('decimal', {
    validate(value) {
        const reg = new RegExp(/^\d{1,4}((\,|\.)\d{1,2})?$/g)
        return reg.test(value)
    }
})
Validator.extend('year', {
    validate(value) {
        const year = moment(value, 'YYYY').year();
        const currYear = moment().year();
        return (year < (currYear + 100) && year > (currYear - 100) && moment(value, 'YYYY', true).isValid()) ? true : false;
    }
})
Validator.extend('iban', {
    validate: value => validateIban(value) ? true : false,
})
Validator.extend('dnie', {
    validate: value => validateDni(value) ? true : false,
})
Validator.extend('lengthDnie', {
    validate(value) {
        value = value.replace(/-|\s|\./gi,"");
        return value.length == 9 ? true : false;
    }
})
Validator.extend('dniFounded', {
    validate(value, args) {
        return parseInt(args) == 0 ? true : false;
    }
})
Validator.extend('dniTutorFounded', {
    validate(value, args) {
        return parseInt(args) == 0 ? true : false;
    }
})
Validator.extend('uniqueEmail', {
    validate(value, args) {
        return parseInt(args) == 0 ? true : false;
    }
})
Validator.extend('uniqueUsername', {
    validate(value, args) {
        return parseInt(args) == 0 ? true : false;
    }
})
Validator.extend('existingUsername', {
    validate(value, args) {
        return parseInt(args) == 0 ? false : true;
    }
})
Validator.extend('picRequired', { // It works?
    validate(value, args) {
        return value;
    }
})

// NOT WORKING AS EXPECT
Validator.extend('click', {
    validate(value, args) {
        let allowedValues = [ 0, 1, 2, 15 ];
        return allowedValues.indexOf(value) != -1 ? true : false;
    }
})
Validator.extend('date_custom_rule', {
    validate(value, args) {
        let minDate = moment().set('year', moment().year() - 1).format('YYYY-MM-DD');
        let maxDate = moment().set('year', moment().year() - 130).format('YYYY-MM-DD');
        return value > maxDate && value < minDate;
    }
})
/*  */

function validateDni(value) {
    if (value == '') return true;
    let allowedLetras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let cleanValue = value.replace(/\W/gi,""); // Cleaning symbols
    let regexNie = /^[XYZ][-.\s]?[\d]{7}[-.\s]?[TRWAGMYFPDXBNJZSQVHLCKE]$/gi;
    let regexDni = /^[\d]{8}[-.\s]?[TRWAGMYFPDXBNJZSQVHLCKE]$/gi;
    if (regexNie.test(cleanValue)) { // We have a nie candidate
        let numNie = switchLetterNie(cleanValue.substring(0,1).toLowerCase()) + cleanValue.replace(/\D/gi,"");
        let letraNie = cleanValue.substr((cleanValue.length - 1),1);
        function switchLetterNie(val) {
            switch (val) {
                case 'x':
                    return 0;
                case 'y':
                    return 1;
                case 'z':
                    return 2;
            }
        }
        return allowedLetras[numNie % 23] == letraNie.toUpperCase();
    } else if (regexDni.test(value)) { // We have a dni candidate
        let numDni = cleanValue.replace(/\D/gi,"");
        let letraDni = cleanValue.substr((cleanValue.length - 1),1);
        return allowedLetras[numDni % 23] == letraDni.toUpperCase();
    }
}

function validateIban(value) {
    var IBAN = require('iban');
    return IBAN.isValid(value);
}

export default {
    dictionary,
    Validator,
}
