<template>
    <animated-number
        class="animated-number"
        :duration="300"
        :round="true"
        :value="numFounded"/>
</template>
<script>
    import AnimatedNumber from "animated-number-vue";

    export default {
        components: {
            AnimatedNumber
        },
        props: [
            'numFounded'
        ],
    };
</script>

