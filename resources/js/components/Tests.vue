<template>
    <b-card
        :title="test[0].title">
        <div class="card-desc">
            {{ test[0].desc }}
        </div>
        <br>
        <span class="test-name text-muted">
            {{ test[0].testName }}
            <span
                v-if="completed">
                <br>
                {{ test.slice(-1)[0].testDate }}
                <br>
                {{ test.slice(-1)[0].testUser }}
            </span>
        </span>
        <b-form-group class="m-0">
            <span
                v-for="field in inSpecs"
                :key="field.spec.trim()">
                {{ field.spec }}
                <br>
            </span>
            <br>
            <span
                class="d-block"
                v-for="field in inTest"
                :key="field.text.trim()">
                <b-button
                    disabled
                    :class="'ig-table-checkbox mr-2' + (field.value ? ' ig-checked' : '')">
                    <fa-icon
                        icon="check"
                        v-if="field.value"></fa-icon>
                </b-button>
                {{ field.text }}
            </span>
            <b-form-group
                v-if="isGeneral">
                <b-form-rating
                    v-model="form.testRating"
                    :disabled="completed"></b-form-rating>
            </b-form-group>
            <b-form-group
                class="mb-1"
                v-else
                :disabled="completed">
                <b-form-radio-group
                    buttons
                    class="col-12 px-0 my-2 radio-selector"
                    v-model="form.testResult">
                    <b-form-radio
                        button-variant="outline-success"
                        value="3"
                        :name="'result-' + test[0].testName">
                        <fa-icon icon="grin-beam"></fa-icon>
                        Todo bien
                    </b-form-radio>
                    <b-form-radio
                        button-variant="outline-warning"
                        value="2"
                        :name="'result-' + test[0].testName">
                        <fa-icon icon="meh"></fa-icon>
                        Algo ha ido mal
                    </b-form-radio>
                    <b-form-radio
                        button-variant="outline-danger"
                        value="1"
                        :name="'result-' + test[0].testName">
                        <fa-icon icon="sad-tear"></fa-icon>
                        Imposible acabar
                    </b-form-radio>
                </b-form-radio-group>
            </b-form-group>
            <b-input
                class="mb-1"
                placeholder="Identificador del socio"
                required
                v-if="!isGeneral"
                v-model="form._id"
                :disabled="completed"></b-input>
            <b-form-textarea
                no-resize
                placeholder="Explica cómo ha ido la prueba..."
                v-model="form.testText"
                :disabled="completed"
                :rows="isGeneral ? 10 : 4"></b-form-textarea>
            <transition name="fade-height">
                <span
                    class="d-block"
                    v-if="form.testResult == 2 || form.testResult == 1">
                    <small
                        v-if="!completed">
                        Puedes adjuntar una imagen que aclare qué ha fallado
                    </small>
                    <b-input-group
                        v-if="!completed">
                        <template
                            #prepend>
                                <b-button
                                    title="Borrar archivo"
                                    variant="outline-danger"
                                    :disabled="!form.errorFile"
                                    @click="form.errorFile = null">
                                    <fa-icon icon="times"></fa-icon>
                                </b-button>
                        </template>
                        <b-form-file
                            accept="image/jpeg, image/png, image/gif"
                            browse-text="Buscar"
                            drop-placeholder="Suelta el archivo"
                            placeholder="Selecciona o suelta un archivo"
                            v-model="form.errorFile"></b-form-file>
                    </b-input-group>
                    <b-list-group
                        class="mt-2 p-1"
                        v-if="completed && form.errorFile != null">
                        <b-list-group-item>
                            <b-avatar
                                button
                                class="mr-3"
                                rounded
                                variant="primary"
                                :src="form.errorFile"
                                @click="$bvModal.show('error-img-modal')"></b-avatar>
                            Imagen
                            <b-modal centered hide-header id="error-img-modal" ok-only size="lg">
                                <b-img
                                    :src="form.errorFile"></b-img>
                            </b-modal>
                        </b-list-group-item>
                    </b-list-group>
                </span>
            </transition>
            <b-button
                class="col-12 mt-2"
                variant="outline-primary"
                v-if="!completed"
                :disabled="(!isGeneral && (!form.testResult || !form._id)) || (isGeneral && (!form.testRating || !form.testText))"
                @click.once="$emit('save', { test: test, result: form })">
                {{ !isGeneral && !form.testResult ? 'Indica un estado' : !isGeneral && !form._id ? 'Indica el id del socio' : isGeneral && !form.testRating ? 'Indica una valoración' : isGeneral && !form.testText ? 'Resume la prueba' : 'Guardar' }}
            </b-button>
        </b-form-group>
    </b-card>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
                form: {
                    _id: null, /* Identifies the customer modified */
                    errorFile: null, /* Contains a file */
                    testDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'), /* Is the date of the save */
                    testResult: null, /* Stores the option selected */
                    testRating: null, /* Is provided on the general tests, stores the rating */
                    testText: null, /* Is the text fetched by the user */
                    testUser: null, /* Stores the user who saves the tests */
                }
            }
        },
        computed: {
            ...mapGetters('auth', ['authenticatedUser']),
            /**
             * Get the test options to show with a checkbox, there include a 'text' in its object
             *
             * @return {Array}
             */
            inTest() {
                return this.test.filter(test => test.text);
                // return this.completed ? this.test.slice(1, this.test.length - 1) : this.test.slice(1, this.test.length);
            },
            /**
             * Get the test options for to show as list, there include a 'spec' in its object
             *
             * @return {Array}
             */
            inSpecs() {
                return this.test.filter(test => test.spec);
            },
            /**
             * Returns if a tests has general questions
             */
            isGeneral() {
                return this.test[0].title.includes('Comportamiento general')
            },
        },
        mounted() {
            /* If we are loading a completed test, resolve the values of the result */
            if (this.completed) {
                const fields = ['_id', 'errorFile', 'testResult', 'testText', 'testDate', 'testUser', 'testRating'];
                fields.forEach(field => {
                    this.$set(this.form, field, this.test.slice(-1)[0][field]);
                });
            } else {
                this.$set(this.form, 'testUser', this.authenticatedUser);
            }
        },
        props: [
            'completed', /* Boolean to determine if we are fetching a new o completed test */
            'test', /* The test content with the action to do */
        ],
    }
</script>
<style scoped>
    .card-desc {
        max-width: 80%;
    }
    .card-title {
        max-width: 50%;
    }
    .test-name {
        position: absolute;
        right: 1rem;
        text-align: right;
        top: 1rem;
    }
</style>
