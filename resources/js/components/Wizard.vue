<template>
<!-- Disabled for now, the costs of deploy it on a lot of pages are bigger than the functionality. -->
    <span
        :class="{ 'mobile-wizard' : mobile }">
        <div
            id="wzd-full-disable-face"
            v-if="wizardLaunched">
                <b-button-close
                    @click="stop()"></b-button-close>
        </div>
        <transition name="wizard-blur-in">
            <!-- Overlay showed when the wizard has been started -->
            <div
                id="wzd-full-face"
                v-if="wizardLaunched">
            </div>
        </transition>
        <!-- Button launcher always visible on the parent -->
        <transition appear name="wzd-launcher-appear">
            <div
                id="wzd-btn-start"
                title="Ayuda"
                v-b-tooltip.hover.noninteractive.left
                :class="'wzd-launcher' + (wizardLaunched ? ' launched' : '')"
                @click="$tours[wizardName].start()">
                <span id="wrp-wzdnav-icon">
                    <fa-icon icon="question"></fa-icon>
                </span>
            </div>
        </transition>
        <!-- Invoke vue tour -->
        <v-tour
            ref="tour"
            :callbacks="wzdCallbacks"
            :name="name"
            :options="wzdOptions"
            :steps="steps">
            <template slot-scope="tour">
                <transition-group name="wizard-blur-in">
                    <!-- Progress bar at the bottom of the window -->
                    <b-progress
                        height="5px"
                        id="wrp-wzd-progress-bar"
                        key="wrp-wzd-progress-bar"
                        variant="info"
                        :max="tour.steps.length" >
                        <b-progress-bar
                            id="wzd-progress-bar"
                            :value="tour.currentStep + 1"></b-progress-bar>
                    </b-progress>
                    <!-- Custom step -->
                    <v-step
                        v-for="(step, index) of tour.steps"
                        v-if="tour.currentStep === index"
                        :key="'step-' + index"
                        :step="step"
                        :previous-step="tour.previousStep"
                        :next-step="tour.nextStep"
                        :stop="tour.stop"
                        :is-first="tour.isFirst"
                        :is-last="tour.isLast"
                        :labels="tour.labels"
                        :useKeyboardNavigation="true">
                        <template>
                            <div slot="actions">
                                <!-- Navigation on the current step tooltip -->
                                <div class="wrp-wzd-nav">
                                    <button
                                        class="wzd-nav"
                                        v-if="!(tour.isFirst && tour.isLast)"
                                        :title="tour.isFirst ? 'Salir' : 'Anterior'"
                                        @click.prevent="previousStep()">
                                        <fa-icon
                                            :icon="tour.isFirst ? 'door-open' : 'angle-left'"></fa-icon>
                                    </button>
                                    <button
                                        class="wzd-nav"
                                        title="Cerrar"
                                        v-if="!(tour.isFirst && tour.isLast)"
                                        @click.prevent="stop()">
                                        <fa-icon icon="times"></fa-icon>
                                    </button>
                                    <button
                                        class="wzd-nav"
                                        id="btn-wzd-next"
                                        :title="tour.isLast ? 'Finalizar' : 'Siguiente'"
                                        @click.prevent="nextStep()">
                                        <fa-icon
                                            :icon="tour.isLast ? 'check' : 'angle-right'"></fa-icon>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </v-step>
                </transition-group>
            </template>
        </v-tour>
    </span>
