<template>
    <div>
        <b-card>
            <b-form-group>
                <h5 class="subtitle" md="4">Gestión y consulta de grados de Karate</h5>
            </b-form-group>
            <b-collapse
                :visible="$route.name == 'belts.index' && rowsSelected.length > 200">
                <b-alert
                    show
                    variant="danger">
                    Has seleccionado más de 200 filas, asegúrate que hayas escogido las filas correctas antes de guardar los cambios.
                </b-alert>
            </b-collapse>
            <!-- Update grades -->
            <b-collapse
                id="collapse-update"
                :visible="updating">
                <h5 class="subtitle subtitle-sub" md="4">
                    Actualización masiva de grados
                </h5>
                <b-row class="mb-2" no-gutters>
                    <b-form-input
                        class="col col-12 col-md-3 mr-1 mb-1 px-2"
                        id="date-cinturones"
                        key="trans-datepicker"
                        size="sm"
                        type="date"
                        v-model="beltsNewDate"></b-form-input>
                    <span
                        class="col col-12 col-md-auto d-inline-block mb-1"
                        key="trans-btns-update"
                        tabindex="0"
                        v-b-tooltip.hover.noninteractive
                        :title="updateInCourse ? 'No puedes actualizar cinturones mientras editas una línea de la tabla' : rowsSelected.length == 0 ? 'Selecciona algún socio en la tabla' : beltsNewDate == '' ? 'Selecciona una fecha' : updateCsv ? 'Descargando...' : 'Guardar y descargar archivo'">
                        <!-- Disabled when no grades are selected and no date was selected or if the process to save the file and download it has been started -->
                        <ButtonIcon
                            class="w-100"
                            icon="save"
                            size="sm"
                            :disabled="beltsNewDate == '' || rowsSelected.length == 0 || updateCsv == true"
                            :spin="updateCsv == true"
                            :variant="beltsNewDate == '' || rowsSelected.length == 0 || updating == false ? 'outline-success' : 'success'"
                            @click="beltsMassUpdate()">
                            Actualizar cinturones
                        </ButtonIcon>
                    </span>
                    <!-- Shown whe the process to update grades is actived and some grade are selected -->
                    <transition name="slide-fade">
                        <span
                            class="d-inline-block ig-inline-text ml-md-3 my-auto"
                            key="trans-text-info-update"
                            v-if="rowsSelected.length > 0">
                            Vas a actualizar {{ rowsSelected.length + (rowsSelected.length > 1 ? ' socios' : ' socio') }}
                        </span>
                    </transition>
                    <b-button
                        class="mb-1 ml-auto"
                        size="sm"
                        title="Finaliza el proceso, los cambios no guardados se perderán"
                        variant="outline-danger"
                        v-b-tooltip.hover.noninteractive
                        @click="endProcedures()">
                        Finalizar
                    </b-button>
                </b-row>
                <b-alert
                    class="mb-2"
                    show
                    variant="info">
                    1 - Busca y selecciona en la tabla los socios que quieres actualizar.
                    <br>
                    2 - Selecciona una fecha, será la fecha en la que se otorgó el nuevo grado.
                    <br>
                    3 - Para acabar, confirma los cambios.
                    <br>
                    <br>
                    <u>Importante:</u>
                    <br>
                    - En la columna 'Siguiente grado' verás el grado que vas a otorgar. Pulsa sobre cualquier otro grado no otorgado para cambiar el grado a otorgar.
                    <br>
                    - Si el grado actual es negro no podrás seleccionar a ese socio, si tiene algún grado pendiente deberás marcarlo como siguiente grado para poder actualizarlo.
                </b-alert>
            </b-collapse>
            <!-- Manual download grades -->
            <b-collapse
                id="collapse-download"
                :visible="downloadGrades">
                <h5 class="subtitle subtitle-sub" md="4">
                    Descarga manual de archivo para diplomas
                </h5>
                <b-row class="mb-2" no-gutters>
                    <span
                        class="col col-12 col-sm-auto d-inline-block mb-1"
                        tabindex="0"
                        v-b-tooltip.hover.noninteractive.top
                        :title="updateInCourse ? 'No puedes generar el archivo mientras editas una línea de la tabla' :  rowsSelected.length == 0 ? 'Selecciona algún socio en la tabla' : downloadCsvManual ? 'Descargando...' : 'Descargar archivo'">
                        <!-- Disabled when no grades are selected or if a row has an edit open or if the process to download the grades has been started -->
                        <ButtonIcon
                            class="w-100"
                            icon="file-download"
                            size="sm"
                            :disabled="rowsSelected.length == 0 || updateInCourse || downloadCsvManual"
                            :spin="downloadCsvManual == true"
                            :variant="rowsSelected.length == 0 || updateInCourse  ? 'outline-success' : 'success'"
                            @click="$tableToCsv([ 'name', 'grade', 'date' ], beltsSelectedDownload, $moment().format('YYYY-MM-DD_HH.mm.ss') + '_cinturones_manual_' + beltsNewDate + '.csv', 'downloadCsvManual')">
                            Descargar fichero de diplomas
                        </ButtonIcon>
                    </span>
                    <!-- Shown when some grade was selected -->
                    <transition name="slide-fade">
                        <span
                            class="d-inline-block ig-inline-text ml-3 my-auto"
                            v-if="rowsSelected.length > 0">
                            Vas a descargar un archivo con {{ rowsSelected.length }} socio/s
                        </span>
                    </transition>
                    <b-button
                        class="ml-auto"
                        size="sm"
                        title="Finaliza el proceso, los cambios no guardados se perderán"
                        variant="outline-danger"
                        v-b-tooltip.hover.noninteractive
                        @click="endProcedures()">
                        Finalizar
                    </b-button>
                </b-row>
                <b-alert
                    class="mb-2"
                    show
                    variant="info">
                    1 - Busca y selecciona en la tabla los socios de los quieres que se añadan al archivo de diplomas a descargar.
                    <br>
                    2 - Por defecto se añadirá el último grado otorgado, el que aparece en la columna 'Grado actual', si quieres cambiarlo pulsa sobre el grado o grados que quieras descargar.
                    <br>
                    3 - Para finalizar el proceso y descargar el fichero, pulsa sobre el botón 'Descargar'.
                </b-alert>
            </b-collapse>
            <TransitionExpand>
                <div
                    v-if="selectedHided">
                    <!-- Shown when the confirmation process has been started and some of the selected items has been hided for the filters applied to the table -->
                    <b-alert
                        class="mb-2"
                        show
                        variant="warning"
                        v-if="selectedHided">
                        Tienes seleccionadas filas que están ocultas debido a los filtros aplicados a la tabla. Pulsa en este botón para mostrar solo las filas seleccionadas:
                        <span
                            class="d-inline-block ml-1"
                            key="trans-btn-show-all"
                            tabindex="0">
                            <b-button
                                size="sm"
                                variant="dark"
                                @click="filterSelected()">
                                Solo seleccionadas
                            </b-button>
                        </span>
                    </b-alert>
                </div>
            </TransitionExpand>
            <!-- Row with the tags -->
            <b-row align-v="end" class="mb-2" no-gutters>
                <b-col>
                    <b-form-tags
                        class="filter-form-tags tags-cinturones p-0"
                        no-outer-focus
                        v-model="filterTags">
                        <template>
                            <b-form-text>Filtros activos:</b-form-text>
                            <b-form-tag
                                size="sm"
                                v-for="tag in filterTags"
                                :class="'filter-tag tag-cinturones-item mr-1 mt-1 ' + tag"
                                :key="tag"
                                @remove="deleteTag(tag)">
                                x <!-- dummy content -->
                            </b-form-tag>
                            <!-- Shown when there are no tags added to the v-model of tags -->
                            <b-form-tag
                                class="filter-tag tag-ninguno mt-1"
                                disabled
                                variant="success"
                                v-if="filterTags.length == 0 && beltsSearch == '' && !allSelected">
                                Ninguno
                            </b-form-tag>
                            <!-- It will be shown when the flag wich indicates that we want to show all the selected rows on the table is true -->
                            <b-form-tag
                                class="filter-tag mr-1 mt-1"
                                variant="primary"
                                v-if="allSelected"
                                @remove="addTagAllSelected()">
                                Seleccionadas
                            </b-form-tag>
                            <!-- It will show the content of the input wich filters the table data -->
                            <b-form-tag
                                class="filter-tag tag-input mt-1"
                                variant="danger"
                                v-if="beltsSearch != ''"
                                @remove="beltsSearch = ''">
                                {{ beltsSearch }}
                            </b-form-tag>
                        </template>
                    </b-form-tags>
                </b-col>
            </b-row>
            <!-- Row with the filters, history and download data table -->
            <b-row class="row-busqueda-table mb-2" no-gutters>
                <b-col class="mr-1 mt-1 px-0" cols="12" lg>
                    <b-form-input
                        id="table-cinturones-search"
                        placeholder="Buscar en la tabla..."
                        size="sm"
                        type="search"
                        v-model="beltsSearch"></b-form-input>
                </b-col>
                <b-col cols="12" lg>
                    <b-row align-h="end" no-gutters>
                        <b-col class="d-flex flex-nowrap justify-content-end">
                            <b-row no-gutters>
                                <!-- Button to show only the selected items -->
                                <span
                                    class="d-inline-block mr-1 mt-1"
                                    key="trans-btn-show-all"
                                    tabindex="0"
                                    v-b-tooltip.hover.noninteractive
                                    :title="rowsSelected.length == 0 ? 'No hay ninguna fila seleccionado' : 'Mostrar solo las filas seleccionadas'">
                                    <!-- It will be disabled when no rows are selected -->
                                    <b-button
                                        class="w-100"
                                        size="sm"
                                        variant="outline-dark"
                                        v-b-tooltip.hover.noninteractive
                                        :disabled="rowsSelected.length == 0"
                                        @click="addTagAllSelected()">
                                        Seleccionadas
                                    </b-button>
                                </span>
                                <!-- Filter by current grade -->
                                <b-dropdown
                                    class="ig-dropdown mr-1 mt-1 px-0"
                                    no-caret
                                    size="sm"
                                    variant="outline-primary">
                                    <template #button-content>
                                        <b-row class="flex-nowrap" no-gutters>
                                            <b-col>
                                                Grado
                                            </b-col>
                                            <b-col class="ml-2" cols="2">
                                                <fa-icon icon="caret-down"></fa-icon>
                                            </b-col>
                                        </b-row>
                                    </template>
                                    <b-dropdown-form>
                                        <b-form-checkbox-group
                                            buttons
                                            button-variant="outline-dark"
                                            size="sm"
                                            stacked
                                            v-model="getSelectedGrade">
                                            <b-form-checkbox
                                                v-for="grade in grades"
                                                :class="'ig-dropdown-item dropdown-grado ' + grade"
                                                :key="grade"
                                                :value="grade"
                                                @change.native="addTags(grade)">
                                            </b-form-checkbox>
                                        </b-form-checkbox-group>
                                    </b-dropdown-form>
                                </b-dropdown>
                                <!-- Reset filters button -->
                                <ButtonIcon
                                    class="btn-fa-tiny mt-1"
                                    icon="sync-alt"
                                    no-text
                                    size="sm"
                                    title="Restablecer los filtros"
                                    variant="outline-warning"
                                    v-b-tooltip.hover.noninteractive
                                    @click="resetFilters()">
                                </ButtonIcon>
                            </b-row>
                        </b-col>
                        <b-col class="d-flex flex-nowrap ml-3 mt-1" cols="auto">
                            <!-- Show all row details button -->
                            <span
                                class="mr-1"
                                tabindex="0"
                                v-b-tooltip.hover.noninteractive
                                :title="$refs.beltsTable && $refs.beltsTable.filteredItems.length == 0 ? 'No hay datos en la tabla' : 'Mostrar detalles en todas las filas'">
                                <!-- Disabled when the table hasn't content or if all the existing rows are showing their details -->
                                <ButtonIcon
                                    class="btn-fa-tiny"
                                    icon="angle-double-down"
                                    no-text
                                    size="sm"
                                    :disabled="$refs.beltsTable && $refs.beltsTable.filteredItems.length == 0 || showingDetailsItems.length == beltsTableItems.length"
                                    :variant="$refs.beltsTable && $refs.beltsTable.filteredItems.length == 0 || showingDetailsItems.length == beltsTableItems.length ? 'outline-info' : 'info'"
                                    @click="detailsExpandAll()">
                                </ButtonIcon>
                            </span>
                            <!-- Hide all row details button -->
                            <span
                                class="mr-3"
                                tabindex="0"
                                v-b-tooltip.hover.noninteractive
                                :title="$refs.beltsTable && $refs.beltsTable.filteredItems.length == 0 ? 'No hay datos en la tabla' : 'Ocultar detalles de todas las filas'">
                                <!-- Disabled when the table hasn't content or if all the existing rows aren't showing their details -->
                                <ButtonIcon
                                    class="btn-fa-tiny"
                                    icon="angle-double-up"
                                    no-text
                                    size="sm"
                                    :disabled="showingDetailsItems.length == 0 || ($refs.beltsTable && $refs.beltsTable.filteredItems.length == 0)"
                                    :variant="showingDetailsItems.length == 0 ? 'outline-secondary' : 'secondary'"
                                    @click="detailsCollapseAll()">
                                </ButtonIcon>
                            </span>
                            <!-- Download table data button -->
                            <span
                                tabindex="0"
                                v-b-tooltip.hover.noninteractive.topleft
                                :title="($refs.beltsTable && $refs.beltsTable.filteredItems.length == 0) ? 'No hay datos en la tabla para descargar' : downloadCsvTable ? 'Descargando...' : 'Descargar los datos de la tabla'">
                                <!-- Disabled when no table content or if the download of the table data was started -->
                                <ButtonIcon
                                    class="btn-fa-tiny"
                                    icon="download"
                                    no-text
                                    size="sm"
                                    variant="outline-success"
                                    :disabled="($refs.beltsTable && $refs.beltsTable.filteredItems.length == 0) || beltsTableItems.length == 0 || downloadCsvTable == true"
                                    :spin="downloadCsvTable == true && ($refs.beltsTable && $refs.beltsTable.filteredItems.length != 0)"
                                    @click="$tableToCsv([ '_id', 'customerNumber', 'name', 'belts' ], $refs.beltsTable.filteredItems, $moment().format('YYYY-MM-DD_HH.mm.ss') + '-grados.csv', 'downloadCsvTable')">
                                </ButtonIcon>
                            </span>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <div>
                <b-table
                    bordered
                    ref="beltsTable"
                    responsive="lg"
                    show-empty
                    small
                    sticky-header="10000px"
                    striped
                    :fields="beltsTableFields"
                    :filter="beltsSearch"
                    :filter-function="filterTable"
                    :items="beltsTableItems">
                    <template
                        #head(selected)>
                        <ButtonIcon
                            id="head-selectall"
                            no-text
                            :class="'ig-table-checkbox' + (selectedAll ? ' ig-checked' : '')"
                            :disabled="($refs.beltsTable && $refs.beltsTable.filteredItems.length == 0) || beltsTableItems.length == 0 || downloadCsvTable == true"
                            :icon="selectedAll ? 'check' : selectedSome ? 'circle' : ''"
                            @click="rowSelectAll(!selectedAll)">
                        </ButtonIcon>
                    </template>
                    <template
                        #cell(active)="row">
                        <b-form-checkbox
                            disabled
                            switch
                            v-model="row.value"></b-form-checkbox>
                    </template>
                    <template
                        #cell(selected)="row">
                        <span
                            v-b-tooltip.hover.noninteractive
                            :title="updating && row.item.belts.some(el => el.date == null) && row.item.nextGrade == '' ? 'No tiene marcado ningún Siguiente grado, revisa si tiene cinturones para otorgar y selecciona alguno' : ''">
                            <ButtonIcon
                                no-text
                                :class="'ig-table-checkbox' + (isSelected(row.item) ? ' ig-checked' : '')"
                                :disabled="(updating && (row.item.belts.some(el => el.date != null) && row.item.nextGrade == '')) || (downloadGrades && (row.item.belts.every(el => el.date == null)))"
                                :icon="isSelected(row.item) ? 'check' : ''"
                                @click="rowSelect(row.item, !isSelected(row.item))">
                            </ButtonIcon>
                        </span>
                    </template>
                    <template
                        #cell(name)="row">
                        <b-link
                            class="d-block pl-1 table-text-overflowed text-nowrap"
                            positioning="top"
                            target="_blank"
                            title="Abre la ficha del socio"
                            v-b-tooltip.hover.right.noninteractive
                            :to="{ name: 'customers.profile', params: { id: row.item._id } }">
                            {{ row.value }}
                            <small class="ml-1"><fa-icon icon="external-link-alt"></fa-icon></small>
                        </b-link>
                    </template>
                    <template
                        #cell(grade)="row">
                        <b-button
                            class="mx-0"
                            title="Muestra/Oculta los cinturones del socio"
                            v-b-tooltip.hover.noninteractive
                            :class="'btn-cinturon-table-static btn-cinturon-table btn-cinturon ' + row.value"
                            @click="detailsSet(row.item, !row.item._showDetails)">
                            {{ row.value == 'blbl' ? '' : row.item.belts.find(belt => belt.grade == row.value).date }}
                        </b-button>
                    </template>
                    <template
                        #cell(nextGrade)="row">
                        <b-button
                            v-if="row.value != ''"
                            :class="'btn-cinturon-table-static btn-cinturon-table btn-cinturon ' + row.value"
                            @click="detailsSet(row.item, !row.item._showDetails)"></b-button>
                    </template>
                    <template
                        #cell(editRow)="row">
                        <ButtonIcon
                            class="ig-small-btn"
                            no-text
                            v-b-tooltip.hover.left.noninteractive
                            :icon="!row.item._showDetails ? 'angle-double-down' : 'angle-double-up'"
                            :title="!row.item._showDetails ? 'Mostrar detalles' : 'Ocultar detalles'"
                            :variant="!row.item._showDetails ? 'outline-info' : 'info'"
                            @click="detailsSet(row.item, !row.item._showDetails)">
                        </ButtonIcon>
                    </template>
                    <template
                        #row-details="row">
                        <TransitionExpand>
                            <b-row
                                no-gutters
                                v-if="!isUpdating(row.item)">
                                <small
                                    class="text-muted">
                                    Cuando actualices grados masivamente, recuerda que puedes cambiar el valor de la columna 'Siguiente grado' pulsando sobre el grado que quieras
                                </small>
                            </b-row>
                        </TransitionExpand>
                        <b-row no-gutters>
                            <b-col class="ml-0 mr-auto">
                                <BeltsRow
                                    :ref="'beltsRow' + row.index"
                                    :customer="getCustomerById(row.item._id)"
                                    :downloadGrades="downloadGrades"
                                    :isBeltSelectedToDelete="isBeltSelectedToDelete"
                                    :isBeltSelectedToDownload="isBeltSelectedToDownload"
                                    :isUpdating="isUpdating"
                                    :isDisabled="false"
                                    :manageDownloadBelts="manageDownloadBelts"
                                    :manageNextGrade="manageNextGrade"
                                    :row="row"></BeltsRow>
                            </b-col>
                            <b-col cols="auto" class="ig-line-height-0 mx-0">
                                <span
                                    class="d-inline-block mb-1"
                                    tabindex="0"
                                    v-b-tooltip.hover.noninteractive
                                    :title="updating ? 'Para poder editar finaliza la actualización de grados' : downloadGrades ? 'Para poder editar finaliza la descarga de diplomas' : !isUpdating(row.item) ? 'Editar grados' : 'Cancelar la edición'">
                                    <ButtonIcon
                                        class="btn-edit-cinturones"
                                        no-text
                                        size="sm"
                                        :disabled="updating || downloadGrades"
                                        :icon="!isUpdating(row.item) ? 'edit' : 'times'"
                                        :variant="!isUpdating(row.item) ? 'outline-secondary' : 'danger'"
                                        @click="activateUpdate(row.item)">
                                    </ButtonIcon>
                                </span>
                            </b-col>
                        </b-row>
                    </template>
                    <template
                        #table-caption>
                        <p>La tabla solo muestra los socios activos. Mostrar los inactivos
                            <b-form-checkbox
                                class="d-inline inline-switch"
                                size="sm"
                                switch
                                v-model="inactives"
                                :disabled="allSelected"></b-form-checkbox>
                        </p>
                        Filas seleccionadas:
                        <animated-num
                            :numFounded="rowsSelected.length"></animated-num>
                        <span
                            v-if="selectedHided"> (algunas están ocultas por los filtros en la tabla)</span>
                        <br>
                        Filas totales:
                        <animated-num
                            :numFounded="totalRows"></animated-num>
                    </template>
                    <template
                        #table-colgroup="scope">
                        <col
                            v-for="field in scope.fields"
                            :key="field.key"
                            :style="{ width: field.key == 'grade' || field.key == 'nextGrade' ? '120px' : field.key == 'editRow' || field.key == 'selected' || field.key == 'active' ? '30px' : field.key == 'customerNumber' ? '75px' : 'auto' }">
                    </template>
                    <template
                        #table-busy>
                        <div class="text-center my-2">
                            <b-spinner class="align-middle" type="grow" variant="secondary"></b-spinner>
                        </div>
                    </template>
                    <!-- It will be shown when the table hasn't rows because the filters have emptied it -->
                    <template
                        #empty
                        v-if="beltsTableItems.length == 0">
                        <b-form-text>
                            No existen cinturones con los filtros aplicados
                        </b-form-text>
                    </template>
                    <template
                        #emptyfiltered>
                        <b-form-text>
                            Ningún registro coincide con tu búsqueda
                        </b-form-text>
                    </template>
                </b-table>
            </div>
        </b-card>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import * as WzdSteps from '../components/wzdsteps/belts';
    const QS = require('qs'); /* Needed at axios.post function to pass array as params to the controller */
    const SPECIAL_CHARACTERS = { 'Ã': 'A', 'À': 'A', 'Á': 'A', 'Ä': 'A', 'Â': 'A', 'È': 'E', 'É': 'E', 'Ë': 'E', 'Ê': 'E', 'Ì': 'I', 'Í': 'I', 'Ï': 'I', 'Î': 'I', 'Ò': 'O', 'Ó': 'O', 'Ö': 'O', 'Ô': 'O', 'Ù': 'U', 'Ú': 'U', 'Ü': 'U', 'Û': 'U', 'ã': 'a', 'à': 'a', 'á': 'a', 'ä': 'a', 'â': 'a', 'è': 'e', 'é': 'e', 'ë': 'e', 'ê': 'e', 'ì': 'i', 'í': 'i', 'ï': 'i', 'î': 'i', 'ò': 'o', 'ó': 'o', 'ö': 'o', 'ô': 'o', 'ù': 'u', 'ú': 'u', 'ü': 'u', 'û': 'u', 'Ñ': 'N', 'ñ': 'n', 'Ç': 'c', 'ç': 'c' };
    export default {
        data() {
            return {
                allSelected: false, /* Flag to obtain only the selected elements on the table */
                beltsNewDate: '', /* v-model for the date that will be used for store new grados */
                beltsSearch: '', /* v-model to the input search on table beltsTable */
                beltsSelectedDel: [], /* Selected grades on a row when a delete action is actived */
                beltsSelectedDownload: [], /* Selected grades on a row when a download action is actived */
                beltsTableFields: [
                    { key: 'selected', label: '', },
                    { key: 'active', label: 'Activo', sortable: true, class: 'text-right', },
                    // { key: 'id', label: 'ID', sortable: true, },
                    { key: 'customerNumber', label: 'Nº Socio', sortable: true, class: 'text-center' },
                    { key: 'name', label: 'Socio', sortable: true },
                    { key: 'grade', label: 'Grado actual', sortable: true, class: 'text-center', },
                    { key: 'nextGrade', label: 'Siguiente grado', sortable: true, class: 'text-center', },
                    { key: 'editRow', label: 'Detalles', class: 'tableEditRow text-center' },
                ], /* Fields of the table beltsTable, some conditional showed fields are not included by default and it will be included in some function */
                deletingRow: false, /* Flag to activate/deactivate the delete grades button */
                downloadCsvTable: false, /* Flag to conditional render an spinner or icon on a print button */
                downloadCsvManual: false, /* Flag to conditional render an spinner or icon on a print button */
                filterTags: [], /* v-model that contains the filters applied on the table */
                getSelectedGrade: [], /* v-model with the grade filter applied to the table */
                grades: [ 'blbl', 'blam', 'amam', 'amna', 'nana', 'nave', 'veve', 'veaz', 'azaz', 'azma', 'mama', 'nene', ], /* Code of grades */
                inactives: false,
                onUpdateRow: {},  /* Store the on delete row wich will be useful to manage the states of the elements allowed and disallowed at the delete of a row */
                rowsSelected: [], /* Selected rows from beltsTable, its elements will be pushed on events at every row */
                showingDetailsItems: [], /* Stores the elements wich are showing their details */
                updateCsv: false, /* Flag to determine if a download csv was requested to apply visual modifications */
            }
        },
        /**
         * Prevent leaving the page with editings open
         */
        beforeRouteLeave(to, from, next) {
            let answer = true;
            if (this.updating || this.downloadGrades || this.beltsTableItems.some(belt => this.isUpdating(belt))) {
                answer = confirm('No has guardado los cambios, ¿seguro que quieres salir?');
                if (!answer) {
                    next(false);
                }
            }
            if (answer) {
                /* End the open belts procedures at vuex */
                this.endProcedures('belts');
                /* Pause the validations before leave the page to prevent errors at assign the validation again to the reusable components */
                this.$validator.pause();
                next();
            }
        },
        computed: {
            ...mapGetters(['getBelts', 'getCustomerById', 'getLastBelts']),
            ...mapGetters('navbar', ['getProcedureState']),
            /**
             * Initialize the belts data from the store. Determine the value of local variables.
             *
             * @return {Array} Array with the objects-rows to the table
             */
            beltsTableItems() {
                let belts = this.getBelts(this.getSelectedGrade, this.inactives);
                if (this.allSelected) {
                    /* Get only the selected rows */
                    belts = belts.filter(belt => this.rowsSelected.some(rs => rs._id == belt._id) == true);
                }
                /* Is necessary to maintain the state of the '_showDetails' attribute between table data changes */
                if (this.showingDetails) {
                    this.showingDetailsItems.forEach(sdi => {
                        if (belts.some(row => row._id == sdi._id)) {
                            this.$set(belts.find(row => row._id == sdi._id), '_showDetails', true);
                        }
                    });
                }
                return belts;
            },
            /**
             * v-model that indicates if the grades download process has been started
             */
            downloadGrades: {
                get() {
                    let state = this.getProcedureState('beltsPrinting');
                    if (state == false) {
                        this.beltsSelectedDownload = [];
                    }
                    if (state && this.updateInCourse) {
                        this.resetUpdate();
                        this.onUpdateRow = {};
                    }
                    return state;
                },
                set(val) {
                    this.setProcedureState({ procedure: 'beltsPrinting', newVal: val });
                }
            },
            /**
             * Gets the rows with belts to download on the csv file
             *
             * @return {Array} Array with the belts to download on the csv file
             */
            rowsSelectedToDownload() {
                return this.beltsSelectedDownload.filter(bsd => this.rowsSelected.some(rs => rs.name == bsd.name));
            },
            /**
             * Determines if all the elements are selected under visible filtered elements on the table. This function is used at the simulated checkbox of the head at the col selected of the table
             *
             * @return {Boolean} Boolean to determine if all the elements of the table are selected
             */
            selectedAll() {
                const filteredItems = this.$refs.beltsTable && this.$refs.beltsTable.filteredItems;
                if (this.rowsSelected.length > 0 && filteredItems.length > 0) {
                    if (this.updating) {
                        const rowsUpdating = filteredItems.filter(el => el.belts.some(belt => belt.date == null) || el.nextGrade != '');
                        return rowsUpdating.every(ru => this.rowsSelected.some(rs => rs._id == ru._id) == true);
                    }
                    if (!this.updating) {
                        return filteredItems.every(fi => this.rowsSelected.some(rs => rs._id == fi._id) == true);
                    }
                }
            },
            /**
             * Determines if some selected row has been hided by the filters applied
             *
             * @return {Boolean} Boolean that determines if some row has been hided by the filters applied
             */
            selectedHided() {
                const filteredItems = this.$refs.beltsTable && this.$refs.beltsTable.filteredItems;
                return this.rowsSelected.length > 0 && this.rowsSelected.some(rs => filteredItems.findIndex(fi => fi._id == rs._id) == -1);
            },
            /**
             * Determines if some row is selected
             *
             * @return {Boolean} Boolean to determine if some element has been selected
             */
            selectedSome() {
                const filteredItems = this.$refs.beltsTable && this.$refs.beltsTable.filteredItems;
                return this.rowsSelected.length > 0 && filteredItems.length > 0 && this.rowsSelected.length > 0;
            },
            /**
             * Informs if some row is showing its details that means is editing
             *
             * @return {Boolean} Boolean that informs if some row is showing its details
             */
            showingDetails() {
                return this.showingDetailsItems.length > 0;
            },
            /**
             * Determines the total filtered rows
             *
             * @returns {Integer} The integer with the total rows in the table
             */
            totalRows() {
                return this.$refs.beltsTable && this.$refs.beltsTable.isFiltered ? this.$refs.beltsTable.filteredItems.length : this.beltsTableItems.length
            },
            /**
             * Indicates if a row is being edited to delete some belts
             *
             * @return {Boolean} Boolean that indicates if a row is being edited to delete some belts
             */
            updateInCourse() {
                return Object.keys(this.onUpdateRow).length !== 0;
            },
            /**
             * v-model that indicates if the updating belts process has been started (it will be setted Vuex and its changes will be tracked on a watcher)
             *
             * @return {Boolean} Boolean with the status of the update of belts procedure
             */
            updating() {
                let status = this.getProcedureState('beltsUpdating');
                /* Reset the row edit if exists */
                if (status === true) {
                    this.resetUpdate();
                    this.onUpdateRow = {};
                }
                return status
            }
        },
        created() {
            /* Force the update of the component to recalculate the directive that adds the title to the name on every row */
            window.addEventListener('resize', () => { this.$forceUpdate() });
            /* Prevents leave the page when changes has been made */
            window.addEventListener('beforeunload', this.beforeUnload);
        },
        destroyed() {
            /* Destroy de listeners */
            window.removeEventListener('beforeunload', this.beforeUnload);
            window.removeEventListener('resize', () => { this.$forceUpdate() });
        },
        methods: {
            ...mapActions(['deleteBelts', 'updateBeltsMassive']),
            ...mapActions('navbar', ['endProcedures', 'setProcedureState']),
            /**
             * Function that 'starts' the delete action
             *
             * @param {Object} row is the row from the table wich contains data and context of one customer
             */
            activateUpdate(row) {
                /* Reset the previous deleting selected */
                this.resetUpdate();
                /* Store the on delete data to use it to control the state of every row */
                this.onUpdateRow = this.onUpdateRow._id == row._id ? {} : { ...row };
            },
            /**
             * Function to manage the tag for all-selected elements shown conditionally with the flag allSelected
             */
            addTagAllSelected() {
                /* Show or hide the tag 'Seleccionadas' */
                this.allSelected = !this.allSelected;
                /* If we want to show the selected belts */
                if (this.allSelected) {
                    /* Check if in the selected belts there are some inactive to active the flag that indicates we are showing the inactives on the table */
                    if (this.rowsSelected.some(belt => belt.active == false)) {
                        this.inactives = true;
                    }
                    // this.beltsTableItems = this.rowsSelected;
                }
            },
            /**
             * Function that add the tags to the array v-model. Is called when a filter on the table is selected
             *
             * @param {String} tag: is the value of the selected filter applied to the table
             */
            addTags(tag) {
                this.filterTags.includes(tag) ? this.filterTags.splice(this.filterTags.indexOf(tag), 1) : this.filterTags.push(tag);
            },
            /**
             * Prevent leave the page with changes unsaved
             *
             * @param {Event} ev: the event fired
             */
            beforeUnload(ev) {
                let answer = true;
                /* From Chrome 60 onward, the beforeunload dialog will only appear if the frame attempting to display it has received a user gesture or user interaction (or if any embedded frame has received such a gesture). */
                if (this.updating || this.downloadGrades || this.beltsTableItems.some(belt => this.isUpdating(belt))) {
                    answer = confirm('No has guardado los cambios, ¿seguro que quieres salir?');
                    if (!answer) {
                        ev.preventDefault();
                        /* Chromium requires returnValue to stop the default propagation */
                        ev.returnValue = '';
                    }
                }
                if (answer) {
                    /* End the open belts procedures at vuex */
                    this.endProcedures('belts');
                    /* Pause the validations before leave the page to prevent errors at assign the validation again to the reusable components */
                    this.$validator.pause();
                }
            },
            /**
             * Function that takes the selected data by the user (rows of the table beltsTable) and store at the database its changes at his grades (cinturones).
             */
            async beltsMassUpdate() {
                /* Will store all the updated rows to send it to vuex */
                let newDate = this.$moment(this.beltsNewDate).format('DD-MM-YYYY');
                const beltsUpdated = await this.updateBeltsMassive({ newDate: newDate, customers: this.rowsSelected })
                /* Construct and show the message to the user based on the updated elements */
                if (beltsUpdated.length > 0 && (beltsUpdated.length == this.rowsSelected.length)) {
                    this.$showToast('success', 'Se han guardado los cambios.', 'Grados actualizados correctamente', 5000);
                }
                if (beltsUpdated.length > 0 && (beltsUpdated.length != this.rowsSelected.length)) {
                    this.$showToast('warning', 'Se han guardado los cambios pero alguno de los grados seleccionados no han podido ser actualizados. Revisa el archivo descargado con los grados actualizados.', 'Grados actualizados correctamente', 7500);
                }
                if (beltsUpdated.length > 0) {
                    this.$showToast('success', 'Se ha descargado el archivo para generar los diplomas.', 'Descarga de archivo de grados', 6500);
                }
                /* Download the csv file with the updated data */
                this.$tableToCsv(['name', 'grade', 'date'], beltsUpdated, this.$moment().format('YYYY-MM-DD_HH.mm.ss') + '_cinturones_diplomas_' + this.beltsNewDate + '.csv', 'updateCsv');
                if (beltsUpdated.length == 0) {
                    this.$showToast('warning', 'No se ha guardado ningún cambio.', 'Atención', 6500);
                }
                /* Reset the involved vars */
                this.beltsNewDate = '';
                this.rowsSelected = [];
            },
            /**
             * Function called when a tag is removed from its interaction. It will splice the tag removed from the v-model of the tags element
             *
             * @param {String} tag: name of the tag clicked to be removed
             */
            deleteTag(tag) {
                /* Delete the specific tag */
                this.filterTags.splice(this.filterTags.indexOf(tag), 1);
                /* Delete the deleted tag on the array of filters too */
                if (this.getSelectedGrade.indexOf(tag) != -1) {
                    this.getSelectedGrade.splice(this.getSelectedGrade.indexOf(tag), 1);
                }
            },
             /**
             * Function to deactivate all the row details on the table beltsTable
             */
            detailsCollapseAll() {
                this.beltsTableItems.forEach(belt => {
                    // this.detailsSet(belt, false);
                    this.$set(belt, '_showDetails', false);
                    if (this.showingDetailsItems.length > 0) {
                        const index = this.showingDetailsItems.findIndex(sdi => sdi._id == belt._id);
                        if (index != -1) {
                            this.showingDetailsItems.splice(index, 1);
                        }
                    }
                });
            },
            /**
             * Function to activate all the row details on the table beltsTable
             */
            detailsExpandAll() {
                this.beltsTableItems.forEach(belt => {
                    // this.detailsSet(belt, true);
                    this.$set(belt, '_showDetails', true);
                    const index = this.showingDetailsItems.findIndex(sdi => sdi._id == belt._id);
                    if (index == -1) {
                        this.showingDetailsItems = [ ...this.showingDetailsItems, { ...belt } ];
                    }
                });
            },
             /**
             * Function wich show the details (b-table functionality) on the row passed from the table
             *
             * @param {Object} row: is the row from the table wich contains data and context of one socio
             */
            detailsSet(row, newValue) {
                this.$set(row, '_showDetails', newValue);
                /* Add the row that are showing details to the array wich contains these items */
                if (this.showingDetailsItems.length > 0) {
                    const index = this.showingDetailsItems.findIndex(sdi => sdi._id == row._id);
                    if (index != -1) {
                        this.showingDetailsItems.splice(index, 1);
                    } else {
                        this.showingDetailsItems = [ ...this.showingDetailsItems, { ...row } ];
                    }
                } else {
                    this.showingDetailsItems = [ ...this.showingDetailsItems, { ...row } ];
                }
                /* If the row is deleting, reset it */
                if (this.isUpdating(row)) {
                    this.resetUpdate();
                    this.onUpdateRow = {};
                }
            },
            /**
             * Evaluate if the selected rows on the table can remain selected during the procedure started. In the case of 'updating' procedure, the rows with no next grade can not be updated and.
             */
            evaluateRowSelectedState() {
                this.rowsSelected.forEach((row, idx) => {
                    /* On the updating procedure we can only select the rows with a nextGrade selected or with some belt.date as null, on the downloadGrades procedure we can only select the rows with any belt acquired */
                    if ((this.updating == true && (row.belts.every(belt => belt.date != null) || row.nextGrade == '')) || (this.downloadGrades && (row.belts.every(belt => belt.date == null)))) {
                        this.rowSelect(row, false)
                        /* Recursive call to iterate over all the items of the array */
                        this.evaluateRowSelectedState();
                    }
                });
            },
            /**
             * Function that empty all the actual filters and show only the selected rows
             */
            filterSelected() {
                /* Reset all the filters */
                this.resetFilters();
                /* Add the tag 'Seleccionadas' */
                this.allSelected = true;
                if (this.rowsSelected.some(belt => belt.active == false)) {
                    this.inactives = true;
                }
            },
            /**
             * Filters the table component by the input provided for it
             *
             * @param {Object} value: the row of the table to make the search
             *
             * @return {Boolean} Boolean which indicates if the row includes or not the search
             */
            filterTable(value) {
                /* Stringify and clean the received object */
                let auxValue = JSON.stringify(value).toLowerCase().replace(new RegExp(/\"/g), '');
                let valueClean = '';
                /* Iterate over the stringified value passed to convert every special character to a regular */
                for (let i = 0; i < auxValue.length; i++) {
                    valueClean += SPECIAL_CHARACTERS[auxValue.charAt(i)] || auxValue.charAt(i);
                }
                let auxFilter = this.beltsSearch.toLowerCase();
                let filterClean = '';
                /* Iterate over the input search value to convert every special character to a regular */
                for (let i = 0; i < auxFilter.length; i++) {
                    filterClean += SPECIAL_CHARACTERS[auxFilter.charAt(i)] || auxFilter.charAt(i);
                }
                return !this.beltsSearch || valueClean.includes(filterClean)
            },
            /**
             * Function to get the last grade obtained
             *
             * @param {Object} row: the row item of the table element
             *
             * @return {Object|null} Returns the grade object or null if not exists any obtained grade
             */
            getLastGrade(row) {
                let lastGrade = null;
                row.belts.forEach(belt => {
                    if (belt.date != null && belt.date != '') {
                        lastGrade = belt;
                    }
                })
                return lastGrade;
            },
            /**
             * Determines if a belts is included on the selected belts to delete from a row
             *
             * @param {Object} belt: is the item to check if is or isn't selected
             * @param {Object} row: the row item of the table element
             *
             * @return {Boolean} Boolean that confirms if the row passed has some belt selected to delete
             */
            isBeltSelectedToDelete(belt, row) {
                return this.beltsSelectedDel.filter(bsdEl => bsdEl.grade == belt.grade && bsdEl.date == belt.date && bsdEl._id == row._id).length > 0;
            },
            /**
             * Determines if a belts is included on the selected belts to download from a row
             *
             * @param {Object} belt: is the item to check if is or isn't selected
             * @param {Object} row: the row item of the table element
             *
             * @return {Boolean} Boolean that confirms if the row passed has some belt selected to download
             */
            isBeltSelectedToDownload(belt, row) {
                return this.beltsSelectedDownload.filter(bsdEl => bsdEl.grade == belt.grade && bsdEl.date == belt.date && bsdEl.name == row.name).length > 0;
            },
            /**
             * Determines if a table row passed is selected to edit its belts
             *
             * @param {Object} row: the row item of the table element
             *
             * @return {Boolean} Boolean that confirms if the row passed has initiated its belt edition or not
             */
            isUpdating(row) {
                return row._id == this.onUpdateRow._id;
            },
            /**
             * Determines if a specific row is selected on the table. Its used on every row simulated checkbox at the select col
             *
             * @param {Object} row: is the table row item
             *
             * @return {Boolean} Boolean to determine if the row passed is selected
             */
            isSelected(row) {
                return this.rowsSelected.some(el => el._id == row._id);
            },
            /**
             * Manages the selection of the elements to download on the certificates csv file
             *
             * @param {Object} belt: contains the selected grade data
             * @param {Object} row: is the row from the table wich contains data and context of one customer
             */
            manageDownloadBelts(belt, row) {
                 /* Check if the grade (belt) passed exists on the array and delete it if its true or push it if its false */
                if (!this.isBeltSelectedToDownload(belt, row)) {
                    // this.beltsSelectedDownload.push({ _id: row._id, ...belt });
                    this.beltsSelectedDownload.push({ name: row.name, ...belt });
                } else if (this.isBeltSelectedToDownload(belt, row)) {
                    this.beltsSelectedDownload.splice(this.beltsSelectedDownload.findIndex(bsdEl => bsdEl.grade == belt.grade && bsdEl.date == belt.date && bsdEl.name == row.name), 1);
                }
            },
            manageNextGrade(belt, row) {
                if (!this.isUpdating(row)) {
                    let nextGrade = belt.grade == row.nextGrade ? '' : belt.grade;
                    this.$set(row, 'nextGrade', nextGrade);
                }
            },
            /**
             * Function to reset all the filters applieds to the table
             */
            resetFilters() {
                /* Empty all the filters and tags */
                this.beltsSearch = '';
                this.filterTags = [];
                this.getSelectedGrade = [];
                this.allSelected = false;
                this.inactives = false;
            },
            /**
             * Reset the edit on every row determining the rows on edition and calling to the child function
             */
            resetUpdate() {
                /* Get the $refs of every row existent */
                let refs = Object.keys(this.$refs).filter(key => key.startsWith('beltsRow'));
                refs.forEach(ref => {
                    /* Reset the updating for every row */
                    this.$refs[ref] && this.$refs[ref].resetUpdating();
                })
            },
            /**
             * Function that select a row by clicking on its checkbox or on the header checkbox. The selected element comes from the table beltsTable and is pushed on the rowsSelected array. Also manage the download grades selected when the procedure is actived
             *
             * @param {Array} row: is the data from a row of the table beltsTable
             * @param {Event} newVal: is the checkbox event that indicates the new value for vuex
             */
            rowSelect(row, newVal) {
                if (newVal) {
                    this.rowsSelected.push(row);
                    /* If the download array doesn't contain the selected row */
                    if (this.downloadGrades) {
                        /* If the row has not selected belts, push the last belt acquired */
                        if (!this.beltsSelectedDownload.some(el => el.name == row.name)) {
                            this.beltsSelectedDownload.push({ name: row.name, ...this.getLastGrade(row) });
                        }
                    }
                } else {
                    this.rowsSelected.splice(this.rowsSelected.findIndex(el => el._id == row._id), 1);
                    /* If exists a belt selected of the row, unselect it */
                    if (this.beltsSelectedDownload.some(el => el.name == row.name)) {
                        this.beltsSelectedDownload = this.beltsSelectedDownload.filter(bsd => bsd.name != row.name);
                    }
                }
            },
            /**
             * Function activated via clicking the header checkbox on tables beltsTable and it calls to rowSelect respective function to select al the avaiable rows on the table
             *
             * @param {Boolean} checked: status of the checkbox of the header row
             */
            rowSelectAll(checked) {
                /* v.2 can be useful */
                // if (checked == true) {
                //     this.$refs.beltsTable.filteredItems.forEach(el => {
                //         if ((this.updating == true && (el.belts.some(belt => belt.date == null) || el.nexGrade != '') || this.updating == false) && !this.rowsSelected.some(row => row._id == el._id)) {
                //             this.rowSelect(el, true);
                //         }
                //     });
                // } else if (checked == false) {
                //     this.$refs.beltsTable.filteredItems.forEach(el => {
                //         if (this.rowsSelected.some(row => row._id == el._id)) {
                //             this.rowSelect(el, false);
                //         }
                //     });
                // }
                let usefulItems = [];
                this.$refs.beltsTable.filteredItems.forEach(el => {
                    /* Algorithm that allows to select the elements wich can be selected
                    beltsTable: if we are updating grades and one or more of the row grades are pending and the nextGrade isn't empy or out of the updating procedure */
                    if ((this.updating == true && el.belts.some(cintu => cintu.date == null) && el.nextGrade != '') || (this.downloadGrades && (el.belts.some(belt => belt.date != null)))) {
                        usefulItems.push(el);
                    } else if (this.updating == false && this.downloadGrades == false) {
                        usefulItems.push(el);
                    }
                });
                /* Iterate the useful items to mark they selected or unselected */
                usefulItems.forEach(el => {
                    if (checked == true && !this.rowsSelected.some(row => row._id == el._id)) {
                        this.rowSelect(el, true);
                    } else if (checked == false && this.rowsSelected.some(row => row._id == el._id)) {
                        this.rowSelect(el, false);
                    }
                });
            },
        },
        watch: {
            downloadGrades(newVal, oldVal) {
                /* If a row is selected before the download procedure has started add the last belt if no belts of a row has been previously added */
                if (newVal === true && this.selectedSome) {
                    /* Evaluate the valid selected rows */
                    this.evaluateRowSelectedState();
                    this.rowsSelected.forEach(row => {
                        if (!row.belts.some(belt => this.isBeltSelectedToDownload(belt, row))) {
                            this.beltsSelectedDownload.push({ name: row.name, ...this.getLastGrade(row) });
                        }
                    });
                }
            },
            /* Watch the updating changes to evaluate the rows selected */
            updating(newVal, oldVal) {
                if (newVal === true) {
                    /* Evaluate the valid selected rows */
                    if (this.rowsSelected.length > 0) {
                        this.evaluateRowSelectedState();
                    }
                }
            },
        },
    }
</script>
<style scoped>
    .btn-cinturon-table-static {
        cursor: default;
        margin-bottom: .1rem!important;
        min-width: 100px;
    }
    /* Selectors are ordered from generic to specific and then alphabetical and its properties are in alphabetical order */
    .btn-edit-cinturones,
    .btn-select-cinturones {
        height: 25px!important;
        line-height: 1;
        margin: 0 .2rem 0 0;
        padding: 0;
        width: 25px;
    }
    .btn-edit-cinturones svg,
    .btn-select-cinturones svg {
        margin: 0 auto;
        padding: 0;
    }
    .b-table-details {
        max-height: 40px!important;
    }
    .b-table-details .btn-group-toggle {
        display: inline-block!important;
        /* width: 60%; */
    }
    .card-body {
        overflow: visible!important; /* This will show the dropdown out of the card limits and prevents scroll it */
    }
    .wrp-tiny-btns {
        word-wrap: no-wrap;
    }
    .wrp-transition-table-alerts {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
    }
    .wrp-transition-table-alerts > * {
        transition: all .2s;
        width: 100%;
    }
</style>

