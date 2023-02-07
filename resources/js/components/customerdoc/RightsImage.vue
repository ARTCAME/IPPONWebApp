<template>
    <div
        class="printable-ctn"
        v-if="customer != null">
        <Header></Header>
        <h4 class="mt-3">Autorización para la publicación de imágenes</h4>
        <p>
            &emsp;Con la inclusión de las nuevas tecnologías dentro de las comunicaciones, publicaciones y acciones comerciales que puede realizar Sergio Pérez Silva en nombre de IPPONGYM y la posibilidad de que en estas puedan aparecer los datos personales y/o imágenes que ha proporcionado a nuestra empresa dentro del vínculo comercial existente.
        </p>
        <p>
            &emsp;Y dado que el derecho a la propia imagen está reconocido al artículo 18 de la Constitución y regulado por la Ley 1/1982, de 5 de mayo, sobre el derecho al honor, a la intimidad personal y familiar y a la propia imagen y el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos,
        </p>
        <p
            v-if="getUnderage(customer._id) && customer.tutor">
            &emsp;Sergio Pérez Silva en nombre de IPPONGYM pide el consentimiento a los padres o tutores legales para poder publicar las imágenes en las cuales aparezcan individualmente o en grupo que con carácter comercial se puedan realizar a los niños y niñas, en las diferentes secuencias y actividades realizadas en nuestras instalaciones y fuera de las mismas en actividades contratadas con nuestra empresa.
        </p>
        <p
            v-else>
            Sergio Pérez Silva en nombre de IPPONGYM pide su consentimiento para poder publicar los datos personales que nos ha facilitado o imágenes en las cuales aparezcan individualmente o en grupo que con carácter comercial se puedan realizar con nuestra empresa.
        </p>
        <p>
            <span
                v-if="getUnderage(customer._id) && customer.tutor">
                &emsp;Don/Doña <u>  {{ customer.tutor.name ? customer.tutor.name : 'Nombre del tutor no disponible' }}  </u> con DNI <u>  {{ customer.tutor.dni ? customer.tutor.dni : 'Dni del tutor no disponible' }}  </u> como padre/madre o tutor del menor <u>  {{ customer.name}}  </u> autorizo a Sergio Pérez Silva en nombre de IPPONGYM a un uso pedagógico/comercial de mis datos personales facilitados dentro de la relación comercial con nuestra empresa y para poder ser publicados en:
            </span>
            <span
                v-else>
                &emsp;Don/Doña <u> {{ customer.name }}  </u> con DNI <u>  {{ customer.dni }}  </u> autorizo a Sergio Pérez Silva en nombre de IPPONGYM a un uso comercial de mis datos personales facilitados dentro de la relación comercial con nuestra empresa y para poder ser publicados en:
            </span>
            <br>
            &emsp;&emsp;· La página web y perfiles en redes sociales de la empresa.
            <br>
            &emsp;&emsp;· Filmaciones destinadas a difusión comercial.
            <br>
            &emsp;&emsp;· Fotografías para revistas o publicaciones de ámbito relacionado con nuestro sector.
        </p>
        <Footer
            :id="getUnderage(customer._id) ? 'sign-row-RI-tutor' : 'sign-row-RI'"
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
        ],
    }
</script>
<style scoped>
#sign-row-RI {
    transform: translateY(253px); /* Reposition the sign based on the disposition of the rest of elements */
}
#sign-row-RI-tutor {
    transform: translateY(228px); /* Reposition the sign based on the disposition of the rest of elements */
}
</style>
