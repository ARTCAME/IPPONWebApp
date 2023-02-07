import store from './store/store';
import validations from './validator/validator';
import Vue from 'vue';

/* Import directives */
import './directives/TextOverflown.js';

Vue.config.devtools = false

import BootstrapVue from 'bootstrap-vue'; /* https://www.npmjs.com/package/bootstrap-vue */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue, {
    BTooltip: {
        delay: { 'show': 800, 'hide': 0 },
      },

});
import 'es6-promise/auto'; /* https://www.npmjs.com/package/es6-promise */

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; /* https://www.npmjs.com/package/@fortawesome/vue-fontawesome */
Vue.component('fa-icon', FontAwesomeIcon);
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(fas)

import moment from 'moment'; /* https://www.npmjs.com/package/moment */
moment.locale('es');
Vue.prototype.$moment = moment;

import NProgress from 'nprogress'; /* https://www.npmjs.com/package/nprogress */
import 'nprogress/nprogress.css';
Vue.use(NProgress);

import router from './router/router';

import VeeValidate from 'vee-validate'; /* 2.x -> http://vee-validate.logaretm.com/v2/guide/flags.html#introduction; */
Vue.use(VeeValidate, {
    classes: true,
    classNames: {
      valid: "is-valid",
      invalid: "is-invalid"
    },
    events: 'blur|input|click',
    fieldsBagName: 'veeFormFields', /* Name changed to prevent conflicts, Only used at MainRegister.vue */
    locale: 'es',
});

import VueTour from 'vue-tour'; /* https://www.npmjs.com/package/vue-tour */
Vue.use(VueTour);
require('vue-tour/dist/vue-tour.css');

/* Import all the plugins from ./plugins */
let requirePlugin = require.context(
    './plugins',
    true,
    /[A-Z]\w+\.(vue|js)$/
  )
requirePlugin.keys().forEach(fileName => {
    const pluginConfig = requirePlugin(fileName);
    /* Manage fileName */
    Vue.use(pluginConfig.default || pluginConfig);
});

/* Import all the components from ./components and subfolders */
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
let requireComponent = require.context(
  './components',
  true,
  /[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName);
    /* Manage subfolder fileName */
    fileName = fileName.slice(fileName.lastIndexOf('/'), fileName.length);
    const componentName = upperFirst(
        camelCase(
            fileName.replace(/^\.?\/?(.*)\.\w+$/, '$1')
            // fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
        )
    );
    Vue.component(
        componentName,
        componentConfig.default || componentConfig
    );
});

// import '../css/styles.css'; // Las fuentes están en app.css en public
import App from './views/App'; /* Contain the css main styles */

window.Vue = require('vue');

import { http } from './utils/http';
/* Add the token to the axios headers */
const token = localStorage.getItem('token')
if (token) {
    // http.defaults.headers.common['Authorization'] = token
    http.defaults.headers['Authorization'] = token;
}

/* Before load the app is necessary to get all the customers data and pass it to vuex but this will happen only if a valid user ir logged in*/

/* UNDER CONSTRUCTION */
// maintenance();
// function maintenance() {
//     store.dispatch('auth/logout');
//     router.push({ name: 'maintenance' });
// }

// window.onerror = function (message, source, lineno, colno, error) {
//     console.error(message);
// };

if (store.getters['auth/isLoggedIn']) {
    store.dispatch('getCustomers')
        .then(() => {
            createVue();
        });
} else {
    createVue();
}
function createVue() {
    const app = new Vue({
        beforeCreate() {
        },
        created() {
            /* Auto login when a user exists on localStorage */
            if (localStorage.getItem('user')) {
                /* Auto login old? */
                store.commit('AUTH_SUCCESS', localStorage.getItem('user'), localStorage.getItem('token'), localStorage.getItem('role'), localStorage.getItem('expires'));
            }
            http.interceptors.response.use(
                response => {
                    return response;
                },
                error => {
                    if (error.response && error.response.status === 401) {
                        store.dispatch('auth/logout');
                        if (error.response.data.message == 'login_error') {
                            this.$showToast('danger', 'Usuario o contraseña incorrectos', 'Error de sesión', 8000);
                        } else if (error.response.data.message.toLowerCase().includes('token')) {
                            // location.reload()
                                // .then(() => {
                                    this.$showToast('danger', 'Sesión expirada. Vuelve a iniciar sesión.', 'Error de sesión', 8000);
                                // });
                        } else {
                            this.$showToast('danger', 'Se ha cerrado la sesión. Vuelve a iniciarla.', 'Error de sesión', 8000);
                        }
                    }
                    console.error(error);
                    NProgress.done();
                    return Promise.reject(error);
                }
            );
        },
        router,
        store,
        validations,
        render: h => h(App)
    }).$mount('#app');
    store.$app = app; /* Pass to the store the this instance to use as this.$app and provide a method to call this.$bvModal or similar */
}

