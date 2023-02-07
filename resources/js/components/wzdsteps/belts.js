export const wcuSteps = [
    {
        target: '[data-v-step="wzd-cinturones-update-0"]',
        content: `<h4>Actualización de grados</h4>La actualización de grados es el proceso con el que podrás actualizar masivamente los grados de los socios que elijas.<br><br><h5>Contexto</h5>En la tabla verás todos los socios que estén activos y que tengan una tarifa que incluya karate. Todos los socios empezarán con grado blanco otorgado en la fecha de alta del socio.<br><br><h5>Objetivo</h5>Una vez realizados los exámenes de grado podrás actualizar los socios al siguiente grado que le corresponda. Solamente deberás seleccionar los socios a actualizar y el sistema añadirá a su histórico el nuevo grado que le corresponde automáticamente.`,
        offset: '-135',
        params: {
            placement: 'bottom-start',
        }
    },
    {
        target: '[data-v-step="wzd-cinturones-update-1"]',
        content: 'Busca y selecciona en la tabla los socios a los que quieres otorgarles un nuevo grado. Recuerda, solo podrás escoger los socios que no sean cinturón negro.',
        offset: '-135',
        params: {
            placement: 'top',
        }
    },
    {
        target: '[data-v-step="wzd-cinturones-update-2"]',
        content: 'Selecciona la fecha en la que se otorgó el grado al socio.',
        offset: '-135',
        params: {
            placement: 'right',
        }
    },
    {
        target: '[data-v-step="wzd-cinturones-update-3"]',
        content: 'Guarda los cambios y finaliza el proceso pulsando en este botón. Se descargará un archivo en formato csv que deberás usar para generar los diplomas.',
        offset: '-135',
        params: {
            placement: 'right',
        }
    },

]

export const wcdSteps = [
    {
        target: '[data-v-step="wzd-cinturones-download-0"]',
        content: `<h4>Descarga manual de archivo de grados</h4>Con este proceso podrás descargar manualmente los grados que necesites exportar a fichero para generar diplomas.<br><br><h5>Contexto</h5>Si necesitas volver a descargar o recuperar algún fichero de grados, con este proceso podrás volver a descargar los datos necesarios para usarlos en la creación de diplomas.<br><br><h5>Objetivo</h5>Para poder generar los diplomas necesitamos exportar los datos que se generan al actualizar los grados. Si por algún motivo no descargaste los datos desde el proceso de actualización desde aquí podrás descargarlos cuando quieras y tantas veces como quieras.`,
        offset: '-135',
        params: {
            placement: 'bottom-start'
        },
    },
    {
        target: '[data-v-step="wzd-cinturones-download-1"]',
        content: 'Busca y selecciona en la tabla los socios de los que quieres descargar el archivo para generar los diplomas.',
        offset: '-135',
        params: {
            placement: 'top'
        }
    },
    {
        target: '[data-v-step="wzd-cinturones-download-2"]',
        content: 'Pulsa en este botón para descargar el fichero necesario para generar los diplomas de grado.',
        offset: '-135',
        params: {
            placement: 'left'
        }
    }
]

export const wmcSteps = [
    {
        target: '[data-v-step="wzd-main-cinturones-0"]',
        content: 'En esta tabla verás los socios que tienen una tarifa que incluye karate o que han obtenido algún grado. Desde aquí podrás consultar, modificar o seleccionar los socios y sus grados, usar los seleccionados para descargar archivos de grado para generar diplomas u otorgar nuevos grados a los socios que los hayan conseguido.',
        offset: '-135',
        params: {
            placement: 'top',
        }
    },
    {
        target: '[data-v-step="wzd-main-cinturones-1"]',
        content: 'Usa los filtros para buscar en la tabla más fácilmente.',
        offset: '-135',
        params: {
            placement: 'top',
        }
    },
    {
        target: '[data-v-step="wzd-main-cinturones-2"]',
        content: 'Los filtros aplicados aparecerán aquí y si este campo se encuentra vacío es que estás viendo todos los datos sin aplicar ningún filtro. La tabla muestra por defecto los socios en estado Activo, si quieres ver los socios inactivos activa la opción disponible al final de la tabla.',
        offset: '-135',
        params: {
            placement: 'bottom',
        }
    },
    {
        target: '[data-v-step="wzd-main-cinturones-3"]',
        content: 'Pulsando sobre el nombre del socio podrás acceder a su ficha y consultar todos sus datos.',
        offset: '-135',
        params: {
            placement: 'top',
        }
    },
    {
        target: '[data-v-step="wzd-main-cinturones-4"]',
        content: 'Pulsando sobre el botón de detalles (o también desde la columna Grado actual o Siguiente grado) accederás a los detalles del socio donde verás todos sus grados otorgados y podrás editarlos.',
        offset: '-135',
        params: {
            placement: 'left'
        }
    },
    {
        target: '[data-v-step="wzd-main-cinturones-5"]',
        content: 'Imprime los datos de la tabla usando este botón.',
        offset: '-135',
        params: {
            placement: 'left',
        }
    },
    {
        target: '[data-v-step="wzd-main-cinturones-6"]',
        content: 'Desde la barra de navegación podrás acceder a varias acciones como la actualización masiva de grados que incluye la descarga del fichero para la creación de diplomas o la descarga manual de ese fichero. Si activas cualquiera de ellas podrás ver información más detallada de cada proceso.',
        offset: '-135',
        params: {
           placement: 'bottom',
           enableScrolling: false /* Doesn't have effect, pointing to the navbar scrolls up jumping the fixed body padding */
        }
    },
]