</template>
<script>
    export default {
        data() {
            return {
                currentEl: null, /* Element wizarded */
                mobile: window.innerWidth <= 700,
                wizardName: null, /* Name of the wizard passed from the parent at name */
                wizardLaunched: false, /* Flag to determine if the wizard has been launched */
                wzdCallbacks: {
                    onStart: this.start,
                }, /* Callbacks to the vue-tour */
                wzdOptions: {
                    useKeyboardNavigation: false, /* This will be managed locally */
                }, /* Options to the vue-tour */
            }
        },
        beforDestroy() {
            window.removeEventListener('keyup', this.keyNav);
            window.removeEventListener('resize');
        },
        computed: {
            tour() {
                return this.$refs.tour;
            }
        },
        created() {
            window.addEventListener('resize', () => {
                this.mobile = window.innerWidth <= 500 || window.innerHeight <= 500
            });
        },
        methods: {
            changeIcon() {
                if (this.tour.isLast) {
                    this.icon = ''
                }
            },
            /**
             * Manage the key events to apropiate use of navigation
             */
            keyNav(ev) {
                if (this.wizardLaunched) {
                    /* Right */
                    if (ev.keyCode == 39) {
                        this.nextStep();
                    }
                    /* Left */
                    if (ev.keyCode == 37) {
                        this.previousStep();
                    }
                    /* Esc */
                    if (ev.keyCode == 27) {
                        this.stop();
                    }
                }
            },
            /**
             * Function to manage specifically the behaviour on navbars wizardeds
             */
            manageNav() {
                /* If the step is on a navbar mantain the nav fixed and move the padding to top to correct the position of the v-step element */
                if (this.currentEl.classList.contains('navbar')) {
                    // this.currentEl.style.position = 'fixed';
                    !document.body.classList.contains('nav-wzd') && document.body.classList.add('nav-wzd');
                } else {
                    document.body.classList.contains('nav-wzd') && document.body.classList.remove('nav-wzd');
                }
            },
            /**
             * Function to acquire the next step element for the vue-tour and to manage the custom class to the next/previous wizarded element that will be change its z-index to show it above the full overlay
             */
            nextStep() {
                if (this.tour.isLast) {
                    this.tour.finish();
                    this.stop();
                } else {
                    this.tour.nextStep();
                    this.currentEl.classList.remove('wizard-focused');
                    this.currentEl = document.querySelector('[data-v-step="' + this.wizardName + '-' + (this.tour.currentStep) + '"]');
                    this.currentEl.classList.add('wizard-focused');
                    this.currentEl.scrollIntoView();
                    this.manageNav();
                }
            },
            /**
             * Function to acquire the previous step element for the vue-tour and to manage the custom class to the next/previous wizarded element that will be change its z-index to show it above the full overlay
             *
             * @param Object tour: includes the vue-tour step variables
             */
            previousStep() {
                if (this.tour.isFirst) {
                    this.tour.skip();
                    this.stop();
                } else {
                    this.tour.previousStep();
                    this.currentEl.classList.remove('wizard-focused');
                    this.currentEl = document.querySelector('[data-v-step="' + this.wizardName + '-' + (this.tour.currentStep) + '"]');
                    this.currentEl.classList.add('wizard-focused');
                    this.manageNav();
                }
            },
            zIndexEval(zIndex) {
                console.log(zIndex);
                if (zIndex > 1000) {
                    const fullFace = document.getElementById('wzd-full-face');
                    fullFace.style.zIndex = zIndex + '!important';
                    const wzdFocused = document.getElementsByClassName('wizard-focused')[0];
                    wzdFocused.style.zIndex = zIndex + 1 + '!important';
                    const fullDisableFace = document.getElementById('wzd-full-disable-face');
                    fullDisableFace.style.zIndex = zIndex + 2 + '!important';
                    const progress = document.getElementById('wrp-wzd-progress-bar');
                    progress.style.zIndex = zIndex + 3 + '!important';
                }
            },
            /**
             * Function that launchs the wizard
             */
            start() {
                // this.$scrollTo('[data-v-step="' + this.wizardName + '-' + 0 + '"]');
                /* Html will not scroll during the wizard */
                document.documentElement.style.overflow = 'hidden';
                this.currentEl = document.querySelector('[data-v-step="' + this.wizardName + '-' + 0 + '"]');
                /* Store the zIndex before modify the item to evaluate if its zIndex is bigger than the wizard elements */
                const zIndex = parseInt(document.defaultView.getComputedStyle(this.currentEl).getPropertyValue('z-index'));
                this.currentEl.classList.add('wizard-focused');
                this.wizardLaunched = true;
                this.manageNav();
                this.$nextTick(() => {
                    this.zIndexEval(zIndex);
                })
            },
            /**
             * Stops the wizard
             */
            stop() {
                /* Reset the scroll */
                document.documentElement.style.overflow = null;
                /* Delaying the time of the rest of the transition to avoid unesthetic z-index change */
                setTimeout(() => this.currentEl.classList.remove('wizard-focused'), 1000);
                this.wizardLaunched = false;
                document.body.classList.contains('nav-wzd') && document.body.classList.remove('nav-wzd');
                this.$tours[this.wizardName].stop();
            },
        },
        mounted() {
            /* Assigning the prop to a local variable */
            this.$nextTick().then(() => this.wizardName = this.name );
            window.addEventListener('keyup', this.keyNav);
        },
        props: [
            'name', /* String with the name of the wizard started */
            'steps', /* Array of the steps for vue-tour */
        ],
    }
</script>
<style>
    .v-step .v-step__arrow,
    .v-step .v-step__arrow[data-v-7c9c03f0] {
        border-color: rgba(255, 255, 255, .95);
    }
    .v-step__content {
        padding: 1rem 1rem 0 1rem!important;
        text-align: left;
    }
    /* Class added with JS to the wizarded element */
    .wizard-focused {
        position: relative;
        z-index: 1001!important;
    }
    /* Mobile styles */
    .mobile-wizard .v-step__content * {
        font-size: 12px!important;
    }
    .mobile-wizard .v-step__content {
        padding: .5rem .5rem 0 .5rem!important;
    }
    .mobile-wizard .wzd-nav {
        font-size: 10px!important;
        height: 15px!important;
        line-height: 15px!important;
    }
