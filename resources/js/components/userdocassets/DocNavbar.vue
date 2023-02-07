<template>
    <section id="doc-navbar">
        <h1 class="subtitle">
            Barra de navegación
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            La barra de navegación es el elemento principal para acceder a todas las herramientas de la aplicación. La encontramos visible en la parte superior de la pantalla independientemente de la sección en la que nos encontremos (exceptuando esta documentación y cuando accedamos a las utilidades globales).
        </p>
        <p>
            En la barra de navegación se mostrarán los siguientes elementos:
            <br>
            - <u>Secciones de navegación principales</u> en la captura vemos las secciones Alta, Cinturones y Pagos pero esto puede variar según el rol de nuestro usuario. Podemos ver que la sección en la que nos encontremos aparece resaltada
            <br>
            - <u>Herramientas propias de la página</u>: son herramientas asociadas a la sección en la que nos encontramos y solo aparecerán si la sección dispone de ellas, en la captura vemos la sección de pagos con sus herramientas disponibles, las explicaremos en las secciones que dispongan de ellas
            <br>
            - <u>Usuario actual</u>: se nos mostrará el nombre de usuario con el que hemos iniciado sesión
            <br>
            - <u>Utilidades globales</u>: las veremos en detalle más adelante, las disponibles son:
            <br>
            &emsp;- Búsqueda: Lo usaremos para buscar y acceder a fichas de socio
            <br>
            &emsp;- Gestión de pagos: Nos servirá para generar nuevos pagos o confirmar el estado de pagos pendientes
            <br>
            &emsp;- Descarga de documentación: Podremos descargar manualmente la documentación asociada a un socio así como recibos de pago
            <br>
        </p>
        <DocImg alt="Barra de navegación" desc="Barra de navegación principal con sus elementos remarcados" img="Navbar1.png" type="image/png"></DocImg>
        <p>
            Además de la disposición y diseño de la barra de navegación que se muestra en la captura anterior, la barra de navegación puede presentar otras disposiciones según el tamaño de la pantalla, los elementos seguirán existiendo pero pasarán a estar contraídos o dentro de menús desplegables.
        </p>
        <p>
            Aquí puedes ver los diferentes diseños para que estés familiarizado con ellos:
        </p>
        <DocImg alt="Barra de navegación grande" desc="Barra de navegación principal a tamaño completo" img="Navbar2.png" noexpandable="true" type="image/png"></DocImg>
        <b-row>
            <DocImg alt="Barra de navegación mediana" class="col" desc="Podemos ver que el apartado de herramientas se ha contraído" img="Navbar3.png" noexpandable="true" type="image/png"></DocImg>
            <DocImg alt="Barra de navegación pequeña" class="col col-5" desc="Las secciones y las herramientas ahora son menús desplegables" img="Navbar4.png" noexpandable="true" type="image/png"></DocImg>
        </b-row>
    </section>
</template>

<script>
export default {

}
</script>

<style>

</style>
