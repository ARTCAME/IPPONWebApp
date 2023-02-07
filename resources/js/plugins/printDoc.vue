<script>
    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';
    export default {
        install (Vue, options) {
            /**
             * Function download a screenshot as pdf file
             *
             * @param {String} filename: The name of file
             * @param {HTMLElement} elem: The element to take a screenshot
             */
            Vue.prototype.$printDoc = function(filename, elem) {
                var doc = new jsPDF('p', "mm", "a4");
                return new Promise((resolve, reject) => {
                    /* Sets the scrolls to 0 avoiding jumps on the resultant image */
                    html2canvas(elem, { logging: false, scrollX: 0, scrollY: 0 })
                        .then((canvas) => {
                            const img = canvas.toDataURL("image/jpeg", 1);
                            doc.addImage(img, 'JPEG', 15, 15);
                            doc.save(filename);
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            }
        }
    }
</script>
