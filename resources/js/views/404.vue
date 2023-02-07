<template>
    <b-container
        class="ctn-404"
        v-if="this.$route.name == '404'">
        <h1 id="ttl-404">
            404
        </h1>
        <h2 class="subtitle">
            Esta página no existe
        </h2>
        <h3 class="mt-3">
            <b-link
                id="homelink"
                :to="{ name: 'home' }">
                Ir a la página principal
            </b-link>
        </h3>
    </b-container>
</template>
<script>
export default {
    mounted() {
        this.$randomGradient(document.getElementById('ttl-404'));
        this.$randomGradient(document.getElementById('homelink'));
    },
}
</script>
<style scoped>
    .ctn-404 {
        width: 100%;
    }
    .ctn-404 * {
        letter-spacing: -.05em;
        user-select: none;
    }
    #homelink {
        background: linear-gradient(to right, #000000 0%, #008351 75%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding-right: 15px;
    }
    #ttl-404 {
        background: linear-gradient(to right, #000000 0%, #008351 75%);
        background-clip: text;
        -webkit-background-clip: text;
        font-size: calc(20px + (120 - 20) * ((100vw - 300px) / (1600 - 300))); /* minsize + (max-min) * (maxvw - minvw) * (maxpx - minpx) */
        -webkit-text-fill-color: transparent;
    }
</style>
