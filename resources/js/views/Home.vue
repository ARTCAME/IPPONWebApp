<template>
    <div id="login-main-container">
        <span class="sides-login" id="side-logo">
            <span id="login-logo">
                <span id="login-ippon">IPPON</span>
                <span id="login-gym">GYM</span>
            </span>
        </span>
        <span id="side-login" class="sides-login">
            <!-- Shown when the api call to login or logout is actived -->
            <span
                id="logginout-spinner-wrp"
                v-if="logging == true">
                <b-spinner id="logginout-spinner" class="ig-green" type="grow"></b-spinner>
            </span>
            <!-- Shown when the user is not logged in -->
            <b-form
                id="login-form"
                v-else-if="isLoggedIn == false"
                @submit.prevent="inLogin">
                <b-form-group>
                    <h5 class="subtitle" md="4">Inicio de sesión</h5>
                </b-form-group>
                <b-alert
                    class="py-1"
                    show
                    variant="danger"
                    v-if="maintenance">
                    Página en mantenimiento, no es posible iniciar sesión
                </b-alert>
                <b-form-group label="Nombre de usuario" label-for="username">
                    <b-form-input
                        name="login-username"
                        required
                        type="text"
                        v-model="username"
                        v-validate="'required'"
                        :class="{ 'is-invalid' : errors.has('login-username') }"></b-form-input>
                    <transition name="liveFeedbacks" mode="out-in">
                        <b-form-invalid-feedback
                            v-for="error in errors.collect('login-username')"
                            :key="error">
                            {{ error }}
                        </b-form-invalid-feedback>
                    </transition>
                </b-form-group>
                <b-form-group label="Contraseña" label-for="password">
                    <b-form-input
                        autocomplete
                        name="login-password"
                        required
                        type="password"
                        v-model="password"
                        v-validate="'required'"
                        :class="{ 'is-invalid' : errors.has('login-password') }"></b-form-input>
                    <transition name="liveFeedbacks" mode="out-in">
                        <b-form-invalid-feedback
                            v-for="error in errors.collect('login-password')"
                            :key="error">
                            {{ error }}
                        </b-form-invalid-feedback>
                    </transition>
                </b-form-group>
                <b-button
                    size="sm"
                    type="submit">Iniciar sesión</b-button>
            </b-form>
            <!-- Visible when the user is logged in -->
            <span
                id="home-nav"
                v-else-if="isLoggedIn">
                <h2 class="subtitle mb-5">
                    ¿Qué quieres hacer?
                </h2>
                <span class="d-block mx-auto my-4">
                    <NavAssets></NavAssets>
                </span>
                <!-- Visible for the role admin -->
                <span
                    class="my-4"
                    v-if="authenticatedRole == 'admin'">
                    <b-button
                        class="home-nav-btn"
                        variant="ig-outline-green"
                        v-for="(route, key) in routes.admin"
                        :key="key"
                        :to="{ name : route.path }">
                        {{ route.name }}
                    </b-button>
                </span>
                <!-- Visible for the role user -->
                <span
                    class="my-4"
                    v-if="authenticatedRole == 'user'">
                    <b-button
                        class="home-nav-btn"
                        variant="ig-outline-green"
                        v-for="(route, key) in routes.user"
                        :key="key"
                        :to="{ name : route.path }">
                        {{ route.name }}
                    </b-button>
                </span>
                <!-- Visible for the role root -->
                <span
                    class="my-4"
                    v-if="authenticatedRole == 'root'">
                    <b-button
                        class="home-nav-btn"
                        variant="ig-outline-green"
                        v-for="(route, key) in routes.root"
                        :key="key"
                        :to="{ name : route.path }">
                        {{ route.name }}
                    </b-button>
                </span>
                <!-- Visible for the role tester -->
                <span
                    class="my-4"
                    v-if="authenticatedRole == 'tester'">
                    <b-button
                        class="home-nav-btn"
                        variant="ig-outline-green"
                        v-for="(route, key) in routes.tester"
                        :key="key"
                        :to="{ name : route.path }">
                        {{ route.name }}
                    </b-button>
                </span>
                <b-button
                    class="d-block home-nav-btn mt-5 mx-auto"
                    variant="outline-warning"
                    v-if="isLoggedIn"
                    @click.prevent="inLogout()">
                    Cerrar la sesión iniciada
                </b-button>
            </span>
        </span>
    </div>
</template>
<script>
    import { http } from "../utils/http";
    import { mapActions, mapGetters } from 'vuex';
