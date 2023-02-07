<template>
    <b-alert
        class="fixed-bottom m-0 position-fixed py-4 rounded-0"
        dismissible
        fade
        id="ls-mutation-alert"
        style="z-index: 2000"
        :show="10">
        {{ content }}
    </b-alert>
</template>
<script>
export default {
    props: [
        'content',
    ],
}
</script>
<style scoped>

</style>