</style>
<style scoped>
    /* Normal styles */
    .v-step {
        background-color: rgba(255, 255, 255, .95);
        border-radius: .25rem;
        color: rgba(90, 90, 90, 1);
        filter: drop-shadow(0 0 3px rgba(0,0,0,.5));
        padding: 0;
        /* max-width: calc(100vw - 60%); */
    }
    .wrp-wzd-nav {
        display: flex;
        flex-direction: row;
        margin-bottom: 7px;
    }
    .wzd-launcher {
        /* background: linear-gradient(217deg, rgba(0, 131, 81,1), rgba(0, 131, 81,0) 70.71%), linear-gradient(127deg, rgba(15, 0, 131,1), rgba(15, 0, 131,0) 70.71%), linear-gradient(336deg, rgba(131, 0, 50,1), rgba(131, 0, 50,0) 70.71%); */
        background: linear-gradient(65deg, rgba(0, 131, 81, .95) 0, rgba(0, 50, 131, .95) 70%);
        background-position: 0;
        background-size: 100%;
        border-radius: 50%;
        bottom: -1px /* 45px */;
        box-shadow: 0 0 3px rgba(0,0,0,.5);
        color: rgba(250, 250, 250, 1);
        cursor: pointer;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
        opacity: .7;
        overflow: hidden;
        position: fixed;
        right: 0rem;
        text-align: center;
        transform: scale(0.98);
        transform: translate(-10px, -10px);
        transition: all .3s, background-position 1s;
        width: 40px;
        z-index: 1000;
    }
    .wzd-launcher.launched {
        opacity: .2!important;
    }
    .wzd-launcher:hover:not(.launched) {
        /* animation: semiRotate .3s forwards; */
        background-position: 100%;
        opacity: 1;
        transform: translate(-10px, -10px) scale(1);
        /* transform: translate(-10px, -10px) scale(1.02); */
    }
    .wzd-nav {
        background-size: 600%;
        color: rgba(250, 250, 250, 1);
        border: 0;
        /* border-radius: 50%; */
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;
        font-size: 20px;
        height: 25px;
        line-height: 25px;
        transition: all .3s, background-position 1s;
        width: 40px;
    }
    .wzd-nav svg {
        transition: transform 1s;
    }
    .wzd-nav:nth-child(1) {
        background: linear-gradient(65deg, rgba(0, 50, 131, .95) 1%, rgba(0, 131, 81, .95) 10%);
        background-position: 0%;
        background-size: 1000%;
    }
    .wzd-nav:nth-child(1):hover {
        background-position-x: 15%;
    }
    .wzd-nav:nth-child(1):hover svg {
        transform: translateX(-2px);
    }
    .wzd-nav:nth-child(2) {
        background: rgba(0, 131, 81, .95);
    }
    .wzd-nav:nth-child(2):hover svg {
        transform: scale(1.2);
    }
    .wzd-nav:nth-child(3) {
        background: linear-gradient(65deg, rgba(0, 131, 81, .95) 50%, rgba(0, 50, 131, .95) 59%);
        background-size: 1000%;
        background-position: 55%;
    }
    .wzd-nav:nth-child(3):hover {
        background-position-x: 40%;
    }
    .wzd-nav:nth-child(3):hover svg {
        transform: translateX(2px);
    }
    #wrp-wzd-progress-bar {
        background-color: unset!important;
        border-radius: 0;
        bottom: 0;
        left: 0;
        position: fixed;
        width: 100%;
        z-index: 1002;
    }
    #wrp-wzdnav-icon {
        box-sizing: border-box;
        /* color: rgba(250, 250, 250, 1); */
        display: block;
        font-size: 28px;
        /* height: 40px; */
        /* line-height: 40px; */
        width: 100%;
    }
    #wrp-wzdnav-icon svg {
        width: 100%; /* Prevents jumps on grow its parent */
    }
    #wzd-full-disable-face {
        display: block;
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1002;
    }
    #wzd-full-face {
        /* background: linear-gradient(to right, rgba(250, 250, 250, .4) 0, rgba(250, 250, 250, .7) 50%, rgba(250, 250, 250, .95) 100%); */
        background: linear-gradient(180deg, rgba(250, 250, 250, .7) 0%, rgba(250, 250, 250, .9) 70%);
        display: block;
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
    }
    #wzd-full-disable-face button.close {
        font-size: 45px;
        padding: 1rem 2rem;
    }
    #wzd-progress-bar {
        background: linear-gradient(to right, rgba(0, 50, 131, .95) 0, rgba(0, 131, 81, .95) 50%);
        border-radius: 0!important;
    }
    @keyframes semiRotate {
        0% {
            transform: /* translate(-10px,-10px) */ /* scale(1.02 )*/ rotate(0deg);
        }
        20% {
            transform: /* translate(-10px,-10px) */ /* scale(1.03 )*/ rotate(-10deg);
        }
        40% {
            transform: /* translate(-10px,-10px) */ /* scale(1.04 )*/ rotate(10deg);
        }
        60% {
            transform: /* translate(-10px,-10px) */ /* scale(1.03 )*/ rotate(-8deg);
        }
        80% {
            transform: /* translate(-10px,-10px) */ /* scale(1.01 )*/ rotate(5deg);
        }
        100% {
            transform: /* translate(-10px,-10px) */ /* scale(1) */ rotate(0deg);
        }
    }
</style>
