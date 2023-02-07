<template>
    <section id="doc-utils-busqueda">
        <h1 class="subtitle">
            Búsqueda de socios y acceso a la ficha de socio
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            A la búsqueda de socio/a accederemos desde la pantalla de inicio y desde la barra de navegación principal y nos servirá para encontrar y acceder a las fichas de los diferentes socios/as.
        </p>
        <DocImg alt="Ubicación del buscador en home" desc="Ubicación del buscador en la página de bienvenida" img="Buscador2.png" type="image/png"></DocImg>
        <DocImg alt="Ubicación del buscador en barra de navegación" desc="Ubicación del buscador en la barra de navegación" img="Buscador1.png" type="image/png"></DocImg>
        <p>
            El buscador usa un filtrado por todos los datos relevantes del socio/a (nombre, dirección, dni, e-mails, teléfonos, número de socio/a o identificador del socio/a) por lo que cada carácter introduzcamos se buscará en todo estos campos a la vez.
        </p>
        <p>
            Para ilustrar el funcionamiento del buscador proponemos un ejemplo: si tenemos una socia que se llama Elena Nito y vive en la calle del Bosque número 1 y otro socio que se llama Aitor Nadó que vive en la calle Elena Nito número 23, si usamos el buscador para encontrar ‘Elena Nito’ nos aparecerán ambos en los resultados ya que ambos contienen la combinación de letras buscadas ‘Elena Nito’.
        </p>
        <p>
            El buscador no tiene en cuenta mayúsculas, tildes o caracteres especiales (se pueden introducir o no indistintamente) y obtendremos todos los resultados, por ejemplo: si buscamos ‘José’, nos devolverá resultados para jose, JOSE, José, josé, etc.
        </p>
        <p>
            Una vez hayamos localizado el socio al que queremos acceder usaremos el botón que aparece en el margen derecho o pulsaremos sobre el socio encontrado para acceder a su ficha.
        </p>
        <p>
            En la siguiente captura puedes ver en detalle la composición del buscador global:
        </p>
        <DocImg alt="Buscador de socios" desc="Vista del buscador de socios, los resultados aparecen en tiempo real debajo del campo de búsqueda" img="Buscador3.png" type="image/png"></DocImg>
        <p class="no-search note">
            <fa-icon class="pr-1" icon="asterisk"></fa-icon>Nota: las características en cuanto al filtrado de resultados e ignorar ciertos caracteres son compartidas con el resto de buscadores que encontraremos a lo largo de la aplicación.
        </p>
    </section>
</template>

<script>
export default {

}
</script>

<style>

</style>
