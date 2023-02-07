<template>
    <b-row>
        <b-col class="sign-ctn">
            <div
                class="m-0 p-0 sign-img-doc"
                v-if="!sign">
                <small>Firma no disponible</small>
            </div>
            <img
                class="sign-img-doc"
                type="image/png"
                v-else
                :src="sign">
            <small class="d-block">Firmado: {{ name }}</small>
            <small>En Zaragoza a {{ docDate ? this.$moment(docDate, 'DD-MM-YYYY HH:MM:ss').format('dddd, D MMMM YYYY') : this.$moment().format('dddd, D MMMM YYYY') }}</small>
        </b-col>
    </b-row>
</template>
<script>
    export default {
        props: [
            'name',
            'sign',
            'docDate', /* Will be the date of the accept/decline the document, only for rightsXXX not for bill */
        ]
    }
</script>
<style scoped>
    .sign-ctn {
        text-align: end;
    }
    .sign-img-doc {
        height: 105px;
        min-height: 105px;
        width: auto;
    }
</style>
