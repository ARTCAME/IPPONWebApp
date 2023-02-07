<template>
    <section id="doc-tutoriales">
        <h1 class="subtitle" data-v-step="wzd-doc-tests-0">
            Tutoriales
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            Algunas secciones pueden suponer un reto en cuanto a la cantidad de información que contienen, en ellas existirá el icono de acceso directo a un tutorial que nos guiará por el proceso a realizar y nos indicará datos relevantes sobre la información que vemos por pantalla.
        </p>
        <p>
            Durante el tutorial iremos navegando por los pasos disponibles durante los que se nos dará la información necesaria para conocer bien el proceso que pretendemos llevar a cabo. Esta navegación puede hacerse usando los botones de avanzar, retroceder y salir o usando las flechas del teclado para avanzar y retroceder o la tecla 'Esc' para salir
        </p>
        <p>
            El icono de acceso directo lo encontraremos siempre en el margen inferior derecho de las secciones, herramientas o utilidades en las que esté disponible. Tiene el formato que puedes ver a continuación, si pulsas sobre el icono podrás ver un ejemplo del funcionamiento de un tutorial:
        </p>
        <div id="wzd-doc-wrp">
            <Wizard
                name="wzd-doc-tests"
                :steps="steps"></Wizard>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                steps: [
                    {
                        target: '[data-v-step="wzd-doc-tests-0"]',
                        content: `<h4>Documentación</h4>Esto es una ventana de un tutorial.<br>La ventana apunta a un elemento (en este caso al título 'Tutoriales') de la página al que hace referencia o da algún dato, este elemento se muestra en primer plano con respecto al resto de la página.<br>Esta ventana tiene botones para avanzar, retroceder o salir del tutorial aunque también puedes usar las flechas de tu teclado para avanzar o retroceder o la tecla escape para salir.<br>Fíjate que en la parte inferior de la pantalla hay una barra que te indicará el avance del tutorial. `,
                        params: {
                            placement: 'left',
                        }
                    },
                ]
            }
        }
    }
</script>
<style>
    #wzd-doc-wrp {
        height: 40px;
        margin: 0 auto;
        padding: .5rem;
        width: 40px;
    }
    #wzd-doc-wrp #wzd-btn-start,
    #wzd-doc-wrp .wizard-launcher {
        bottom: 0;
        left: 0;
        position: relative!important;
    }
</style>
