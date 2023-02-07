<template>
    <section id="doc-tests">
        <h1 class="subtitle">
            Tester
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            Esta sección contiene los tests a realizar sobre la aplicación y los ya realizados por el usuario que ha iniciado sesión.
        </p>
        <p>
            Cada test está contenido en una tarjeta en la que se tenemos diferente contenido:
            <br>
            &emsp;- Nombre y tipo de test
            <br>
            &emsp;- Qué tiene que hacer el usuario
            <br>
            &emsp;- Qué características debe tener el socio/a a testear
            <br>
            &emsp;- Un selector de resultado con tres estados:
            <br>
            &emsp;&emsp;- Todo bien: La prueba ha ido bien y hemos podido cumplir todo lo que se pide
            <br>
            &emsp;&emsp;- Algo ha ido mal: Aunque la prueba ha ido parcial o totalmente bien hemos visto algo incorrecto o algo ha fallado
            <br>
            &emsp;&emsp;- Imposible acabar: No hemos podido completar la prueba por que algo ha fallado
            <br>
            &emsp;- Un campo para añadir imágenes que muestren un error (este campo aparece cuando se selecciona un resultado diferente a 'Todo bien'
            <br>
            &emsp;- Un campo para añadir el identificador del socio
            <br>
            &emsp;- Un campo de texto para explicar cómo ha ido la prueba, es especialmente relevante para los casos en los que se produzca algún fallo ya que podremos explicar qué ha sucedido e indicar un el código de error
        </p>
        <DocImg alt="Tests" desc="Podemos ver diferentes tests con su contenido" img="Tests1.png" type="image/png"></DocImg>
        <p>
            Los tests pendientes los veremos en el apartado Pendientes y los que hayamos finalizado desaparecerán de esta sección y se mostrarán en el apartado Completados.
        </p>
        <p>
            Además, como vemos en la captura, podemos buscar en los tests a través de cualquiera de sus campos para localizar alguno rápidamente.
        </p>
        <p>
            Los tests son registrados en la base de datos y serán visibles por el administrador para gestionar los resultados.
        </p>
    </section>
</template>
