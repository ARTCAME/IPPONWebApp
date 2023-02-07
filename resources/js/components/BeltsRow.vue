<template>
    <span>
        <b-form-row
            :class="'mx-0' + ($route.name != 'belts.index' ? ' mb-2 mt-4' : '')"
            no-gutters>
            <span
                v-b-tooltip.hover.noninteractive
                v-for="belt in customer.belts"
                :key="belt.grade"
                :title="$route.name == 'belts.index' ? evaluateGradesTooltipTitle(row.item, belt) : ''">
                <b-button
                    size="sm"
                    :class="'mb-1 btn-cinturon-table btn-cinturon ' + belt.grade + ($route.name == 'belts.index' ? (isBeltSelectedToUpdate(belt) ? ' actualizando-cinturones' : isBeltSelectedToDownload(belt, row.item) ? ' descargando-cinturones' : '') : isBeltSelectedToUpdate(belt) ? ' actualizando-cinturones' : '')"
                    :disabled="$route.name == 'belts.index' ? evaluateGradesDisabled(row.item, belt) : isDisabled"
                    @click="$route.name == 'belts.index' ? (downloadGrades ? manageDownloadBelts({ grade: belt.grade, date: belt.date }, row.item) : isUpdating(row.item) ? manageUpdateBelts({ grade: belt.grade, date: belt.date }) : manageNextGrade({ grade: belt.grade, date: belt.date }, row.item)) : manageUpdateBelts({ grade: belt.grade, date: belt.date })">
                        {{ belt.date ? belt.date : '' }}
                </b-button>
            </span>
        </b-form-row>
        <TransitionExpand>
            <div
                v-if="$route.name == 'belts.index' ? isUpdating(row.item) : true">
                <small
                    class="text-muted"
                    v-if="!isDisabled">
                    Puedes seleccionar grados y aplicarles una nueva fecha o borrarles la fecha que tengan
                </small>
                <b-form-row
                    no-gutters
                    v-if="!isDisabled"
                    :class="'pb-1 ml-0' + ($route.name == 'belts.index' ? ' belts-table-edit' : '')">
                    <b-form-input
                        class="col-3"
                        type="date"
                        v-model="beltsNewDate"></b-form-input>
                    <span
                        v-b-tooltip.hover.noninteractive
                        :title="selectedBelts.length == 0 ? 'Selecciona algún grado' : beltsNewDate == '' ? 'Selecciona una fecha' : 'Guarda la fecha seleccionado en los grados seleccionados'">
                        <b-button
                            class="ml-2"
                            variant="outline-primary"
                            :disabled="selectedBelts.length == 0 || beltsNewDate == ''"
                            @click="beltsUpdate()">Aplicar nueva fecha</b-button>
                    </span>
                    <span
                        v-b-tooltip.hover.noninteractive
                        :title="selectedBelts.length == 0 ? 'Selecciona algún grado' : 'Borra la fecha de los grados seleccionados'">
                        <b-button
                            class="ml-2"
                            variant="outline-danger"
                            :disabled="selectedBelts.length == 0 || selectedBelts.every(sb => !sb.date)"
                            @click="beltsDelete()">Borrar fecha</b-button>
                    </span>
                </b-form-row>
            </div>
        </TransitionExpand>
    </span>
</template>

