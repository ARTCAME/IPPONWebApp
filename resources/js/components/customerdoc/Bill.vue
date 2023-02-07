<template>
    <!-- The below element isn't show to the user but rendered to allow html2canvas to print it as an image -->
    <div>
        <Header></Header>
        <br>
        <b-row>
            <b-col cols="4"><small>Número de recibo:</small></b-col>
            <b-col>
                <small>
                    {{ customer._id.slice(0, 10) + '_' + printItem.payment_id.slice(57, -1) + '_' + customer.customerNumber }}
                </small>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="4">Nombre del socio:</b-col>
            <b-col>{{ customer.name }}</b-col>
        </b-row>
        <b-row
            v-if="getUnderage(customer._id)">
            <b-col cols="4">Nombre del tutor:</b-col>
            <b-col>{{ customer.tutor.name }}</b-col>
        </b-row>
        <b-row>
            <b-col cols="4">{{ getUnderage(customer._id) ? 'Dni del tutor:' : 'Dni del socio:' }}</b-col>
            <b-col>{{ getUnderage(customer._id) ? customer.tutor.dni : customer.dni }}</b-col>
        </b-row>
        <b-row>
            <b-col cols="4">Tarifa:</b-col>
            <b-col>{{ printItem ? printItem.rate : customer.paymentData.rate }}</b-col>
        </b-row>
        <b-row>
            <b-col cols="4">Forma de pago:</b-col>
            <b-col>{{ printItem ? printItem.paymenttype : customer.paymentData.paymenttype }}</b-col>
        </b-row>
        <b-row
            v-if="printItem.paymenttype == 'Domiciliación'">
            <b-col cols="4">Cuenta de pago:</b-col>
            <b-col>{{ printItem.iban }}</b-col>
        </b-row>
        <b-row>
            <b-col cols="4">Importe: </b-col>
            <b-col>{{ printItem ? printItem.amount : customer.paymentData.amount }}€ (IVA incluido)</b-col>
        </b-row>
        <b-row>
            <b-col cols="4">Periodo de pago: </b-col>
            <b-col>{{ printItem.interval }}</b-col>
        </b-row>
        <b-row>
            <b-col cols="4">Fecha de pago: </b-col>
            <b-col>{{ printItem ? printItem.dateconfirmed : getPaymentByPaymentId(customer._id, printItem.payment_id).dateconfirmed }}</b-col>
        </b-row>
        <Footer
            :name="getUnderage(customer._id) && customer.tutor ? customer.tutor.name : customer.name"
            :sign="customer.sign"></Footer>
    </div>
</template>
<script>
    import Footer from './printsassets/Footer'
    import Header from './printsassets/Header'
    import { mapGetters } from 'vuex';
    export default {
        components: {
            'Footer': Footer,
            'Header': Header,
        },
        computed: {
            ...mapGetters(['getPaymentByPaymentId', 'getUnderage']),
        },
        props: [
            'customer', /* Object with the customer data */
            'printItem', /* The item with the payment data of a payment edited or created */
        ],
    }
</script>
