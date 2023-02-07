<template>
    <div id="navs-container">
        <!-- This nav will be used as the main top sticky nav bar on some pages and as a nav item on the home page. To manage this behaviors the in-home class is added based on the route name -->
        <b-navbar
            id="ig-main-navbar"
            fixed="top"
            :class="'d-block pb-0' + (this.$route.name == 'home' || this.$route.name == '404' ? ' in-home' : '')"
            :toggleable="this.$route.name == 'home' || this.$route.name == '404' ? false : 'md'">
            <span id="main-nav-container" class="nav-container">
                <b-navbar-brand class="ippon-title" href="/" id="ctn-ippongym">
                    <router-link
                        id="ippon-link"
                        :to="{ name : 'home' }">
                        <b class="ippon-ttl" id="ippon-ttl">
                            IPPONGYM
                        </b>
                    </router-link>
                </b-navbar-brand>
                <b-navbar-nav class="mr-auto" id="nav-user">
                    <b-nav-text
                        v-if="isLoggedIn">
                        <router-link
                            :title="'Has iniciado sesión con el usuario: ' + authenticatedUser"
                            :to="{ name : 'home' }">
                            {{ authenticatedUser }}
                        </router-link>
                    </b-nav-text>
                </b-navbar-nav>
                <button
                    :class="'navbar-toggler' + (collapsed ? ' not-collapsed' : ' collapsed')"
                    @click="collapsed = !collapsed">
                    <fa-icon icon="bars"></fa-icon>
                </button>
                <b-collapse
                    id="nav-collapse"
                    is-nav
                    v-model="collapsed"
                    @hide="navExpand('ig-main-navbar')"
                    @show="navExpand('ig-main-navbar')">
                    <b-navbar-nav id="main-navbar-nav" class="ml-auto">
                        <b-navbar-nav
                            v-if="authenticatedRole == 'user'">
                            <b-nav-item
                                active-class="active"
                                class="p-2"
                                exact
                                v-for="(route, key) in routes.user"
                                :key="route.path">
                                <router-link
                                    :id=route.name
                                    :key="key"
                                    :to="{ name : route.path }">
                                    {{ route.name }}
                                </router-link>
                            </b-nav-item>
                        </b-navbar-nav>
                        <b-navbar-nav
                            v-if="authenticatedRole == 'admin'">
                            <b-nav-item
                                active-class="active"
                                class="p-2"
                                exact
                                v-for="(route, key) in routes.admin"
                                :key="route.path">
                                <router-link
                                    :id=route.name
                                    :key="key"
                                    :to="{ name : route.path }">
                                    {{ route.name }}
                                </router-link>
                            </b-nav-item>
                        </b-navbar-nav>
                        <b-navbar-nav
                            v-if="authenticatedRole == 'tester'">
                            <b-nav-item
                                active-class="active"
                                class="p-2"
                                exact
                                v-for="(route, key) in routes.tester"
                                :key="route.path">
                                <router-link
                                    :id=route.name
                                    :key="key"
                                    :to="{ name : route.path }">
                                    {{ route.name }}
                                </router-link>
                            </b-nav-item>
                        </b-navbar-nav>
                        <b-navbar-nav
                            v-if="authenticatedRole == 'root'">
                            <b-nav-item
                                active-class="active"
                                class="p-2"
                                exact
                                v-for="(route, key) in routes.root"
                                :key="route.path">
                                <router-link
                                    :id=route.name
                                    :key="key"
                                    :to="{ name : route.path }">
                                    {{ route.name }}
                                </router-link>
                            </b-nav-item>
                        </b-navbar-nav>
                        <b-navbar-nav>
                            <b-nav-item
                                class="p-2 pl-md-3"
                                v-if="isLoggedIn">
                                <a
                                    href="#"
                                    class="text-muted"
                                    @click.prevent="inLogout()">
                                    CERRAR SESIÓN
                                </a>
                            </b-nav-item>
                        </b-navbar-nav>
                    </b-navbar-nav>
                </b-collapse>
            </span>
            <b-navbar
                id="ig-tools-navbar"
                :toggleable="$route.name == 'payments.index' || $route.name == 'belts.index' ? 'sm' : false">
                <b-row align-h="between" align-v="start" class="nav-container" no-gutters>
                    <b-col class="my-auto" id="col-tools">
                        <transition appear mode="out-in" name="left-slide-fade">
                            <b-alert
                                class="d-inline-block mb-0 py-2"
                                id="edit-alert"
                                key="alert-editform-tools"
                                show
                                variant="warning"
                                v-if="$route.name == 'customers.edit'">
                                Recuerda guardar los cambios
                            </b-alert>
                            <span
                                class="d-block"
                                key="belts-tools"
                                v-if="$route.name == 'belts.index'">
                                <b-row align-h="start" class="nav-btn-wrp" no-gutters>
                                    <b-navbar-nav
                                        id="nav-belts-update"
                                        :class="'ig-tools-nav mr-1 onpage' + (getProcedureState('beltsUpdating') ? ' actived' : '')">
                                        <b-nav-item
                                            class="ig-tools-item onpage"
                                            @click="collapsed = false; setProcedureState({ procedure: 'beltsUpdating' })">
                                            <div>
                                                <fa-icon
                                                    class="tools-icon"
                                                    :icon="getProcedureState('beltsUpdating') ? 'times' : 'graduation-cap'"></fa-icon>
                                                <span class="nav-text">
                                                    Actualiza grados
                                                </span>
                                            </div>
                                        </b-nav-item>
                                        <p class="nav-desc-tools">
                                            {{ getProcedureState('beltsUpdating') ? 'Finalizar' : 'Actualiza los grados' }}
                                        </p>
                                    </b-navbar-nav>
                                    <b-navbar-nav
                                        id="nav-belts-print"
                                        :class="'ig-tools-nav onpage' + (getProcedureState('beltsPrinting') ? ' actived' : '')">
                                        <b-nav-item
                                            class="ig-tools-item onpage"
                                            @click="collapsed = false; setProcedureState({ procedure: 'beltsPrinting' })">
                                            <div>
                                                <fa-icon
                                                    class="tools-icon"
                                                    :icon="getProcedureState('beltsPrinting') ? 'times' : 'id-card-alt'"></fa-icon>
                                                <span class="nav-text">
                                                    Descarga el archivo de diplomas
                                                </span>
                                            </div>
                                        </b-nav-item>
                                        <p class="nav-desc-tools">
                                            {{ getProcedureState('beltsPrinting') ? 'Finalizar' : 'Descarga el archivo de diplomas' }}
                                        </p>
                                    </b-navbar-nav>
                                </b-row>
                            </span>
                            <span
                                class="d-block"
                                key="payments-tools"
                                v-if="$route.name == 'payments.index'">
                                <b-row align-h="start" class="nav-btn-wrp" no-gutters>
                                    <b-navbar-nav
                                        id="nav-payments-update"
                                        :class="'ig-tools-nav mr-1 onpage' + (getProcedureState('paymentsConfirming') ? ' actived' : '')">
                                        <b-nav-item
                                            :class="'ig-tools-item onpage'"
                                            @click="collapsed = false; setProcedureState({ procedure: 'paymentsConfirming' })">
                                            <div>
                                                <fa-icon
                                                    class="tools-icon"
                                                    :icon="getProcedureState('paymentsConfirming') ? 'times' : 'landmark'"></fa-icon>
                                                <span class="nav-text">
                                                    Confirma pagos
                                                </span>
                                            </div>
                                        </b-nav-item>
                                        <p class="nav-desc-tools">
                                            {{ getProcedureState('paymentsConfirming') ? 'Finalizar' : 'Confirma pagos' }}
                                        </p>
                                    </b-navbar-nav>
                                    <b-navbar-nav
                                        id="nav-payments-print"
                                        :class="'ig-tools-nav onpage' + (getProcedureState('paymentsPrinting') ? ' actived' : '')">
                                        <b-nav-item
                                            class="ig-tools-item onpage"
                                            @click="collapsed = false; setProcedureState({ procedure: 'paymentsPrinting' })">
                                            <div>
                                                <fa-icon
                                                    class="tools-icon"
                                                    :icon="getProcedureState('paymentsPrinting') ? 'times' : 'file-invoice'"></fa-icon>
                                                <span class="nav-text">
                                                    Descarga archivos de remesa
                                                </span>
                                            </div>
                                        </b-nav-item>
                                        <p class="nav-desc-tools variant">
                                            {{ getProcedureState('paymentsPrinting') ? 'Finalizar' : 'Descarga archivos de remesa' }}
                                        </p>
                                    </b-navbar-nav>
                                    <!-- <b-navbar-nav
                                        id="nav-payments-charts"
                                        :class="'ig-tools-nav ml-1 onpage' + (getProcedureState('paymentsCharts') ? ' actived' : '')">
                                        <b-nav-item
                                            class="ig-tools-item onpage"
                                            @click="collapsed = false; setProcedureState({ procedure: 'paymentsCharts' })">
                                            <b-row no-gutters>
                                                <fa-icon
                                                    class="tools-icon"
                                                    :icon="getProcedureState('paymentsCharts') ? 'times' : 'chart-bar'"></fa-icon>
                                                <span class="nav-text">
                                                    {{ getProcedureState('paymentsCharts') ? 'Oculta gráficos' : 'Mostrar gráficos' }}
                                                </span>
                                            </b-row>
                                        </b-nav-item>
                                        <p class="nav-desc-tools">
                                            {{ getProcedureState('paymentsCharts') ? 'Oculta gráficos' : 'Ver gráficos' }}
                                        </p>
                                    </b-navbar-nav> -->
                                </b-row>
                            </span>
                        </transition>
                    </b-col>
                    <!-- Global options -->
                    <b-col cols="auto" id="col-assets">
                        <transition appear name="slide-fade">
                            <NavAssets></NavAssets>
                        </transition>
                    </b-col>
                </b-row>
            </b-navbar>
        </b-navbar>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    export default {
        data() {
            return {
                alta: { name: 'ALTA', path: 'customers.new' }, /* router link */
                biggerScroll: 0, /* Stores the biggest scroll to manage the reapear of the navbar on scroll up */
                cinturones: { name: 'CINTURONES', path: 'belts.index' }, /* router link */
                collapsed: false, /* V-model for the main nav */
                lastScroll: 0, /* Stores the last scroll to reveal if the user scrolls up or down */
                pagos: { name: 'PAGOS', path: 'payments.index' }, /* router link */
                routes: {}, /* Will be composed by the router links depending on the user authenticated */
                smallerScroll: 0, /* Stores the smaller scroll to manage the hiding of the navbar on scroll down */
                tests: { name: 'TESTS', path: 'tests.index' }, /* router link */
                testsRoot: { name: 'TESTS', path: 'testsRoot' }, /* router link */
                usuario: { name: 'GESTIÓN DE USUARIOS & LABS', path: 'users.index' }, /* router link */
            }
        },
        computed: {
            ...mapGetters('auth', ['authenticatedRole', 'authenticatedUser', 'isLoggedIn']),
            ...mapGetters('navbar', ['getIsProcedureBeltsStarted', 'getIsProcedurePaymentsStarted', 'getProcedureState']),
            /**
             * Determines if a procedure cancellable is actived to show a cancel button
             *
             * @return {Boolean} Boolean that indicates if some cancellable procedure has been started
             */
            cancellable() {
                return (this.$route.name == 'payments.index' && this.getIsProcedurePaymentsStarted) || (this.$route.name == 'belts.index' && this.getIsProcedureBeltsStarted);
            },
        },
        created() {
            /* Assign the routes */
            this.routes.admin = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }];
            this.routes.user = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }];
            this.routes.tester = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }, { ...this.tests }];
            this.routes.root = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }, { ...this.testsRoot }, { ...this.usuario }];
            /* Listen to the scroll event to visual effects */
            window.addEventListener('scroll', this.scroll);
        },
        destroyed() {
            /* Destroy scroll listener */
            window.removeEventListener('scroll', this.scroll);
        },
        methods: {
            ...mapActions('auth', ['logout']),
            ...mapActions('navbar', ['setProcedureState']),
            /**
             * Logout the user, this only can be achieved from the navbar (from here)
             */
            inLogout() {
                /* Calls to the vuex logout that calls to the api to logout the user */
                this.logout()
                    .then(() => {
                        /* Redirect to the login home page */
                        if (this.$router.currentRoute.path != '/') {
                            /* Reload the page the reset vuex */
                            location.reload()
                        }
                    });
            },
            /**
             * Uix improvements for the expanded navs
             *
             * @param {String} nav: identifies the nav to manage
             */
            navExpand(nav) {
                const elem = document.getElementById(nav);
                elem.classList.toggle('nav-expanded');
            },
            /**
             * Manage the behaviour of the navbars
             */
            scroll() {
                const mainNav = document.getElementById('ig-main-navbar');
                const editAlert = document.getElementById('edit-alert') || null;
                /* Add class with the box-shadow behaviour */
                document.getElementsByTagName('html')[0].scrollTop > 0 ? mainNav.classList.add('scrolling') : mainNav.classList.remove('scrolling');
                /* Hide/Unhide the navbar based on the scroll position */
                const scrollY = window.scrollY;
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                this.biggerScroll = this.biggerScroll < scrollY ? scrollY : this.biggerScroll;
                this.smallerScroll = this.smallerScroll > scrollY ? scrollY : this.smallerScroll;
                if (scrollY > 350) {
                    /* If is scrolling up and the scroll has a minium up movement */
                    if (currentScroll < this.lastScroll && (currentScroll <= this.biggerScroll - 350)) {
                        this.biggerScroll -= 350;
                        mainNav.style.transform = 'unset';
                        if (editAlert) {
                            editAlert.style.boxShadow = 'unset';
                            editAlert.style.top = '0'
                        }
                    // } else if (currentScroll > this.lastScroll) {
                    } else if (currentScroll > this.lastScroll && (currentScroll >= this.smallerScroll + 350)) {
                        this.smallerScroll += 350;
                        mainNav.style.transform = 'translateY(-150px)';
                        /* Shrink the nav when is expanded */
                        if (this.collapsed) {
                            this.collapsed = false;
                        }
                        /* Manage the edit form alert to sticky it at top */
                        if (editAlert) {
                            editAlert.style.boxShadow = '0px 0px 4px 0 rgba(133, 100, 4, 1)';
                            editAlert.style.top = '100px'
                        }
                    }
                } else if (scrollY <= 350) {
                    this.biggerScroll = 0;
                    mainNav.style.transform = 'unset';
                    if (editAlert) {
                        editAlert.style.boxShadow = 'unset';
                        editAlert.style.top = '0'
                    }
                }
                /* For mobile or negative scrolling set the minimum at 0 */
                this.lastScroll = currentScroll <= 0 ? 0 : currentScroll;
            },
        },
        mounted() {
            this.lastScroll = window.pageYOffset || document.documentElement.scrollTop;
            /* Generate random gradient for the main title */
            this.$randomGradient(document.getElementById('ippon-ttl'));
        }
    }
