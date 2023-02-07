<template>
    <div id="wrapper">
        <div
        class="mb-2"
        id="main-container"
        ref="container">
<!-- Navbar -->
        <NavBar
            v-if="$route.name != 'home' && $route.name != '404' && $route.name != 'wiki' && $route.name != 'maintenance'"></NavBar>
        <transition appear mode="out-in" name="fade">
            <router-view></router-view>
        </transition>
<!-- Wiki launcher -->
        <transition appear mode="out-in" name="launcher-appear">
            <DocLauncher
                v-if="isLoggedIn && $route.name != '404' && $route.name != 'wiki' && $route.name != 'maintenance'"></DocLauncher>
        </transition>
        </div>
<!-- News launcher -->
        <News></News>
<!-- Scroll top button -->
        <transition appear name="wzd-launcher-appear">
            <div
                id="to-top"
                v-if="scrollToTop"
                @click="$scrollTo('html')">
                <fa-icon icon="arrow-up"></fa-icon>
            </div>
        </transition>
        <!-- <loading v-if="$root.isLoading == true"></loading> -->
    </div>
</template>
<script>
    import addBottomAlert from '../mixins/addBottomAlert.vue';
    import DocLauncher from '../components/userdocassets/DocLauncher';
    import { mapActions, mapGetters, mapState } from 'vuex';
    export default {
        data() {
            return {
                scrollToTop: false,
            }
        },
        components: {
            'DocLauncher': DocLauncher,
        },
        computed: {
            ...mapGetters('auth', ['isLoggedIn'/* , 'authenticatedRole', 'authenticatedUser' */]),
        },
        created() {
            window.addEventListener('scroll', this.evaluateToTop);
            /* Listen to the storage changes */
            window.addEventListener('storage', this.actionReceived);
            /* Prevents leave the page when changes has been made */
            window.addEventListener('beforeunload', this.beforeUnload);
        },
        destroyed() {
            /* Destroy de listeners */
            window.removeEventListener('scroll', this.evaluateToTop);
            window.removeEventListener('storage', this.actionReceived);
            window.removeEventListener('beforeunload', this.beforeUnload);
        },
        methods: {
            ...mapActions(['initEditForm', 'setCustomerEdited']),
            /**
             * Manages the localStarge changes to react on them on the diferent app pages to reload the customers data modified on other local tabs/windows
             *
             * @param {Object} ev: is the event stored on the localStorage, contains ev.newValue that is the id which identifies the customer updated
             */
            actionReceived(ev) {
                const data = ev.newValue;
                const store = this.$store.state;
                /* Ignore empty value or value reset */
                if (!data) {
                    return;
                }
                // console.log('receiving ->' + data)
                if (ev.key == 'customer_updated') {
                    /* Update the customer */
                    this.setCustomerEdited(data);
                    /* Update the form */
                    if (this.$route.name == 'customers.edit' || this.$route.name == 'customers.profile') {
                        this.initEditForm(data);
                    }
                    /* Algorithm
                        Are using the editform state and the id is used as a customer, tutor or contact
                        Are using the form and the id is used a tutor or contact
                        Are out of the form states and the home, 404 and wiki pages
                     */
                    if (((this.$route.name == 'customers.edit' || this.$route.name == 'customers.profile') && data == store.editform._id) || ((this.$route.name == 'customers.edit' || this.$route.name == 'customers.profile') && store.editform.tutor && data == store.editform.tutor._id) || ((this.$route.name == 'customers.edit' || this.$route.name == 'customers.profile') && store.editform.contacts && store.editform.contacts.length > 0 && data == store.editform.contacts.filter(contact => contact._id == data).length > 0) || (this.$route.name == 'customers.new' && store.form.tutor && data == store.form.tutor._id) || (this.$route.name == 'customers.new' && store.form.contacts && store.form.contacts.length > 0 && store.form.contacts.filter(contact => contact._id == data).length > 0) || (!['customers.edit', 'customers.new', 'customers.profile', 'wiki', '404', 'home'].includes(this.$route.name))) {
                        /* Reload the specific customer */
                        /* Call to the mixin function to show an alert */
                        this.addBottomAlert('Se han producido cambios en los datos y se han cargado correctamente a esta página.');
                    }
                }
            },
            /**
             * Determines if the to-top element has to be shown based on the amount of the scroll is bigger than 600 or if its smaller and the scroll is on the bottom of the page
             *
             * @returns {Boolean} With the result of these evaluations as flag to show the helper button
             */
            evaluateToTop() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                this.scrollToTop = currentScroll > 600 || (window.innerHeight < document.documentElement.scrollHeight && ((window.pageYOffset + window.innerHeight) == document.documentElement.scrollHeight));
            },
        },
        mixins: [
            addBottomAlert
        ],
    }
</script>
<style lang="scss">
    @import url('../../sass/custom.scss'); /* No funsiona! */
    @font-face {
        font-family: 'myriad';
        src: url('../../fonts/Myriad_Pro_Bold_Condensed_Italic.ttf') format('truetype');
    }
    $ig-font: 'myriad';
    $font-family-sans-serif:      $ig-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    $font-family-base:            $font-family-sans-serif;

    $blue:     #003283;
    $green:     #008351;
    $dangning:  #833000;

    @import "~bootstrap/scss/bootstrap.scss";
    @import '~bootstrap-vue/src/index.scss';
</style>
<style>
    @font-face {
        font-family: 'myriad';
        src: url('../../fonts/Myriad_Pro_Bold_Condensed_Italic.ttf') format('truetype');
    }
    @import url('../../css/custom_variants.css');
    @import url('../../css/transitions.css');
    @import url('../../css/styles.css');

    #main-container {
        margin: 0 auto;
        max-width: 90%;
        width: 90%!important;
    }
    #to-top {
        background: linear-gradient(65deg, rgba(0, 50, 131, .95) 0, rgba(0, 131, 81, .95) 70%);
        background-position: 0;
        background-size: 150%;
        border-radius: 50%;
        bottom: 80px;
        box-shadow: 0 0 3px rgba(0,0,0,.5);
        color: rgba(250, 250, 250, 1);
        cursor: pointer;
        font-size: 20px;
        height: 30px;
        line-height: 30px;
        opacity: .7;
        overflow: hidden;
        position: fixed;
        right: 15px;
        text-align: center;
        transition: all .3s, background-position 1s;
        width: 30px;
        z-index: 999;
    }
    #to-top:hover {
        background-position: 100%;
        opacity: 1;
    }
    #to-top svg {
        transition: .25s;
    }
    #to-top:hover svg {
        transform: translateY(-1px);
    }
    @media screen and (min-width: 992px) {
        #main-container {
            margin: 0 auto;
            max-width: 80%;
            width: 80%!important;
        }
    }
</style>

