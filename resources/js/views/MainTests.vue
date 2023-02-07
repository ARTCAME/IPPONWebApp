<template>
    <div>
        <b-alert dismissible show variant="info">
            Información para la realización de tests:
            <br>
            - En esta página encontrarás diferentes tipos de tests:
            <br>
            &emsp;- Tests sobre procesos como un alta, imprimir un documento, editar un socio, etc.
            <br>
            &emsp;- Preguntas generales sobre comportamiento y contenidos
            <br><br>
            <u>Importante</u>: Para poder resolver las preguntas generales es recomendable que primero hagas un gran número de tests sobre procesos para así tener el máximo de conocimiento.

        </b-alert>
        <b-card no-body>
            <template v-slot:header>
                <b-nav card-header tabs>
                    <b-nav-item
                        class="p-0"
                        :active="current == 0"
                        @click="current = 0; filter = null;">
                        <!-- filterTests is filtering the tests on the users non root page and provoques hide all -->
                        <!-- @click="current = 0; filterTests(''); filter = null;"> -->
                        Pendientes
                    </b-nav-item>
                    <b-nav-item
                        class="p-0"
                        :active="current == 1"
                        @click="current = 1; filter = null;">
                        <!-- filterTests is filtering the tests on the users non root page and provoques hide all -->
                        <!-- @click="current = 1; filterTests(''); filter = null;"> -->
                        Completados
                    </b-nav-item>
                </b-nav>
            </template>
            <span
                class="d-inline-block m-2"
                v-if="$route.name == 'testsRoot'">
                <b-row no-gutters>
                    <b-col class="col-auto mr-3">
                        <b-button
                            variant="outline-warning"
                            @click="filterTests(''); filter = null;">
                            Limpiar filtros
                        </b-button>
                    </b-col>
                    <b-input
                        class="col px-2"
                        placeholder="Filtra los resultados"
                        v-model="filter"
                        @input="filterTests($event)"></b-input>
                    <b-col
                        class="col-auto ml-3"
                        v-if="current == 1">
                        <b-button
                            variant="outline-success"
                            @click="filterTests('testResult:3')">
                            <fa-icon icon="grin-beam"></fa-icon>
                        </b-button>
                        <b-button
                            class="mx-1"
                            variant="outline-warning"
                            @click="filterTests('testResult:2')">
                            <fa-icon icon="meh"></fa-icon>
                        </b-button>
                        <b-button
                            variant="outline-danger"
                            @click="filterTests('testResult:1')">
                            <fa-icon icon="sad-tear"></fa-icon>
                        </b-button>
                    </b-col>
                </b-row>
            </span>
            <transition mode="out-in" name="fade">
                <!-- Pending page -->
                <b-card-group
                    class="p-2"
                    columns
                    key="tests-page-0"
                    v-if="current == 0">
                    <span
                        v-if="tests.length == 0">
                        No hay tests pendientes
                    </span>
                    <transition-group mode="out-in" name="fade">
                        <Tests
                            v-for="test in tests"
                            :key="test[0].testName"
                            :test="test"
                            @save="saveTests(...arguments)"></Tests>
                    </transition-group>
                </b-card-group>
                <!-- Completed page -->
                <b-card-group
                    class="p-2"
                    columns
                    key="tests-page-1"
                    v-if="current == 1">
                    <span
                        v-if="completedTests.length == 0">
                        No hay tests completados
                    </span>
                    <transition-group mode="out-in" name="fade">
                        <Tests
                            v-for="(test, index) in completedTests"
                            :completed="true"
                            :key="test[0].testName + index"
                            :test="test"></Tests>
                    </transition-group>
                </b-card-group>
            </transition>
        </b-card>
    </div>