</script>
<style>
    /* Custom toggler styles */
    .navbar-toggler {
        border: 0;
        color: rgba(0, 131, 81, 1)!important;
    }
    .navbar-toggler.collapsed {
        transform: rotate(0deg);
        transition: transform .3s ease-in-out;
    }
    .navbar-toggler.not-collapsed {
        transform: rotate(-90deg);
        transition: transform .3s ease-in-out;
    }
</style>
<style scoped>
    /* Styles when are in home page, the rest are for the nav style */
    .in-home {
        display: flex 1 1;
        flex-direction: column;
    }
    .in-home .nav-link {
        padding: .4rem!important;
    }
    .in-home #ippon-ttl {
        font-size: calc(50px + (150 - 50) * ((100vw - 300px) / (1600 - 300))); /* minsize + (max-min) * (maxvw - minvw) * (maxpx - minpx) */
        padding: 0 50px 0 50px;
        text-align: center;
    }
    .in-home #nav-user {
        text-align: center;
        width: 100%;
    }
    .in-home #nav-user * {
        width: 100%;
    }

    /* Standard top sticky navbar styles */
    /* Nested nav on main nav */
    .nav-expanded nav {
        box-shadow: 0 -2px 2px 0 rgba(180, 180, 180, 1)!important;
    }
    .ig-tools-item {
        display: block;
        height: 40px;
        padding: 0;
        transition: all .15s ease-in-out;
        min-width: 40px;
        width: 100%;
    }
    .ig-tools-item svg {
        height: 100%;
        margin: auto;
        transition: color .15s ease-in-out;
    }
    .ig-tools-item .nav-link {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
    }
    .ig-tools-item .nav-text,
    .ig-tools-item.onpage svg {
        color: rgba(0, 131, 81, 1);
    }
    .ig-tools-nav.onpage:hover .ig-tools-item.onpage *,
    .ig-tools-nav.onpage.actived .ig-tools-item.onpage * {
        /* color: rgba(159, 209, 189, 1); */
        color: rgba(255, 255, 255, 1);
    }
    .ig-tools-nav {
        border-radius: .25rem;
        box-sizing: border-box;
        height: 40px;
        padding: 0;
        position: relative;
        text-align: center;
        white-space: nowrap;
        width: 40px;
    }
    .ig-tools-nav.onpage {
        transition: background-color .15s ease-in-out, color .15s ease-in-out;
    }
    .ig-tools-nav.onpage {
        padding: 0 .5rem;
        width: auto;
    }
    .ig-tools-nav.onpage:hover,
    .ig-tools-nav.onpage.actived {
        background-color: rgba(0, 131, 81, 1);
        /* color: rgba(159, 209, 189, 1)!important; */
        color: rgba(255, 255, 255, 1)!important;
    }
    .nav-btn-wrp {
        line-height: 38px; /* Vertical alignment correction of the nav content */
    }
    .nav-container {
        align-items: center;
        border: 1px solid transparent; /* Avoding the small jump on hambur open */
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 auto;
        position: relative;
        width: 88%;
    }
    @media screen and (min-width: 992px) {
        .nav-container {
            max-width: 78%;
            width: 78%!important;
        }
    }
    .nav-desc-tools {
        border-radius: .25rem;
        color: rgba(0, 131, 81, 1);
        display: none;
        height: 20px!important;
        letter-spacing: -.04em;
        line-height: 9px;
        margin-top: 18px;
        opacity: 0;
        padding: 5px;
        position: absolute;
        pointer-events: none;
        right: 50%;
        transition: all .3s ease-in-out;
        transform: translate(50%, -38px);
        user-select: none;
        visibility: hidden;
    }
    .ig-tools-nav:hover .nav-desc-tools {
        transform: translate(50%, -41px);
        padding-bottom: 1rem;
        opacity: 1;
        visibility: visible;
    }
    .nav-item a {
        letter-spacing: -.04em;
    }
    .nav-text {
        padding: 0 0 0 .5rem;
    }
    .navbar-light .navbar-toggler {
        border-color: transparent; /* Delete the icon border */
        height: 40px!important
    }
    .navbar {
        border-radius: 0.25rem;
        box-shadow: 0 0 0 0 rgba(180, 180, 180, 1);
        box-sizing: border-box;
        margin: 15px;
        transition: box-shadow .15s ease-in-out;
    }
    .navbar-collapse .nav-link {
        padding: 0;
    }
    .router-link-exact-active:not(#ippon-link) {
        color: rgba(0, 131, 81, 1)!important;
        text-decoration: underline!important;
    }
    .tools-icon {
        max-height: 17px;
        min-width: 22px;
    }
    #ctn-ippongym {
        border: 1px solid transparent; /* Avoding the small jump on hambur open */
    }
    /* Correcting the misalignment */
    #col-tools {
        box-sizing: border-box;
        /* border: 2px solid transparent; */
    }
    /* Alert used on the main form, when a edit is proceding */
    #edit-alert {
        height: 40px;
        max-height: 40px;
        opacity: 75%;
        transition: .15s ease-in-out;
        position: relative;
        z-index: 999;
    }
    #ig-main-navbar,
    #ig-tools-navbar {
        transition: box-shadow .15s ease-in-out, transform .15s ease-in-out;
        width: 100vw; /* Resolving jumps on appear scrollbar */
    }
    #ig-main-navbar {
        border-radius: 0;
        background-color: rgba(255, 255, 255, 1);
        margin: 0;
        min-height: 123px;
        z-index: 999; /* In front of tools nav */
    }
    /* When the main nav is expanded */
    #ig-main-navbar.nav-expanded {
        box-shadow: 0 2px 2px 0 rgba(180, 180, 180, 1)!important;
    }
    #ig-main-navbar #main-navbar-nav {
        padding-top: 10px;
    }
    /* Shadow added when scroll down is produced */
    #ig-main-navbar.scrolling {
        box-shadow: 0 2px 2px 0 rgba(180, 180, 180, 1)!important;
    }
    #ig-tools-navbar {
        background-color: rgba(255, 255, 255, 1);
        border-radius: 0;
        bottom: 0;
        left: 0;
        margin: 0;
        min-height: 40px;
        padding: 0;
        position: absolute;
        z-index: 998; /* Behind tools nav */
    }
    #ippon-link:hover{
        text-decoration: none!important;
    }
    #ippon-ttl {
        background: linear-gradient(to right, #000000 0%, #008351 75%);
        background-clip: text;
        -webkit-background-clip: text;
        letter-spacing: -.05em;
        padding-right: 3px; /* Prevents hides on the cursive letters */
        -webkit-text-fill-color: transparent;
        text-align: center;
        user-select: none;
    }
    #nav-user {
        opacity: .2;
    }
    #tools-cancel-btn {
        margin-bottom: auto;
        margin-left: .5rem;
        margin-top: auto;
    }
    /* Prevent jumps on open modals */
    .modal-open #ig-main-navbar button {
        margin-right: unset!important;
    }
    .modal-open #ig-main-navbar {
        padding-right: 17px!important;
    }
    .modal-open.neutral-scroll #ig-main-navbar {
        padding-right: 1rem!important;
    }
    .modal-open.neutral-scroll #ig-tools-navbar {
        padding-right: 0!important;
    }

    @media screen and (max-width: 880px) {
        .ig-tools-nav.onpage:hover,
        .ig-tools-nav.onpage.actived {
            background-color: rgba(0, 131, 81, 1);
        }
        .ig-tools-nav.onpage:hover .ig-tools-item.onpage .nav-text,
        .ig-tools-nav.onpage.actived .ig-tools-item.onpage .nav-text {
            color: rgba(0, 131, 81, 1);
        }
        .ig-tools-nav.onpage:hover .ig-tools-item.onpage svg,
        .ig-tools-nav.onpage.actived .ig-tools-item.onpage svg {
            /* color: rgba(159, 209, 189, 1); */
            color: rgba(255, 255, 255, 1);
        }
        .ig-tools-nav.onpage {
            padding: 0; /* Remove the padding because on this breakpoint the tools nav are only composed by a svg and it manage its bounds */
        }
        .ig-tools-nav.onpage .nav-text {
            display: none; /* Hide the text */
        }
        .nav-desc-tools {
            display: block; /* Show the hover desc */
        }
    }
    @media (min-width: 768px) {
        #ig-main-navbar #main-navbar-nav {
            padding-top: 0;
        }
    }
    @media (max-width: 768px) {
        #nav-collapse {
            padding-bottom: 62px; /* Giving visibility to nested absolute positioned nav on collapsed nav */
        }
    }
    @media screen and (max-width: 480px) {
        #edit-alert {
            font-size: 14px;
            line-height: 2;
        }
    }
</style>

