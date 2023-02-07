<template>
    <b-form-group class="mb-0 pt-2"
        v-if="(isDisabled && inNotes && inNotes.length > 0) || !isDisabled">
        <h5 md="4" class="subtitle">Notas</h5>
        <b-form-row
            v-if="!isDisabled">
            <b-col
                cols="auto">
                <span
                    class="d-block"
                    v-b-tooltip.hover.bottom.noninteractive
                    :title="!newNote ? 'Escribe una nota' : ''">
                    <ButtonIcon
                        icon="plus"
                        variant="outline-success"
                        :disabled="!newNote"
                        @click="addNote()">
                        <span class="ml-1">
                            Añadir nota
                        </span>
                    </ButtonIcon>
                </span>
            </b-col>
            <b-col>
                <b-form-group>
                    <b-form-textarea
                        max-rows="1"
                        rows="1"
                        placeholder="Escribe una nota..."
                        v-model="newNote"></b-form-textarea>
                </b-form-group>
            </b-col>
        </b-form-row>
        <TransitionExpand>
            <div
                key="1"
                v-if="!isDisabled && (!inNotes || (inNotes && inNotes.length == 0))">
                <b-alert
                    class="py-1"
                    show
                    variant="secondary">
                    Cuando exista alguna nota la verás aquí
                </b-alert>
            </div>
            <div
                key="2"
                v-if="inNotes && inNotes.length > 0">
                <b-form-group>
                    <b-card-group columns>
                        <b-card
                            bg-variant="light"
                            v-for="(note, index) in (inNotes.length > 5 && !all ? inNotes.slice(0, 5) : inNotes)"
                            :key="note.date + ' - ' + index"
                            :sub-title="note.date">
                            <div class="d-flex w-100 justify-content-between">
                                <b-btn-close
                                    class="wrapper-dismissible-close"
                                    tabindex="-1"
                                    v-if="!isDisabled"
                                    @click="delFormElement({ _id: _id, entity: target, entityIndex: targetIndex, field: 'notes', fieldIndex: index, })">
                                </b-btn-close>
                            </div>
                            <b-card-text>
                                {{ note.note }}
                            </b-card-text>
                        </b-card>
                    </b-card-group>
                    <b-row
                        class="mt-2"
                        no-gutters
                        v-if="inNotes.length > 5">
                        <b-button
                            class="ml-auto mr-0"
                            variant="outline-secondary"
                            @click="all = !all">
                            {{ all ? 'Mostrar menos' : 'Mostrar todas (' + inNotes.length + ')' }}
                        </b-button>
                    </b-row>
                </b-form-group>
            </div>
        </TransitionExpand>
    </b-form-group>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            all: false,
            newNote: '',
        }
    },
    methods: {
        ...mapActions(['addNewElement', 'delFormElement']),
        async addNote() {
            await this.addNewElement({ _id: this._id, element: 'notes', entity: this.target, entityIndex: this.targetIndex, value: { note: this.newNote, date: this.$moment().format('DD-MM-YYYY HH:mm:ss') } });
            this.newNote = '';
        },
    },
    props: {
        '_id': String, /* Points to the customer fetched on the form, if its false is a new customer */
        'inNotes': [Array, String], /* The notes data to render */
        'isDisabled': Boolean, /* Boolean that indicates if the form is being edited */
        'target': String, /* Can be 'customer', 'tutor' or 'contacts' */
        'targetIndex': {
            default: null,
            type: Number,
        }, /* Will be the index of the target to edit */
    },
}
</script>
<style scoped>
    .card-columns {
        -webkit-column-count: 3;
        column-count: 3;
    }
    .notes-container {
        position: relative;
    }
    .notes-list {
        /* transition: all .3s ease; */
        width: 100%;
    }
    @media screen and (max-width: 576px) {
        .card-columns {
            -webkit-column-count: 1;
            column-count: 1;
        }
    }
    @media screen and (max-width: 768px) {
        .card-columns {
            -webkit-column-count: 2;
            column-count: 2;
        }
    }
    @media screen and (min-width: 1200px) {
        .card-columns {
            -webkit-column-count: 5;
            column-count: 5;
        }
    }
</style>