</template>
<script>
    import { ALTA } from '../tests/alta';
    import { COMPORTAMIENTO } from '../tests/behavior';
    import { CINTURONES } from '../tests/cinturones';
    import { DOCS } from '../tests/docs';
    import { EDITAR } from '../tests/editar';
    import { http } from '../utils/http';
    import { mapGetters } from 'vuex';
    import { PAGOS } from '../tests/pagos';
    const QS = require('qs'); /* Needed at axios.post function to pass array as params to the controller */
    export default {
        data() {
            return {
                auxCompletedTests: [], /* Stores the api response inmutable */
                auxTests: [], /* Stores the api response inmutable */
                completedTests: [], /* Will be the tests for the completed tests page */
                current: 0, /* Identifies the current page 0 => Pending, 1 => Completed */
                filter: null, /* Input v-model to filter the results */
                tests: [], /* Will be the tests for the pending tests page */
            }
        },
        computed: {
            ...mapGetters('auth', ['authenticatedUser']),
            /**
             * Merge the imported tests. Every tests can have different structures but with a
             */
            importedTests() {
                return [ ...ALTA, ...PAGOS, ...DOCS, ...CINTURONES, ...EDITAR, ...COMPORTAMIENTO ];
            }
        },
        created() {
            /* Fetch the completed and not completed tests */
            this.loadTests();
        },
        methods: {
            /**
             * On typing on input, filter the tests shown
             *
             * @param {String} ev: the value on search input
             */
            filterTests(ev) {
                /* Depending on the page, filter on one or another array, the data is provided on an aux array that contains the original api response */
                if (this.current == 0) {
                    this.tests = this.auxTests.filter(test => cleanObj(test).includes(ev.toLowerCase()));
                } else if (this.current == 1) {
                    this.completedTests = this.auxCompletedTests.filter(test => cleanObj(test).includes(ev.toLowerCase()));
                }
                /* When the input is clean, restart the shown tests */
                if (ev == '' || ev == null) {
                    this.current == 0 ? this.tests = this.auxTests : this.completedTests = this.auxCompletedTests;
                }
                /* Clean the object stringified data */
                function cleanObj(value) {
                    return JSON.stringify(value).toLowerCase().replace(/["{}+]/g,'');
                }
            },
            /**
             * Load the tests completed by the user and fetch the completed and the not completed tests
             */
            loadTests() {
                if (this.$route.name == "testsRoot") {
                    http.get('/api/getAllTests')
                        .then((response) => {
                            /* Set the completed tests */
                            this.completedTests = response.data;
                            this.auxCompletedTests = [ ...this.completedTests ];
                            /* Set the not completed tests based on the completed received */
                            this.tests = (this.completedTests && this.completedTests.length > 0) ? this.importedTests.filter(it => this.completedTests.some(ct => ct[0].testName == it[0].testName) == false) : this.importedTests;
                            this.auxTests = [ ...this.tests ];
                        })
                        .catch(error => {
                            this.$showToast('danger', 'No se han podido obtener los tests', 'Ha ocurrido un error');
                            console.error(error.response ? error.response.data : error);
                        });
                } else {
                    http.get('/api/getTests', { params: this.authenticatedUser })
                        .then((response) => {
                            /* Set the completed tests */
                            this.completedTests = response.data;
                            /* Set the not completed tests based on the completed received */
                            this.tests = (this.completedTests && this.completedTests.length > 0) ? this.importedTests.filter(it => this.completedTests.some(ct => ct[0].testName == it[0].testName) == false) : this.importedTests;
                        })
                        .catch((error) => {
                            this.$showToast('danger', 'No se han podido obtener los tests', 'Ha ocurrido un error');
                            console.error(error.response ? error.response.data : error);
                        })
                }
            },
            /**
             * Saves the tests completed by the user
             *
             * @param {Object} test: includes the test actions and the test result from the children
             */
            saveTests(test) {
                const newTest = [
                    ...test.test,
                    test.result,
                ];
                http.post('/api/saveTests', { username: this.authenticatedUser, test: newTest })
                    .then((response) => {
                        this.loadTests();
                        this.$showToast('success', 'Test guardado', 'Completado')
                    })
                    .catch((error) => {
                        this.$showToast('danger', 'Test NO guardado', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    })
            },
        },
    }
</script>
<style scoped>
    .card-columns {
        column-count: 3;
    }
    @media screen and (max-width: 1000px) {
        .card-columns {
            column-count: 2;
        }
    }
    @media screen and (max-width: 680px) {
        .card-columns {
            column-count: 1;
        }
    }
</style>
