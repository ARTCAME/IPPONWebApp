<template>
    <div id="wrp-webcam">
        <div id="ctn-main" class="col-xl-3 px-0">
            <div
                id="ctn-buttons">
                <b-button
                    id="snap"
                    size="sm"
                    v-b-tooltip.hover.noninteractive
                    :disabled="isDisabled"
                    :title="isDisabled ? '' : started ? (captured ? 'Hacer otra foto' : 'Hacer foto') : 'Encender cámara'"
                    :variant="started ? (captured ? 'warning' : 'success') : 'primary'"
                    @click="started ? capture() : start()" >
                    <fa-icon
                        icon="redo"
                        v-if="started && captured"></fa-icon>
                    <fa-icon
                        icon="camera"
                        v-else-if="started && !captured"></fa-icon>
                    <fa-icon
                        icon="power-off"
                        v-else-if="!started"></fa-icon>
                </b-button>
                <!-- Shown when the cam is on -->
                <b-button
                    id="snap-cancel"
                    size="sm"
                    variant="danger"
                    v-b-tooltip.hover.bottom.noninteractive
                    v-if="started"
                    :disabled="!started || isDisabled"
                    @click="cancel()">
                    <fa-icon class="fas" icon="times-circle"></fa-icon>
                </b-button>
                <b-tooltip
                    placement="bottom"
                    target="snap-cancel"
                    v-if="started && !isDisabled">
                    Cancelar
                </b-tooltip>
                <div id="ctn-video">
                    <fa-icon id="user-plus" icon="camera" size="6x"></fa-icon>
                    <video autoplay id="video" ref="video"></video>
                    <canvas
                        height="240"
                        id="canvas"
                        ref="canvas"
                        width="340"
                        :src="avatar == null ? '' : avatar"></canvas>
                    <b-img
                        height="240"
                        id="avatar"
                        required
                        width="320"
                        v-model="avatar"
                        :src="avatar == null ? '' : avatar"></b-img>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex';
    export default {
        data() {
            return {
                auxAvatar: null, /* Stores the existing image when reshooting an image */
                captured: false, /* Flag to canvas state */
                captures: null, /* Stores the local canvas context */
                pic: null, /* Will contain the pic shooted */
                started: false, /* Flag to cam state */
                video: null, /* Will contain the video stream object */
            }
        },
        computed: {
            ...mapState({
                newCustomerForm: state => state.form,
                editCustomerForm: state => state.editform,
            }),
            /**
             * Is the v-model for the profile image
             */
            avatar: {
                get() {
                    return this.form.image;
                },
                set(value) {
                    /* The id will be null on customers.new page, its managed at vuex */
                    this.updateFormData({ _id: this.form._id, field: 'image', newVal: value });
                }
            },
            /**
             * Defines the current form state (edit or new customer)
             *
             * @return {Object} The object with the form data from the customers state
             */
            form() {
                return this.$route.name == 'customers.new' ? this.newCustomerForm : this.editCustomerForm;
            },
        },
        methods: {
            ...mapActions(['updateFormData']),
            /**
             * Cancel the shooting closing the video stream and cleaning the modifications. This function is also called from the parent in component route guards
             */
            cancel() {
                /* Reset the flags status */
                this.started = false;
                this.captured = false;
                /* Reset the captured image if exists */
                if (this.pic != null) {
                    this.pic.getContext("2d").clearRect(0, 0, 320, 240);
                }
                this.pic = null;
                this.captures = null;
                /* Reset the video stream if exists */
                if (this.video != null) {
                    if (this.video.srcObject != null) {
                        this.video.srcObject.getTracks()[0].stop()
                    }
                    this.video.srcObject = null;
                }
                /* Reset the avatar to its original data (database data) */
                if (this.auxAvatar != null) {
                    this.avatar = this.auxAvatar;
                }
            },
            /**
             * Capture and image from the video stream, if an image exists the function restarts the video stream
             */
            capture() {
                /* If an image exists restart the video stream to reshoot another pic */
                if (this.captured == true) {
                    if (this.pic != null) {
                        this.pic.getContext("2d").clearRect(0, 0, 320, 240);
                    }
                    this.pic = null;
                    this.captured = false;
                    this.captures = null;
                    this.avatar = null;
                    /* Restart the video stream to reshoot */
                    this.start();
                    return;
                }
                this.captured = true
                /* Draw the image */
                this.pic = this.$refs.canvas;
                this.pic.getContext("2d").drawImage(this.video, 0, 0, 320, 240);
                this.captures = canvas.toDataURL("image/png");
                this.avatar = this.captures;
                /* When has been shooted, stops the video stream */
                this.stop();
            },
            /**
             * Starts the camera stream assigning it to the video variable
             */
            start() {
                this.video = this.$refs.video;
                /* Reset the current image if exists */
                if (this.avatar != null) {
                    this.auxAvatar = this.avatar;
                    this.pic = null;
                    this.captured = false;
                    this.captures = null;
                    this.avatar = null;
                }
                /* Start the video stream on the navigator */
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
                        .then(stream => {
                            this.video.srcObject = stream;
                            this.video.play();
                            this.started = true;
                        });
                }
            },
            /**
             * Stops the video stream
             */
            stop() {
                if (this.video != null && this.video.srcObject != null) this.video.srcObject.getTracks()[0].stop();
            },
        },
        mounted() {
            /* Activate the flag which determine if a picture exists */
            if (this.avatar != '' && this.avatar != null) {
                /* this.started =  */this.captured = true;
            }
            /* Assign the vuex value to the local canvas context */
            this.captures = this.avatar;
        },
        props: [
            'isDisabled', /* Determines if the customer is being edited */
        ],
    }
