import Vue from 'vue';
/* Directive to insert a title only for the overflown elements, it doesn't works with v-b-tooltip */
/* Pending to resolve: on Payments.vue is not possible to attach this directive on cell(name) when on tableResults and MainBelts is attached in the same way */
Vue.directive('overflown', {
    bind: (el, binding) => {
        if (el.offsetWidth < el.scrollWidth) {
            el.setAttribute('title', binding.value);
        } else {
            el.removeAttribute('title');
        }
    },
    inserted: (el, binding) => {
        if (el.offsetWidth < el.scrollWidth) {
            el.setAttribute('title', binding.value);
        } else {
            el.removeAttribute('title');
        }
    },
    update: (el, binding) => {
        if (el.offsetWidth < el.scrollWidth) {
            el.setAttribute('title', binding.value);
        } else {
            el.removeAttribute('title');
        }
    },
    componentUpdated: (el, binding) => {
        if (el.offsetWidth < el.scrollWidth) {
            el.setAttribute('title', binding.value);
        } else {
            el.removeAttribute('title');
        }
    },
})
