import Fof from '../views/404';
import Home from '../views/Home';
import MainBelts from '../views/MainBelts';
import MainDoc from '../views/MainDoc';
import MainForm from '../views/MainForm';
import MainPayments from '../views/MainPayments';
import MainUsers from '../views/MainUsers';
import MainTests from '../views/MainTests';
import NProgress from 'nprogress';
import Router from 'vue-router';
import store from '../store/store';
import UnderConstruct from '../views/UnderConstruct';
import Vue from 'vue';

Vue.use(Router)
const router = new Router ({
    base: process.env.BASE_URL,
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/alta',
            name: 'customers.new',
            component: MainForm,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/socio/:id',
            name: 'customers.profile',
            component: MainForm,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/socio/:id/editar',
            name: 'customers.edit',
            component: MainForm,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/pagos',
            name: 'payments.index',
            component: MainPayments,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/cinturones',
            name: 'belts.index',
            component: MainBelts,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/tests',
            name: 'tests.index',
            component: MainTests,
            meta: {
                requiresAuth: true,
                role: 'tester',
            }
        },
        {
            path: '/wiki',
            name: 'wiki',
            component: MainDoc,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/404',
            name: '404',
            component: Fof,
        },
        {
            path: '/400',
            name: '400',
            component: Home,
        },
        {
            path: '*',
            redirect: '/404',
        },
        {
            path: '/users',
            name: 'users.index',
            component: MainUsers,
            meta: {
                requiresAuth: true,
                // role: 'admin',
                role: 'root',
            }
        },
        {
            path: '/testsRoot',
            name: 'testsRoot',
            component: MainTests,
            meta: {
                requiresAuth: true,
                // role: 'admin',
                role: 'root',
            }
        },
        /* MAINTENANCE */
        // {
        //     path: '/mantenimiento',
        //     name: 'maintenance',
        //     component: UnderConstruct
        // },
        // {
        //     path: '*',
        //     name: 'maintenance',
        //     component: UnderConstruct
        // },
        // {
        //     path: '/*',
        //     name: 'maintenance',
        //     component: UnderConstruct
        // },
    ],
    scrollBehavior (to, from, savedPosition) {
        //https://router.vuejs.org/guide/advanced/scroll-behavior.html
        if (to.hash) {
                return { selector: to.hash }
            } else if (savedPosition) {
                return savedPosition;
            } else {
                return { x: 0, y: 0 }
            }
    },
})
import { http } from '../utils/http';
const maintenance = false;
router.beforeEach(async (to, from, next) => {
    if (maintenance && store.getters['auth/authenticatedRole'] == 'root' || !maintenance) {
        if (store.getters['auth/isLoggedIn']) {
            /* Update the session data of the current user */
            const id = store.getters['auth/authId'];
            http.post('/api/updateSession', { id: id });
        }
        /* Start the route progress bar out of the documentation page */
        if (!to.hash.includes('#doc-') && to.name != '404') {
            NProgress.start();
        }
        /* Check if the role and the user are valid */
        if ((to.matched.some(record => record.meta.requiresAuth) && store.getters['auth/isLoggedIn']) || (to.matched.some(record => record.meta.requiresAuth && record.meta.role) && store.getters['auth/isLoggedIn'] && store.getters['auth/authenticatedRole'] == record.meta.role)) {
            next();
            return;
        } else if (((to.matched.some(record => record.meta.requiresAuth) && !store.getters['auth/isLoggedIn'])) || (to.matched.some(record => record.meta.requiresAuth && record.meta.role) && (!store.getters['auth/isLoggedIn'] || store.getters['auth/authenticatedRole'] != record.meta.role))) {
            next('/');
        } else {
            next();
        }
    } else if (maintenance && store.getters['auth/authenticatedRole'] != 'root') {
        next();
    }
})
router.afterEach(() => {
    /* Complete the animation of the progress bar. */
    NProgress.done();
})
export default router;
