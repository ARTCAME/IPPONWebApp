<template>
    <b-row
        id="row-assets"
        :align-h="$route.name == 'home' ? 'center' : 'end'"
        :class="$route.name == 'home' ? ' in-home' : ''"
        no-gutters>
        <b-navbar-nav class="ig-assets-nav mr-1 p-0">
            <b-nav-item
                class="ig-asset-item"
                id="nav-search"
                v-b-modal.search-nav-modal
                @click="closePops()">
                <span
                    v-if="$route.name == 'home'">
                    <fa-icon class="mr-2" icon="search"></fa-icon>
                    BUSCA y accede a los SOCIOS
                </span>
                <span
                    v-else>
                    <fa-icon icon="search"></fa-icon>
                    <p class="nav-desc text-ig-gold">
                        Busca y accede a socios
                    </p>
                </span>
            </b-nav-item>
        </b-navbar-nav>
        <b-modal
            class="nav-modals"
            button-size="sm"
            header-text-variant="ig-gold"
            hide-backdrop
            hide-footer
            id="search-nav-modal"
            modal-class="ig-custom-modal"
            no-close-on-backdrop
            ref="mdl-comparar-cambios"
            scrollable
            title="Búsqueda de socio"
            @hidden="$manageScrollBar"
            @show="$manageScrollBar">
            <Search></Search>
        </b-modal>
        <b-navbar-nav class="ig-assets-nav">
            <b-nav-item
                class="ig-asset-item"
                id="nav-newpayment"
                v-b-modal.payments-nav-modal
                @click="closePops()">
                <span
                    v-if="$route.name == 'home'">
                    <fa-icon class="mr-2" icon="euro-sign"></fa-icon>
                    Gestiona NUEVOS PAGOS
                </span>
                <span
                    v-else>
                    <fa-icon icon="euro-sign"></fa-icon>
                    <p class="nav-desc text-ig-blue">
                        Añade pagos
                    </p>
                </span>
            </b-nav-item>
        </b-navbar-nav>
        <b-modal
            class="nav-modals"
            button-size="sm"
            header-text-variant="ig-blue"
            hide-backdrop
            hide-footer
            id="payments-nav-modal"
            modal-class="ig-custom-modal"
            no-close-on-backdrop
            scrollable
            ref="payments-nav-modal"
            title="Añade y actualiza pagos"
            @hidden="$manageScrollBar"
            @show="$manageScrollBar">
            <PaymentNavBar></PaymentNavBar>
        </b-modal>
        <b-navbar-nav class="ig-assets-nav ml-1">
            <b-nav-item
                class="ig-asset-item"
                id="nav-printfile"
                v-b-modal.print-nav-modal
                @click="closePops()">
                <span
                    v-if="$route.name == 'home'">
                    <fa-icon class="mr-2" icon="print"></fa-icon>
                    GENERA e IMPRIME recibos o documentos
                </span>
                <span
                    v-else>
                    <fa-icon icon="print"></fa-icon>
                    <p class="nav-desc text-ig-darkpink">
                        Genera documentos
                    </p>
                </span>
            </b-nav-item>
        </b-navbar-nav>
        <b-modal
            class="nav-modals"
            button-size="sm"
            header-text-variant="ig-darkpink"
            hide-backdrop
            hide-footer
            id="print-nav-modal"
            modal-class="ig-custom-modal"
            no-close-on-backdrop
            scrollable
            title="Genera y descarga documentos"
            @hidden="$manageScrollBar"
            @show="$manageScrollBar">
            <PrintFile></PrintFile>
        </b-modal>
    </b-row>
</template>
<script>
    export default {
        methods: {
            closePops() {
                this.$root.$emit('bv::hide::popover');
                this.$root.$emit('bv::hide::tooltip')
            }
        }
    }
