<template>
    <section id="doc-alertas">
        <h1 class="subtitle">
            Avisos y alertas
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            La aplicación mantendrá un formato similar a la hora de mostrar alertas con resultados relacionados con las diferentes acciones que realicemos. Estas alertas se mostrarán centrados en la parte inferior de la pantalla.
        </p>
        <p>
            A continuación mostramos algunos ejemplos, es importante notar que, en el caso de que se produzca y se nos informe de un error, se nos facilitará un código que lo identificará y que será útil para determinar qué ha sucedido:
        </p>
        <b-row>
            <DocImg alt="Alerta de error" class="col" desc="Alerta de error" img="Alerta1.png" type="image/png"></DocImg>
            <DocImg alt="Alerta de guardado" class="col" desc="Alerta de guardado" img="Alerta2.png" type="image/png"></DocImg>
        </b-row>
        <b-row no-gutters>
            <b-button
                class="col col-12"
                size="sm"
                variant="ig-outline-green"
                @click="randomAlert()">
                Generar una alerta
            </b-button>
        </b-row>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                alerts: [
                    ['success', 'Todo ha ido bien, se ha guardado correctamente', 'Datos guardados'],
                    ['success', 'Me muestro centrado en la parte inferior de la pantalla', 'Esto es un test'],
                    ['success', '¿Cómo está yendo el día?', '¡Hola!'],
                    ['success', 'Hemos enviado un mensaje a alguien que te sorprenderá', 'Mensaje enviado correctamente'],
                    ['danger', 'Algo ha ido mal y no hemos podido completar la operación. Código de error: BaHj@Tester', 'Error'],
                    ['danger', 'Soy un toast de bootstrap y aquí estoy por que me lo has pedido', 'Ojo cuidado'],
                    ['danger', '¡La estás liando! Código de error: KsjN@kjss', '¡Es hora de parar!'],
                    ['danger', 'Borrando todos los datos en 3... 2... 1...', 'Reiniciando el sistema'],
                ],
            }
        },
        methods: {
            randomAlert() {
                this.$showToast(...this.alerts[Math.floor(Math.random() * (8 - 0)) + 0]);
            },
        },
    }
</script>
