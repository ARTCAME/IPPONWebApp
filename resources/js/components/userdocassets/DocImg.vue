<template>
    <div class="doc-img">
        <b-form-group
            class="doc-attch-img-wrp"
            :description="desc">
            <div
                @click="noexpandable ? null : $bvModal.show('doc-img-modal' + '-' + img)">
                <b-img-lazy
                    blank-color="rgba(245, 245, 245, 1)"
                    blank-height="315px"
                    blank-width="800px"
                    class="doc-attch-img"
                    fluid
                    v-show="true"
                    :alt="alt"
                    :blank-src="require('../userdocassets/img/loadingImg.gif')"
                    :src="require(`../userdocassets/img/${img}`)"
                    :type="type"
                    :width="width ? width : 'auto'"></b-img-lazy>
            </div>
        </b-form-group>
        <b-modal
            centered
            hide-footer
            ok-only
            ok-title="Cerrar"
            size="xl"
            :id="'doc-img-modal' + '-' + img"
            :title="desc">
            <b-img-lazy
                blank-color="rgba(245, 245, 245, 1)"
                class="doc-img-modal"
                fluid
                v-show="true"
                :src="require(`../userdocassets/img/${img}`)"
                :type="type"></b-img-lazy>
        </b-modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loaded: false,
                loadedModal: false,
            }
        },
        methods: {
            click() {
                console.log('click!')
            }
        },
        mounted() {
        },
        props: [
            'alt',
            'desc',
            'height',
            'img', /* img attr */
            'noexpandable',
            'type', /* img attr */
            'width',
        ]
    }
</script>
<style>
    .modal[id^="doc-img-modal"] {
        height: 100%;
        width: 100%;
    }
    .modal[id^="doc-img-modal"] .modal-dialog {
        min-width: 90%;
    }
    .modal[id^="doc-img-modal"]  button.close {
        font-size: 45px!important;
        margin: 0;
        padding: .3rem 1rem;
        position: absolute;
        right: 0;
        top: 0;
    }
    .modal[id^="doc-img-modal"] header.modal-header {
        border-bottom: unset!important;
        padding-bottom: 0!important;
    }
</style>
<style scoped>
    .doc-attch-img-wrp {
        width: 100%;
    }
    .doc-attch-img {
        background-color: rgba(250, 250, 250, 1);
        border-radius: .25rem;
        box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, .25);
        cursor: pointer;
        height: auto;
        /* max-height: 315px; */
        /* width: 800px; */
    }
    .doc-img-modal {
        min-width: 100%;
    }
    .doc-spinner-wrp {
        text-align: center;
    }
    .doc-spinner-wrp .spinner-border {
        border: 0.25em solid rgba(0, 131, 81, 1);
        border-right-color: transparent;
        height: 50px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
    }
</style>