<script>
    import { mapActions } from 'vuex';
    export default {
        data() {
            return {
                beltsNewDate: '', /* v-model to the new belts ndate */
                selectedBelts: [], /* Grades selected to delete */
            }
        },
        methods: {
            /* Mapping vuex */
            ...mapActions(['deleteBelts', 'updateBelts', 'updateFormBelts']),
            /**
             * On delete belts (set its date as null) commit it at db via vuex. Depending on the route the changes are stored at the db (main.belts) or are vuex's only (rest)
             */
            async beltsDelete() {
                if (this.$route.name == 'belts.index') {
                    try {
                        const response = await this.deleteBelts({ id: this.customer._id, selectedBelts: this.selectedBelts});
                        this.$showToast('success', 'Se han guardado los cambios.', 'Grados actualizados correctamente', 5000);
                    } catch(error) {
                        this.$showToast('danger', 'No se ha podido completar la operación. Código de error: FESoFo@BeDe', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    }
                } else {
                    this.updateFormBelts({ id: this.customer._id, selectedBelts: this.selectedBelts });
                }
                /* Reset the inputs and selectors involved */
                this.beltsResetFields();
            },
            /**
             * Reset the values that manages the belts modifications
             */
            beltsResetFields() {
                /* Empty the selected belts array */
                this.resetUpdating();
                /* Set the v-model of the belts date to its initial value */
                this.beltsNewDate = '';
            },
            /**
             * Commit the new date selected on db via vuex for the belts selecteds. Depending on the route the changes are stored at the db (main.belts) or are vuex's only (rest)
             */
            async beltsUpdate() {
                if (this.$route.name == 'belts.index') {
                    try {
                        const response = await this.updateBelts({ id: this.customer._id, selectedBelts: this.selectedBelts, date: this.$moment(this.beltsNewDate).format('DD-MM-YYYY') });
                        this.$showToast('success', 'Se han guardado los cambios.', 'Grados actualizados correctamente', 5000);
                    } catch(error) {
                        this.$showToast('danger', 'No se ha podido completar la operación. Código de error: FESoFo@BeUp', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    }
                } else {
                    this.updateFormBelts({ id: this.customer._id, selectedBelts: this.selectedBelts, newVal: this.$moment(this.beltsNewDate).format('DD-MM-YYYY') });
                }
                /* Reset the inputs and selectors involved */
                this.beltsResetFields();
            },
            /**
             * Evaluates the disabled status for the belts button on the show details element of every row
             *
             * @param {Object} item: the row.item element wich contains the row data
             * @param {Object} belt: the belt data
             *
             * @return {Boolean} The disabled status
             */
            evaluateGradesDisabled(item, belt) {
                let disabled = false;
                if (this.$route.name == 'belts.index') {
                    if (this.downloadGrades) {
                        disabled = belt.date == null;
                    } else if (!this.downloadGrades) {
                        if (this.isUpdating(item)) {
                            disabled = false;
                        } else if (!this.isUpdating(item) && belt.date != null) {
                            disabled = true;
                        }
                    }
                } else {
                    disabled = this.isDisabled;
                }
                return disabled;
            },
            /**
             * Evaluates the title of the tooltip for the belts button on the show details element of every row
             *
             * @param {Object} item: the row.item element wich contains the row data
             * @param {Object} belt: the belt data
             *
             * @return {String} The title to show on the tooltip on every button of every row
             */
            evaluateGradesTooltipTitle(item, belt) {
                let title = '';
                /* If the downloading of grades is actived */
                if (this.downloadGrades) {
                    /* If the date is empty */
                    if (belt.date != null && belt.date != '') {
                        title = 'Deseleccionar para diplomas';
                        if (!this.isBeltSelectedToDownload(belt, item)) {
                            title = 'Seleccionar para diplomas';
                        }
                    }
                /* If the dowloading is not actived and the deleting yes */
                } else if (!this.downloadGrades && this.isUpdating(item)) {
                    title = 'Deseleccionar';
                    if (!this.isBeltSelectedToUpdate(belt, item)) {
                        title = 'Seleccionar';
                    }
                /* If the dowloading and deleting are not actived */
                } else if (!this.downloadGrades && !this.isUpdating(item)) {
                    /* If the belt date is empty */
                    if (belt.date == null || belt.date == '') {
                        if (item.nextGrade != belt.grade) {
                            title = 'Marcar como siguiente grado';
                        } else {
                            title = 'Desmarcar como siguiente grado';
                        }
                    }
                }
                return title;
            },
            /**
             * Determines if a belt is selected to update
             *
             * @param {Object} the belt data
             */
            isBeltSelectedToUpdate(belt) {
                return this.selectedBelts.some(sb => sb.date == belt.date && sb.grade == belt.grade);
            },
            /**
             * Function to manage the selected belts to update they
             *
             * @param {Object} belt: the object to select/unselect
             */
            manageUpdateBelts(belt) {
                let index = this.selectedBelts.findIndex(sb => sb.date == belt.date && sb.grade == belt.grade)
                if (index != -1) {
                    this.selectedBelts.splice(index, 1);
                } else {
                    this.selectedBelts.push(belt);
                }
            },
            /**
             * Reset the updating action emptying the selectedBelts array
             */
            resetUpdating() {
                this.$set(this, 'selectedBelts', []);
            },
        },
        props: [
            'belts', /* The array of belts of a customer */
            'customer', /* The customer entire data of a row on the table of main belts or a customer loaded at a form*/
            'downloadGrades', /* From MainBelts, the status of the procedure */
            'isBeltSelectedToDownload', /* Function from MainBelts to determine if a belt of a row is selected to download */
            'isUpdating', /* Function from MainBelts to determine if a belt of a row has an updating actived */
            'isDisabled', /* Disabled status on MainForm (the customer is on edit or not) */
            'manageDownloadBelts', /* Function from MainBelts to add an specific belt to the array of downloadable belts */
            'manageNextGrade', /* Function from MainBelts to select the nextGrade on the column */
            'row', /* From MainBelts, the row of the table */
        ],
    }
</script>
<style scoped>
    .btn-cinturon-table input {
        display: none!important; /* Hide the checkbox */
    }
    .belts-table-edit button,
    .belts-table-edit input {
        font-size: 0.875rem!important;
        line-height: 1;
    }
    .belts-table-edit button {
        height: 27px;
    }
    .belts-table-edit input {
        height: 28px; /* Correcting the alignment */
    }

</style>
