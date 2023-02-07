<template>
    <b-card no-body>
        <template v-slot:header>
            <b-nav card-header tabs>
                <b-nav-item
                    class="p-0"
                    :active="current == 0"
                    @click="current = 0">
                    Estado de usuarios
                </b-nav-item>
                <b-nav-item
                    class="p-0"
                    :active="current == 1"
                    @click="current = 1">
                    Registro de usuario
                </b-nav-item>
                <b-nav-item
                    class="p-0"
                    :active="current == 2"
                    @click="current = 2">
                    Edición de usuario
                </b-nav-item>
                <b-nav-item
                    class="p-0"
                    :active="current == 3"
                    @click="current = 3">
                    Labs
                </b-nav-item>
            </b-nav>
        </template>
        <transition appear mode="out-in" name="fade">
            <!-- Status dashboard -->
            <div
                key="user-status-dashboard"
                v-if="current == 0 && authenticatedRole == 'root'">
                <b-row no-gutters>
                    <b-input
                        class="m-2"
                        placeholder="Filtra los resultados"
                        @input="filterUsers($event)"></b-input>
                </b-row>
                <b-card-group
                    class="p-2"
                    columns>
                    <span
                        v-if="users && users.length == 0">
                        No hay usuarios
                    </span>
                    <transition-group mode="out-in" name="fade">
                        <b-card
                            v-for="user in users"
                            :key="user._id.$oid">
                            <b-list-group>
                                <b-list-group-item
                                    class="user-data-list"
                                    v-for="(ud, index) in userData"
                                    :key="ud + index">
                                    <b-row>
                                        <b-col>{{ ud.text }}:</b-col>
                                        <b-col
                                            v-if="ud.key == 'tests'">{{ user[ud.key] ? user[ud.key].length : 0 }}</b-col>
                                        <b-col
                                            v-else>{{ user[ud.key] }}</b-col>
                                    </b-row>
                                </b-list-group-item>
                            </b-list-group>
                        </b-card>
                    </transition-group>
                </b-card-group>
            </div>
            <!-- Register form -->
            <b-form
                autocomplete="off"
                key="user-register-form"
                method="post"
                v-if="current == 1"
                @submit.prevent="inRegister">
                <b-card id="register-form">
                    <b-form-group>
                        <h5 md="4" class="subtitle">Nuevo usuario</h5>
                    </b-form-group>
                    <b-form-group label="Nombre" label-for="name">
                        <b-form-input
                            autocomplete="off"
                            autofocus
                            id="name"
                            name="reg_nombre"
                            required
                            type="text"
                            v-model="name"
                            v-validate="'required|min:3'"
                            :class="{ 'is-invalid' : errors.has('reg_nombre') }"></b-form-input>
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-form-invalid-feedback
                                v-for="error in errors.collect('reg_nombre')"
                                :key="error">
                                {{ error }}
                            </b-form-invalid-feedback>
                        </transition>
                    </b-form-group>
                    <b-form-group label="Nombre de usuario" label-for="username">
                        <b-form-input
                            autocomplete="off"
                            autofocus
                            id="username"
                            name="reg-username"
                            required
                            type="text"
                            v-model="username"
                            v-validate="'required|min:3|uniqueUsername:' + numUserFounded"
                            :class="{ 'is-invalid' : errors.has('reg-username') }"
                            @input="find('username', username)"></b-form-input>
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-form-invalid-feedback
                                v-for="error in errors.collect('reg-username')"
                                :key="error">
                                {{ error }}
                            </b-form-invalid-feedback>
                        </transition>
                    </b-form-group>
                    <b-form-group label="E-mail" label-for="email">
                        <b-form-input
                            id="email"
                            name="reg-email"
                            required
                            type="email"
                            v-model="email"
                            v-validate="'required|email|uniqueEmail:' + numEmailFounded"
                            :class="{ 'is-invalid' : errors.has('reg-email') }"
                            @input="find('email', email)"></b-form-input>
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-form-invalid-feedback
                                v-for="error in errors.collect('reg-email')"
                                :key="error">
                                {{ error }}
                            </b-form-invalid-feedback>
                        </transition>
                    </b-form-group>
                    <b-form-group label="Contraseña" label-for="password">
                        <b-form-input
                            id="password"
                            name="reg-pass"
                            ref="password"
                            required
                            type="password"
                            v-model="password"
                            v-validate="{ required: true, min: 3 }"
                            :class="{ 'is-invalid' : errors.has('reg-pass') }"></b-form-input>
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-form-invalid-feedback
                                v-for="error in errors.collect('reg-pass')"
                                :key="error">
                                {{ error }}
                            </b-form-invalid-feedback>
                        </transition>
                    </b-form-group>
                    <b-form-group label="Confirma contraseña" label-for="password-confirm">
                        <b-form-input
                            id="password-confirm"
                            name="reg-pass-confirm"
                            required
                            type="password"
                            v-model="password_confirmation"
                            v-validate="{ required: true, min: 3, confirmed: password }"
                            :class="{ 'is-invalid' : errors.has('reg-pass-confirm') }"></b-form-input>
                        <transition mode="out-in" name="liveFeedbacks">
                            <b-form-invalid-feedback
                                v-for="error in errors.collect('reg-pass-confirm')"
                                :key="error">
                                {{ error }}
                            </b-form-invalid-feedback>
                        </transition>
                    </b-form-group>
                    <b-form-group
                        label="Selecciona rol">
                        <b-form-select
                            name="selectRole"
                            required
                            v-model="role"
                            v-validate="'required'"
                            :class="{ 'is-invalid' : errors.has('selectRole') }"
                            :options="roles"></b-form-select>
                            <transition mode="out-in" name="liveFeedbacks">
                                <b-form-invalid-feedback
                                    v-for="error in errors.collect('selectRole')"
                                    :key="error">
                                    {{ error }}
                                </b-form-invalid-feedback>
                            </transition>
                    </b-form-group>
                    <b-button
                        type="submit"
                        :disabled="this.isEveryValid == false">
                        Registrar
                    </b-button>
                </b-card>
            </b-form>
            <!-- User edits forms -->
            <b-card
                id="user-edits-forms"
                key="user-edits-forms"
                v-if="current == 2">
                <b-row class="my-2" no-gutters>Selecciona una acción:</b-row>
                <b-row class="mb-3" no-gutters>
                    <b-button
                        variant="primary"
                        @click="currentEdit = 0">
                        Cambiar contraseña
                    </b-button>
                    <b-button
                        class="mx-2" variant="primary"
                        @click="currentEdit = 1">
                        Editar datos de usuario
                    </b-button>
                    <b-button
                        variant="outline-primary"
                        @click="wantNewsTester()">
                        Activar news en testers
                    </b-button>
                </b-row>
                <div
                    v-if="currentEdit !== null">
                    <b-row class="mt-4" no-gutters>Selecciona un usuario:</b-row>
                    <b-input
                        class="my-2"
                        placeholder="Filtra los usuarios"
                        @input="filterByUsername($event)"></b-input>
                    <div class="mb-3">
                        <b-button
                            class="m-1"
                            variant="outline-secondary"
                            v-for="user in users"
                            :key="user._id.$oid"
                            @click="editUser = {...user}">
                            {{ user.username }}
                        </b-button>
                    </div>
                </div>
                <transition appear mode="out-in" name="fade">
                    <b-form
                        autocomplete="off"
                        key="user-change-password-form"
                        method="post"
                        v-if="currentEdit == 0 && editUser"
                        @submit.prevent="inUpdatePassword">
                        <b-card id="update-password-form">
                            <b-form-group>
                                <h5 md="4" class="subtitle">Cambio de contraseña</h5>
                            </b-form-group>
                            <b-form-group label="Nombre de usuario" label-for="upd-username">
                                <b-form-input
                                    autocomplete="off"
                                    autofocus
                                    disabled
                                    id="upd-username"
                                    type="text"
                                    v-model="editUser.username"></b-form-input>
                            </b-form-group>
                            <b-form-group label="Nueva contraseña" label-for="upd-password">
                                <b-form-input
                                    id="upd-password"
                                    name="upd-password"
                                    ref="upd-password"
                                    required
                                    v-model="updPassword"
                                    v-validate="{ required: true, min: 3 }"
                                    :class="{ 'is-invalid' : errors.has('upd-password') }"></b-form-input>
                                <transition mode="out-in" name="liveFeedbacks">
                                    <b-form-invalid-feedback
                                        v-for="error in errors.collect('upd-password')"
                                        :key="error">
                                        {{ error }}
                                    </b-form-invalid-feedback>
                                </transition>
                            </b-form-group>
                            <b-button type="submit">
                                Actualizar contraseña
                            </b-button>
                        </b-card>
                    </b-form>
                    <!-- Edit user form -->
                    <b-form
                        autocomplete="off"
                        key="user-edit-form"
                        method="post"
                        v-if="currentEdit == 1 && editUser"
                        @submit.prevent="inUpdate">
                        <b-card id="edit-form">
                            <b-form-group>
                                <h5 md="4" class="subtitle">Editar usuario</h5>
                            </b-form-group>
                            <transition appear mode="out-in" name="fade">
                                <div>
                                    <b-form-group label="Nombre de usuario" label-for="username">
                                        <b-form-input
                                            autocomplete="off"
                                            autofocus
                                            disabled
                                            id="edit-username"
                                            type="text"
                                            v-model="editUser.username"></b-form-input>
                                    </b-form-group>
                                    <b-form-group label="Nombre" label-for="name">
                                        <b-form-input
                                            autocomplete="off"
                                            autofocus
                                            id="edit-name"
                                            name="edit_name"
                                            required
                                            type="text"
                                            v-model="editUser.name"
                                            v-validate="'required|min:3'"
                                            :class="{ 'is-invalid' : errors.has('edit_name') }"></b-form-input>
                                        <transition mode="out-in" name="liveFeedbacks">
                                            <b-form-invalid-feedback
                                                v-for="error in errors.collect('edit_name')"
                                                :key="error">
                                                {{ error }}
                                            </b-form-invalid-feedback>
                                        </transition>
                                    </b-form-group>
                                    <b-form-group label="E-mail" label-for="email">
                                        <b-form-input
                                            id="edit-email"
                                            name="edit-email"
                                            required
                                            type="email"
                                            v-model="editUser.email"
                                            v-validate="'required|email|uniqueEmail:' + numEmailFounded"
                                            :class="{ 'is-invalid' : errors.has('edit-email') }"
                                            @input="find('email', editUser.email)"></b-form-input>
                                        <transition mode="out-in" name="liveFeedbacks">
                                            <b-form-invalid-feedback
                                                v-for="error in errors.collect('edit-email')"
                                                :key="error">
                                                {{ error }}
                                            </b-form-invalid-feedback>
                                        </transition>
                                    </b-form-group>
                                    <b-form-group
                                        label="Selecciona rol">
                                        <b-form-select
                                            name="edit-selectRole"
                                            required
                                            v-model="editUser.role"
                                            v-validate="'required'"
                                            :class="{ 'is-invalid' : errors.has('edit-selectRole') }"
                                            :options="roles"></b-form-select>
                                            <transition mode="out-in" name="liveFeedbacks">
                                                <b-form-invalid-feedback
                                                    v-for="error in errors.collect('edit-selectRole')"
                                                    :key="error">
                                                    {{ error }}
                                                </b-form-invalid-feedback>
                                            </transition>
                                    </b-form-group>
                                    <b-form-group
                                        label="Mostrar noticias">
                                        <b-form-select
                                            name="edit-news"
                                            :options="[{ value: true, text: 'Sí' }, { value: false, text: 'No' }]"
                                            v-model="editUser.wantNews"></b-form-select>
                                    </b-form-group>
                                    <b-button
                                        type="submit"
                                        :disabled="this.isEveryValid == false">
                                        Actualizar usuario
                                    </b-button>
                                </div>
                            </transition>
                        </b-card>
                    </b-form>
                </transition>
            </b-card>
            <div
                key="labs-tab"
                v-if="current == 3 && authenticatedRole == 'root'">
                Función para añadir a todos los pagos de cada socio el tipo periódico:
                <b-button @click="editPaymentsManual">Llamar función</b-button>
            </div>
        </transition>
    </b-card>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import { http } from "../utils/http";
    export default {
        data() {
            return {
                auxUsers: [], /* Stores a copy of the users to filter it on search*/
                current: 0, /* Is the current tab */
                currentEdit: null, /* Is the edit action selected */
                editUser: null, /* The user on edit */
                email: '', /* V-model */
                name: '', /* V-model */
                numEmailFounded: 0, /* Stores the number of coincidences by email founded at the database */
                numUserFounded: 0, /* Stores the number of coincidences by username founded at the database */
                password: '', /* V-model */
                password_confirmation: '', /* V-model */
                role: '', /* V-model */
                roles: [
                    { value: 'user', text: 'Usuario' },
                    { value: 'admin', text: 'Administrador' },
                    { value: 'root', text: 'Root' },
                    { value: 'tester', text: 'Tester' }
                ], /* Select element options */
                typingTimer: null, /* Timer for the settimeout */
                username: '', /* V-model */
                users: [], /* Users existing on the db */
                userData: [
                    { text: 'Nombre', key: 'name' },
                    { text: 'Nombre de usuario', key: 'username' },
                    { text: 'E-mail', key: 'email' },
                    { text: 'Conexiones', key: 'login_count' },
                    { text: 'Última actividad', key: 'lastActivity' },
                    { text: 'Última ip', key: 'lastIp' },
                    { text: 'Último inicio de sesión', key: 'last_login' },
                    { text: 'Tests completados', key: 'tests' },
                    { text: 'Mostrando noticias', key: 'wantNews' },
                ], /* Data of the user to show */
                updPassword: '', /* V-model */
            }
        },
        computed: {
            ...mapGetters('auth', ['authenticatedRole', 'isLoggedIn']),
            /**
             * Evaluate if every field is correct
             */
            isEveryValid() {
                return Object.keys(this.veeFormFields).every(k => this.veeFormFields[k].valid);
            },
        },
        mounted() {
            /* Get all the users registered and its sessions */
            this.getUsers();
            this.getSessions();
        },
        methods: {
            ...mapActions('auth', ['register']),
            /**
             * Call to the api
             */
            editPaymentsManual() {
                http.post('api/editPaymentsManual')
                    .then(response => {
                        console.log(response)
                    })
            },
            /**
             * On typing on input, filter by the username the users shown
             *
             * @param {String} ev: the value on search input
             */
            filterByUsername(ev) {
                this.users = this.auxUsers.filter(user => user.username.toLowerCase().includes(ev.toLowerCase()));
                /* When the input is clean, restart the shown users */
                if (ev == '' || ev == null) {
                    this.users = this.auxUsers;
                }
            },
            /**
             * On typing on input, filter the users shown
             *
             * @param {String} ev: the value on search input
             */
            filterUsers(ev) {
                this.users = this.auxUsers.filter(user => cleanObj(user).includes(ev.toLowerCase()));
                /* When the input is clean, restart the shown users */
                if (ev == '' || ev == null) {
                    this.users = this.auxUsers;
                }
                /* Clean the object stringified data */
                function cleanObj(value) {
                    return JSON.stringify(value).toLowerCase().replace(/["{}+]/g,'');
                }
            },
            /**
             * Finds by email and username the users
             *
             * @param {String} f: the field to search
             * @param {String} v: the value to search
             */
            find(f, v) {
                /* Reset the counters to its initial values */
                this.numEmailFounded = 0
                this.numUserFounded = 0;
                const founded = this.users.filter(user => user[f] == v).length;
                f == 'email' ? this.numEmailFounded = founded : this.numUserFounded = founded;
            },
            /**
             * Get the sessions
             */
            getSessions() {
                http.get('/api/getSessions')
                    .then((response) => {
                        this.users.forEach((user, index) => {
                            /* Check if a session exists to assign its data to the user */
                            const session = response.data.filter(session => session.user_id == user._id.$oid);
                            if (session.length > 0) {
                                this.$set(this.users[index], 'lastActivity', this.$moment(parseInt(session[0].updated_at.$date.$numberLong)).format('YYYY-MM-DD HH:mm:ss'));
                                this.$set(this.users[index], 'lastIp', session[0].last_ip);
                            }
                        });
                        /* Save the users to an aux variable to allow the filter of the users */
                        this.auxUsers = [...this.users];
                    })
                    .catch(error => {
                        this.$showToast('danger', 'No se han podido obtener las sesiones', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    });
            },
            /**
             * Get the users
             */
            getUsers() {
                http.get('/api/getUsers')
                    .then((response) => {
                        this.users = response.data;
                    })
                    .catch(error => {
                        this.$showToast('danger', 'No se han podido obtener los usuarios', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    });
            },
            /**
             * Launchs the register action to the db
             */
            inRegister() {
                let user = {
                    name: this.name,
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                    role: this.role,
                    login_count: 0,
                }
                http.post('api/register', { ...user })
                    .then(response => {
                        this.name = '';
                        this.username = '';
                        this.email = '';
                        this.password = '';
                        this.password_confirmation = '';
                        this.role = '';
                        this.$validator.reset();
                        this.$showToast('success', 'Usuario creado correctamente', 'Creación de usuario');
                    })
                    .catch(error => {
                        this.$showToast('danger', 'No se ha podido crear al nuevo usuario. Código de error: FEMaUs@InRe', 'Ha ocurrido un error');
                        console.error(error.response ? error.response.data : error);
                    });
            },
            inUpdate() {
                http.post('api/update', { ...this.editUser })
                    .then(response => {
                        this.$validator.pause();
                        this.editUser = null;
                        this.currentEdit = null;
                        this.$showToast('success', 'Usuario actualizado correctamente', 'Edición de usuario');
                        /* Refetch the users and sessions */
                        this.getUsers();
                        this.getSessions();
                    })
                    .then(() =>{
                        this.$validator.resume();
                        this.$validator.reset();
                    })
                    .catch(error => {
                        this.$showToast('danger', 'No se ha podido actualizar el usuario. Código de error: FEMaUs@InUp', 'Ha ocurrido un error');
                        console.error(error.response ? error.response.data : error);
                    });

            },
            /**
             * Update the user requested password
             */
            inUpdatePassword() {
                http.post('api/updatePassword', { newPassword: this.updPassword, username: this.editUser.username })
                    .then((response) => {
                        this.$showToast(response.data.status, response.data.message, response.data.title);
                        this.editUser = null;
                        this.currentEdit = null;
                    })
                    .catch(error => {
                        this.$showToast('danger', 'No se ha podido completar la operación. Código de error: FEMaUs@InUpPa', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    });
            },
            /**
             * Function to activate the news on the testers
             */
            wantNewsTester() {
                http.post('api/wantNews')
                    .then((response) => {
                        this.$showToast('success', 'Se han activado las noticias para todos los usuarios tester y root', 'Activación de noticias');
                        this.editUser = null;
                        this.currentEdit = null;
                    })
                    .catch(error => {
                        this.$showToast('danger', 'No se ha podido completar la operación. Código de error: FEMaUs@WaNeTe', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    });
            },
        },
    }
</script>
<style scoped>
    .user-data-list {
        padding: .4rem .5rem;
    }
    .card-columns {
        column-count: 3;
    }
    #register-form,
    #update-password-form,
    #user-edits-forms {
        border-color: transparent!important;
    }
    @media screen and (max-width: 1000px) {
        .card-columns {
            column-count: 2;
        }
    }
    @media screen and (max-width: 680px) {
        .card-columns {
            column-count: 1;
        }
    }
</style>