</script>
<style>
    #payments-nav-modal .modal-body {
        overflow-x: hidden!important;
    }
    #payments-nav-modal.ig-custom-modal .modal-header,
    #print-nav-modal.ig-custom-modal .modal-header,
    #search-nav-modal.ig-custom-modal .modal-header {
        padding-left: 3rem;
    }
    #payments-nav-modal.ig-custom-modal .modal-header .modal-title,
    #print-nav-modal.ig-custom-modal .modal-header .modal-title,
    #search-nav-modal.ig-custom-modal .modal-header .modal-title {
        margin-top: 10px; /* Align with the close cross */
    }
    .navbar-light .navbar-toggler {
        border-color: transparent; /* Delete the hambur icon border */
    }
    @media screen and (max-width:768px) {
        #payments-nav-modal.ig-custom-modal .modal-header,
        #print-nav-modal.ig-custom-modal .modal-header,
        #search-nav-modal.ig-custom-modal .modal-header {
            padding-left: .5rem;
        }
        #payments-nav-modal.ig-custom-modal .modal-header .close,
        #print-nav-modal.ig-custom-modal .modal-header .close,
        #search-nav-modal.ig-custom-modal .modal-header .close {
            padding-right: .5rem;
        }
    }
</style>
<style scoped>
    .in-home {
        display: flex;
    }
    .in-home .ig-assets-nav {
        height: 35px;
        line-height: 1.2;
        margin-top: 5px;
        width: auto;
    }
    .in-home .nav-item {
        border-radius: .25rem;
    }
    .in-home .nav-link {
        padding: 0.375rem 0.75rem!important;
        /* padding: .4rem!important; */
        letter-spacing: 0;
    }
    .in-home .ig-assets-nav:not(:last-child) {
        margin-right: 10px!important;
        box-sizing: border-box;
    }
    .in-home #nav-newpayment {
        border: 1px solid rgba(0, 50, 131, 1)!important;
    }
    .in-home #nav-printfile {
        border: 1px solid rgba(131, 0, 52, 1)!important;
    }
    .in-home #nav-search {
        border: 1px solid rgba(118, 131, 0, 1)!important;
    }
    .ig-asset-item {
        border-radius: .25rem;
        height: 100%;
        /* margin: 0 1px; */
        padding: 2px;
        transition: all .15s ease-in-out;
        width: 100%;
    }
    .in-home .ig-asset-item a > span {
        display: block;
        line-height: 1;
    }
    .ig-asset-item svg {
        height: 100%;
        margin: auto;
        transition: all .15s ease-in-out;
    }
    .ig-asset-item .nav-link {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
    }
    .ig-assets-nav {
        /* border: 1px solid orange; */
        box-sizing: border-box;
        height: 40px;
        margin: 0;
        padding: 0;
        position: relative;
        text-align: center;
        white-space: nowrap;
        width: 40px;
    }
    .nav-desc {
        border-radius: .25rem;
        height: 20px!important;
        line-height: 9px;
        margin-top: 10px;
        opacity: 0;
        padding: 5px;
        pointer-events: none;
        position: absolute;
        right: 50%;
        transition: all .3s ease-in-out;
        transform: translate(50%, -74px);
        user-select: none;
        visibility: hidden;
    }
    .ig-assets-nav:hover .nav-desc {
        transform: translate(50%, -77px);
        padding-bottom: 1rem;
        opacity: 1;
        visibility: visible;
    }
    .nav-item a {
        letter-spacing: -.04em;
    }
    .navbar {
        box-shadow: 0 0 0 0 grey;
        border-radius: 0.25rem;
        box-sizing: border-box;
        margin: 15px;
        /* overflow: hidden; */
        transition: box-shadow .2s ease-out;
    }
    .navbar-collapse .nav-link {
        padding: 0;
    }
    #nav-newpayment:hover {
        background-color: rgba(0, 50, 131, 1)!important;
    }
    #nav-printfile:hover {
        background-color: rgba(131, 0, 52, 1)!important;
    }
    #nav-search:hover {
        background-color: rgba(118, 131, 0, 1)!important;
    }
    #nav-newpayment a {
        color: rgba(0, 50, 131, 1)!important;
    }
    #nav-newpayment:hover a {
        /* color: rgba(164, 159, 209, 1)!important; */
        color: rgba(255, 255, 255, 1)!important;
    }
    #nav-printfile a {
        color: rgba(131, 0, 52, 1)!important;
    }
    #nav-printfile:hover a {
        /* color: rgba(209, 159, 164, 1)!important; */
        color: rgba(255, 255, 255, 1)!important;
    }
    #nav-search a {
        color: rgba(118, 131, 0, 1)!important;
    }
    #nav-search:hover a {
        /* color: rgba(204, 209, 159, 1)!important; */
        color: rgba(255, 255, 255, 1)!important;
    }
    #row-assets {
        border: 1px solid transparent; /* Prevent jumps when inline elements appears */
    }
</style>
