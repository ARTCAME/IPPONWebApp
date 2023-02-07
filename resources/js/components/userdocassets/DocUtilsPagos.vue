<template>
    <section id="doc-utils-pagos">
        <h1 class="subtitle">
            Actualiza y genera pagos
        </h1>
        <small class="text-muted">Última actualización 2020-01-04</small>
        <p>
            Esta utilidad está orientada a gestionar los pagos que los socios nos realicen físicamente en el centro aunque sus opciones nos permite gestionar cualquier tipo de pago. Debemos tener en cuenta que tenemos la sección para la <a href="doc-pagos" @click.prevent="$scrollTo('#doc-pagos')">gestión global de Pagos</a> desde la que podremos gestionar masivamente los pagos domiciliados.
        </p>
        <p>
            Está pensada para llevar el control de quién nos abona las cuotas, productos o servicios del centro y poder generar recibos de pago en el momento ya que la propia utilidad nos va a permitir descargar el recibo en el mismo momento para poder conservarlo o entregárselo al cliente.
        </p>
        <p>
            Vamos a poder generar, modificar o actualizar pagos basados, por un lado, en la cuota que tiene el socio para su pago mensual que escogiéramos durante el proceso de alta (o modificásemos después), y por otro, basados en pagos sobre algún producto o servicio concreto no basado en la cuota mensual: un campus, material, un pago parcial de una cuota, matrícula, etc.
        </p>
        <p>
            Los pagos podrán tener tres estados: 'Pendiente', 'Devuelto' o 'Confirmado' (el estado 'Devuelto' solo existe para pagos domiciliados). Los pagos que no hayan sido confirmados aparecerán en el estado ‘Pendiente’, los pagos con tarjeta y efectivo que hayan sido completados cambiarán al estado ‘Confirmado’ y los pagos domiciliados, una vez hayan sido completados, podrán aparecer como ‘Confirmado’ o ‘Devuelto’, según el caso concreto. Cuando usemos esta utilidad marcaremos los pagos 'Pendientes' a 'Confirmado' o 'Devuelto'.
        </p>
        <section>
            <h4 id="doc-utils-pagos-procedure">
                Pasos para la gestión de un pago
            </h4>
            <article>
                <h5 id="doc-utils-pagos-selection">
                    Selección del socio
                </h5>
                <p>
                    El primer paso siempre será seleccionar el socio sobre el que queremos gestionar un pago. Al iniciar la utilidad de gestión de un nuevo pago nos aparecerá directamente el buscador de socios para que podamos seleccionar el deseado.
                </p>
                <p>
                    Existe la opción de abrir directamente la gestión de un pago desde la sección 'Gestión de pagos' de la ficha de un socio como se ve en la siguiente imagen:
                </p>
                <DocImg alt="Botón de generación de pago en la ficha del socio" desc="Botón para generar un pago nuevo directamente desde la ficha de un socio" img="PagosUtils1.png" type="image/png"></DocImg>
                <p>
                    Independientemente del camino seguido para seleccionar al socio sobre el que queremos gestionar un pago, los siguientes pasos serán idénticos.
                </p>
            </article>
            <article>
                <h5 id="doc-utils-pagos-confirm-update">
                    Revisión de pagos anteriores
                </h5>
                <p>
                    Este paso <u>no siempre</u> lo deberemos realizar ya que solo será necesario si el socio tiene pagos pendientes. Es importante tener que cuenta que <u>nunca deberemos</u> crear pagos que ya existan para no duplicarlos y asi evitar desvirtuar los datos de la aplicación.
                </p>
                <DocImg alt="Aviso de pagos pendiente durante la creación de un nuevo pago" desc="Aviso de pagos pendiente durante la creación de un nuevo pago" img="PagosUtils2.png" type="image/png"></DocImg>
                <p>
                    El sistema nos advertirá de qué pagos tiene el socio pendientes por si alguno de ellos es el mismo que pretendemos crear. Si alguno de estos pagos se aviene al que queremos crear deberemos seleccionar el pago y en vez de crearlo podremos confirmarlo o editarlo.
                </p>
                <DocImg alt="Datos de pago ya existente, podemos confirmarlo o editarlo" desc="Datos de pago ya existente, podemos confirmarlo o editarlo" img="PagosUtils3.png" type="image/png"></DocImg>
                <p>
                    Si seleccionamos la opción 'Marcar como pagado' o 'Marcar como pagado y descargar recibo' el pago quedará automáticamente en estado 'Confirmado' (y podremos o no descargar el recibo). Tanto si usamos la opción 'Editar el pago' como 'Omitir y gestionar nuevo pago' iremos a la edición/creación de pagos que se explica en el apartado siguiente.
                </p>
            </article>
            <article>
                <h5 id="doc-utils-pagos-edit-create">
                    Formulario de creación y edición de pagos
                </h5>
                <p>
                    A este formulario llegaremos directamente desde los socios que no tengan pagos anteriores pendientes o si los tienen hemos escogido omitir y crear un pago nuevo y también llegaremos a este formulario si hemos seleccionado un pago anterior.
                </p>
                <p>
                    El formulario de edición y creación de pagos es el mismo, la única diferencia será que en un pago editado la mayoría de campos estarán rellenados y en un pago nuevo no.
                </p>
                <DocImg alt="Formulario de creación de un nuevo pago" desc="Formulario de creación de un nuevo pago" img="PagosUtils4.png" type="image/png"></DocImg>
                <h6>
                    <u>Glosario de los datos del formulario</u>
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
                <p class="no-search note">
                    <fa-icon class="pr-1" icon="asterisk"></fa-icon>Nota: En la sección <a href="#doc-pagos" @click.prevent="$scrollTo('#doc-pagos')">Pagos</a> veremos más detalles sobre los procesos de edición y creación de pagos que se pueden hacer desde allí, básicamente son los mismos procesos pero generados desde otro origen.
                </p>
            </article>
        </section>
    </section>
</template>
