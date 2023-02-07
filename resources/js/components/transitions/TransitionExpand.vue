
<template>
    <component
        name="expand"
        v-bind="$attrs"
        :is="type"
        :tag="tag"
        @after-enter="afterEnter"
        @after-leave="afterLeave"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave">
        <slot></slot>
    </component>
</template>
<script>
    export default {
        // https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
        // https://github.com/BinarCode/vue2-transitions/blob/master/src/Collapse/CollapseTransition.vue
        computed: {
            type() {
                return this.group ? 'transition-group' : 'transition';
            },
        },
        props: {
            /* Determine if the transition os or not a group */
            group: Boolean,
            /* Determine the context tag */
            tag: {
                type: String,
                default: "div"
            },
        },
        methods: {
            afterLeave(element) {
                element.classList.remove('expandable');
            },
            afterEnter(element) {
                /* Apply the height auto to the element after the appear transition time */
                setTimeout(() => {
                    element.style.height = 'auto'
                    element.style.overflow = null;
                }, 350);
            },
            beforeEnter(element) {
                !element.classList.contains('expandable') && element.classList.add('expandable');
            },
            enter(element) {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.98)';
                element.style.overflow = 'hidden';
                /* The transition groups will comes with value on computed style height, the single transitions no and it's gotten from scrollHeight */
                const height = getComputedStyle(element).height === '0px' ? element.scrollHeight + 'px' : getComputedStyle(element).height;
                element.style.height = height === '0px' ? element.scrollHeight + 'px' : 0;
                /* Force repaint to make sure the animation is triggered correctly */
                getComputedStyle(element).height;
                /* Trigger the animation using requestAnimationFrame because we need to make sure the browser has finished painting after setting the height */
                requestAnimationFrame(() => {
                    element.style.height = height;
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                });
            },
            leave(element) {
                // const width = getComputedStyle(element).width;
                // element.style.width = width;
                element.style.overflow = 'hidden';
                const height = getComputedStyle(element).height;
                element.style.height = height;
                /* Force repaint to make sure the animation is triggered correctly */
                getComputedStyle(element).height;
                /* Trigger the animation using requestAnimationFrame because we need to make sure the browser has finished painting after setting the height */
                requestAnimationFrame(() => {
                    element.style.height = '0';
                    element.style.opacity = '0';
                    element.style.transform = 'scale(0.98)';
                });
            }
        },
    }
</script>
<style>
    .expand-enter-to,
    .expandable {
        transition: all .35s ease;
    }
</style>
<style scoped>
    * {
        will-change: height;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }
    .expand-enter-active,
    .expand-leave-active {
        transition: all .35s ease;
        overflow: hidden!important;
    }
    .expand-enter,
    .expand-leave-to {
        /* opacity: 0;
        transform: scale(0.98); */
    }
</style>