</script>
<style>
    li {
        display: inline;
        padding: 5px;
    }
    #avatar,
    #canvas {
        height: 200px;
        left: 50%;
        position: absolute!important;
        top: 50%;
        transform: translate(-47%,-50%)!important;
        width: auto;
    }
    #ctn-buttons {
        height: 200px;
        width: 200px;
        z-index: 2;
    }
    #ctn-main {
        left: 50%;
        max-height: 200px;
        min-height: 200px;
        min-width: 200px;
        position: absolute;
        top: 50%;
        transform: translate(-65%, -50%);
    }
    #ctn-video {
        border: 1px solid rgba(206, 212, 218, 1);
        border-radius: 50%;
        height: 200px;
        margin: 0 auto;
        overflow: hidden;
        position: relative;
        transition: filter 0.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        width: 200px;
        z-index: 1;
    }
    #snap {
        top: 40%;
    }
    #snap-cancel {
        top: 60%;
    }
    #snap,
    #snap-cancel {
        border-radius: 50%;
        box-sizing: border-box;
        margin: 0 auto;
        margin-top: 10px;
        overflow: hidden;
        position: absolute;
        right: -45px;
        transform: translateY(-50%);
        transition: all cubic-bezier(0.25, 0.46, 0.45, 0.94) .5s;
    }
    #user-plus {
        left: 50%;
        position: absolute!important;
        transform: translate(-50%,-50%)!important;
        top: 50%;
    }
    #video {
        height: 200px;
        left: 50%;
        position: absolute!important;
        transform: translate(-50%,-50%)!important;
        top: 50%;
        width: auto;
    }
    #wrp-webcam {
        height: 100%;
        margin-bottom: 10px;
        position: relative;
        width: 100%;
    }
    @media (max-width: 1200px) {
        #ctn-buttons {
            left: 50%;
            position: absolute!important;
            transform: translateX(-50%)!important;
        }
        #ctn-main {
            transform: translate(-50%, -50%);
        }
        #wrp-webcam {
            height: 250px;
        }
    }
    @media (min-width: 1200px) {
        #ctn-main {
            width: 100%;
        }
    }
</style>
