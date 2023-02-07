<template>
    <div id="doc-wrp">
        <div id="doc-content">
            <b-sidebar id="doc-sidebar" shadow visible>
                <template
                    #header-close>
                    <b-button-close id="doc-sidebar-closer"></b-button-close>
                </template>
                <template
                    #title>
                    <span class="subtitle subtitle-sub">
                        Contenidos
                    </span>
                </template>
                <template>
                    <b-navbar
                        id="doc-sidebar-navbar"
                        v-b-scrollspy:doc-ctn>
                        <b-nav pills vertical>
                            <b-nav-item
                                href="#doc-sesion"
                                @click.prevent="$scrollTo('#doc-sesion')">
                                Inicio de sesión y página de bienvenida
                            </b-nav-item>
                            <b-nav-item
                                href="#doc-alertas"
                                @click.prevent="$scrollTo('#doc-alertas')">
                                Avisos y alertas
                            </b-nav-item>
                            <!-- <b-nav-item
                                href="#doc-tutoriales"
                                @click.prevent="$scrollTo('#doc-tutoriales')">
                                Tutoriales
                            </b-nav-item> -->
                            <b-nav-item
                                href="#doc-navbar"
                                @click.prevent="$scrollTo('#doc-navbar')">
                                Barra de navegación
                            </b-nav-item>
                            <b-nav-item
                                href="#doc-utils-busqueda"
                                @click.prevent="$scrollTo('#doc-utils-busqueda')">
                                Búsqueda de socios y acceso a la ficha de socio
                            </b-nav-item>
                            <b-nav-item
                                href="#doc-utils-documentos"
                                @click.prevent="$scrollTo('#doc-utils-documentos')">
                                Genera y descarga documentos de socio
                            </b-nav-item>
                            <b-nav-item
                                href="#doc-utils-pagos"
                                @click.prevent="$scrollTo('#doc-utils-pagos')">
                                Actualiza y genera pagos
                            </b-nav-item>
                            <b-nav pills vertical>
                                <b-nav-item class="ml-3"
                                    href="#doc-utils-pagos-selection"
                                    @click.prevent="$scrollTo('#doc-utils-pagos-selection')">
                                    Selección del socio
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-utils-pagos-confirm-update"
                                    @click.prevent="$scrollTo('#doc-utils-pagos-confirm-update')">
                                    Revisión de pagos anteriores
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-utils-pagos-edit-create"
                                    @click.prevent="$scrollTo('#doc-utils-pagos-edit-create')">
                                    Formulario de creación y edición de pagos
                                </b-nav-item>
                            </b-nav>
                            <b-nav-item
                                href="#doc-alta"
                                @click.prevent="$scrollTo('#doc-alta')">
                                Alta y edición de socios
                            </b-nav-item>
                            <b-nav pills vertical>
                                <b-nav-item class="ml-3"
                                    href="#doc-alta-els"
                                    @click.prevent="$scrollTo('#doc-alta-els')">
                                    Elementos del formulario
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-alta-editar"
                                    @click.prevent="$scrollTo('#doc-alta-editar')">
                                    Edición de un socio
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-alta-grados"
                                    @click.prevent="$scrollTo('#doc-alta-grados')">
                                    Edición de grados/cinturones desde la ficha del socio
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-alta-pagos"
                                    @click.prevent="$scrollTo('#doc-alta-pagos')">
                                    Edición de pagos desde la ficha del socio
                                </b-nav-item>
                            </b-nav>
                            <b-nav-item
                                href="#doc-cinturones"
                                @click.prevent="$scrollTo('#doc-cinturones')">
                                Gestión global de grados
                            </b-nav-item>
                            <b-nav pills vertical>
                                <b-nav-item class="ml-3"
                                    href="#doc-grados-actualizar"
                                    @click.prevent="$scrollTo('#doc-grados-actualizar')">
                                    Actualización de grados
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-grados-descargar"
                                    @click.prevent="$scrollTo('#doc-grados-descargar')">
                                    Descarga manual de archivo de diplomas
                                </b-nav-item>
                            </b-nav>
                            <b-nav-item
                                href="#doc-pagos"
                                @click.prevent="$scrollTo('#doc-pagos')">
                                Gestión global de pagos
                            </b-nav-item>
                            <b-nav pills vertical>
                                <b-nav-item class="ml-3"
                                    href="#doc-pagos-editar"
                                    @click.prevent="$scrollTo('#doc-pagos-editar')">
                                    Edición de pagos desde la página de gestión global de pagos
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-pagos-confirmar"
                                    @click.prevent="$scrollTo('#doc-pagos-confirmar')">
                                    Confirmación de pagos
                                </b-nav-item>
                                <b-nav-item class="ml-3"
                                    href="#doc-pagos-descargar"
                                    @click.prevent="$scrollTo('#doc-pagos-descargar')">
                                    Descarga manual de archivo de remesa
                                </b-nav-item>
                                <!-- <b-nav-item class="ml-3"
                                    href="#doc-pagos-gráficos"
                                    @click.prevent="$scrollTo('#doc-pagos-gráficos')">
                                    Gráficos
                                </b-nav-item> -->
                            </b-nav>
                            <b-nav-item
                                href="#doc-usuarios"
                                v-if="['admin', 'root'].includes(authenticatedRole)"
                                @click.prevent="$scrollTo('#doc-usuarios')">
                                Registro de usuarios
                            </b-nav-item>
                            <b-nav-item
                                href="#doc-tests"
                                v-if="['tester', 'root'].includes(authenticatedRole)"
                                @click.prevent="$scrollTo('#doc-tests')">
                                Tester
                            </b-nav-item>
                        </b-nav>
                    </b-navbar>
                </template>
            </b-sidebar>
            <div id="doc-sidebar-toggler-wrp">
                <fa-icon
                    id="doc-sidebar-toggler"
                    icon="bars"
                    v-b-toggle.doc-sidebar></fa-icon>
            </div>
            <div id="doc-ctn">
                <div
                    class="doc-article"
                    v-for="(doc, index) in roleDoc"
                    :key="index">
                    <component
                        :is="doc"
                        :ref="doc"></component>
                </div>
            </div>
        </div>
        <!-- <TextSearch
            :html="htmlOfDocs"
            :text="textOfDocs"></TextSearch> -->
    </div>
