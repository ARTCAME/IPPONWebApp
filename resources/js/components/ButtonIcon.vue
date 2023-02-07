<template>
    <b-button
        v-bind="$attrs"
        @click="$emit('click')">
        <b-spinner
            small
            type="grow"
            v-if="spin"></b-spinner>
        <fa-icon
            v-else-if="icon"
            :icon="icon"></fa-icon>
        <span
            class="ml-2"
            v-if="!noText">
            <slot></slot>
        </span>
    </b-button>
</template>
<script>
    export default {
        inheritAttrs: false,
        props: {
            icon: String,
            noText: Boolean,
            spin: Boolean,
        }
    }
</script>
<style scoped>
    /* Sets the btn-sm font-size */
    .btn-sm *,
    .btn-group-sm > .btn * {
        font-size: 0.875rem!important;
    }
</style>
