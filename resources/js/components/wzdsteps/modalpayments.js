export const wmodalpayments = [
    {
        target: '[data-v-step="wzd-modal-payments-0"]',
        content: `<h4>Añade y actualiza pagos</h4>Desde esta herramienta podrás gestionar nuevos pagos para los que recibas el dinero por parte del cliente.<br><br>El sistema detecta automáticamente si el pago existe o no y si existe carga las características con las que se creó (forma de pago, importe y tarifa).<br><br>En la creación de nuevos pagos se usarán los datos que existen en la ficha del socio y en la actualización de pagos se usarán los datos del pago guardado, por lo que, es posible que algún dato no se ajuste, si fuera así puedes acceder a la ficha de socio y modificar lo que necesites.`,
        params: {
            placement: 'top',
        }
    },
    {
        target: '[data-v-step="wzd-modal-payments-1"]',
    content: `Selecciona un intervalo, el sistema detecta en tiempo real si existen pagos para el mes/año seleccionados y si fuera así no permitirá que escojas un periodo en el que ya haya un pago con un estado confirmado.<br><br>Los pagos efectuados con tarjeta y efectivo se añadirán con el estado 'Confirmado', para los pagos domiciliados deberás escoger entre 'Confirmado' o 'Devuelto'.`,
        params: {
            placement: 'bottom-start',
        }
    },
    {
        target: '[data-v-step="wzd-modal-payments-2"]',
        content: `Muestra el resumen del pago a registrar. Debes revisar que todo esté correcto antes de registrar el pago. <br><br>En este apartado, el sistema puede mostrarte mensajes indicativos de que existe un error o si falta por seleccionar algún dato.<br><br>Si necesitas modificar algún dato del socioo de la forma de pago deberás ir a la ficha del socio.`,
        params: {
            placement: 'top',
        }
    },
]

export const wmodalpayments_previouspending = [
    {
        target: '[data-v-step="wzd-modal-payments-previouspending-0"]',
        content: `En la lista se te los pagos pendientes que tiene el socio para que, si fuera el caso, utilices el botón 'Usar' que encontrarás en cada línea de la tabla para editar ese pago y no crear uno nuevo.<br><br>Si ningún pago se corresponde con el que quieres añadir puedes usar el botón 'Omitir y gestionar nuevo pago'`,
        params: {
            placement: 'top',
        }
    },
]

