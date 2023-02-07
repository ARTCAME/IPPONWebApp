<!--
    Super inspired by the example SigCaptX-Capture.html provided by wacom, a lot of functionalities has been disabled to simplify the use on the app
-->
<template>
    <div id="sign-container">
        <!-- Disable the image validation to tests! -->
        <!-- v-validate="'required'" -->
        <b-img
            id="imageBox"
            name="sign"
            v-model="sign"
            :class="{ 'is-invalid' : errors.has('sign') }"
            :src="sign == '' || sign == null ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : sign"></b-img>
        <transition mode="out-in" name="liveFeedbacks">
            <small
                class="fake-invalid-feedback"
                v-if="errors.has('sign')">
                El cliente debe firmar
            </small>
        </transition>
        <b-row class="capture-btns-row ml-md-0 mx-auto my-2" no-gutters>
            <b-row
                class="w-100"
                no-gutters
                v-if="!isDisabled">
                <TransitionExpand>
                    <div
                        class="w-100"
                        v-if="!capturable || !isWacomOn">
                        <b-alert
                            class="py-1 text-left"
                            show>
                            Para poder firmar deberás revisar los pasos pendientes:
                            <br>
                            <span v-if="underage == null">
                                - Falta la fecha de nacimiento
                                <br>
                            </span>
                            <span v-if="(underage == true && form.tutor && (!form.tutor.name || existsErrors('tutor-name'))) || ((underage == false || underage == null) && (existsErrors('name') || !form.name))">
                                - Falta el nombre del {{ underage == true ? 'tutor' : 'socio' }}
                                <br>
                            </span>
                            <span v-if="(underage == true && form.tutor && ((!form.tutor.dni || existsErrors('tutor-dni')) && (!form.dni || existsErrors('dni')))) || ((underage == false || underage == null) && (existsErrors('dni') || !form.dni))">
                                - Falta el dni del {{ underage == true ? 'tutor' : 'socio' }}
                                <br>
                            </span>
                            <span
                                v-if="!isWacomOn"
                                @click="$giveShortFocus(['power-wacom-btn'])">
                                <br>
                                - Enciende la tablet
                            </span>
                        </b-alert>
                    </div>
                </TransitionExpand>
            </b-row>
            <b-button
                class="col mr-2"
                id="delete-sign-btn"
                size="sm"
                variant="outline-secondary"
                v-if="!isDisabled"
                :disabled="!sign"
                @click="sign = ''">
                Borrar firma
            </b-button>
            <b-button
                class="col"
                id="power-wacom-btn"
                size="sm"
                v-if="!isDisabled"
                :disabled="!capturable"
                :variant="isWacomOn ? 'outline-danger' : 'outline-primary'"
                @click="turnOnWacom()">
                {{ !capturable ? 'Revisa campos pendientes' : isWacomOn ? 'Apagar tablet' : 'Encender tablet' }}
            </b-button>
        </b-row>
        <b-row class="capture-btns-row ml-md-0 mx-auto my-2" no-gutters>
            <b-button
                class="col"
                id="capture-btn"
                size="sm"
                v-if="!isDisabled"
                :disabled="!capturable || !isWacomOn"
                :variant="!capturable || !isWacomOn ? 'outline-secondary' : 'success'"
                @click="capture()">
                <fa-icon
                    class="mr-2"
                    icon="signature"
                    v-if="capturable && isWacomOn"></fa-icon>
                Capturar firma
            </b-button>
        </b-row>
        <!-- Is not infomation necessary to the user -->
        <div
            v-show="false">
            <small
                class="text-danger">
                Ha ocurrido un error, <u v-b-toggle.logs><small>ver logs</small></u>
            </small>
            <b-collapse id="logs">
                <b-form-textarea id="txtDisplay" rows="7"></b-form-textarea>
            </b-collapse>
        </div>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';
    export default {
        data() {
            return {
                isWacomOn: false, /* Flag to improve ux on the start/stop wacom */
                signatureOk: true, /* Flag to determine if the signature was correct */
            }
        },
        computed: {
            /**
             * @returns {Boolean} to determine if the sign is capturable
             */
            capturable() {
                return !(this.underage == null || ((this.underage == true && this.form.tutor && (((!this.form.tutor.dni ||this. existsErrors('tutor-dni')) && (!this.form.dni || this.existsErrors('dni'))) || (!this.form.tutor.name || this.existsErrors('tutor-name')))) || (this.underage == false && ((this.existsErrors('name') || !this.form.name) || (this.existsErrors('dni') || !this.form.dni)))));
            },
            /**
             * Is the v-model for the sign element
             */
            sign: {
                get() {
                    return this.form.sign;
                },
                set(value) {
                    /* The id will be null on customers.new page, its managed at vuex */
                    this.updateFormData({ _id: this.form._id, field: 'sign', newVal: value });
                }
            },
        },
        inject: [
            '$validator', /* Inject the main $validator from the parent */
        ],
        methods: {
            ...mapActions(['updateFormData']),
            /**
             * Active the signature and treat its value
             */
            capture() {
                if (!wgssSignatureSDK.running || null == dynCapt) {
                    this.signatureOk = false;
                    print('Error. Reiniciando la sesión.');
                    actionWhenRestarted(window.Capture);   // See SigCaptX-js
                    return;
                }
                /* Construct a hash object to contain the hash */
                var hash = new wgssSignatureSDK.Hash(onHashConstructor);
                var self = this;
                function onHashConstructor(hashV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        self.GetHash(hash, onGetInitialHash);
                    } else {
                        self.signatureOk = false;
                        print('Error en el constructor del hash: ' + status);
                        if (wgssSignatureSDK.ResponseStatus.INVALID_SESSION == status) {
                            self.signatureOk = false;
                            print('Error, sesión inválida. Reiniciando sesión.');
                            actionWhenRestarted(window.Capture);
                        }
                    }
                }
                /* If the hash value has been calculated successfully next steps is to capture the signature */
                function onGetInitialHash() {
                    const name = self.underage == true && self.form.tutor ? self.form.tutor.name : self.form.name;
                    // const name = 'foo';
                    if (self.underage && !self.form.tutor) {
                        print('Faltan los datos del tutor.');
                    } else if (name == null) {
                        print('No se puede registrar la firma, faltan datos del firmante.')
                    }
                    dynCapt.Capture(sigCtl, name, "Comprendo las indicaciones dadas por IPPONGYM", hash, null, onDynCaptCapture);
                }
                /* Treat the signature caption */
                function onDynCaptCapture(dynCaptV, SigObjV, status) {
                    if (wgssSignatureSDK.ResponseStatus.INVALID_SESSION == status) {
                        self.signatureOk = false;
                        print('Error, sesión inválida. Reiniciando sesión');
                        actionWhenRestarted(window.Capture);  // See SigCaptX-SessionControl.js
                    } else {
                        /* Check the status returned from the signature capture */
                        switch( status ) {
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptOK:
                                sigObj = SigObjV;
                                self.signatureOk = true;
                                print('Firma capturada');
                                var outputFlags = wgssSignatureSDK.RBFlags.RenderOutputBase64 | wgssSignatureSDK.RBFlags.RenderColor32BPP;
                                sigObj.RenderBitmap(BITMAP_IMAGEFORMAT, imageBox.clientWidth, imageBox.clientHeight, BITMAP_INKWIDTH, BITMAP_INKCOLOR, BITMAP_BACKGROUNDCOLOR, outputFlags, BITMAP_PADDING_X, BITMAP_PADDING_Y, onRenderBitmap);
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptCancel:
                                self.signatureOk = false;
                                print('Error. Captura de firma cancelada');
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptPadError:
                                self.signatureOk = false;
                                print('No hay servicio de captura disponible');
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptError:
                                self.signatureOk = false;
                                print('Error en la tablet');
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptNotLicensed:
                                self.signatureOk = false;
                                print('No se ha encontrado una licencia de captura válida');
                                break;
                            default:
                                self.signatureOk = false;
                                print('Error al capturar la firma: ' + status);
                                break;
                        }
                    }
                }
                function onRenderBitmap(sigObjV, bmpObj, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        /* If RenderBitmap generated a standard image (picture) then just place that picture in the img control on the HTML form */
                        /* Assign the image obj to the v-model */
                        self.sign = 'data:image/jpeg;base64,' + bmpObj;
                    } else {
                        self.signatureOk = false;
                        print('Error al renderizar el Bitmap de la firma: ' + status);
                    }
                }
            },
            /**
             * Faking that should be done by vee erros.has() but is not working
             *
             * @param {String} field: the name of the field to check
             *
             * @returns {Boolean} Boolean that reveals if exists vee errors
             */
            existsErrors(field) {
                return this.errors.items.filter(error => error.field == field).length > 0
            },
            /**
             * Calculates a hash value using the first and last names on the HTML form
             */
            GetHash(hash, callback) {
                print('Creando hash:');
                hash.Clear(onClear);
                var self = this;
                function onClear(hashV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        hash.PutType(wgssSignatureSDK.HashType.HashMD5, onPutType);
                    } else {
                        print('Error al limpiar el hash: ' + status);
                    }
                }
                function onPutType(hashV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        var vFname = new wgssSignatureSDK.Variant();
                        vFname.Set(self.name);
                        hash.Add(vFname, onAddFname);
                    } else {
                        print('Error al utilizar el hash: ' + status);
                    }
                }
                function onAddFname(hashV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        callback();
                    } else {
                        print('Error al añadir el hash: ' + status);
                    }
                }
            },
            /**
             * Validate the component from the parent
             */
            async validate() {
                await this.$validator.validateAll();
                return this.errors.all().length;
            },
            /**
             * Turns on the wacom on demain
             */
            async turnOnWacom() {
                if (wgssSignatureSDK) {
                    this.isWacomOn = false;
                    wgssSignatureSDK.keepAlive = null;
                    wgssSignatureSDK.sigsdkptr = null;
                    wgssSignatureSDK = null;
                    return;
                }
                const resp = await body_onload();
                this.isWacomOn = wgssSignatureSDK && wgssSignatureSDK.running;
            }
        },
        mounted() {
            /* Load the wacom api */
            // if (this.$route.name != 'customers.profile') {
            //     if (wizardEventController != undefined) {
            //         wizardEventController.body_onload();
            //     }
            // } else {
            //     sigObj && sigObj.PutSigText(this.sign, this.onPutSigText);
            // }
        },
        props: [
            'form', /* Is the form object from the vuex store currently used */
            'isDisabled', /* If is true indicates the user cannot interact */
            'underage', /* Boolean that indicates if the customer is underage */
        ],
    }
</script>
<style>
    .capture-btns-row {
        width: 342px;
    }
    .capture-btns-row * {
        font-size: 0.875rem!important
    }
    .fake-invalid-feedback {
        display: block;
        color: rgba(220, 53, 69, 1);
        font-size: 80%;
        width: 100%;
    }
    #imageBox {
        border: 1px solid rgba(180, 180, 180, 1);
        border-radius: .25rem;
        /* height: auto; */
        height: 200px;
        /* max-height: 200px; */
        /* max-width: 342px; */
        /* width: 100%; */
        width: 342px;
    }
    #imageBox.is-invalid {
        border-color: #dc3545;
        border-radius: 0.25rem;
    }
    #txtDisplay {
        max-width: 342px;
        width: 100%;
    }
    @media screen and (max-width: 768px) {
        #imageBox,
        #txtDisplay {
            margin: 0 auto;
        }
        #sign-container {
            text-align: center;
        }
    }
</style>