import Axios from 'axios';
    export default {
        data() {
            return {
                alta: { name: 'Dar de ALTA un socio', path: 'customers.new' },
                cinturones: { name: 'Actualizar y ver los CINTURONES', path: 'belts.index' },
                logging: false, /* Flag to apply visual modifications when logging in/out */
                maintenance: false, /* Flag to unable certain functionalities during the maintenances */
                numUserFounded: '', /* Number of users coincidents at the db. Used on typing the user name to show error  */
                pagos: { name: 'Gestionar y consultar los PAGOS existentes', path: 'payments.index' },
                password: '', /* v-model */
                routes: {},
                tests: { name: 'Realizar TESTS sobre procesos', path: 'tests.index' },
                testsRoot: { name: 'Realizar TESTS sobre procesos', path: 'testsRoot' },
                username: '', /* v-model */
                usuario: { name: 'Acceder a la GESTIÓN DE USUARIOS', path: 'users.index' },
            }
        },
        computed: {
            ...mapGetters('auth', ['authStatus', 'isLoggedIn', 'authenticatedRole', 'authenticatedUser']),
        },
        created() {
            /* Assign the routes */
            this.routes.admin = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }];
            this.routes.user = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }];
            this.routes.tester = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }, { ...this.tests }];
            this.routes.root = [{ ...this.alta }, { ...this.cinturones }, { ...this.pagos }, { ...this.testsRoot }, { ...this.usuario }];
        },
        methods: {
            ...mapActions('auth', ['login', 'logout']),
            /**
             * Login the user
             */
            inLogin() {
                if (this.maintenance && this.username == 'root' || !this.maintenance) {
                    this.logging = true;
                    this.login({ username: this.username, password: this.password })
                        .then((response) => {
                            this.logging = false;
                        })
                        .catch(error => {
                            this.logging = false;
                            return new Promise((resolve, reject) => {
                                reject(error);
                            })
                        });
                }
            },
            /**
             * Logout the user, this only can be achieved from the navbar (from here)
             */
            inLogout() {
                this.logging = true;
                /* Calls to the vuex logout that calls to the api to logout the user */
                this.logout()
                    .then(() => {
                        location.reload()
                            .then(() => {
                                this.logging = false;
                            });
                    });
            },
        },
    }
</script>
<style scoped>
    #home-nav {
        margin: auto;
        text-align: center;
        width: 80%;
    }
    #logginout-spinner-wrp {
        margin: auto;
        text-align: center;
        width: 50%;
    }
    #logginout-spinner {
        height: 50px;
        width: 50px;
    }
    #login-main-container {
        display: flex;
        flex-flow: row nowrap;
        height: 100%;
        overflow-y: auto!important ;
        position: fixed;
        right: 0;
        top: 0;
        width: 100%;
    }
    #login-logo {
        margin: auto;
        padding: 0 .25rem;
        text-align: center;
        width: 100%;
    }
    #login-logo * {
        font-size: calc(50px + (200 - 50) * ((100vw - 300px) / (1600 - 300))); /* minsize + (max-min) * (maxvw - minvw) * (maxpx - minpx) */
        letter-spacing: -.05em;
        white-space: nowrap;
    }
    #login-form {
        margin: auto;
        width: 50%;
    }
    #login-ippon {
        color: rgb(255, 255, 255);
        -webkit-text-fill-color: rgb(255, 255, 255); /* Will override color (regardless of order) */
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: rgb(0, 0, 0);
    }
    #login-gym {
        color: rgb(0, 131, 81);
        -webkit-text-fill-color: rgb(0, 131, 81); /* Will override color (regardless of order) */
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: rgb(0, 131, 81);
    }
    #side-login {
        right: 0;
    }
    #side-logo {
        left: 0;
    }
    .home-nav-btn {
        height: 35px;
        line-height: 1.4;
        margin-right: 10px;
        margin-top: 5px;
    }
    .sides-login {
        box-sizing: border-box;
        display: inline-flex!important;
        flex: 1;
        height: 100%;
    }
    @media (max-width: 720px) {
        #login-logo * {
            font-size: calc(50px + (200 - 50) * ((100vw - 0px) / (1600 - 500))); /* minsize + (max-min) * (maxvw - minvw) * (maxpx - minpx) */
            letter-spacing: -.05em;
            white-space: nowrap;
        }
        #login-main-container {
            flex-direction: column;
        }
        #side-logo {
            flex-grow: .40;
        }
    }
</style>
