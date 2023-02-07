<template>
    <section id="doc-cinturones">
        <h1 class="subtitle">
            Gestión global de grados
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            Desde la sección de grados tendremos una visión global de los grados otorgados a los socios del club y podremos modificar datos de manera masiva o individualmente y podremos buscar fácilmente para localizar socios concretos:
        </p>
        <DocImg alt="Gestión global de grados" desc="Desde la vista general de grados podemos ver el grado actual y el siguiente de nuestros socios y podremos acceder a todo el histórico así como buscar o filtrar para localizar los que necesitemos" img="Grados1.png" type="image/png"></DocImg>
        <p>
            Datos importantes sobre la sección cinturones:
            <br>
            &emsp;- La tabla nos presenta una línea por cada socio activo que tenga o haya tenido progresión de grados de karate, si quisiéramos podríamos visualizar datos de los socios inactivos marcando la opción en la parte inferior de la tabla.
            <br>
            &emsp;- Pulsando sobre el nombre del socio o su grado actual podemos acceder al detalle de grados que tiene este socio, podemos usar los botones del margen superior derecho de la tabla para desplegar todos o contraer todos.
            <br>
            &emsp;- Desde la tabla podremos editar los grados individualmente en cada socio de forma muy similar a como podemos realizarlo en la ficha del socio. Para acceder a la edición de los grados de un socio pulsaremos en el nombre del socio o su grado actual para desplegar el detalle de grados y una vez aquí usaremos el botón de edición para poder acceder a editar los grados. Como se ve en la captura podremos añadir una nueva fecha a los grados seleccionados o borrar la fecha que tengan los grados que seleccionemos.
        </p>
        <DocImg alt="Editando cinturones" desc="Desde una línea de la tabla podemos editar grados a un socio" img="Grados2.png" type="image/png"></DocImg>
        <section>
            Además, en la barra de navegación principal tendremos acceso a herramientas que nos permitirán gestionar los cinturones de manera masiva:
            <DocImg alt="Herramientas para grados" desc="En la gestión global de grados podremos actualizarlos masivamente o descargar manualmente archivos para generar de diplomas" img="Grados3.png" type="image/png"></DocImg>
            <article>
                <h4 id="doc-grados-actualizar">
                    Actualización de grados:
                </h4>
                <p>
                    Es el proceso con el que podremos actualizar masivamente los grados otorgados a uno o varios socios/as. El proceso funciona de la siguiente manera:
                    <br>
                    &emsp;- Disponemos de un listado de socios que tienen grados de karate otorgados
                    <br>
                    &emsp;- Deberemos seleccionar los socios de los que necesitamos actualizar sus grados, podremos buscar o filtrar los socios como queramos
                    <br>
                    &emsp;- La aplicación tendrá en cuenta cuál fue el último grado otorgado para otorgarle el siguiente en cada caso
                    <br>
                    &emsp;- Podremos seleccionar de entre los grados pendientes el que necesitemos para que ese sea el que tome el proceso para actualizarlo, para ello solamente deberemos clicar sobre el grado para que se añada como Siguiente grado
                    <br>
                    &emsp;- Un socio/a que ya sea cinturón negro no será seleccionable, si quisiéramos otorgarle un grado inferior que tuviera pendiente deberemos seleccionarlo como Siguiente grado
                    <br>
                    &emsp;- La cantidad de grados que podemos actualizar no está definida, puede ser uno o muchos según nuestra necesidad
                    <br>
                    &emsp;- Al finalizar el proceso se descarga automáticamente un fichero en formato csv con la relación de socios/as actualizados y con él podremos generar posteriormente los diplomas para entregárselos a los socios/as
                </p>
            </article>
            <article>
                <h4 id="doc-grados-descargar">
                    Descarga manual de archivo de diplomas:
                </h4>
                <p>
                    Esta herramienta nos servirá para descargar manualmente los datos necesarios para generar diplomas. Como hemos visto, durante el proceso de actualización de grados se descargará este fichero automáticamente pero siempre podemos necesitar descargarlo manualmente.
                </p>
                <p>
                    El proceso consiste en la selección de los socios/as de los que necesitamos sus datos y una vez seleccionados usaremos el botón descargar para obtener el fichero que nos servirá para generar los diplomas.
                    <br>
                    La selección de un socio implica que se descargarán los datos del último grado otorgado, si quisiéramos descargar otro o múltiples grados de un socio deberemos acceder al detalle de sus grados pulsando sobre el nombre de socio o el último grado y marcar los grados que queramos descargar.
                </p>
            </article>
        </section>
    </section>
</template>
