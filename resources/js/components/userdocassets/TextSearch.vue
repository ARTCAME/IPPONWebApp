<template>
    <div id="text-search">
        <div id="text-search-input-ctn">
            <b-form-input
                debounce="500"
                id="text-search-input"
                placeholder="Buscar..."
                type="search"
                v-model="searchValue"
                @input="search($event)"></b-form-input>
        </div>
        <transition name="slide-fade">
            <div
                id="text-search-result-ctn"
                v-if="searchValue">
                <ul class="m-3 p-0">
                    <li
                        v-if="searchValue && searchResults.length == 0">
                        <div class="text-muted">
                            Ningún resultado...
                        </div>
                    </li>
                    <li
                        v-else
                        v-for="(result, index) in searchResults"
                        :key="result.title + index"
                        @click.prevent="$scrollTo('#' + result.id)">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1 text-success">{{ result.title }}</h5>
                        </div>
                        <p class="text-muted">
                            {{ result.text }}...
                        </p>
                        <hr
                            v-if="searchResults.length > 1 && index < (searchResults.length - 1)">
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
    // import constants from '../../utils/constants';
    import HELPERS from '../../utils/helpers';
    import kebabCase from 'lodash/kebabCase';
    export default {
        data() {
            return {
                searchResults: [],
                searchValue: '',
            }
        },
        computed: {
            // results() {
            //     console.log(this.searchValue)
            //     let shownResults = [];
            //     // if (this.searchValue) {
            //         /* If <= 3 words has been search only in the titles */
            //         // if (this.searchValue.length <= 3) {
            //             Object.keys(this.html).forEach(key => {
            //                 /* Fake a document element to allow getElements from it */
            //                 let doc = document.createElement('div');
            //                 doc.className = 'fake-div'
            //                 doc.innerHTML = this.html[key];
            //                 this.getParent(doc, shownResults, key)
            //                     // .then(result => {
            //                     //     // shownResults.push(result);
            //                     //     console.log(shownResults)
            //                     //     console.log(result)
            //                     // });

            //                 /* Get the titles and its first next to paragraph */
            //                 // // const title = doc.getElementsByClassName('subtitle')[0];
            //                 // const paragraphs = doc.getElementsByTagName('p');
            //                 // // const titleText = title.innerText;
            //                 // const shownText = paragraphs[0].innerText.slice(0, 100);
            //                 // // const htmlText =  doc.innerHTML;
            //                 // // shownResults = this.manageCoincidences(titleText, shownText, shownResults, key);
            //                 // this.getParent(doc, shownText, shownResults, key);
            //                 // console.log(this.searchResults);
            //             });
            //         // }
            //         console.log(shownResults);
            //         return shownResults;
            //         // return this.searchResults;
            //     // } else {
            //     //     return [];
            //     // }
            // }
        },
        methods: {
            deepSearch(node) {
                if (node.nodeName == 'P') {
                    return node;
                }
                if ((node.nodeName == 'SECTION' || node.nodeName == 'ARTICLE') && node.firstChild) {
                    this.deepSearch(node.firstChild);
                }
                if (['H1', 'H2', 'H3', 'H4', 'H5'].includes(node.nextElementSibling.nodeName)) {
                    this.deepSearch(node.nextElementSibling);
                }
            },
            // async getParent(elem, shownResults, key) {
            getParent(elem, key) {
                // new Promise((resolve, reject) => {
                    const header = this.getClosestHeader(elem).textContent.trim().replace(/[:-]/ig, '');
                    // header = header.;
                    if (!this.isHeader(elem.nodeName) && elem.nodeType === Node.TEXT_NODE && !elem.parentElement.className.includes('no-search') && HELPERS.checkCoincidence(elem.nodeValue.trim(), this.searchValue)) {
                        /* If the search matches with the titles push the value if is not pushed yet */
                        // if (!this.searchResults.some(result => result.title == header)) {
                            // return {
                            //     id: kebabCase(key),
                            //     title: header.textContent.trim().replace(/[:-]/ig, ''),
                            //     text: elem.nodeValue.trim().replace(/[:-]/ig, '').slice(0, 100),
                            // };
                            this.searchResults.push({
                                id: kebabCase(key),
                                title: header,
                                text: elem.nodeValue.trim().replace(/[:-]/ig, '')/* .slice(0, 300) */,
                            });
                        // }
                        // console.log(elem.parentNode.nodeName + " contains text: " + elem.nodeValue.trim());
                    /* If the search doesn't match and the results include this result from a previous match, delete it */
                    } /* else if (elem.nodeType === Node.TEXT_NODE && !HELPERS.checkCoincidence(elem.nodeValue.trim(), this.searchValue)) {
                        const index = this.searchResults.findIndex(result => result.title == header);
                        if (index != -1) {
                            this.searchResults.splice(index, 1);
                        }
                    } */
                    elem.childNodes.length && elem.childNodes.forEach(e => this.getParent(e, key));

                    // if (elem.childNodes.length) {
                    //     for (const node of elem.childNodes) {
                    //         this.getParent(node, key);
                    //         // const s = this.getParent(node, key);
                    //         // if (s) {
                    //             // this.searchResults.push(s);
                    //         // }
                    //         // console.log(s)
                    //     }
                    // }
                    // resolve(results);
                    // elem.childNodes.length && elem.childNodes.forEach(e => this.getParent(e, shownResults, key));
                // })
            },
            /* This function assumes that never is going to exist and element wihout header */
            getClosestHeader(elem) {
                let header = elem;
                /* If the element is not header */
                if (!this.isHeader(elem.nodeName)) {
                    /* Check if exists a previous sibling and its a header */
                    if (elem.previousSibling != null) {
                        header = this.getClosestHeader(elem.previousSibling);
                        /* When found a header broke the recursivity and retur the element founded */
                        if (this.isHeader(header)) return header;
                    /* If doesn't exists previous sibling step up one level to continue checking the siblings/headers */
                    } else {
                        let inElem = elem.parentNode;
                        if (inElem != null) {
                            header = this.getClosestHeader(inElem);
                            if (this.isHeader(header)) return header;
                        }
                    }
                }
                return header;
            },
            isHeader(candidate) {
                return ['H1', 'H2', 'H3', 'H4', 'H5'].includes(candidate);
            },
            // manageCoincidences(onSearchText, resultText, results, target) {
            //     let value = this.searchValue;
            //     let inResults = results;
            //     /* If the search matches with the titles push the value if is not pushed yet */
            //     if (HELPERS.checkCoincidence(onSearchText, this.searchValue)) {
            //         if (!this.searchResults.some(result => result.title == onSearchText)) {
            //             this.searchResults.push({
            //                 id: kebabCase(target),
            //                 title: onSearchText,
            //                 text: resultText,
            //             });
            //         }
            //     /* If the search doesn't match and the results include this result from a previous match, delete it */
            //     } else {
            //         if (this.searchResults.findIndex(result => result.title == onSearchText) != -1) {
            //             this.searchResults.splice(index, 1);
            //         }
            //     }
            //     // return this.searchResults;
            // },
            search(ev) {
                console.log(ev);
                // let shownResults = [];
                if (ev) {
                    /* If <= 3 words has been search only in the titles */
                    // if (this.searchValue.length <= 3) {
                        Object.keys(this.html).forEach(async key => {
                            /* Fake a document element to allow getElements from it */
                            let doc = document.createElement('div');
                            doc.className = 'fake-div'
                            doc.innerHTML = this.html[key];

                            const res = this.getParent(doc, key)
                                // .then(result => {
                                //     // shownResults.push(result);
                                //     console.log(shownResults)
                                //     console.log(result)
                                // });

                            /* Get the titles and its first next to paragraph */
                            // // const title = doc.getElementsByClassName('subtitle')[0];
                            // const paragraphs = doc.getElementsByTagName('p');
                            // // const titleText = title.innerText;
                            // const shownText = paragraphs[0].innerText.slice(0, 100);
                            // // const htmlText =  doc.innerHTML;
                            // // shownResults = this.manageCoincidences(titleText, shownText, shownResults, key);
                            // this.getParent(doc, shownText, shownResults, key);
                            // console.log(this.searchResults);
                        });
                    // }
                    // console.log(shownResults);
                    // return shownResults;
                    // return this.searchResults;
                } /* else {
                    this.searchResults = [];
                } */
                console.log(this.searchResults);
            },
        },
        props: {
            html: Object,
            text: Object,
        }
    }
</script>

<style scoped>
    ul {
        padding: 0;
    }
    ul li {
        display: list-item;
        list-style-type:none;
    }
    #text-search {
        display: block;
        max-width: 600px;
        position: fixed;
        right: 25px;
        top: .7rem;
        width: 50%;
    }
    #text-search-result-ctn {
        background: rgba(248, 248, 248, 1);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: .25rem;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        cursor: pointer;
        margin-top: 10px;
        max-height: 300px;
        overflow-y: auto;
    }
</style>
