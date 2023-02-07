<template>
    <div
        class="printable-ctn"
        v-if="customer != null">
        <Header></Header>
        <h4 class="mt-3">Consentimiento expreso</h4>
        <p>
            &emsp;En aras a dar cumplimiento al Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos, y siguiendo las Recomendaciones e Instrucciones emitidas por la Agencia Española de Protección de Datos (A.E.P.D.), SE INFORMA:
        </p>
        <p>
            &emsp;Los datos de carácter personal solicitados y facilitados por usted, son incorporados un fichero de titularidad privada cuyo responsable y único destinatario es Sergio Pérez Silva en nombre de IPPONGYM.
        </p>
        <p>
            &emsp;Solo serán solicitados aquellos datos estrictamente necesarios para prestar adecuadamente los servicios solicitados, pudiendo ser necesario recoger datos de contacto de terceros, tales como representantes legales, tutores, o personas a cargo designadas por los mismos.
        </p>
        <p>
            &emsp;Todos los datos recogidos cuentan con el compromiso de confidencialidad, con las medidas de seguridad establecidas legalmente, y bajo ningún concepto son cedidos o tratados por terceras personas, físicas o jurídicas, sin el previo consentimiento del cliente, tutor o representante legal, salvo en aquellos casos en los que fuere imprescindible para la correcta prestación del servicio.
        </p>
        <p>
            &emsp;Una vez finalizada la relación entre la empresa y el cliente los datos serán archivados y conservados, durante un periodo tiempo mínimo de 2 años, tras lo cual seguirá archivado o en su defecto serán devueltos íntegramente al cliente o autorizado legal.
        </p>
        <p>
            &emsp;Los datos que facilito serán incluidos en el Tratamiento denominado Clientes de Sergio Pérez Silva en nombre de IPPONGYM, con la finalidad de gestión del servicio contratado, emisión de facturas, contacto..., todas las gestiones relacionadas con los clientes y manifiesto mi consentimiento. También se me ha informado de la posibilidad de ejercitar los derechos de acceso, rectificación, cancelación y oposición, indicándolo por escrito a Sergio Pérez Silva en calle Leopoldo Romeo 9, 50002 Zaragoza.
        </p>
        <p>
            Los datos personales podrán ser cedidos por Sergio Pérez Silva en nombre de IPPONGYM a las entidades que le presten servicios.
        </p>
        <p
            :class="{ 'mb-0' : customer.tutor }">
            Nombre y apellidos del cliente: <u>  {{ customer.name }}  </u>
            <br>
            Dni del cliente: <u>  {{ customer.dni ? customer.dni : 'Dni no disponible' }}  </u>
        </p>
        <p
            class="mb-0"
            v-if="customer.tutor">
            Nombre y apellidos del tutor: <u>  {{ customer.tutor.name ? customer.tutor.name : 'Nombre del tutor no disponible' }}  </u>
            <br>
            Dni del tutor: <u>  {{ customer.tutor.dni ? customer.tutor.dni : 'Dni del tutor no disponible' }}  </u>
        </p>
        <Footer
            id="sign-row-RP"
            :docDate="customer.rightsProtect.date"
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
            ...mapGetters(['getUnderage']),
        },
        props: [
            'customer', /* Object with the customer data */
        ]
    }
</script>
<style scoped>
#sign-row-RP {
    transform: translateY(-40px); /* Reposition the sign based on the disposition of the rest of elements */
}
</style>
