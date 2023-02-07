<script>
    export default {
        install (Vue, options) {
            /**
             * Function to convert array of table data to a csv file globally
             *
             * @param {Array} arrKeys: Contain the strings of the columns of the table that will be added as headers
             * @param {Array} arrData: Contains the row of the table with the data
             * @param {String} fileName: Name of the download file
             * @param {String} elAnimated: On the view we want a feedback to the user, it refers to the flag with shows a button feedback
             */
            Vue.prototype.$tableToCsv = function(arrKeys, arrData, fileName, elAnimated = null) {
                // console.log(arrData)
                // console.log(arrData[0].paymentData.rate)
                // HAY QUE PODER IMPRIMIR LO ABOVE
                // console.log(arrData[0]['paymentData.rate'])
                /* Transform the mongo name of variants to user friendly names */
                const COLUMN_NAMES = {
                    'ibanownername': 'Nombre',
                    'ibanownerdni': 'Dni',
                    'iban': 'Iban',
                    'amount': 'Importe',
                    'interval': 'Intervalo',
                    'customerNumber': 'Nº socio',
                    'paymenttype': 'Forma de pago',
                    'name': 'Nombre',
                    'rate': 'Tarifa',
                    'dateconfirmed': 'Fecha de confirmación',
                };
                let fileKeys = [];
                arrKeys.forEach(key => {
                    let cn = COLUMN_NAMES[key] || null;
                    /* If the key is avaiable change its name */
                    if (cn) {
                        fileKeys.push(cn);
                    /* Contemplate the residual possibility of a keys undeclared */
                    } else {
                        fileKeys.push(key);
                    }
                });
                /* Add the data to the csv file */
                let csvContent, keys;
                keys = arrKeys;
                csvContent = '';
                csvContent += fileKeys.join(';'); /* Add to the csv file the transformed column names */
                csvContent += '\n';
                arrData.forEach(item => {
                    keys.forEach(key => {
                        if (item[key]) {
                            /* Detect if an element is a mongo formatted date and format it */
                            if (item[key].$date && this.$moment(parseInt(item[key].$date.$numberLong)).isValid()) {
                                csvContent += this.$moment(parseInt(item[key].$date.$numberLong)).format('DD-MM-YYYY HH:mm:ss');
                            /* Detect sub objects and fetch it on the same 'cell' */
                            } else if (item[key] instanceof Object) {
                                item[key].forEach(subItem => {
                                    Object.values(subItem).forEach(subItemValue => {
                                        csvContent += subItemValue + '-';
                                    })
                                    csvContent = csvContent.replace(/-$/,'');
                                    csvContent += ' ';
                                });
                            } else {
                                csvContent += item[key] + ';';
                            }
                        /* If the data doesn't has the key insert blank space */
                        } else {
                            csvContent += ';';
                        }
                    })
                    csvContent += '\n';
                })
                /* Create a dummy element and interact with it to generate the download of the file */
                var dummyEl = document.createElement('a');
                dummyEl.href = 'data:text/csv; charset=utf-8,' + encodeURIComponent("\uFEFF" + csvContent);
                dummyEl.target = '_blank';
                dummyEl.download = fileName;
                dummyEl.click();
                /* Change the flag status to show a feedback to the user on the view */
                if (elAnimated !== null) {
                    if (!this[elAnimated]) {
                        this[elAnimated] = true;
                    }
                    setTimeout(() => {
                        this[elAnimated] = false;
                    }, 1500);
                }
            }
        }
    }
</script>
