<template>
    <b-table
        class="mb-0"
        fixed
        ref="searchTable"
        responsive
        show-empty
        small
        v-bind="$attrs"
        :current-page="searchTablePagination"
        :items="items"
        :per-page="pagination"
        :sort-by="sortBy"
        :sort-desc="true"
        :tbody-tr-class="clicableRows ? 'clicableRow' : ''"
        @row-clicked="clicableRows ? $emit('row-clicked', $event) : ''">
        <template
            #cell(type)="row">
            {{ row.value == 'periodic' ? 'Periódico' : 'Manual'}}
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
            <slot
                name="name"
                :row="row">
                <div
                    class="pl-1 table-text-overflowed text-nowrap"
                    v-overflown="row.value">
                    {{ row.value }}
                </div>
            </slot>
        </template>
        <template
            #cell(phones)="row">
            <span
                v-for="(phone, index) in row.item.phones"
                :key="row.item._id + phone.phone">
                {{ phone.phone != null ? phone.phone + (row.item.phones.length > (index + 1) ? ' - ' : '') : '' }}
            </span>
        </template>
        <template
            #cell(dni)="row">
            {{ row.value != '' && row.value != null ? row.value : row.item.tutor ? row.item.tutor.dni + '(tutor)' : 'No disponible' }}
        </template>
        <template #cell(unpayed)="row">
            <slot name="unpayed" :row="row"></slot>
        </template>
        <template
            #cell(actions)="row">
            <slot
                name="actions"
                :row="row">
                <b-button
                    class="ig-small-btn"
                    size="sm"
                    variant="outline-primary"
                    @click="$emit('choose', row.item)">
                    <span class="text">Usar</span>
                </b-button>
            </slot>
        </template>
        <template
            #table-caption
            v-if="!lite">
            <!-- v-if="!lite && (($refs.searchTable && $refs.searchTable.filteredItems.length > pagination) || (items && items.length > pagination))"> -->
            <b-row align-h="between" no-gutters>
            <!-- <b-row align-h="end" no-gutters> -->
                <b-col>
                    <!-- :cols="$refs.paymentsTable && $refs.paymentsTable.isFiltered && ($refs.paymentsTable.filteredItems.length > perPage || paymentsItems.length > perPage) ? 6 : 'auto'"> -->
                    <!-- <span
                        v-if="$route.name == 'payments.index' && !lite">
                        <p>
La tabla solo muestra los socios activos. Mostrar los inactivos
                            <b-form-checkbox
                                class="d-inline custom inline-switch"
                                size="sm"
                                switch
                                v-model="inactives"></b-form-checkbox> -->
                                <!-- @change="cancelEdit()"></b-form-checkbox> -->
                        <!-- </p>
                        Filas seleccionadas:
                        <AnimatedNum
                            :numFounded="rowsSelected.length"></AnimatedNum>
                        <br>
                    </span> -->
                    Filas totales: {{ $refs.searchTable && $refs.searchTable.isFiltered ? $refs.searchTable.filteredItems.length : items ? items.length : 0 }}
                    <!-- <AnimatedNum
                        :numFounded="$refs.paymentsTable && $refs.paymentsTable.isFiltered ? $refs.paymentsTable.filteredItems.length : paymentsItems.length"></AnimatedNum> -->
                </b-col>
                <b-pagination
                    aria-controls="searchTable"
                    class="float-right mb-0"
                    size="sm"
                    v-if="($refs.searchTable && $refs.searchTable.filteredItems.length > pagination) || (items && items.length > pagination)"
                    v-model="searchTablePagination"
                    :per-page="pagination"
                    :total-rows="$refs.searchTable ? $refs.searchTable.filteredItems.length : items ? items.length : 0"></b-pagination>
            </b-row>
        </template>
        <template
            #table-colgroup="scope">
            <slot name="col" v-bind:fields="scope.fields"></slot>
        </template>
        <!-- It will be shown when the table hasn't rows because the filters have emptied it -->
        <template
            #empty>
            <b-form-text>
                No hay registros
            </b-form-text>
        </template>
        <template
            #emptyfiltered>
            <b-form-text>
                Ningún registro coincide con tu búsqueda
            </b-form-text>
        </template>
    </b-table>
</template>
<script>
export default {
    data() {
        return {
            searchTablePagination: 1, /* Marks the current page, always starts at the first */
        }
    },
    // created() {
    //     /* Force the update of the component to recalculate the directive that adds the title to the name on every row */
    //     window.addEventListener('resize', () => { this.$forceUpdate() });
    // },
    // destroyed() {
    //     window.removeEventListener('resize', () => { this.$forceUpdate() });
    // },
    props: {
        clicableRows: Boolean, /* Boolean to enable the click to enter on every table row */
        customer: Object, /* Boolean to determine if the parent (or grand-parent) is a customer and hide some elements */
        items: Array, /* The table items, passeds from the parent */
        lite: Boolean, /* Flag to hide some elements depending of the parent requirements */
        pagination: {
            type: Number,
            default: 5,
        }, /* Integer to apply on pagination, if its 0 the pagination is not enabled */
        sortBy: String, /* The sort-by attr to the table */
    }
}
</script>
<style>
    .clicableRow {
        cursor: pointer;
    }
    .ig-small-btn {
        line-height: 22px;
    }
    .ig-modal-table-btn-svg {
        line-height: 18px;
    }
    /* Sets like a button behaviour */
    .ig-small-btn:hover .text,
    .ig-modal-table-btn:hover svg {
        color: rgb(248, 249, 250)!important;
        transition: .35s;
    }
</style>
