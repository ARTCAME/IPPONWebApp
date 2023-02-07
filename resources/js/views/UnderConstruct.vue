<template>
    <b-container
        class="ctn-construct"
        v-if="this.$route.name == 'maintenance'">
        <h1 id="ttl-construct">
            Estamos aplicando algunos cambios, vuelve pasados unos minutos.
        </h1>
        <h2 class="subtitle">
            ¡Disculpa las molestias!
        </h2>
    </b-container>
</template>
<script>
export default {
    mounted() {
        this.$randomGradient(document.getElementById('ttl-construct'));
    },
}
</script>
<style scoped>
    .ctn-construct {
        width: 100%;
    }
    .ctn-construct * {
        letter-spacing: -.05em;
        user-select: none;
    }
    #ttl-construct {
        background: linear-gradient(to right, #000000 0%, #008351 75%);
        background-clip: text;
        -webkit-background-clip: text;
        font-size: calc(20px + (60 - 20) * ((100vw - 300px) / (1600 - 300))); /* minsize + (max-min) * (maxvw - minvw) * (maxpx - minpx) */
        -webkit-text-fill-color: transparent;
    }
</style>
