
<template>
    <div>
        <TransitionExpand>
            <div
                v-if="$route.name == 'payments.index' && rowsSelected.length > 200">
                <b-alert
                    class="py-1"
                    show
                    variant="danger">
                    Has seleccionado más de 200 filas, asegúrate que hayas escogido las filas correctas antes de guardar los cambios.
                </b-alert>
            </div>
        </TransitionExpand>
        <!-- Content for the confirmation process -->
        <b-collapse
            id="collapse-information-confirm"
            :visible="confirming">
            <h5 class="subtitle subtitle-sub" md="4">
                Confirmación de estado de pagos domiciliados
            </h5>
            <b-row align-h="start" class="mb-2" no-gutters>
                <b-col cols="12" md="auto">
                    <b-row class="mx-0" no-gutters>
                        <!-- It will be disabled when the confirmation of payments process has not been started -->
                        <b-form-radio-group
                            buttons
                            button-variant="outline-secondary"
                            class="col col-12 col-sm mb-1 mr-1 px-0 "
                            key="trans-radio-new-state"
                            size="sm"
                            v-model="newStateSelected"
                            :disabled="!confirming">
                            <b-form-radio
                                name="radio-stats"
                                value="confirmado">
                                Confirmado
                            </b-form-radio>
                            <b-form-radio
                                name="radio-stats"
                                value="devuelto">
                                Devuelto
                            </b-form-radio>
                        </b-form-radio-group>
                        <!-- It is shown conditionally when the confirmation of payments has been started -->
                        <span
                            class="col col-12 col-sm d-inline-block mb-1 px-0"
                            id="save-confirmation"
                            key="trans-btn-save-confirm"
                            tabindex="0"
                            v-b-tooltip.hover.noninteractive
                            :title="newStateSelected == false && rowsSelected.length == 0 ? 'Selecciona un estado y algún pago de la tabla' : newStateSelected == false ? 'Selecciona un estado' : rowsSelected.length == 0 ?  'Selecciona algún pago de la tabla' : paymentsTableBusy ? 'Descargando...' : ''">
                            <!-- It will be disabled when the user hasn't selected a new state for the payment or if he hasn't select a row in the table or if a row in the table is being edited or if the flag wich controls the download of the file is actived -->
                            <ButtonIcon
                                class="w-100"
                                icon="check-double"
                                size="sm"
                                :disabled="!newStateSelected || rowsSelected.length == 0 || paymentsTableBusy"
                                :spin="paymentsTableBusy == true"
                                :variant="paymentsTableBusy == false && (newStateSelected && rowsSelected.length > 0) ? 'success' : 'outline-success'"
                                @click="confirmingState()">
                                Confirmar estado
                            </ButtonIcon>
                        </span>
                    </b-row>
                </b-col>
                <!-- Shown whe the process to update payments is actived and some valid payments are selected -->
                <transition name="slide-fade">
                    <span
                        class="d-inline-block ig-inline-text ml-md-3 my-auto"
                        v-if="confirming && rowsSelected.length > 0">
                        Vas a confirmar {{ rowsSelected.length + (rowsSelected.length > 1 ? ' pagos' : ' pago') }}
                    </span>
                </transition>
                <b-col align-self="end" class="mb-2">
                    <b-button
                        class="d-block ml-auto mr-0"
                        size="sm"
                        title="Finaliza el proceso, los cambios no guardados se perderán"
                        variant="outline-danger"
                        v-b-tooltip.hover.noninteractive
                        @click="endProcedures()">
                        Finalizar
                    </b-button>
                </b-col>
            </b-row>
            <!-- It will be shown when the confirmation process has been started -->
            <b-alert
                class="mb-2"
                show
                variant="info">
                1 - Busca y selecciona los pagos que quieres cambiar de estado. En este proceso solo podrás seleccionar los que estén 'Pendientes' y tengan forma de pago 'Domiciliación'.
                <br>
                2 - Selecciona el estado que quieres aplicar: 'Confirmado' o 'Devuelto'.
                <br>
                3 - Para acabar, confirma los cambios.
                <br>
                <br>
                <u>Importante:</u>
                <br>
                - Fíjate que el periodo de pago y la forma de pago de los pagos que selecciones sean los correctos.
                <br>
                - Si lo necesitas, puedes editar ciertos datos en la tabla o ir a la ficha del usuario y modificar lo que necesites.
                <br>
                - Los pagos que no sean domiciliados se gestionan desde la herramienta para pagos de la barra de navegación.
                <br>
                - Si hubieras seleccionado un pago no compatible se desmarcará automáticamente (los que no sean domiciliados o los que lo sean y no estén pendientes).
            </b-alert>
        </b-collapse>
        <!-- Content for the manual download of payments process -->
        <b-collapse
            id="collapse-information-manual"
            :visible="manualDownload">
            <h5 class="subtitle subtitle-sub" md="4">
                Descarga manual de fichero de remesa para los pagos pendientes
            </h5>
            <b-row class="mb-2" no-gutters>
                <b-col cols="12" sm="auto">
                    <!-- It will be shown when the manual download is actived-->
                    <span
                        class="d-inline-block mb-1 px-0 w-100"
                        key="trans-btn-download"
                        tabindex="0"
                        v-b-tooltip.hover.noninteractive
                        :title="rowsSelected.length == 0 ? 'Selecciona algún pago de la tabla' : csvDownloadManual ? 'Descargando...' : ''">
                        <!-- Disabled when any row on the table has been selected or if the edition of some row is actived or if the process of manual download hasn't been started of if the flag wich controls the download of the file is true -->
                        <ButtonIcon
                            class="w-100"
                            icon="file-download"
                            size="sm"
                            :disabled="rowsSelected.length == 0 || !manualDownload || csvDownloadManual"
                            :spin="csvDownloadManual == true"
                            :variant="csvDownloadManual == false && (rowsSelected.length != 0 && manualDownload) ? 'success' : 'outline-success'"
                            @click="paymentsToCsv()">
                            Descargar archivo de remesa
                        </ButtonIcon>
                    </span>
                </b-col>
                <!-- Shown whe the process to update grades is actived and some grade are selected -->
                <transition name="slide-fade">
                    <span
                        class="d-inline-block ig-inline-text ml-sm-3 my-auto"
                        v-if="manualDownload && rowsSelected.length > 0">
                        Vas a descargar datos de {{ rowsSelected.length + (rowsSelected.length > 1 ? ' socios' : ' socio') }}
                    </span>
                </transition>
                <!-- <b-col cols="auto" class="mb-1"> -->
                    <b-button
                        class="d-block mb-1 ml-auto mr-0"
                        size="sm"
                        title="Finaliza el proceso, los cambios no guardados se perderán"
                        variant="outline-danger"
                        v-b-tooltip.hover.noninteractive
                        @click="endProcedures()">
                        Finalizar
                    </b-button>
                <!-- </b-col> -->
            </b-row>
            <!-- It will be shown when the manual download process has been started -->
            <b-alert
                class="mb-2"
                show
                variant="info">
                1 - Busca y selecciona los socios sobre los que quieres descargar los datos, solo podrás seleccionar de entre los pagos por 'Domiciliación' los que estén en los estados: 'Confirmado' o 'Devuelto'.
                <br>
                2 - Descarga el fichero.
            </b-alert>
        </b-collapse>
        <TransitionExpand>
            <div
                v-if="selectedHided">
            <!-- Shown when the confirmation process has been started and some of the selected items has been hided for the filters applied to the table -->
                <b-alert
                    class="mb-2"
                    key="trans-alert-warning-selected-confirm"
                    show
                    variant="warning">
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
        <!-- Charts -->
        <!-- Shown only at the main payments page -->
        <!-- <b-collapse
            id="collapse-charts"
            v-if="$route.name == 'payments.index'"
            :visible="collapseCharts">
            <h5 class="subtitle subtitle-sub" md="4">
                Gráficos
            </h5>
            <div id="ctn-collapse-charts" class="pb-3 pt-2">
                <b-row no-gutters>
                    <b-button
                        class="col mr-1"
                        id="btn-chart-pagos-tipo"
                        size="sm"
                        title="Muestra el total mensual por tipo y estado del pago"
                        value="pagos-tipo"
                        v-b-toggle.chart-pagos-tipo
                        v-b-tooltip.hover.noninteractive
                        :variant="$refs.chartPagosTipo && $refs.chartPagosTipo.show ? 'secondary' : 'outline-secondary'">
                        <fa-icon icon="chart-bar"></fa-icon>
                        &ensp;Pagos por tipo
                    </b-button>
                    <b-button
                        class="col mr-1"
                        id="btn-chart-pagos-total"
                        size="sm"
                        title="Muestra el total de pagos completados y pendientes en relación con el total de socios"
                        value="pagos-total"
                        v-b-toggle.chart-pagos-total
                        v-b-tooltip.hover.noninteractive
                        :variant="$refs.chartPagosTotal && $refs.chartPagosTotal.show ? 'secondary' : 'outline-secondary'">
                        <fa-icon icon="chart-bar"></fa-icon>
                        &ensp;Pagos totales
                    </b-button>
                    <b-button
                        class="col"
                        id="btn-chart-pagos-ingresos"
                        size="sm"
                        title="Muestra los ingresos y las devoluciones en relación con el total de socios"
                        value="pagos-ingresos"
                        v-b-toggle.chart-ingresos-total
                        v-b-tooltip.hover.noninteractive
                        :variant="$refs.chartIngresosTotal && $refs.chartIngresosTotal.show ? 'secondary' : 'outline-secondary'">
                        <fa-icon icon="chart-bar"></fa-icon>
                        &ensp;Ingresos
                    </b-button>
                </b-row>
                <b-collapse
                    id="chart-pagos-tipo"
                    ref="chartPagosTipo">
                    <div class="wrp-chart">
                        <h5 class="subtitle subtitle-sub">Pagos por tipo</h5>
                        <bar-chart
                            class="chart-pagos"
                            :chart-data="chartPagosTipoData"
                            :options="chartPagosTipoOptions"></bar-chart>
                    </div>
                </b-collapse>
                <b-collapse
                    id="chart-pagos-total"
                    ref="chartPagosTotal">
                    <div class="wrp-chart">
                        <h5 class="subtitle subtitle-sub">Pagos totales</h5>
                        <bar-chart
                            class="chart-pagos"
                            :chart-data="chartPagosTotalData"
                            :options="chartPagosTotalOptions"></bar-chart>
                    </div>
                </b-collapse>
                <b-collapse
                    id="chart-ingresos-total"
                    ref="chartIngresosTotal">
                    <div class="wrp-chart">
                        <h5 class="subtitle subtitle-sub">Ingresos</h5>
                        <bar-chart
                            class="chart-pagos"
                            :chart-data="chartIngresosTotalData"
                            :options="chartIngresosTotalOptions"></bar-chart>
                    </div>
                </b-collapse>
            </div>
        </b-collapse> -->
        <TransitionExpand>
            <div
                v-if="allHided && !selectedHided">
                <b-alert
                    class="py-1"
                    variant="warning"
                    show>
                    Los filtros activos sobre la tabla están ocultando todos sus elementos
                </b-alert>
            </div>
        </TransitionExpand>
        <!-- Row with the tags -->
        <b-row align-v="end" class="mb-3" no-gutters>
            <b-col>
                <b-form-tags
                    class="filter-form-tags p-0"
                    no-outer-focus
                    v-model="filterTags">
                    <template>
                        <b-form-text>Filtros activos:</b-form-text>
                        <b-form-tag
                            class="filter-tag mr-1 mt-1"
                            size="sm"
                            v-for="tag in filterTags"
                            :key="tag"
                            :variant="months.includes(tag) ? 'info' : btnStates.includes(tag) ? 'secondary' : btnPayTypes.includes(tag) ? 'dark' : Object.values(btnTypes).some(btn => btn.text == tag) ? 'warning' : 'primary'"
                            @remove="deleteTag(tag)">
                            <!-- @remove="deleteTag(tag); cancelEdit()"> -->
                            {{ tag }}
                        </b-form-tag>
                        <!-- Shown when a range of dateconfirmed is selected -->
                        <b-form-tag
                            class="filter-tag mt-1 tag-dateconfirmed"
                            variant="success"
                            v-if="dateCreationRange.startDate != null && dateCreationRange.endDate != null"
                            @remove="dateCreationRange.startDate = null; dateCreationRange.endDate = null;">
                            Fecha de creación
                        </b-form-tag>
                        <!-- Shown when a range of dateconfirmed is selected -->
                        <b-form-tag
                            class="filter-tag mt-1 tag-dateconfirmed"
                            variant="primary"
                            v-if="dateConfirmationRange.startDate != null && dateConfirmationRange.endDate != null"
                            @remove="dateConfirmationRange.startDate = null; dateConfirmationRange.endDate = null;">
                            Fecha de pago
                        </b-form-tag>
                        <!-- Shown when there are no tags added to the v-model of tags -->
                        <b-form-tag
                            class="filter-tag mt-1 tag-ninguno"
                            disabled
                            variant="secondary"
                            v-if="filterTags.length == 0 && paymentsSearch == '' && !allSelected && (dateCreationRange.startDate == null && dateCreationRange.endDate == null) && (dateConfirmationRange.startDate == null && dateConfirmationRange.endDate == null)">
                            Ninguno
                        </b-form-tag>
                        <!-- It will be shown when the flag wich indicates that we want to show all the selected rows on the table is true and only at the main payments page -->
                        <b-form-tag
                            class="filter-tag mr-1 mt-1"
                            variant="primary"
                            v-if="allSelected && $route.name == 'payments.index'"
                            @remove="allSelected = false">
                            <!-- @remove="allSelected = false; cancelEdit()"> -->
                            Seleccionadas
                        </b-form-tag>
                        <!-- It will show the content of the input wich filters the table data -->
                        <b-form-tag
                            class="filter-tag mt-1"
                            variant="danger"
                            v-if="paymentsSearch != ''"
                            @remove="paymentsSearch = ''">
                            {{ paymentsSearch }}
                        </b-form-tag>
                    </template>
                </b-form-tags>
            </b-col>
        </b-row>
        <!-- Row with the filters for the table -->
        <b-row class="mb-2 mx-0 no-gutters">
            <b-dropdown
                class="col col-auto col-md ig-dropdown ig-dropdown-horizontal mr-1 mt-1"
                no-caret
                size="sm"
                variant="outline-primary"
                v-if="filters == null || filters.includes('interval')">
                <template #button-content>
                    <b-row class="flex-nowrap" no-gutters>
                        <b-col>
                            Periodo del pago
                        </b-col>
                        <b-col cols="2">
                            <fa-icon icon="caret-down"></fa-icon>
                        </b-col>
                    </b-row>
                </template>
                <b-dropdown-form>
                    <b-form-group class="mb-1" label="Año">
                        <b-form-checkbox-group
                            buttons
                            button-variant="outline-primary"
                            size="sm"
                            v-model="getSelectedYear">
                            <b-form-checkbox
                                class="ig-dropdown-item"
                                v-for="btn in btnYears"
                                :key="btn"
                                :value="btn"
                                @change.native="addTags(btn)">
                                {{ btn }}
                            </b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                    <b-form-group class="mb-1" label="Mes">
                        <b-form-checkbox-group
                            buttons
                            button-variant="outline-info"
                            class="flex-wrap"
                            name="month-selected"
                            size="sm"
                            v-model="getSelectedMonth">
                            <b-form-checkbox
                                class="ig-dropdown-item"
                                v-for="btn in btnMonths"
                                :key="btn.value"
                                :value="btn.value"
                                @change.native="addTags(btn.value, 'month')">
                                {{ btn.text }}
                            </b-form-checkbox>
                            <!-- :title="ctnArray.filter(el => getSelectedYear.includes($moment(el['interval'], 'YYYY-MM').year()) && $moment(el['interval'], 'YYYY-MM').month() == btn.value).length == 0 ? 'Sin datos' : 'Selecciona'" -->
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-dropdown-form>
            </b-dropdown>
            <b-dropdown
                class="col col-auto col-md ig-dropdown mr-1 mt-1"
                no-caret
                size="sm"
                variant="outline-secondary"
                v-if="filters == null || filters.includes('status')">
                <template #button-content>
                    <b-row class="flex-nowrap" no-gutters>
                        <b-col>
                            Estado del pago
                        </b-col>
                        <b-col cols="2">
                            <fa-icon icon="caret-down"></fa-icon>
                        </b-col>
                    </b-row>
                </template>
                <b-dropdown-form>
                    <b-form-checkbox-group
                        buttons
                        button-variant="outline-secondary"
                        size="sm"
                        stacked
                        v-model="getSelectedState">
                        <b-form-checkbox
                            class="ig-dropdown-item"
                            v-for="btn in btnStates"
                            :key="btn"
                            :value="btn"
                            @change.native="addTags(btn)">
                            {{ btn }}
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-dropdown-form>
            </b-dropdown>
            <b-dropdown
                class="col col-auto col-md ig-dropdown mr-1 mt-1"
                no-caret
                size="sm"
                variant="outline-dark"
                v-if="filters == null || filters.includes('paymenttype')">
                <template #button-content>
                    <b-row class="flex-nowrap" no-gutters>
                        <b-col>
                            Forma de pago
                        </b-col>
                        <b-col cols="2">
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
                        v-model="getSelectedPayType">
                        <b-form-checkbox
                            class="ig-dropdown-item"
                            v-for="btn in btnPayTypes"
                            :key="btn"
                            :value="btn"
                            @change.native="addTags(btn)">
                            {{ btn }}
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-dropdown-form>
            </b-dropdown>
            <b-dropdown
                class="col col-auto col-md ig-dropdown mr-1 mt-1"
                no-caret
                size="sm"
                variant="outline-warning"
                v-if="filters == null || filters.includes('type')">
                <template #button-content>
                    <b-row class="flex-nowrap" no-gutters>
                        <b-col>
                            Tipo
                        </b-col>
                        <b-col cols="2">
                            <fa-icon icon="caret-down"></fa-icon>
                        </b-col>
                    </b-row>
                </template>
                <b-dropdown-form>
                    <b-form-checkbox-group
                        buttons
                        button-variant="outline-warning"
                        size="sm"
                        stacked
                        v-model="getSelectedType">
                        <b-form-checkbox
                            class="ig-dropdown-item"
                            v-for="btn in btnTypes"
                            :key="btn.text"
                            :value="btn.value"
                            @change.native="addTags(btn.text)">
                            {{ btn.text }}
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-dropdown-form>
            </b-dropdown>
            <DateRangePicker
                class="col col-auto ig-dropdown mr-1 mt-1"
                control-container-class="btn btn-outline-success btn-sm date-range-payments"
                minDate="2020/01/01 00:00:00"
                maxDate="2999/12/31 23:59:59"
                opens="left"
                ref="picker"
                v-if="filters == null || filters.includes('creationdate')"
                v-model="dateCreationRange"
                :auto-apply="true"
                :linkedCalendars="true"
                :locale-data="dateLocaleData"
                :showDropdowns="true"
                :time-picker="true"
                @update="dateCreationRangeSelected($event)">
                <template
                    #input="picker">
                    <b-row>
                        <b-col class="text-nowrap" cols="10">
                            {{ !picker.startDate || !picker.endDate ? 'Fecha de creación...' : 'Fecha de creación:  ' + $moment(picker.startDate).format('DD/MM/YYYY') + ' - ' + $moment(picker.endDate).format('DD/MM/YYYY') }}
                        </b-col>
                        <b-col class="pl-1" cols="2">
                            <fa-icon icon="caret-down"></fa-icon>
                        </b-col>
                    </b-row>
                </template>
                <template
                    #ranges>
                    <b-col>
                        <b-button
                            class="m-1"
                            size="sm"
                            :variant="btn.text == 'Limpiar' ? 'outline-danger' : 'outline-success'"
                            v-for="btn in dateRangeButtons"
                            :key="btn.text"
                            @click="dateCreationRangeSelected({ startDate: btn.startDate, endDate: btn.endDate })">
                            {{ btn.text }}
                        </b-button>
                    </b-col>
                </template>
            </DateRangePicker>
            <DateRangePicker
                class="col col-auto ig-dropdown mt-1"
                control-container-class="btn btn-outline-primary btn-sm date-range-payments"
                minDate="2020/01/01 00:00:00"
                maxDate="2999/12/31 23:59:59"
                opens="left"
                ref="picker"
                v-if="filters == null || filters.includes('confirmationdate')"
                v-model="dateConfirmationRange"
                :auto-apply="true"
                :linkedCalendars="true"
                :locale-data="dateLocaleData"
                :showDropdowns="true"
                :time-picker="true"
                @update="dateConfirmationRangeSelected($event)">
                <template
                    #input="picker">
                    <b-row>
                        <b-col class="text-nowrap" cols="10">
                            {{ !picker.startDate || !picker.endDate ? 'Fecha de confirmación...' : 'Fecha de confirmación:  ' + $moment(picker.startDate).format('DD/MM/YYYY') + ' - ' + $moment(picker.endDate).format('DD/MM/YYYY') }}
                        </b-col>
                        <b-col class="pl-1" cols="2">
                            <fa-icon icon="caret-down"></fa-icon>
                        </b-col>
                    </b-row>
                </template>
                <template
                    #ranges>
                    <b-col>
                        <b-button
                            class="m-1"
                            size="sm"
                            :variant="btn.text == 'Limpiar' ? 'outline-danger' : 'outline-primary'"
                            v-for="btn in dateRangeButtons"
                            :key="btn.text"
                            @click="dateConfirmationRangeSelected({ startDate: btn.startDate, endDate: btn.endDate })">
                            {{ btn.text }}
                        </b-button>
                    </b-col>
                </template>
            </DateRangePicker>
        </b-row>
        <b-row
            class="mb-2 row-busqueda-table"
            no-gutters>
            <b-col class="mt-1 mr-1 px-0" cols="12" sm>
                <b-form-input
                    debounce="200"
                    id="table-pagos-search"
                    size="sm"
                    placeholder="Buscar en la tabla..."
                    type="search"
                    v-if="filters == null || filters.includes('textfilter')"
                    v-model="paymentsSearch"></b-form-input>
                    <!-- @keyup="fetchChartData()"></b-form-input> -->
            </b-col>
            <!-- Shown only on the main payments page -->
            <span
                class="col col-auto mr-1 mt-1 px-0"
                tabindex="0"
                v-b-tooltip.hover.noninteractive
                v-if="$route.name == 'payments.index'"
                :title="rowsSelected.length == 0 ? 'No hay ninguna fila seleccionado' : 'Mostrar solo las filas seleccionadas'">
                <!-- It will be disabled when no rows are selected -->
                <b-button
                    id="payments-seleccionadas-btn"
                    class="px-1"
                    size="sm"
                    variant="outline-dark"
                    v-b-tooltip.hover.noninteractive
                    :disabled="rowsSelected.length == 0"
                    @click="allSelected = true">
                    Seleccionadas
                </b-button>
            </span>
            <b-col class="ml-auto ml-sm-0 mt-1" cols="auto">
                <ButtonIcon
                    class="btn-fa-tiny"
                    icon="sync-alt"
                    no-text
                    size="sm"
                    title="Restablecer los filtros"
                    variant="outline-warning"
                    v-b-tooltip.hover.noninteractive
                    @click="resetFilters()">
                </ButtonIcon>
                <!-- Show all row details button -->
                <span
                    class="ml-1"
                    tabindex="0"
                    v-b-tooltip.hover.noninteractive
                    :title="paymentsItems.length == 0 ? 'No hay datos en la tabla' : 'Mostrar detalles de todas las filas'">
                    <!-- Disabled when the table hasn't content or if all the existing rows are showing their details -->
                    <ButtonIcon
                        class="btn-fa-tiny"
                        icon="angle-double-down"
                        no-text
                        size="sm"
                        :disabled="paymentsItems.length == 0 || paymentsItems.every(pt => pt._showDetails == true)"
                        :variant="paymentsItems.length == 0 || paymentsItems.every(pt => pt._showDetails == true) ? 'outline-info' : 'info'"
                        @click="detailsExpandAll()">
                    </ButtonIcon>
                </span>
                <!-- Hide all row details button -->
                <span
                    class="mr-1"
                    tabindex="0"
                    v-b-tooltip.hover.noninteractive
                    :title="paymentsItems.length == 0 ? 'No hay datos en la tabla' : 'Ocultar detalles de todas las filas'">
                    <!-- Disabled when the table hasn't content or if all the existing rows aren't showing their details -->
                    <ButtonIcon
                        class="btn-fa-tiny"
                        icon="angle-double-up"
                        no-text
                        size="sm"
                        :disabled="paymentsItems.length == 0 || !paymentsItems.some(pt => pt._showDetails == true)"
                        :variant="paymentsItems.length == 0 || !paymentsItems.some(pt => pt._showDetails == true) ? 'outline-secondary' : 'secondary'"
                        @click="detailsCollapseAll()">
                    </ButtonIcon>
                </span>
                <span
                    class="d-inline-block"
                    tabindex="0"
                    v-b-tooltip.hover.noninteractive.topleft
                    :title="($refs.paymentsTable && $refs.paymentsTable.filteredItems.length == 0) ? 'No hay datos en la tabla para descargar' : csvDownloadTable ? 'Descargando...' : 'Descargar los datos de la tabla'">
                    <!-- It will be disabled when there are no rows on the table or if the flag wich controls the download of the file is on -->
                    <ButtonIcon
                        class="btn-fa-tiny"
                        icon="download"
                        no-text
                        size="sm"
                        variant="outline-success"
                        :disabled="($refs.paymentsTable && $refs.paymentsTable.filteredItems.length == 0) || csvDownloadTable"
                        :spin="csvDownloadTable == true"
                        @click="$tableToCsv(['_id', 'customerNumber', 'name', 'rate', 'amount', 'paymenttype', 'iban', 'interval', 'dateconfirmed'], paymentsItems, $moment().format('YYYY-MM-DD_HH.mm.ss') + '_pagos_tabla.csv', 'csvDownloadTable')">
                    </ButtonIcon>
                </span>
            </b-col>
        </b-row>
        <!-- Main table -->
        <div>
            <b-table
                bordered
                id="paymentsTable"
                fixed
                no-select-on-click
                ref="paymentsTable"
                responsive="lg"
                select-mode="multi"
                selectable
                show-empty
                small
                striped
                :busy="paymentsTableBusy"
                :current-page="paymentsTablePagination"
                :fields="tableFields"
                :filter="paymentsSearch"
                :filter-function="filterTable"
                :items="paymentsItems"
                :per-page="perPage">
                <!-- sticky-header="10000px" -> causes that the head elements cannot to be focused -->
                <!-- :tbody-transition-props="{ mode: 'out-in', name: 'fade' }"> will cause jumps between filtered states -->
                <template
                    #head(selected)>
                    <ButtonIcon
                        no-text
                        :class="'ig-table-checkbox' + (selectedAll ? ' ig-checked' : '')"
                        :icon="selectedAll ? 'check' : selectedSome ? 'circle' : ''"
                        @click="rowSelectAll(!selectedAll)">
                    </ButtonIcon>
                </template>
                <!-- The selected elems are managed locally, don't depend on vuex and the table events, it will be evaluated by local functions -->
                <template
                    #cell(selected)="row">
                    <span
                        v-b-tooltip.hover.noninteractive
                        :title="confirming || manualDownload ? evaluateRowSelectedBtn(row.item).title : ''">
                        <!-- :title="confirming && (row.item.status != 'Pendiente' || row.item.paymenttype != 'Domiciliación') ? 'Este pago no se puede confirmar. El estado no es Pendiente y/o la forma de pago Domiciliación' : confirming && row.item.type == 'periodic' && getFilteredPaymentsById({ _id: row.item._id, filterYears: [$moment(row.item.interval, 'YYYY-MM').year()], filterMonths: [$moment(row.item.interval, 'YYYY-MM').month()], filterStatus: ['Confirmado'], filterType: ['periodic'] }).length > 0 ? 'Este pago no se puede confirmar. Ya existe un pago periódico confirmado para el mismo intervalo' : (manualDownload && (row.item.paymenttype != 'Domiciliación' || (row.item.status != 'Pendiente' && row.item.paymenttype == 'Domiciliación'))) ? 'No puedes descargar archivo de remesa de un pago que no sea por domiciliación o si lo es, que esté pendiente' : ''"> -->
                        <ButtonIcon
                            no-text
                            :class="'ig-table-checkbox' + (isSelected(row.item) ? ' ig-checked' : '')"
                            :disabled="confirming || manualDownload ? evaluateRowSelectedBtn(row.item).disabled : false"
                            :icon="isSelected(row.item) ? 'check' : ''"
                            @click="rowSelect(row.item, !isSelected(row.item))">
                        </ButtonIcon>
                            <!-- :disabled="(confirming && ((row.item.status != 'Pendiente' || row.item.paymenttype != 'Domiciliación') || (row.item.type == 'periodic' &&  getFilteredPaymentsById({ _id: row.item._id, filterYears: [$moment(row.item.interval, 'YYYY-MM').year()], filterMonths: [$moment(row.item.interval, 'YYYY-MM').month()], filterStatus: ['Confirmado'], filterType: ['periodic'] }).length > 0))) || (manualDownload && (row.item.paymenttype != 'Domiciliación' || (row.item.status != 'Pendiente' && row.item.paymenttype == 'Domiciliación')))" -->
                    </span>
                </template>
                <template
                    #cell(active)="row">
                    <b-form-checkbox
                        disabled
                        switch
                        v-model="row.value"></b-form-checkbox>
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
                    #cell(rate)="row">
                    <div
                        class="pl-1 table-text-overflowed text-nowrap"
                        :title="row.value">
                        {{ row.value }}
                    </div>
                </template>
                <template
                    #cell(status)="row">
                    <span
                        :class="row.value == 'Pendiente' ? 'text-warning' : row.value == 'Devuelto' ? 'text-danger' : ''">
                        {{ row.value }}
                    </span>
                </template>
                <template
                    #cell(amount)="row">
                    <span>
                        {{ row.value + '€'}}
                    </span>
                </template>
                <template
                    #cell(type)="row">
                    {{ row.value == 'periodic' ? 'Periódico' : 'Manual' }}
                </template>
                <template
                    #cell(actions)="row">
                    <ButtonIcon
                        class="ig-small-btn"
                        icon="edit"
                        no-text
                        size="sm"
                        title="Editar el pago"
                        variant="outline-secondary"
                        v-b-tooltip.hover.left.noninteractive
                        :id="'tooltip_edit_row' + row.index"
                        @click="manageEdit(row.item)">
                    </ButtonIcon>
                    <span
                        class="d-inline-block"
                        tabindex="0"
                        v-b-tooltip.hover.left.noninteractive
                        :title="row.item.status != 'Confirmado' ? 'Pago no realizado' : 'Descargar recibo'">
                        <ButtonIcon
                            class="ig-small-btn"
                            icon="file-download"
                            no-text
                            size="sm"
                            variant="outline-dark"
                            :disabled="row.item.status != 'Confirmado'"
                            @click="printBill(row.item)">
                        </ButtonIcon>
                    </span>
                    <ButtonIcon
                        class="ig-small-btn"
                        no-text
                        size="sm"
                        v-b-tooltip.hover.left.noninteractive
                        :icon="!row.item._showDetails ? 'angle-double-down' : 'angle-double-up'"
                        :title="!row.item._showDetails ? 'Mostrar detalles' : 'Ocultar detalles'"
                        :variant="!row.item._showDetails ? 'outline-info' : 'info'"
                        @click="row.toggleDetails">
                    </ButtonIcon>
                </template>
                <template
                    #cell(use)="row">
                    <slot
                        name="use"
                        :row="row">
                        <b-button
                            class="ig-modal-table-btn"
                            size="sm"
                            variant="outline-primary"
                            @click="$emit('choose', row.item)">
                            Usar
                        </b-button>
                    </slot>
                </template>
                <!-- Shown only when other procedures are not initiated -->
                <template
                    #row-details="row">
                    <div class="p-2">
                        <b-row>
                            <b-col cols="6">
                                <b-row
                                    v-for="(field, idx) in detailFields"
                                    :key="idx">
                                    <b-col cols="4" class="text-nowrap">
                                        <span class="text-muted">{{ field.key }}:</span>
                                    </b-col>
                                    <b-col>{{ field.value == 'dateconfirmed' && (row.item.dateconfirmed == null || row.item.dateconfirmed == '') ? 'El pago aún no está confirmado' : row.item[field.value] }}</b-col>
                                </b-row>
                            </b-col>
                            <b-col
                                cols="6"
                                v-if="row.item.paymenttype == 'Domiciliación'">
                                <b-row>
                                    <b-col>
                                        <span class="text-muted text-nowrap"><u>Datos bancarios</u></span>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col cols="4">
                                        <span class="text-muted text-nowrap">IBAN:</span>
                                    </b-col>
                                    <b-col>{{ row.item.iban }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col cols="4">
                                        <span class="text-muted text-nowrap">Nombre del titular:</span>
                                    </b-col>
                                    <b-col>{{ row.item.ibanownername }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col cols="4">
                                        <span class="text-muted text-nowrap">Dni del titular:</span>
                                    </b-col>
                                    <b-col>{{ row.item.ibanownerdni }}</b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                    </div>
                </template>
                <template
                    #table-colgroup="scope">
                    <slot
                        name="col"
                        v-bind:fields="scope.fields">
                        <col
                            v-for="field in scope.fields"
                            :key="field.key"
                            :style="{ width: field.key == 'name' ? '200px' : field.key == 'active' ? '60px' : field.key == 'use' ? '50px' : field.key == 'selected' ? '30px' : field.key == 'amount' || field.key == 'type' || field.key == 'interval' ? '70px' : field.key == 'actions' ? '125px' : field.key == 'paymenttype' ? '110px' : field.key == 'status' ? '90px' : field.key == 'rate' ? '150px' :  field.key == 'dateconfirmed' ? '180px' : field.key == 'customerNumber' ? '75px' : 'auto' }">
                    </slot>
                </template>
                <template
                    #table-caption>
                    <b-row align-h="between" no-gutters>
                        <!-- Shown only at the main payments page -->
                        <b-col
                            v-if="$route.name == 'payments.index' && !lite"
                            :cols="$refs.paymentsTable && $refs.paymentsTable.isFiltered && ($refs.paymentsTable.filteredItems.length > perPage || paymentsItems.length > perPage) ? 6 : 'auto'">
                            <p>
                                La tabla solo muestra los socios activos. Mostrar los inactivos
                                <b-form-checkbox
                                    class="d-inline custom inline-switch"
                                    size="sm"
                                    switch
                                    v-model="inactives"></b-form-checkbox>
                                    <!-- @change="cancelEdit()"></b-form-checkbox> -->
                            </p>
                            Filas seleccionadas:
                            <AnimatedNum
                                :numFounded="rowsSelected.length"></AnimatedNum>
                            <br>
                            Filas totales: {{ $refs.paymentsTable && $refs.paymentsTable.isFiltered ? $refs.paymentsTable.filteredItems.length : paymentsItems.length }}
                            <!-- <AnimatedNum
                                :numFounded="$refs.paymentsTable && $refs.paymentsTable.isFiltered ? $refs.paymentsTable.filteredItems.length : paymentsItems.length"></AnimatedNum> -->
                        </b-col>
                        <b-col align-self="end">
                            <b-pagination
                                aria-controls="paymentsTable"
                                class="float-right"
                                size="sm"
                                v-model="paymentsTablePagination"
                                v-if="$refs.paymentsTable && $refs.paymentsTable.isFiltered ? $refs.paymentsTable.filteredItems.length > perPage : paymentsItems.length > perPage"
                                :per-page="perPage"
                                :total-rows="$refs.paymentsTable && $refs.paymentsTable.isFiltered ? $refs.paymentsTable.filteredItems.length : paymentsItems.length"></b-pagination>
                        </b-col>
                    </b-row>
                </template>
                <template
                    #table-busy>
                    <div class="text-center my-2">
                        <b-spinner class="align-middle" type="grow" variant="secondary"></b-spinner>
                    </div>
                </template>
                <!-- It will be shown when the table hasn't rows because the filters have emptied it -->
                <template
                    #empty>
                    <b-form-text>
                        No hay pagos con estos criterios
                    </b-form-text>
                </template>
                <template
                    #emptyfiltered>
                    <b-form-text>
                        Ningún registro coincide con tu búsqueda
                    </b-form-text>
                </template>
            </b-table>
            <!-- Payments edit action -->
            <PaymentEdit
                :editingItem="editingItem"
                @successEdit="evaluateRowSelectedState(...arguments)"></PaymentEdit>
                <!-- @successEdit="evaluateRowSelectedState(...arguments); fetchChartData();"></PaymentEdit> -->
        </div>
        <!-- Hided printable bill -->
        <div class="printable-wrp">
            <div class="pr-1 printable-ctn" ref="printableNPB">
                <Bill
                    v-if="print"
                    :customer="printCustomer"
                    :printItem="printItem"></Bill>
            </div>
        </div>
    </div>
</template>
<script>
    import { http } from '../utils/http';
    import BarChart from '../charts/BarChart.vue';
    import DateRangePicker from 'vue2-daterange-picker'; /* https://innologica.github.io/vue2-daterange-picker/#props */
    import LineChart from '../charts/LineChart.vue';
    import { mapActions, mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css' /* https://innologica.github.io/vue2-daterange-picker/#props */
    import * as WzdSteps from './wzdsteps/payments';
    const QS = require('qs'); /* Needed at axios.post function to pass arrays as params to the controller */
    const SPECIAL_CHARACTERS = { 'Ã': 'A', 'À': 'A', 'Á': 'A', 'Ä': 'A', 'Â': 'A', 'È': 'E', 'É': 'E', 'Ë': 'E', 'Ê': 'E', 'Ì': 'I', 'Í': 'I', 'Ï': 'I', 'Î': 'I', 'Ò': 'O', 'Ó': 'O', 'Ö': 'O', 'Ô': 'O', 'Ù': 'U', 'Ú': 'U', 'Ü': 'U', 'Û': 'U', 'ã': 'a', 'à': 'a', 'á': 'a', 'ä': 'a', 'â': 'a', 'è': 'e', 'é': 'e', 'ë': 'e', 'ê': 'e', 'ì': 'i', 'í': 'i', 'ï': 'i', 'î': 'i', 'ò': 'o', 'ó': 'o', 'ö': 'o', 'ô': 'o', 'ù': 'u', 'ú': 'u', 'ü': 'u', 'û': 'u', 'Ñ': 'N', 'ñ': 'n', 'Ç': 'c', 'ç': 'c' };
    export default {
        components: { BarChart, DateRangePicker, LineChart },
        data() {
            return {
                allSelected: false, /* Flag to obtain only the selected elements on the table */
                btnMonths: [
                    { text: 'Enero', value: 0, },
                    { text: 'Febrero', value: 1, },
                    { text: 'Marzo', value: 2, },
                    { text: 'Abril', value: 3, },
                    { text: 'Mayo', value: 4, },
                    { text: 'Junio', value: 5, },
                    { text: 'Julio', value: 6, },
                    { text: 'Agosto', value: 7, },
                    { text: 'Septiembre', value: 8, },
                    { text: 'Octubre', value: 9, },
                    { text: 'Noviembre', value: 10, },
                    { text: 'Diciembre' ,value: 11, },
                ], /* Data for a b-checkbox-group with the selectable months and its values to show it on the view, it is used to apply filters on the table data */
                btnPayTypes: [ 'Efectivo', 'Tarjeta', 'Domiciliación' ], /* The selectable pay types to show it on the view, it is used to apply filters on the table data */
                btnTypes: [
                    { text: 'Periódico', value: 'periodic' },
                    { text: 'Manual', value: 'manual' }
                ], /* The selectable pay types to show it on the view, it is used to apply filters on the table data */
                btnStates: [ 'Confirmado', 'Pendiente', 'Devuelto' ], /* The selectable states to show it on the view, it is used to apply filters on the table data */
                btnYears: [], /* Data to show on a b-form-checkbox with the selectable years, the years will be calculated based on the data stored on the database. It is used to apply filters on the table data */
                chartIngresosTotalData: {}, /* Chart data */
                chartIngresosTotalOptions: {
                    animation: {
                        ease: 'easeInOutBounce',
                    },
                    legend: {
                        position: 'bottom',
                    },
                    maintainAspectRatio: false,
                    responsive:true,
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,
                            },
                        }],
                        yAxes: [{
                            id: 'left',
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        }, {
                            id: 'right',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        }]
                    },
                    tooltips: {
						intersect: true,
					},
                }, /* Chart options */
                chartPagosTipoData: {}, /* Chart data */
                chartPagosTipoOptions: {
                    animation: {
                        ease: 'easeInOutBounce',
                    },
                    legend: {
                        position: 'bottom',
                    },
                    maintainAspectRatio: false,
                    responsive:true,
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,
                            },
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            }
                        }]
                    },
                    tooltips: {
						intersect: true,
					},
                }, /* Chart options */
                chartPagosTotalData: {}, /* Chart data */
                chartPagosTotalOptions: {
                    animation: {
                        ease: 'easeInOutBounce',
                    },
                    legend: {
                        position: 'bottom',
                    },
                    maintainAspectRatio: false,
                    responsive:true,
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,
                            },
                        }],
                        yAxes: [{
                            id: 'left',
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        }, {
                            id: 'right',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        }]
                    },
                    tooltips: {
						intersect: true,
					},
                }, /* Chart options */
                csvDownloadManual: false, /* Flag to conditional render an spinner or icon on the manual download button */
                csvDownloadTable: false, /* Flag to conditional render an spinner or icon on a manual print table button */
                editingItem: {}, /* Stores the data of a row when it is edited to allow recover it */
                dateLocaleData: {
                    format: 'YYYY/MM/DD HH:mm:ss',
                    separator: ' - ',
                    daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                    monthNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    firstDay: 1
                }, /* Parameters to the datepicker */
                dateCreationRange: {
                    startDate: null /* this.$moment().startOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                    endDate: null /* this.$moment().endOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                }, /* V-model for the creation date filter */
                dateConfirmationRange: {
                    startDate: null /* this.$moment().startOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                    endDate: null /* this.$moment().endOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                }, /* V-model for the confirmation date filter */
                dateRangeButtons: [
                    { text: "Limpiar", startDate: null, endDate: null },
                    { text: "Hoy", startDate: this.$moment().startOf('day').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().endOf('day').format('YYYY/MM/DD HH:mm:ss') },
                    { text: "Ayer", startDate: this.$moment().subtract(1, 'days').startOf('day').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().subtract(1, 'days').endOf('day').format('YYYY/MM/DD HH:mm:ss') },
                    { text: "Esta semana", startDate: this.$moment().startOf('week').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().endOf('week').format('YYYY/MM/DD HH:mm:ss') },
                    { text: "Semana pasada", startDate: this.$moment().subtract(1, 'week').startOf('week').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().subtract(1, 'week').endOf('week').format('YYYY/MM/DD HH:mm:ss') },
                    { text: "Este mes", startDate: this.$moment().startOf('month').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().endOf('month').format('YYYY/MM/DD HH:mm:ss') },
                    { text: "Mes pasado", startDate: this.$moment().subtract(1, 'month').startOf('month').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().subtract(1, 'month').endOf('month').format('YYYY/MM/DD HH:mm:ss') },
                    { text: "Últimos 3 meses", startDate: this.$moment().subtract(2, 'months').startOf('month').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().endOf('month').format('YYYY/MM/DD HH:mm:ss') },
                    { text: "Este año", startDate: this.$moment().startOf('year').format('YYYY/MM/DD HH:mm:ss'), endDate: this.$moment().endOf('year').format('YYYY/MM/DD HH:mm:ss') },
                ], /* Objects to show different buttons to interact with the date picked */
                detailFields: [
                    { key: 'ID', value: '_id' },
                    { key: 'Número de socio', value: 'customerNumber' },
                    { key: 'Fecha de pago', value: 'dateconfirmed' },
                    { key: 'Fecha de creación', value: 'dategenerated' },
                ], /* Values to show on row-details */
                filterTags: [], /* v-model that contains the filters applied on the table */
                getSelectedDateConfirmed: '', /* v-model for a b-checkbox-group, it stores the dateconfirmed */
                getSelectedMonth: [this.$moment().month()], /* v-model for a b-checkbox-group, it stores the months selecteds to filter the data on the table */
                getSelectedDateConfirmed: [], /* v-model for a b-checkbox-group, it stores the pay type of the payments selecteds to filter the data on the table */
                getSelectedPayType: [], /* v-model for a b-checkbox-group, it stores the pay type of the payments selecteds to filter the data on the table */
                getSelectedType: [], /* v-model for a b-checkbox-group, it stores the type of the payments selecteds to filter the data on the table */
                getSelectedState: [], /* v-model for a b-checkbox-group, it stores the states of the payments selecteds to filter the data on the table */
                getSelectedYear: [this.$moment().year()], /* v-model for a b-checkbox-group, it stores the years selected to filter the data on the table */
                inactives: false, /* Flag to show or not the inactive customers */
                months: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ], /* Array used to convert the numbers to string */
                newStateSelected: false, /* v-model for a b-checkbox-group, acts like a flag to activate options on the confirming payments procedure */
                paymentsTableBusy: true, /* Flag to mark table as busy */
                paymentsTablePagination: 1, /* The pagination index of the table */
                print: false, /* Flag to activate the print component */
                printCustomer: null, /* The id of the customer to print a bill */
                printItem: null, /* The item used to print a bill */
                rowsSelected: [], /* Stores the selected rows of the table to manage some conditional rendering and states */
                paymentsSearch: '', /* v-model for the table input search */
            }
        },
        /**
         * Prevent leaving the page with editings open
         */
        beforeRouteLeave(to, from, next) {
            let answer = true;
            if (this.confirming || this.manualDownload || this.paymentsItems.some(el => el._showDetails == true)) {
                answer = confirm('No has guardado los cambios, ¿seguro que quieres salir?');
                if (!answer) {
                    next(false);
                }
            }
            if (answer) {
                /* End the open payments procedures at vuex */
                this.endProcedures('payments');
                /* Pause the validations before leave the page to prevent errors at assign the validation again to the reusable components */
                this.$validator.pause();
                next();
            }
        },
        computed: {
            ...mapGetters(['filterPayments', 'getCustomerById', 'getFilteredPaymentsAll', 'getFilteredPaymentsById', 'getPaymentsYears']),
            ...mapGetters('navbar', ['getProcedureState']),
            /**
             * Determines if all the payments avaiable are hided by the filters
             *
             * @retuns {Boolean} Boolean with the evaluation based on the table items and the items filtered
             */
            allHided() {
                return this.paymentsAll.length > 0 && this.paymentsItems.length == 0;
            },
            /**
             * v-model that indicates if the charts has been saw
             */
            collapseCharts: {
                get() {
                    return this.getProcedureState('paymentsCharts');
                },
                set(val) {
                    this.setProcedureState({ procedure: 'paymentsCharts', newVal: val });
                }
            },
            /**
             * v-model that indicates if the confiming process has been started (it will be setted Vuex and its changes will be tracked on a watcher)
             */
            confirming() {
                return this.getProcedureState('paymentsConfirming');
            },
            /**
             * v-model that indicates if the dowload process has been started (it will be setted Vuex and its changes will be tracked on a watcher)
             */
            manualDownload() {
                return this.getProcedureState('paymentsPrinting');
            },
            /**
             * Compute all the payments for each parent type
             *
             * @return {Array} Array with the paymets objects
             */
            paymentsAll() {
                /* If the items are provided from the parent */
                if (this.parentItems) {
                    return this.parentItems;
                /* If the parent provide and id to search the payments return its search */
                } else if (this.parentId) {
                    return this.getFilteredPaymentsById({ _id: this.parentId, inactives: true });
                }
                /* Else return all the payments without any filter */
                return this.getFilteredPaymentsAll({ filterYears: this.getSelectedYear, filterMonths: this.getSelectedMonth, filterStatus: this.getSelectedState, filterPaytype: this.getSelectedPayType, filterType: this.getSelectedType, creationRange: this.dateCreationRange, confirmationRange: this.dateConfirmationRange, inactives: this.inactives });
            },
            /**
             * Initialize the payments data from the store. Determine the value of local variables.
             *
             * @return {Array} Array with the objects-rows to the table
             */
            paymentsItems() {
                /* If the parent provides the items use it. If the parent provides the id then search the payments related with it. For this options always active the inactives flag (last param of the filter action call) to acquire all the payments of this customer althought is inactive (this options are provided from the customer profile or from payment print and always want to print this documents regardless of the state of the customer). If not parent id or items are provided acquire all the payments of every customer */
                let payments = this.parentItems ? this.filterPayments({ payments: this.parentItems, filterYears: this.getSelectedYear, filterMonths: this.getSelectedMonth, filterStatus: this.getSelectedState, filterPaytype: this.getSelectedPayType, filterType: this.getSelectedType, creationRange: this.dateCreationRange, confirmationRange: this.dateConfirmationRange, inactives: true }) : this.parentId ? this.getFilteredPaymentsById({ _id: this.parentId, filterYears: this.getSelectedYear, filterMonths: this.getSelectedMonth, filterStatus: this.getSelectedState, filterPaytype: this.getSelectedPayType, filterType: this.getSelectedType, creationRange: this.dateCreationRange, confirmationRange: this.dateConfirmationRange, inactives: true }) : this.getFilteredPaymentsAll({ filterYears: this.getSelectedYear, filterMonths: this.getSelectedMonth, filterStatus: this.getSelectedState, filterPaytype: this.getSelectedPayType, filterType: this.getSelectedType, creationRange: this.dateCreationRange, confirmationRange: this.dateConfirmationRange, inactives: this.inactives });
                if (this.allSelected) {
                    /* Get only the selected rows */
                    payments = payments.filter(payment => this.rowsSelected.some(rs => rs._id == payment._id && rs.payment_id == payment.payment_id) == true);
                }
                return payments;
            },
            /**
             * Table items per page
             */
            perPage() {
                /* If the parent provides a number of items per page use it */
                if (this.itemsPerPage) {
                    return this.itemsPerPage;
                }
                return 100;
            },
            /**
             * Determines if all the elements are selected under visible filtered elements on the table. This function is used at the simulated checkbox of the head at the col selected of the table
             *
             * @return {Boolean} Boolean to determine if all the elements of the table are selected
             */
            selectedAll() {
                const filteredItems = this.$refs.paymentsTable && this.$refs.paymentsTable.filteredItems;
                if (this.rowsSelected.length > 0 && filteredItems.length > 0) {
                    if (this.confirming || this.manualDownload) {
                        let usefulRows = filteredItems.filter(el => el.paymenttype == 'Domiciliación' && el.status == 'Pendiente');
                        if (this.confirming) {
                            usefulRows.filter(rowItem => this.getFilteredPaymentsById({ _id: rowItem._id, filterYears: [this.$moment(rowItem.interval, 'YYYY-MM').year()], filterMonths: [this.$moment(rowItem.interval, 'YYYY-MM').month()], filterStatus: ['Confirmado'], filterType: ['periodic'] }).length == 0);
                        }
                        return usefulRows.every(ur => this.rowsSelected.some(rs => rs._id == ur._id && rs.payment_id == ur.payment_id) == true);
                    }
                    if (!this.confirming && !this.manualDownload) {
                        return filteredItems.every(fi => this.rowsSelected.some(rs => rs._id == fi._id && rs.payment_id == fi.payment_id) == true);
                    }
                }
            },
            /**
             * Determines if some selected row has been hided by the filters applied
             *
             * @return {Boolean} Boolean that determines if some row has been hided by the filters applied
             */
            selectedHided() {
                const filteredItems = this.$refs.paymentsTable && this.$refs.paymentsTable.filteredItems;
                return this.rowsSelected.length > 0 && this.rowsSelected.some(rs => filteredItems.findIndex(fi => fi._id == rs._id && rs.payment_id == fi.payment_id) == -1);
            },
            /**
             * Determines if some row is selected
             *
             * @return {Boolean} Boolean to determina if some element has been selected
             */
            selectedSome() {
                const filteredItems = this.$refs.paymentsTable && this.$refs.paymentsTable.filteredItems;
                return this.rowsSelected.length > 0 && filteredItems.length > 0 && this.rowsSelected.length > 0;
            },
        },
        created() {
            /* Is not working for the v-overflown */
            // window.addEventListener('resize', () => { this.$forceUpdate() });
            /* Prevents leave the page when changes has been made */
            window.addEventListener('beforeunload', this.beforeUnload);
        },
        destroyed() {
            /* Destroy de listeners */
            window.removeEventListener('beforeunload', this.beforeUnload);
            /* Is not working for the v-overflown */
            // window.removeEventListener('resize', () => { this.$forceUpdate() });
        },
        inject: [
            '$validator', /* Inject the main $validator from the parent */
        ],
        methods: {
            ...mapActions(['fetchCustomerImages', 'updatePaymentData']),
            ...mapActions('navbar', ['endProcedures', 'setProcedureState']),
            /**
             * Function that add the tags to the array v-model. Is called when a filter on the table is selected and on the mounted hook to apply the current year and month
             *
             * @param {String|Integer} value: is the value of the selected filter applied to the table, on the months it will be an integer
             * @param {String} type: is the type of tag to add, is passed only from the months to select the value correctly
             */
            addTags(value, type = null) {
                /* Only the months need to be interpreted, the rest of tag are pushed as comes */
                let tag = type == 'month' ? this.months[value] : value;
                this.filterTags.includes(tag) ? this.filterTags.splice(this.filterTags.indexOf(tag), 1) : this.filterTags.push(tag);
            },
            /**
             * Prevent leave the page with changes unsaved
             *
             * @param {Event} ev: the event fired
             */
            beforeUnload(ev) {
                let answer = true;
                /* From Chrome 60 onward, the beforeunload dialog will only appear if the frame attempting to display it has received a user gesture or user interaction (or if any embedded frame has received such a gesture). Confirm with the user when a procedure is open or if a editing modal is open */
                if (this.confirming || this.manualDownload || document.getElementById('edit-payment-modal')) {
                    answer = confirm('No has guardado los cambios, ¿seguro que quieres salir?');
                    if (!answer) {
                        ev.preventDefault();
                        /* Chromium requires returnValue to stop the default propagation */
                        ev.returnValue = '';
                    }
                }
                if (answer) {
                    /* End the open payments procedures at vuex */
                    this.endProcedures('payments');
                    /* Pause the validations before leave the page to prevent errors at assign the validation again to the reusable components */
                    this.$validator.pause();
                }
            },
            /**
             * Mass confirmation of the payments on the payments.index route
             */
            confirmingState() {
                this.paymentsTableBusy = true;
                /* Update the payment on the db via vuex */
                this.updatePaymentData({ items: this.rowsSelected, action: this.newStateSelected })
                    .then(response => {
                        response.updated.forEach(item => {
                            /* Delete the selected row from the array of selected elements */
                            this.rowSelect(item, false);
                            /* Trigger a modification on the localStorage to propagate the changes on other windows */
                            /* This makes a lot of writes without much sense, not activated for now */
                            // localStorage.setItem('customer_updated', item._id);
                            // localStorage.removeItem('customer_updated');
                        });
                        if (response.interval_err.length > 0) {
                            let errors = response.interval_err;
                            let message = 'Los siguientes pagos no se han actualizado debido a que el intervalo coincide con otros pagos ya confirmados:'
                            errors.forEach(error => {
                                /* Delete the selected row from the array of selected elements */
                                this.rowSelect(error, false);
                                message += '<br><span class="text-danger">' + error.payment_id + '</span>'
                            });
                            const errorMessage = this.$createElement('div', { domProps: { innerHTML: message } });
                            /* If a validation error on the backend occurs, show the info on a modal */
                            this.$bvModal.msgBoxOk(errorMessage, {
                                buttonSize: 'sm',
                                centered: true,
                                okTitle: 'Aceptar',
                                title: 'Algunos pagos no se han actualizado',
                            });
                        }
                        /* Reset the used vars */
                        this.newStateSelected = false;
                        this.$showToast(response.status, response.message, 'Confirmación masiva de pagos');
                        /* Regenerate the charts data */
                        // this.fetchChartData();

                    })
                    .then(() => {
                        this.paymentsTableBusy = false;
                    })
                    .catch(error => {
                        this.$showToast('danger', 'No se ha podido completar la operación. Código de error: FEPa@CoSt', 'Ha ocurrido un error')
                        console.error(error.response ? error.response.data : error);
                    });
            },
            /**
             * Function to set the datepicker return value on update its range by the user interaction
             *
             * @param {Object} event with the date object composed by the start and end date.
             */
            dateCreationRangeSelected(date) {
                this.dateCreationRange.startDate = date.startDate == null ? date.startDate : this.$moment(date.startDate).format('YYYY/MM/DD HH:mm:ss');
                this.dateCreationRange.endDate = date.endDate == null ? date.endDate : this.$moment(date.endDate).format('YYYY/MM/DD HH:mm:ss');
            },
            /**
             * Function to set the datepicker return value on update its range by the user interaction
             *
             * @param {Object} event with the date object composed by the start and end date.
             */
            dateConfirmationRangeSelected(date) {
                this.dateConfirmationRange.startDate = date.startDate == null ? date.startDate : this.$moment(date.startDate).format('YYYY/MM/DD HH:mm:ss');
                this.dateConfirmationRange.endDate = date.endDate == null ? date.endDate : this.$moment(date.endDate).format('YYYY/MM/DD HH:mm:ss');
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
                if (this.getSelectedYear.indexOf(tag) != -1) {
                    this.getSelectedYear.splice(this.getSelectedYear.indexOf(tag), 1);
                } else if (this.months.indexOf(tag) != -1) {
                    this.getSelectedMonth.splice(this.getSelectedMonth.indexOf(this.months.indexOf(tag)), 1);
                } else if (this.btnStates.indexOf(tag) != -1) {
                    this.getSelectedState.splice(this.getSelectedState.indexOf(tag), 1);
                } else if (this.btnPayTypes.indexOf(tag) != -1) {
                    this.getSelectedPayType.splice(this.getSelectedPayType.indexOf(tag), 1);
                // } else if (this.btnTypes.indexOf(tag) != -1) {
                } else if (Object.values(this.btnTypes).some(btn => btn.text == tag)) {
                    const value = Object.values(this.btnTypes).find(btn => btn.text == tag).value;
                    this.getSelectedType.splice(this.getSelectedType.findIndex(btn => btn == value), 1);
                }
            },
            /**
             * Function to deactivate all the row details on the table paymentsTable
             */
            detailsCollapseAll() {
                this.paymentsItems.forEach(payment => {
                    this.$set(payment, '_showDetails', false);
                });
            },
            /**
             * Function to activate all the row details on the table paymentsTable
             */
            detailsExpandAll() {
                this.paymentsItems.forEach(payment => {
                    this.$set(payment, '_showDetails', true);
                });
            },
            /**
             * Evaluate if the selected rows are selectable on the process open. This function can be called on watch the status changes of the procedures start flags or when a payment of the table is edited and needs to be reconfirmed if its allowed to the process open
             *
             * @param {String} payment_id: is the payment_id of a payment updated, only provided when the function calls from a payment edit
             */
            evaluateRowSelectedState(payment_id = null) {
                if (payment_id) {
                    /* Update the payment on the array with the new data from the edit process */
                    this.rowsSelected = this.rowsSelected.map(rs => rs.payment_id == payment_id ? this.paymentsAll.find(pa => pa.payment_id == payment_id) : rs);
                }
                /* Filter the payments that has the status 'Pendiente' and the pay type is 'Domiciliación'. If the procedure actived is 'confiming' also check if exists a confirmed payment for the same interval of a pending payment */
                this.rowsSelected = this.rowsSelected.filter(rs => (this.confirming || this.manualDownload) && (rs.paymenttype == 'Domiciliación' && rs.status == 'Pendiente') && ((this.confirming && this.getFilteredPaymentsById({ _id: rs._id, filterYears: [this.$moment(rs.interval, 'YYYY-MM').year()], filterMonths: [this.$moment(rs.interval, 'YYYY-MM').month()], filterStatus: ['Confirmado'], filterType: ['periodic'] }).length == 0) || this.manualDownload));
            },
            /**
             * Evaluate the status and the title props of every row checkbox when a procedure is started
             *
             * @param {Object} rowItem: contains the row data
             */
            evaluateRowSelectedBtn(rowItem) {
                let result = {
                    disabled: false,
                    title: '',
                };
                if (this.confirming && (rowItem.status != 'Pendiente' || rowItem.paymenttype != 'Domiciliación')) {
                    result.title = 'Este pago no se puede confirmar. El estado no es Pendiente y/o la forma de pago Domiciliación';
                    result.disabled = true;
                }
                if (this.confirming && rowItem.type == 'periodic' && this.getFilteredPaymentsById({ _id: rowItem._id, filterYears: [this.$moment(rowItem.interval, 'YYYY-MM').year()], filterMonths: [this.$moment(rowItem.interval, 'YYYY-MM').month()], filterStatus: ['Confirmado'], filterType: ['periodic'] }).length > 0) {
                    result.title = 'Este pago no se puede confirmar. Ya existe un pago periódico confirmado para el mismo intervalo';
                    result.disabled = true;
                }
                if (this.manualDownload && (rowItem.paymenttype != 'Domiciliación' || (rowItem.status != 'Pendiente' && rowItem.paymenttype == 'Domiciliación'))) {
                    result.title = 'No puedes descargar archivo de remesa de un pago que no sea por domiciliación o si lo es, que esté pendiente';
                    result.disabled = true;
                }
                return result;
            },
            /**
             * Function that fetch the chart data with the table data. The data can be generated inside of the function when is called from a initial load of the table data or can be passed as a param when is called from an update of the table data
             */
            fetchChartData() {
                let auxDatos = this.generateChartData();
                let datos = auxDatos[0];
                let datosTotales = auxDatos[1];
                let auxDomDev = [],
                    auxDomPen = [],
                    auxDomPag = [],
                    auxEfePen = [],
                    auxEfePag = [],
                    auxTarPen = [],
                    auxTarPag = [],
                    totalIngresos = [],
                    totalIngresosPerdidos = [],
                    totalPagosCompletados = [],
                    totalPagosPendientes = [],
                    totalSocios = [];
                for (let i = 0; i <= 11; i++) {
                    auxDomDev.push(datos.months[i].domiciliacion.devuelto);
                    auxDomPen.push(datos.months[i].domiciliacion.pendiente);
                    auxDomPag.push(datos.months[i].domiciliacion.pagado);
                    auxEfePen.push(datos.months[i].efectivo.pendiente);
                    auxEfePag.push(datos.months[i].efectivo.pagado);
                    auxTarPen.push(datos.months[i].tarjeta.pendiente);
                    auxTarPag.push(datos.months[i].tarjeta.pagado);
                    totalIngresos.push(datosTotales.months[i].totalIngresos);
                    totalIngresosPerdidos.push(datosTotales.months[i].totalIngresosPerdidos);
                    totalPagosCompletados.push(datosTotales.months[i].totalPagosCompletados);
                    totalPagosPendientes.push(datosTotales.months[i].totalPagosPendientes);
                    totalSocios.push(datosTotales.months[i].totalSocios);
                }
                this.chartPagosTipoData = {
                    datasets: [
                        {
                            backgroundColor: '#BFE0D4',
                            data: auxDomDev,
                            label: 'Domiciliados devueltos',
                        }, {
                            backgroundColor: '#60B292',
                            data: auxDomPen,
                            label: 'Domiciliados pendientes',
                        }, {
                            backgroundColor: '#008351',
                            data: auxDomPag,
                            label: 'Domiciliados pagados',
                        }, {
                            backgroundColor: '#9260B2',
                            data: auxEfePen,
                            label: 'Efectivo pendientes',
                        }, {
                            backgroundColor: '#510083',
                            data: auxEfePag,
                            label: 'Efectivo pagado',
                        }, {
                            backgroundColor: '#B29260',
                            data: auxTarPen,
                            label: 'Tarjeta pendientes',
                        }, {
                            backgroundColor: '#835100',
                            data: auxTarPag,
                            label: 'Tarjeta pagado',
                        },
                    ],
                    labels: this.months,
                }
                this.chartPagosTotalData = {
                    datasets: [
                        {
                            backgroundColor: '#008351',
                            borderColor: '#008351',
                            borderWidth: 1,
                            data: totalSocios,
                            fill: false,
                            label: 'Socios totales',
                            type: 'line',
                            yAxisID: 'right',
                        }, {
                            backgroundColor: '#830032',
                            borderColor: '#830032',
                            borderWidth: 1,
                            data: totalPagosCompletados,
                            fill: false,
                            label: 'Pagos completados',
                            yAxisID: 'left'
                        }, {
                            backgroundColor: '#748300',
                            borderColor: '#748300',
                            borderWidth: 1,
                            data: totalPagosPendientes,
                            fill: false,
                            label: 'Pagos pendientes',
                            yAxisID: 'left'
                        },
                    ],
                    labels: this.months,
                }
                this.chartIngresosTotalData = {
                    datasets: [
                        {
                            backgroundColor: '#008351',
                            borderColor: '#008351',
                            borderWidth: 1,
                            data: totalSocios,
                            fill: false,
                            label: 'Socios totales',
                            type: 'line',
                            yAxisID: 'right',
                        }, {
                            backgroundColor: '#0F0083',
                            borderColor: '#0F0083',
                            borderWidth: 1,
                            data: totalIngresos,
                            fill: false,
                            label: 'Ingresos totales',
                            yAxisID: 'left'
                        }, {
                            backgroundColor: '#830032',
                            borderColor: '#830032',
                            borderWidth: 1,
                            data: totalIngresosPerdidos,
                            fill: false,
                            label: 'Ingresos perdidos',
                            yAxisID: 'left'
                        }
                    ],
                    labels: this.months,
                }
            },
            /**
             * Activates the flags to show the selected elements on the table and reset all the filters applied
             */
            filterSelected() {
                /* Active the flag/v-model to show the tag and all the  */
                this.allSelected = true;
                /* Reset all the filters and tags */
                this.filterTags = [];
                this.getSelectedMonth = [];
                this.getSelectedPayType = [];
                this.getSelectedYear = [];
                this.getSelectedState = [];
                this.getSelectedType = [];
                this.dateCreationRange = {
                    startDate:  null,
                    endDate: null,
                };
                this.dateConfirmationRange = {
                    startDate:  null,
                    endDate: null,
                };
                this.paymentsSearch = '';
                /* If one of the selected elements is inactive, active the option to show the inactive customers */
                if (this.rowsSelected.some(el => el.active == false)) {
                    this.inactives = true;
                }
            },
            /**
             * Filters the table component with the input provided for it
             *
             * @param {Object} value: the row of the table to make the search
             *
             * @return {Boolean} Boolean which indicates if the row includes or not the search
             */
            filterTable(value) {
                console.log(value);
                /* Stringify and clean the received object */
                let auxValue = JSON.stringify(value).toLowerCase().replace(new RegExp(/\"/g), '');
                let valueClean = '';
                /* Iterate over the stringified value passed to convert every special character to a regular */
                for (let i = 0; i < auxValue.length; i++) {
                    valueClean += SPECIAL_CHARACTERS[auxValue.charAt(i)] || auxValue.charAt(i);
                }
                let auxFilter = this.paymentsSearch.toLowerCase();
                let filterClean = '';
                /* Iterate over the input search value to convert every special character to a regular */
                for (let i = 0; i < auxFilter.length; i++) {
                    filterClean += SPECIAL_CHARACTERS[auxFilter.charAt(i)] || auxFilter.charAt(i);
                }
                return !this.paymentsSearch || valueClean.includes(filterClean)
            },
            /**
             * Function that generates the data for the charts, it can be called on the initial load of the table data or when the table data is updated
             *
             * @param {Boolean} manual: indicates if the function is called from the initial load or from the updates of the table data
             *
             * @return {Array} formed with the generated chart data and the totals of the generated chart data, it is necessary to fetch the different charts
             */
            generateChartData() {
                let aux = {};
                aux.months = [];
                this.$set(aux.months, 0, this.months);
                let total = {};
                total.months = [];
                for (let i = 0; i <= 11; i++) {
                    aux.months[i] = {
                        efectivo: {
                            pendiente: 0,
                            pagado: 0,
                        },
                        tarjeta: {
                            pendiente: 0,
                            pagado: 0,
                        },
                        domiciliacion: {
                            pendiente: 0,
                            pagado: 0,
                            devuelto: 0,
                        },
                    },
                    total.months[i] = {
                        totalSocios: 0,
                        totalPagosCompletados: 0,
                        totalPagosPendientes: 0,
                        totalIngresos: 0,
                        totalIngresosPerdidos: 0,
                    }
                }
                let auxDatosPago = this.$refs.paymentsTable.isFiltered ? this.$refs.paymentsTable.filteredItems : this.paymentsItems;
                auxDatosPago.forEach(pago => {
                    for (let j = 0; j <= 11; j++) {
                        if (this.$moment(pago['interval'],'YYYY-MM').month() == j) {
                            total.months[j].totalSocios++;
                            switch (pago['paymenttype']) {
                                case 'Domiciliación':
                                    if (pago['status'] == 'Pendiente') {
                                        aux.months[j].domiciliacion.pendiente++;
                                        total.months[j].totalPagosPendientes++;
                                        total.months[j].totalIngresosPerdidos += parseInt(pago['amount'])
                                    } else if (pago['status'] == 'Devuelto') {
                                        aux.months[j].domiciliacion.devuelto++;
                                        total.months[j].totalPagosPendientes++;
                                        total.months[j].totalIngresosPerdidos += parseInt(pago['amount']);
                                    } else {
                                        aux.months[j].domiciliacion.pagado++;
                                        total.months[j].totalPagosCompletados++;
                                        total.months[j].totalIngresos += parseInt(pago['amount']);
                                    }
                                    break;
                                case 'Tarjeta':
                                    if (pago['status'] == 'Pendiente') {
                                        aux.months[j].tarjeta.pendiente++;
                                        total.months[j].totalPagosPendientes++;
                                        total.months[j].totalIngresosPerdidos += parseInt(pago['amount']);
                                    } else {
                                        aux.months[j].tarjeta.pagado++;
                                        total.months[j].totalPagosCompletados++;
                                        total.months[j].totalIngresos += parseInt(pago['amount']);
                                    }
                                    break;
                                case 'Efectivo':
                                    if (pago['status'] == 'Pendiente') {
                                        aux.months[j].efectivo.pendiente++;
                                        total.months[j].totalPagosPendientes++;
                                        total.months[j].totalIngresosPerdidos += parseInt(pago['amount']);
                                    } else {
                                        aux.months[j].efectivo.pagado++;
                                        total.months[j].totalPagosCompletados++;
                                        total.months[j].totalIngresos += parseInt(pago['amount']);
                                    }
                                    break;
                            }
                        }
                    }
                });
                return [aux, total];
            },
            /**
             * Determines if a specific row is selected on the table. Its used on every row checkbox at the select col
             *
             * @param {Object} row: is the table row item
             *
             * @return {Boolean} Boolean to determine if the row passed is selected
             */
            isSelected(row) {
                return this.rowsSelected.some(el => el._id == row._id && el.payment_id == row.payment_id);
            },
            /**
             * Function to fill the object with the row to edit. This object will be passed to the component PaymentEdit where will be modified.
             *
             * @param {Object} row: contains the row from the table with the customer data that will be deleted
             */
            manageEdit(row) {
                /* Restore the object that will be passed to the child */
                this.editingItem = {};
                /* Assign to the object the new data */
                Object.keys(row).forEach(async field => {
                    await this.$set(this.editingItem, field, row[field]);
                });
                this.$bvModal.show('payment-edit-modal')
            },
            /**
             * Manage the payments data before send it to the plugin on will be csv printed
             */
            paymentsToCsv() {
                /* Unify the same iban payments */
                let csvPayments = [];
                this.rowsSelected.forEach(row => {
                    /* If the iban is previously used sum the amounts of the new and previous data and check if the intervals and rates are different too to show it on the csv file data*/
                    if (csvPayments.some(cp => cp.iban == row.iban)) {
                        csvPayments = csvPayments.map(cp => cp.iban == row.iban ? { ...(cp.amount = parseFloat(cp.amount) + parseFloat(row.amount)), ...(cp.interval != row.interval ? 'Múltiples intervalos' : cp.interval), ...(cp.rate += ', ' + row.name + ' - ' + row.rate + ' - ' + row.amount), ...cp } : cp);
                    /* If the iban is never used, add the row to the csv data without reference */
                    } else {
                        let noRef = { ...row };
                        csvPayments.push({ ...(noRef.rate = noRef.name + ' - ' + noRef.rate + ' - ' + noRef.amount), ...noRef })
                    }
                });
                this.$tableToCsv(['ibanownername', 'ibanownerdni', 'iban', 'amount', 'interval', 'rate'], csvPayments, this.$moment().format('YYYY-MM-DD_HH.mm.ss') + '_pagos_manual.csv', 'csvDownloadManual');
            },
            /**
             * Function to print a bill of specific row item
             *
             * @param {Object} item: the row item wich trigger this function
             */
            async printBill(item) {
                this.print = true;
                /* Fill the payment object for the Bill component */
                this.printItem = Object.assign({}, item);
                /* Fill the customer data for the Bill component */
                this.printCustomer = this.getCustomerById(item._id);
                this.printCustomer = Object.assign({}, await this.fetchCustomerImages({ customer: this.printCustomer, sign: true, image: false }));
                this.$showToast('success', 'En breve se iniciará la descarga del fichero', 'Descarga de recibo solicitada');
                this.$nextTick(async () => {
                    /* Call the plugin to capture and download the component document */
                    const filename = this.printCustomer.name.replace(/\s/g, '-') + '__recibo__' + this.$moment().format('YYYY-MM-DD_HH_mm') + '.pdf';
                    NProgress.set(0.5);
                    await this.$printDoc(filename, this.$refs.printableNPB);
                    NProgress.done();
                    /* Reset the involved variables */
                    this.print = null;
                    this.printItem = null;
                    this.printCustomer = null;
                });
            },
            /**
             * Function that unselect all the actived checkbox filters of the table and reload the data, this function will show all the existing payments on the database for every customer for the current year
             */
            resetFilters() {
                /* Reset the filters of the main table. Always mantain the filters to the current year and month to avoid performance issues */
                this.paymentsSearch = '';
                this.getSelectedYear = [this.$moment().year()];
                this.getSelectedMonth = [this.$moment().month()];
                this.getSelectedState = [];
                this.getSelectedPayType = [];
                this.getSelectedType = [];
                this.dateCreationRange = {
                    startDate:  null /* this.$moment().startOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                    endDate: null /* this.$moment().endOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                };
                this.dateConfirmationRange = {
                    startDate:  null /* this.$moment().startOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                    endDate: null /* this.$moment().endOf('month').format('YYYY/MM/DD HH:mm:ss') */,
                };
                /* Reset the tags */
                this.filterTags = [];
                this.allSelected = false;
                this.inactives = false;
                this.addTags(this.getSelectedYear[0]);
                this.addTags(this.getSelectedMonth[0], 'month');
            },
            /**
             * Select/Unselect a row (pushing it at the rowsSelected array) individually on check its on-line checkbox
             *
             * @param {Object} row: row item of the table
             * @param {Boolean} ev: the state of the checkbox
             */
            rowSelect(row, newVal) {
                let index = this.rowsSelected.findIndex(el => el._id == row._id && el.payment_id == row.payment_id);
                if (newVal && index == -1) {
                    this.rowsSelected.push(row);
                } else if (!newVal && index != -1) {
                    this.rowsSelected.splice(index, 1);
                }
            },
            /**
             * Called from the checkbox on the head of 'select' col on the table to select/unselect all the rows
             *
             * @param {Boolean} checked: the state of the checkbox
             */
            rowSelectAll(checked) {
                this.$refs.paymentsTable.filteredItems.forEach(rowItem => {
                    if (checked == true && !this.rowsSelected.some(el => el._id == rowItem._id && el.payment_id == rowItem.payment_id)) {
                        /* Evaluate separetly to select the rows in every procedure actived (they cannot be active simultaneously), in some way this overload the conditions on rowSelect() */
                        if ((this.confirming && rowItem.status == 'Pendiente' && rowItem.paymenttype == 'Domiciliación' && this.getFilteredPaymentsById({ _id: rowItem._id, filterYears: [this.$moment(rowItem.interval, 'YYYY-MM').year()], filterMonths: [this.$moment(rowItem.interval, 'YYYY-MM').month()], filterStatus: ['Confirmado'], filterType: ['periodic'] }).length == 0) || (this.manualDownload && rowItem.status == 'Pendiente' && rowItem.paymenttype == 'Domiciliación') || (!this.confirming && !this.manualDownload)) {
                            this.rowSelect(rowItem, true);
                        }
                    } else if (checked == false && this.rowsSelected.some(el => el._id == rowItem._id && el.payment_id == rowItem.payment_id)) {
                        this.rowSelect(rowItem, false);
                    }
                });
            },
        },
        mounted() {
            /* Get all the distinct years in the store */
            this.btnYears = this.getPaymentsYears;
            /* Fetch the charts data */
            // this.fetchChartData();
            /* Add the tags of the filters applied always on the first load */
            this.addTags(this.getSelectedYear[0]);
            this.addTags(this.getSelectedMonth[0], 'month');
            /* Stop the 'loading' animation */
            this.paymentsTableBusy = false;
        },
        props: [
            'parentId', /* If is provided the table items are from this customer */
            'filters', /* Array with the filters to show, possible filters: type, paymenttype, textfilter, creationdate, confirmationdate, status, interval */
            'isDisabled', /* Indicates if the form is being edited */
            'itemsPerPage', /* Items to show per page */
            'lite', /* Optional flag to show/hide determined elements on the table */
            'parentItems', /* Items getted on the parent */
            'tableFields', /* The table fields */
        ],
        /**
         * Provide the same $validator to the childs
         */
        provide() {
            return {
                $validator: this.$validator,
            }
        },
        watch: {
            /* Watch the confirming changes to evaluate the rows selected */
            confirming(newVal, oldVal) {
                if (newVal == true) {
                    /* Clean the possible selected rows and leave only the permitted */
                    if (this.rowsSelected.length > 0) {
                        this.evaluateRowSelectedState();
                    }
                }
            },
            /* Watch the manualDownload changes to evaluate the rows selected */
            manualDownload(newVal, oldVal) {
                if (newVal == true) {
                    /* Clean the possible selected rows and leave only the permitted */
                    if (this.rowsSelected.length > 0) {
                        this.evaluateRowSelectedState();
                    }
                }
            },
        },
    }
</script>
<style>
    .table-responsive-lg {
        overflow-x: auto!important;
    }
</style>
<style scoped>
    .chart-pagos {
        background: linear-gradient(90deg, rgba(0, 0, 0, .01) 60%, rgba(0, 0, 0, .02) 100%);
        border-radius: .25rem;
        box-sizing: border-box;
        height: 200px;
        margin: 0 auto;
        width: 100%;
    }
    .subtitle.subtitle-filters {
        font-size: calc(20px + (50 - 20) * ((100vw - 300px) / (1600 - 300))); /* minsize + (max-min) * (maxvw - minvw) * (maxpx - minpx) */
        margin-right: 15px;
    }
    .wrp-chart {
        padding: 1rem;
    }
    #collapse-charts {
        background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .02) 100%);
        border-radius: .25rem;
    }
    #payments-seleccionadas-btn {
        white-space: nowrap;
    }
</style>
