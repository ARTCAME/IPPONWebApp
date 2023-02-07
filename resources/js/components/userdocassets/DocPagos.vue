<template>
    <section id="doc-pagos">
        <h1 class="subtitle">
            Gestión global de pagos
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            Desde la gestión global de pagos tendremos una visión global de todos los pagos de cada socio/a que tenemos en nuestro club ya que disponemos de un listado con todos los pagos registrados así como gráficos para ayudarnos a destacar la información que necesitemos. Por otro lado, nos será útil para evitar el trabajo repetitivo a la hora de gestionar los pagos domiciliados.
        </p>
        <DocImg alt="Gestión global de pagos" desc="Desde la gestión de pagos podremos acceder a consultar datos de los pagos y a gestionar las remesas generadas en el banco" img="Pagos1.png" type="image/png"></DocImg>
        <p class="no-search note">
            <fa-icon class="pr-1" icon="asterisk"></fa-icon>Nota: al cargar esta sección siempre se hará filtrando por el mes y año actuales
        </p>
        <p>
            Recordemos algunos datos sobre los pagos:
            <br>
            &emsp;- Los pagos se generarán automáticamente a principios de mes para los socios en estado Activo e independientemente del tipo de pago
            <br>
            &emsp;- Para los pagos generados automáticamente y que tengan forma de pago domiciliación recibiremos un archivo de remesa para enviar al banco, allí tendremos toda la información relevante para que el banco pueda gestionar el cobro al cliente/a
            <br>
            &emsp;- En el archivo de remesa de pagos domiciliados, los pagos se agruparán por IBAN, así, todos los pagos que compartan IBAN los veremos en una misma línea sumados. Esto no altererá el funcionamiento individual del pago ya que veremos en cada socio su pago generado y su estado lo deberemos actualizar a cada socio individualmente, eso sí, de cara al banco generaremos una única orden de pago
            <br>
            &emsp;- Podemos generar pagos relacionados con la cuota periódica de manera manual desde la utilidad global de pagos siempre y cuando no se hayan generado ya automáticamente. El sistema tendrá en cuenta el periodo de pago para determinar si un pago ya existe, esto quiere decir que este pago generado manualmente no se generará automáticamente y en el caso de un pago generado automáticamente no podrá ser generado manualmente nunca
            <br>
            &emsp;- Todos los pagos generados automáticamente se establecen en el estado 'Pendiente' y posteriormente desde la sección de pagos o desde la utilidad global de pagos deberemos confirmar su estado definitivo, esto es siempre así y para cada pago
        </p>
        <article>
            <h4 id="doc-pagos-editar">
                Edición de pagos desde la página de gestión global de pagos:
            </h4>
            <p>
                Al igual que hemos visto en la sección de edición de un socio, desde la gestión global de pagos también podremos realizar modificaciones a los pagos.
            </p>
            <p>
                A la hora de consultar pagos podemos usar los filtros disponibles para localizar rápidamente un pago:
            </p>
            <DocImg alt="Edición de pagos" desc="Tenemos disponibles filtros para localizar un pago y podremos descargar los recibos de los pagos confirmados, las columnas de la tabla pueden diferir" img="Alta10.png" type="image/png"></DocImg>
            <p>
                Para editar un pago iremos a la línea que lo contiene y pulsaremos en el botón de editar situado en el margen derecho para que se nos abra el formulario de edición con los datos del pago cargados.
            </p>
            <DocImg alt="Editando un pago" desc="Al editar un pago podremos cambiar cualquier campo que necesitemos, los campos siempre aparecerán rellenados con los datos del pago" img="Alta11.png" type="image/png"></DocImg>
            <h6>
                <u>Glosario de los datos del formulario de edición</u>
            </h6>
            <ul>
                <li>
                    - <u>Socio</u>: Es el nombre del socio al que corresponde el pago
                </li>
                <br>
                <li>
                    - <u>Tipo de pago</u>: Escogeremos entre 'Cuota periódica' (pagos basados en la cuota mensual que tiene el socio) y 'Pago manual' (pagos manuales en los que indicaremos un importe y un concepto)
                </li>
                <br>
                <li>
                    - <u>Tarifa</u>: Es la tarifa mensual del socio en pagos periódicos o el concepto de pago en pagos manuales
                </li>
                <br>
                <li>
                    - <u>Importe</u>: La cantidad a pagar en euros
                </li>
                <br>
                <li>
                    - <u>Estado</u>: Es el nuevo estado, escogeremos entre 'Confirmado', 'Pendiente' o 'Devuelto' (solo pagos domiciliados)
                </li>
                <br>
                <li>
                    - <u>Periodo de pago</u>: Es el periodo mes-año al que corresponde el pago. En pagos periódicos es obligatorio indicarlo no siéndolo en los pagos manuales
                </li>
                <br>
                <li>
                    - <u>Fecha de confirmación</u>: Es la fecha en la que el pago se efectúa. Se rellena automáticamente al seleccionar un estado diferente a 'Pendiente' con la fecha actual pero podremos editarla
                </li>
                <br>
                <li>
                    - <u>Forma de pago</u>: Escogeremos entre 'Efectivo', 'Tarjeta' y 'Domiciliación', si escogemos 'Domiciliación' deberemos rellenar el IBAN y el nombre y dni del titular del IBAN
                </li>
                <br>
            </ul>
            <h6>
                <u>Características para la creación y edición de pagos:</u>
            </h6>
            <ul>
                <li>
                    - Si seleccionamos un pago de 'Cuota periódica', que hace referencia a la cuota mensual establecida para el socio, se cargarán al formulario ciertos datos de la ficha del socio: tarifa, importe mensual y datos de pago
                </li>
                <br>
                <li>
                    - Si seleccionamos un pago del tipo 'Pago manual', que se referirá a un concepto que deberemos indicar como matrícula, cuota parcial, material, etc., se cargarán al formulario los datos del pago registrados en la ficha del socio
                </li>
                <br>
                <li>
                    - Los datos cargados en el formulario se pueden editar, es decir, un pago de 'Cuota periódica' puede generarse con una tarifa, importe o datos de pago diferentes a los que se carguen desde la ficha del socio; este cambio solo se aplica al pago específico que estamos gestionando y no se guarda permanentemente en la ficha del socio
                </li>
                <br>
                <li>
                    - Si estamos editando un pago, además de los datos ya indicados, se cargarán también el periodo de pago y el concepto, dependiendo de si es un pago manual o periódico
                </li>
                <br>
                <li>
                    - Siempre deberemos indicar un estado para poder guardar el pago. Si el nuevo estado es 'Confirmado' o 'Devuelto' se asignará una fecha de confirmación que hará referencia al momento de la creación, podemos modificarla si lo necesitamos
                </li>
                <br>
                <li>
                    - Al guardar la creación o edición de un recibo podremos escoger si queremos descargar o no el recibo de ese pago (lo podremos descargar en otro momento si fuera necesario)
                </li>
            </ul>
            <p>
                Vamos a recordar el comportamiento del formulario de edición de pagos:
                <br>
                &emsp;- Tal como hemos visto en el proceso de alta, al cambiar la tarifa el importe de la cuota se modifica automáticamente según las tarifas establecidas, si seleccionamos una tarifa del tipo Personalizada podremos indicar un importe específico
                <br>
                &emsp;- Un pago en efectivo o tarjeta no podrá tener el estado Devuelto por lo que no podremos seleccionar esta opción; si estuviera seleccionada se vaciaría y para poder guardar deberemos seleccionar un nuevo estado
                <br>
                &emsp;- Los pagos domiciliados tendrán los datos del iban y su titularidad, si cambiamos un pago domiciliado a otra forma de pago esos datos se borrarán
                <br>
                &emsp;- Los pagos con estado 'Devuelto' o 'Confirmado' tienen fecha de confirmación que es la fecha en la que se estableció ese estado, si modificamos el estado a Pendiente la fecha de confirmación se eliminará automáticamente, esto sumado al punto anterior quiere decir que si tengo un pago domiciliado y devuelto que lo cambio a tarjeta, este cambio alterará el estado eliminando el estado Devuelto y esto a su vez quitará la fecha de confirmación
            </p>
            <p>
                Una vez hayamos realizado los cambios que necesitemos usaremos el botón guardar para finalizar la edición del pago.
            </p>
            <p>
                De nuevo, recordamos que la edición de un pago también nos habilita a borrarlo. Borrar un pago es un proceso no recomendado ya que las causas que nos pueden llevar a necesitar borrarlo están cubiertas con la edición de pagos, vamos a ver casos en los que nos puede parecer interesante borrar un pago pero en los que realmente no será necesario:
                <br>
                &emsp;- Si un pago no se abonara o el socio/a ya no es socio/a: el pago se mantiene en el histórico como pendiente o devuelto según el caso, recordemos que si desactivamos el socio no se generarán nuevos pagos mensuales
                <br>
                &emsp;- Un pago tiene datos que no se corresponden con los datos reales: modificaremos los datos que necesitemos del pago, no hay nada que no podamos cambiar en el pago que justifique borrarlo
            </p>
        </article>
        <article>
            Además, disponemos de las herramientas globales para gestionar procesos en los pagos:
            <DocImg alt="Herramientas para gestión de pagos en la barra de navegación" desc="Herramientas para la gestión de pagos en la barra de navegación" img="Pagos3.png" type="image/png"></DocImg>
            <h4 id="doc-pagos-confirmar">
                Confirmación de pagos:
            </h4>
            <p>
                Este proceso nos servirá para actualizar todos los pagos domiciliados a la vez y no tener que hacerlo individualmente. En realidad, este proceso puede realizarse por la cantidad de pagos que queramos así que podrá ser desde uno hasta los que necesitemos.
            </p>
            <p>
                Debemos tener en cuenta que la aplicación va a limitar los pagos sobre los que podemos realizar la confirmación en base a diferentes criterios para evitar que confirmemos pagos que no pueden ser confirmados, la aplicación limitará de la siguiente manera:
                <br>
                &emsp;- No se pueden confirmar pagos que no tengan forma de pago domiciliación
                <br>
                &emsp;- No se pueden confirmar pagos que ya hayan sido confirmados
            </p>
            <p>
                Además, para entender mejor lo que vamos a gestionar confirmando pagos, vamos a poner un poco más de contexto:
                <br>
                &emsp;- Los pagos mensuales se generan automáticamente a inicio de mes
                <br>
                &emsp;- Enviamos al banco los datos de los clientes/as a los que se les debe enviar un cobro domiciliado
                <br>
                &emsp;- Posteriormente, el banco nos contesta con la resolución de los pagos y debemos actualizarlos todos a su nuevo estado, teniendo en cuenta que tendremos confirmados y devueltos
            </p>
            <p>
                Los pasos para gestionar la confirmación de pagos domiciliados serán muy sencillos:
                <br>
                &emsp;- Localizar y seleccionar los pagos a los que queremos confirmar su estado
                <br>
                &emsp;- Seleccionamos el nuevo estado a establecer
                <br>
                &emsp;- La aplicación añadirá automáticamente la fecha y hora actuales como momento de la confirmación del pago
                <br>
                &emsp;- Deberemos repetir este proceso para cada estado que necesitemos establecer
            </p>
        </article>
        <article>
            <h4 id="doc-pagos-descargar">
                Descarga manual de archivo de remesa:
            </h4>
            <p>
                En diversas situaciones podrá ser de utilidad poder descargar manualmente un archivo de remesa:
                <br>
                &emsp;- Un pago domiciliado no se ha incluido en la remesa automática por que no lo modificamos a tiempo
                <br>
                &emsp;- El cliente nos ha cambiado la forma de pago tras generarse la remesa automática
                <br>
                &emsp;- Nos han venido pagos devueltos que queremos volver a pasar por el banco a los clientes/as
            </p>
            <p>
                En todos estos casos podremos utilizar esta herramienta para descargar un fichero en con los datos de los socios sobre los que queremos generar un nuevo pago.
            </p>
            <p>
                El proceso es muy sencillo:
                <br>
                &emsp;- Localizaremos y seleccionaremos los pagos que queremos volver a enviar al banco
                <br>
                &emsp;- Pulsaremos el botón de descarga del fichero de remesa y lo enviaremos al banco
            </p>
        </article>
        <article>
            <!-- <h4 id="doc-pagos-graficos">
                Gráficos de pagos:
            </h4>
            <p>
                <p>
                    Esta herramienta de consulta nos ayudará a tener una visión global de los datos que vemos en la tabla de pagos.
                </p>
                <p>
                    La información que veremos en los gráficos está sujeta a los filtros que aplicamos a la tabla, así, si hacemos algún cambio a los filtros de la tabla estos se reflejarán en los gráficos.
                </p>
                <p>
                    En el propio apartado de gráficos podremos ver en detalle qué información dispone cada gráfico.
                </p>
            </p> -->
        </article>
    </section>
</template>