</template>
<script>
    import docs from '../components/userdocassets/DocIndex';
    import { mapGetters } from 'vuex';
    export default {
        components: docs,
        data() {
            return {
                adminDoc: ['DocUsuarios'],
                commonDoc: ['DocSesion', 'DocAlertas', 'DocNavbar', 'DocUtilsBusqueda', 'DocUtilsDocumentos', 'DocUtilsPagos', 'DocAlta', 'DocCinturones', 'DocPagos'], /*  'DocWizard', */
                htmlOfDocs: {},
                rootDoc: ['DocUsuarios', 'DocTests'],
                testerDoc: ['DocTests'],
                textOfDocs: {},
            }
        },
        mounted() {
            this.roleDoc.forEach(doc => {
                if (this.$refs[doc]) {
                    this.textOfDocs[doc] = this.$refs[doc][0].$el.innerText;
                    this.htmlOfDocs[doc] = this.$refs[doc][0].$el.innerHTML;
                }
            });
        },
        computed: {
            ...mapGetters('auth', ['authenticatedRole']),
            /**
             * Set the content for every role
             */
            roleDoc() {
                switch (this.authenticatedRole) {
                    case 'admin':
                        return [...this.commonDoc, ...this.adminDoc];
                        break;
                    case 'user':
                        return [...this.commonDoc];
                        break;
                    case 'root':
                        return [...this.commonDoc, ...this.rootDoc];
                        break;
                    case 'tester':
                        return [...this.commonDoc, ...this.testerDoc];
                        break;
                }
            },
        },
    }
</script>
<style>
    /* Not scoped to apply it to the imported child components */
    @media screen and (max-width: 500px) {
        #doc-wrp *:not(.subtitle):not(#wzd-btn-start) {
            font-size: 12px!important;
        }
        #doc-ctn * {
            margin-left: .1rem!important;
            margin-right: .1rem!important;
        }
        #doc-content,
        #doc-ctn {
            padding-left: 0!important;
            padding-right: 0!important;
        }
    }
</style>
<style scoped>
    .doc-article {
        margin: 0 auto;
        margin-bottom: 1.5rem;
        max-width: 800px;
    }
    #doc-sidebar-navbar .nav-item.active .nav-link.active {
        background-color: rgba(0, 131, 81, 1);
        color: rgba(255, 255, 255, 1)!important;
    }
    #doc-sidebar button.close {
        font-size: 45px!important;
        padding: 0!important;
    }
    #doc-sidebar-navbar li {
        padding: 2px;
    }
    #doc-sidebar-navbar li a {
        padding: .2rem .5rem;
    }
    #doc-sidebar-toggler-wrp {
        background-color: rgba(255, 255, 255, 1);
        border-radius: .25rem;
        height: 28px;
        left: 1rem;
        position: fixed;
        text-align: center;
        top: 1rem;
        width: 28px;
        z-index: 999;
    }
    #doc-sidebar-toggler {
        color: rgba(0, 131, 81, 1);
        cursor: pointer;
        font-size: 28px!important;
    }
    #doc-ctn {
        height: 100%;
        padding: 4rem 2rem;
        position: relative;
        overflow-x: hidden;
        overflow-y: scroll;
        width: 100%;
    }
    #doc-wrp {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }
    #doc-content {
        height: 100%;
        /* padding: 2rem; */
        /* padding-top: 4rem; */
        /* position: relative; */
        /* overflow-y: scroll; */
    }
</style>
