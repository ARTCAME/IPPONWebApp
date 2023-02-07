<template>
    <b-list-group class="mx-1">
        <b-list-group-item
            class="py-1"
            v-if="fileType == 0">
            <b-row>
                <b-col class="text-muted" cols="6">
                    NÚMERO DE RECIBO
                </b-col>
                {{ billNumber }}
            </b-row>
        </b-list-group-item>
        <b-list-group-item
            class="py-1"
            v-for="(rV, rK) in resumeKeys"
            v-if="rK == 'iban' && paymentData.paymenttype == 'Domiciliación' || rK != 'iban'"
            :key="rK">
            <b-row>
                <b-col class="text-muted" cols="6">
                    {{ rV }}
                </b-col>
                <span
                    v-html="evaluateListElement((Object.keys(billFields).includes(rK) ? paymentData : customer), rK).text"
                    :class="evaluateListElement((Object.keys(billFields).includes(rK) ? paymentData : customer), rK).class">
                    <!-- {{ evaluateListElement((Object.keys(billFields).includes(rK) ? paymentData : customer), rK).text }} -->
                </span>
            </b-row>
        </b-list-group-item>
    </b-list-group>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
                billFields: {
                    rate: 'TARIFA',
                    amount: 'IMPORTE',
                    paymenttype: 'FORMA DE PAGO',
                    iban: 'IBAN',
                    interval: 'PERIODO DE PAGO',
                },
                commonFields: {
                    name: 'NOMBRE',
                    dni: 'DNI', /* On underages must check the dni of the customer and the tutor to show the apropiate*/
                    sign: 'FIRMA',
                },
                rpFields: {
                    RPaccept: 'ACEPTA CONSENTIMIENTO EXPRESO',
                },
                riFields: {
                    RIaccept: 'ACEPTA CESIÓN DE IMAGEN',
                },
                tutorFields: {
                    tutorName: 'NOMBRE DEL TUTOR',
                    tutorDni: 'DNI DEL TUTOR',
                },
            }
        },
        computed: {
            ...mapGetters(['getUnderage']),
            /**
             * Build the bill number to print it on the bill
             *
             * @return {String} String formed by the 10 firsts chars of the customer id, the 6 last chars of the payment_id and the customer number
             */
            billNumber() {
                return this.customer._id.slice(0, 10) + '_' + this.paymentData.payment_id.slice(57, -1) + '_' + this.customer.customerNumber
            },
            /**
             * Agregate the fields to use on the current doctype
             *
             * @returns {Object} Object formed by the k,v for the current type of document
             */
            resumeKeys() {
                let keys = { ...this.commonFields };
                if (this.underage) {
                    keys = { ...keys, ...this.tutorFields };
                }
                if (this.fileType == 0) {
                    keys = { ...keys, ...this.billFields };
                } else if (this.fileType == 1) {
                    keys = { ...keys, ...this.rpFields };
                } else if (this.fileType == 2) {
                    keys = { ...keys, ...this.riFields };
                }
                return keys;
            },
            /**
             * Determines if the provided customer is underage checking to vuex customer data
             *
             * @return {Boolean} Boolean that indicates if the customer is or no underage
             */
            underage() {
                return this.getUnderage(this.customer._id);
            },
        },
        methods: {
            /**
             * Function to determine the text and the text class for the list-group elements
             *
             * @param {Object} elem: the payment element to evaluate
             * @param {String} key: the key of the object
             *
             * @returns {Object} with the text and the flag to deterimne if the text-danger class is needed
             */
            evaluateListElement(elem, key) {
                let result = {
                    text: elem[key],
                    class: ''
                };
                switch(key) {
                    case 'dni':
                        result.text = (this.customer.dni != '' && this.customer.dni != null) ? this.customer.dni : 'Falta el dni';
                        break;
                    case 'tutorName':
                        result.text = this.customer.tutor && (this.customer.tutor.name != '' && this.customer.tutor.name != null) ? this.customer.tutor.name : 'Falta el nombre del tutor';
                        if (this.customer.tutor && (this.customer.tutor.name == '' || this.customer.tutor.name == null)) {
                            result.class = 'text-danger';
                        }
                        break;
                    case 'tutorDni':
                        result.text = this.customer.tutor && (this.customer.tutor.dni != '' && this.customer.tutor.dni != null) ? this.customer.tutor.dni : 'Falta el dni del tutor';
                        if (this.customer.tutor && (this.customer.tutor.dni == '' || this.customer.tutor.dni == null)) {
                            result.class = 'text-danger';
                        }
                        break;
                    case 'sign':
                        const pending = 'Pendiente, <a href="\/socio\/' + this.customer._id + '" target="_blank" title="Abre la ficha del socio">edítala en la ficha del socio</a>';
                        // const pending = "Pendiente, <a  href=\"#\" rel=\"nofollow\">edítala en la ficha del socio<fa-icon class='ml-2' icon='external-link'></fa-icon><\/a>";
                        result.text = this.customer.sign ? 'Correcta' : pending;
                        if (!this.customer.sign) {
                            result.class = 'text-danger';
                        }
                        break;
                    /* The two below aren't visibles for the user because the summary is not rendered when this options are null or false */
                    case 'RPaccept':
                        result.text = this.customer.rightsProtect.RPaccept == false ? 'No' : this.customer.rightsProtect.RPaccept == null ? 'No indicado' : 'Sí';
                        break;
                    case 'RIaccept':
                        result.text = this.customer.rightsImage.RIaccept == false ? 'No' : this.customer.rightsImage.RIaccept == null ? 'No indicado' : 'Sí';
                        break;
                }
                return result;
            },
        },
        props: [
            'fileType',
            'paymentData',
            'customer',
        ],
    }
</script>
