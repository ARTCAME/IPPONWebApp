<template>
        <div id="ctn-loading">
            <b-img
                class="ml-3"
                fluid
                id="loading-img"
                src="../../../images/loading0.gif"></b-img>
                <!-- :src="src[num]"></b-img> -->
            <span class="mr-3" id="loading-text">CARGANDO...</span>
        </div>
</template>
<script>

// import img from '../../../images/loading.gif'
    export default {
        data() {
            return {
                num: 0,
                src:  [
                    '..\/..\/..\/images\/loading0.gif',
                    '..\/..\/..\/images\/loading1.gif',
                    '..\/..\/..\/images\/loading2.gif',
                    '..\/..\/..\/images\/loading3.gif',
                    '..\/..\/..\/images\/loading4.gif',
                    '..\/..\/..\/images\/loading5.gif',
                    '..\/..\/..\/images\/loading6.gif',
                    '..\/..\/..\/images\/loading7.gif',
                ],
            }
        },
        created() {
            this.num = (Math.floor(Math.random() * 6) + 0);
        },
        mounted() {
            this.randomColor();
        },
        methods: {
             randomColor() {
                document.getElementById('loading-text').style.background = " linear-gradient(to right, " + '#' + (Math.random()*0xFFFFFF<<0).toString(16) + " " + Math.floor(Math.random() * 25) + "%, " + '#' + (Math.random()*0xFFFFFF<<0).toString(16) +  " " + (Math.floor(Math.random() * 100) + 50) + "%)";
                document.getElementById('loading-text').style.webkitBackgroundClip = "text";
                document.getElementById('loading-text').style.backgroundClip = "text";
                document.getElementById('loading-text').style.webkitTextFillColor = "transparent";
            },
        }
    }
</script>
<style scoped>
    /* body,
    html,
    .container {
        height: 100%!important;
    } */
    #ctn-loading {
        box-sizing: border-box;
        position: fixed;
        top: 50%;
        left: 0;
        /* margin-left: calc(100vw - 100%)!important; */
        text-align: center;
        transform: translateY(-50%);
        width: 100%;
        z-index: 99999;
    }
    #loading-img {
        bottom: 0;
        height: 100px;
        left: 0;
        position: absolute;
        widows: auto;
    }

    #loading-text {
        animation: animation-text infinite 2s;
        background: linear-gradient(to right, #000000 0%, #008351 75%);
        background-clip: text;
        -webkit-background-clip: text;
        bottom: 0;
        font-size: calc(40px + (70 - 40) * ((100vw - 300px) / (1600 - 300))); /* minsize + (max-min) * (maxvw - minvw) * (maxpx - minpx) */
        letter-spacing: -.05em;
        position: absolute;
        right: 0;
        -webkit-text-fill-color: transparent;
        user-select: none;
    }

    #ctn-loading {
        /* background: rgba(250, 250, 250, 1); */
        background: linear-gradient(180deg, rgba(250, 250, 250, .5) 0%, rgba(250, 250, 250, 1) 70%);
        height: 100%;
        min-height: 100%;
        min-width: 100%;
        width: 100%;
    }
    #row-loading {
        border: 1px solid red;
        bottom: 0;
        position: absolute;
    }
    @keyframes animation-text {
        0% {
            background-size: 200%;
            background-position: 0%;
        }
        50% {
            background-size: 200%;
            background-position: 100%;
        }
        100% {
            background-size: 200%;
            background-position: 0%;
        }
    }
</style>
