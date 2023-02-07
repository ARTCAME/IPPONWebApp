export const wmpSteps = [
    {
        target: '[data-v-step="wzd-main-pagos-0"]',
        content: 'En esta tabla verás los datos de los pagos que existen en el sistema. Los nuevos pagos se irán añadiendo automáticamente el día 1 de cada mes con el estado "Pendiente" y posteriormente confirmaremos su estado definitivo que podrá ser "Confirmado" o "Devuelto".',
        offset: '-135',
        params: {
           placement: 'top-start'
        }
    },
    {
        target: '[data-v-step="wzd-main-pagos-1"]',
        content: 'Desde esta columna podrás editar los datos relevantes del pago: "Tarifa", "Importe", "Forma de pago", "Estado" y "Fecha de pago confirmado". Si necesitas modificar algún otro dato del socio puedes acceder a su ficha directamente.',
        offset: '-135',
        params: {
           placement: 'left'
        }
    },
    {
        target: '[data-v-step="wzd-main-pagos-2"]',
        content: 'Desde aquí podrás aplicar filtros a la tabla para ver solamente la información que necesites.',
        offset: '-135',
        params: {
           placement: 'top'
        }
    },
    {
        target: '[data-v-step="wzd-main-pagos-3"]',
        content: 'Aquí verás los filtros que tengas activos, por defecto el sistema aplicará el mes y año actuales.',
        offset: '-135',
        params: {
           placement: 'top-start'
        }
    },
    {
        target: '[data-v-step="wzd-main-pagos-4"]',
        content: 'Desde este botón podrás descargar los datos que tengas actualmente en la tabla.',
        offset: '-135',
        params: {
           placement: 'left'
        }
    },
    {
        target: '[data-v-step="wzd-main-pagos-5"]',
        content: 'Desde la barra de navegación podrás acceder a varias acciones como la confirmación de pagos domiciliados de manera masiva, la descarga del fichero de remesa o mostrar gráficos sobre los datos de la tabla. Si activas cualquiera de ellas podrás ver información más detallada de cada proceso.',
        offset: '-135',
        params: {
           placement: 'bottom-start'
        }
    },
]

export const wpcSteps = [
    {
        target: '[data-v-step="wzd-pagos-confirming-0"]',
        content: `<h4>Confirmación de pagos</h4>La confirmación de pagos es el proceso por el cual establecerás un estado definitivo a los pagos generados mediante domiciliación.<br><br><h5>Contexto</h5>Los pagos son añadidos automáticamente el día 1 de cada mes en el estado "Pendiente"; día en el que también recibirás un correo electrónico con el archivo de remesa para enviar al banco.<br><br><h5>Objetivo</h5>Confirmando los pagos conseguirás establecer el estado definitivo para un pago: "Confirmado" o "Devuelto". De esta manera podremos conocer el estado de los pagos en cada ficha de los socios de IPPONGYM.`,
        offset: '-135',
        params: {
            placement: 'bottom-start'
        }
    },
    {
        target: '[data-v-step="wzd-pagos-confirming-1"]',
        content: 'Busca y selecciona los pagos a los que quieres confirmar el estado. Solamente tendrás habilitadas las filas que sea posible confirmar, es decir, aquellas que tengan la forma de pago "Domiciliación" y estén en estado "Pendiente".',
        offset: '-135',
        params: {
            placement: 'top'
        }
    },
    {
        target: '[data-v-step="wzd-pagos-confirming-2"]',
        content: 'Selecciona el estado que quieres establecer.',
        offset: '-135',
        params: {
            placement: 'right'
        }
    },
    {
        target: '[data-v-step="wzd-pagos-confirming-3"]',
        content: 'Pulsa este botón para guardar el nuevo estado y habrás finalizado el proceso.',
        offset: '-135',
        params: {
           placement: 'right'
        }
    },
]

export const wpdSteps = [
    {
        target: '[data-v-step="wzd-pagos-download-0"]',
        content: `<h4>Descarga fichero de pagos</h4>Mediante este proceso podrás descargar manualmente el fichero de pagos domiciliados con el formato y los datos necesarios para poder enviárselo a la entidad bancaria para que generen las remesas a los socios.<br><br><h5>Contexto</h5>Los pagos son añadidos automáticamente el día 1 de cada mes con el estado "Pendiente"; día en el que también recibirás un correo electrónico con el archivo de remesa para enviar al banco.<br><br><h5>Objetivo</h5>Si por algún motivo el fichero recibido por e-mail el día 1 no está correcto o has hecho algún cambio a los datos de algún socio y necesitas enviar esos cambios a la entidad bancaria, desde este proceso puedes descargar tantas veces como quieras, y de los socios que quieras, el fichero de pagos.`,
        offset: '-135',
        params: {
           placement: 'bottom-start'
        }
    },
    {
        target: '[data-v-step="wzd-pagos-download-1"]',
        content: 'Busca y selecciona los pagos sobre los que quieres descargar sus datos. Solamente tendrás habilitadas las filas que sea posible descargar, es decir, aquellas que tengan la forma de pago "Domiciliación" y estén en estado "Pendiente".',
        offset: '-135',
        params: {
           placement: 'top'
        }
    },
    {
        target: '[data-v-step="wzd-pagos-download-2"]',
        content: 'Cuando hayas seleccionado los pagos que necesites incluir en el fichero, pulsa este botón para descargarlo y finalizar el proceso.',
        offset: '-135',
        params: {
           placement: 'left'
        }
    },
]
