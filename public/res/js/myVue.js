var eventBus = new Vue()

Vue.component('v-placegroup', {
    template: '#v-placegroup',
    props: {
        placegroup: {
            type: Object,
            required: true,
        }
    },
    methods: {
        showPlaceInfo(place) {
            removeHighlight()
            highlightPlace(place)
        },
    },
    computed: {
        places() {
            return this.placegroup.places
        },
        placegroupID() {
            return this.placegroup.id
        },
        isDepartment() {
            return this.placegroupID == 'pl-department'
        },
        isBusstop() {
            return this.placegroupID == 'pl-busstop'
        },
        isCanteen() {
            return this.placegroupID == 'pl-canteen'
        },
        isCopier() {
            return this.placegroupID == 'pl-copier'
        },
        isHostel() {
            return this.placegroupID == 'pl-hostel'
        },
        isActivity() {
            return this.placegroupID == 'pl-activity'
        },
        getMaterialIcon() {
            // ternary operator
            return this.isDepartment ? constants.materialized.icons.departments :
                this.isBusstop ? constants.materialized.icons.busStops :
                this.isCanteen ? constants.materialized.icons.canteens :
                this.isCopier ? constants.materialized.icons.copiers :
                this.isHostel ? constants.materialized.icons.hostels :
                this.isActivity ? constants.materialized.icons.activities :
                constants.materialized.icons.otherPlaces;
        }
    },
})

Vue.component('v-dock', {
    template: '#v-dock',
    data() {
        return {
            place: new Place({
                properties: {},
                coordinates: [],
            }),
            isExpanded: false,
            visible: true,
            height: '0vh',
        }
    },
    methods: {
        show() {
            this.height = '16vh'
        },
        hide() {
            this.height = '0vh'
        },
        routeToPage() {
            this.hide()
            router.push({
                name: 'place',
                params: this.place
            })
        }
    },
    mounted() {
        eventBus.$on('show-dock', place => {
            this.place = place
            this.show()
        })

        eventBus.$on('hide-dock', e => {
            this.hide()
        })
    }
})

Vue.component('v-sidebar', {
    template: '#v-sidebar',
    data() {
        return {
            placegroups: [],
            totalPlace: 0,
            inputString: '',
            results: [],
            resultGroupHeight: '0vh',
            isOnSearch: false,
            searchInputIsVisible: true,
            populationAnalisisIsOn: false,
            placeAnalisisIsOn: false,
        }
    },
    methods: {
        showPlaceInfo(result) {
            // clearing search results and previous highlight
            $('#searchInput').val('')
            this.quitSearch()
            removeHighlight()
            highlightPlace(result.item)
        },
        getMaterialIcon(type) {
            return getMaterialIcon(type)
        },
        getPercentage(placeNum) {
            return Math.round((placeNum / this.totalPlace) * 100)
        },
        getThemeColor(placegroupID) {
            switch (placegroupID) {
                case 'pl-department':
                    return '#4285f4'
                case 'pl-busstop':
                    return '#0a8ea0'
                case 'pl-canteen':
                    return '#f85a40'
                case 'pl-copier':
                    return '#bc5090'
                case 'pl-hostel':
                    return '#ffc845'
                case 'pl-activity':
                    return '#30c39e'
                default:
                    return '#52565e'
            }
        },
        indexOf(result) {
            return this.results.indexOf(result)
        },
        quitSearch() {
            this.isOnSearch = false
            this.clearSearchResults()
        },
        clearSearchResults() {
            this.results = []
            this.resultGroupHeight = '0vh'
        },
        togglePopulationAnalysis() {
            if ($('#checkbox_population').is(":checked")) {
                this.switchMapThemeToAnalysis()
                map.setLayoutProperty('building-3d-datavisualization-background', 'visibility', 'visible')
                map.setLayoutProperty('population-bar', 'visibility', 'visible')
                map.setLayoutProperty('label-structure-data-visualization', 'visibility', 'visible')
                this.populationAnalisisIsOn = true
            } else {
                map.setLayoutProperty('building-3d-datavisualization-background', 'visibility', 'none');
                map.setLayoutProperty('population-bar', 'visibility', 'none');
                map.setLayoutProperty('label-structure-data-visualization', 'visibility', 'none');
                this.populationAnalisisIsOn = false
                if (!this.placeAnalisisIsOn) {
                    this.switchMapThemeToNormal()
                }
            }
        },
        togglePlaceAnalysis() {
            if ($('#checkbox_place').is(":checked")) {
                this.placeAnalisisIsOn = true
                this.switchMapThemeToAnalysis()
                map.setLayoutProperty('poi-label-places-datavisualized', 'visibility', 'visible');
                this.initChart()
            } else {
                map.setLayoutProperty('poi-label-places-datavisualized', 'visibility', 'none');
                this.placeAnalisisIsOn = false
                if (!this.populationAnalisisIsOn) {
                    this.switchMapThemeToNormal()
                }
            }
        },
        switchMapThemeToAnalysis() {
            map.setLayoutProperty('poi-label-places', 'visibility', 'none');
            map.setLayoutProperty('background-data-visualization', 'visibility', 'visible');
            map.setLayoutProperty('road-data-visualization', 'visibility', 'visible');
        },
        switchMapThemeToNormal() {
            map.setLayoutProperty('poi-label-places', 'visibility', 'visible');
            map.setLayoutProperty('background-data-visualization', 'visibility', 'none');
            map.setLayoutProperty('road-data-visualization', 'visibility', 'none');
        },
        initChart() {
            var self = this
            var data = []
            var backgroundColor = []
            var labels = []

            this.placegroups.forEach(placegroup => {
                labels.push(placegroup.name)
                data.push(placegroup.places.length)
                backgroundColor.push(this.getThemeColor(placegroup.id))
            });

            var ctx = document.getElementById('myChart')
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'doughnut',

                // The data for our dataset
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'My First dataset',
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: 'rgb(243, 244, 247)',
                    }]
                }
            })
        }
    },
    mounted() {
        var fuse
        var self = this

        eventBus.$on('load-data', e => {
            this.placegroups = myVue.placegroups
            this.placegroups.forEach(placegroup => {
                this.totalPlace += placegroup.places.length
            })

            var list = []
            this.placegroups.forEach(placegroup => {
                placegroup.places.forEach(place => {
                    list.push(place)
                })
            })

            var options = {
                shouldSort: true,
                includeMatches: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 3,
                keys: [
                    "properties.name_en",
                    "properties.type",
                    "properties.note"
                ]
            }

            fuse = new Fuse(list, options);
        })

        $('#searchInput').on('input', function () {
            self.results = fuse.search($(this).val())
            if ($(this).val().length > 0) {
                self.isOnSearch = true
            } else {
                self.isOnSearch = false
            }
        })

        $('#searchInput').on('click', function () {
            self.results = fuse.search($(this).val())
            if ($(this).val().length > 0) {
                self.isOnSearch = true
            } else {
                self.isOnSearch = false
            }
        })

        // Material JS config for Sidebar and Collapses
        var sideNavElem = document.querySelector('.sidenav');
        M.Sidenav.init(sideNavElem);
        var collapsibleElem = document.querySelectorAll('.collapsible');
        var collapsibleInstance = M.Collapsible.init(collapsibleElem, function onOpenStart() {
            // added custom code (at line 2180 )for dropdown animation
        })
    }
})

Vue.component('v-searchbar', {
    template: '#v-searchbar',
    data() {
        return {
            inputString: '',
            results: []
        }
    },
    methods: {
        showPlaceInfo(result) {
            highlightPlace(result.item)

            // manually clearing search results
            $('#searchInput').val('')
            this.results = []
        },
    },
    mounted() {
        var fuse

        eventBus.$on('load-data', e => {
            var list = []
            myVue.placegroups.forEach(placegroup => {
                placegroup.places.forEach(place => {
                    list.push(place)
                })
            })

            var options = {
                shouldSort: true,
                includeMatches: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "properties.name_en",
                    "properties.type"
                ]
            }

            fuse = new Fuse(list, options);
        })

        $('#searchInput').on('input', function () {
            eventBus.$emit('dataInput', $(this).val())
        });


        eventBus.$on('dataInput', input => {
            this.results = fuse.search(input)
            console.log(this.results) // get the current value of the input field.
        })
    }
})

var vPlacePage = Vue.component('v-place-page', {
    template: '#v-place-page',
    props: {
        properties: {
            type: Object,
            required: false,
        },
        coordinates: {
            type: Array,
            required: false,
        },
        srcs: {
            type: Array,
            required: false,
        }
    },
    data() {
        return {
            imgSrcs: [],
            height: 'fit-content',
            position: 'fixed',
            expanded: false,
        }
    },
    methods: {
        toggle() {
            if (this.expanded) {
                this.shrink()
            } else {
                this.expand()
            }
        },
        expand() {
            var self = this
            const dock = document.querySelector('.dock')
            dock.classList.add('animated', 'faster', 'slideInUp')
            self.height = '100%'
            this.expanded = true

            dock.addEventListener('animationend', function () {
                dock.classList.remove('animated', 'fast', 'faster', 'fadeOutDown', 'slideInUp')
                dock.removeEventListener('animationend', this)

                var collapsibleElems = document.querySelectorAll('.collapsible')
                M.Collapsible.init(collapsibleElems)
                var tooltipElems = document.querySelectorAll('.tooltipped');
                M.Tooltip.init(tooltipElems);
            })



            // loading images
            // this.imgSrcs.forEach(src => {
            //     loadImage(
            //         src,
            //         function (img, data) {
            //             if (img.type === "error") {
            //                 console.error("Error loading image " + src);
            //             } else {
            //                 document.querySelector('.img-group').appendChild(img);
            //                 console.log("Original image width: ", data.originalWidth);
            //                 console.log("Original image height: ", data.originalHeight);
            //             }
            //         },
            //         {
            //             orientation: true
            //         }
            //     )
            // });
        },
        shrink() {
            var self = this;
            const dock = document.querySelector('.dock')
            dock.classList.add('animated', 'faster', 'fadeOutDown')

            dock.addEventListener('animationend', removeAnimateAndShrink)

            function removeAnimateAndShrink() {
                dock.classList.remove('animated', 'fast', 'faster', 'fadeOutDown', 'fadeInUp')
                dock.removeEventListener('animationend', removeAnimateAndShrink)
                self.expanded = false
                self.height = 'fit-content'

                dock.classList.add('animated', 'faster', 'fadeInUp')
                dock.addEventListener('animationend', removeAnimation)
            }

            function removeAnimation() {
                dock.classList.remove('animated', 'fast', 'faster', 'fadeOutDown', 'fadeInUp')
                dock.removeEventListener('animationend', removeAnimation)
            }
        },
        initMaterialbox() {
            var materialboxElems = document.querySelectorAll('.materialboxed')
            M.Materialbox.init(materialboxElems)
        },
        retrieveSrcs() {
            console.log(`old imgSrcs: ${this.imgSrcs.length}`)
            console.log('retrieving srcs...')

            // get image srcs from firebase storage and push to `imgSrcs[]` array
            try {
                var srcArray = []
                placesRef.child(this.properties.id).listAll().then(res => {
                    res.items.forEach(itemRef => {
                        itemRef.getDownloadURL().then(url => {
                            srcArray.push(url)
                        })
                    })
                })
                console.log(srcArray)
                this.imgSrcs = srcArray
            } catch (e) {
                if (!(e instanceof TypeError)) {
                    throw e
                }
            }

            // this.imgSrcs = ['res/img/d-cs/bg.png', 'res/img/d-cs/img1.png', 'res/img/d-cs/img2.jpg', 'res/img/d-cs/img3.jpg']


            console.log('retieved srcs!')
            console.log(this.imgSrcs)
        },
        goBack() {
            this.shrink()
        },
        getMaterialIcon(type) {
            return getMaterialIcon(type)
        },
        animateCSS(element, animationName, callback) {
            const node = document.querySelector(element)
            node.classList.add('animated', animationName)

            function handleAnimationEnd() {
                node.classList.remove('animated', animationName)
                node.removeEventListener('animationend', handleAnimationEnd)

                if (typeof callback === 'function') callback()
            }

            node.addEventListener('animationend', handleAnimationEnd)
        },
        sharePlace(id) {
            console.log('#Sharing '+id)
            if(navigator.share) {
                navigator.share({
                    title: '#Share Place',
                    url: 'https://du-map.web.app/#/place/'+id,
                }).then(() => {
                    console.log('#Share Success!')
                }).catch(console.error)
            } else {
                console.log('#Navigator is not supported')
            }
        }
    },
    computed: {
        headerColor() {
            if (this.expanded) {
                return 'white'
            } else {
                switch (this.properties.type) {
                    case 'department':
                        return '#4285F4' // google blue
                    case 'bus stop':
                        return '#f4b400f0'
                    case 'canteen':
                        return '#30c39eff'
                    default:
                        return 'teal'
                }
            }
        },
        themeColor() {
            switch (this.properties.type) {
                case 'department':
                    return '#4285F4' // google blue
                case 'bus stop':
                    return '#f4b400f0'
                case 'canteen':
                    return '#30c39eff'
                default:
                    return 'teal'
            }
        }
    },
    mounted() {
        var collapsibleElems = document.querySelectorAll('.collapsible')
        collapsibleInstance = M.Collapsible.init(collapsibleElems)

        const dock = document.querySelector('.dock')
        dock.addEventListener('animationend', removeAnimation)

        function removeAnimation() {
            dock.classList.remove('animated', 'fast', 'fadeOutDown', 'fadeInUp')
            dock.removeEventListener('animationend', removeAnimation)
        }
    },
    watch: {
        '$route'(to, from) {
            // react to route changes...
            this.retrieveSrcs()
            this.initMaterialbox()
        }
    },
})

const routes = [{
        path: '/place',
        name: 'place',
        component: vPlacePage,
        props: true,
    },
    {
        path: '/place/:id',
        name: 'placeWithId',
        props: (route) => {
            var filteredPlace =
                sourceFeatures.filter(place => place.properties.id == route.params.id)

            try {
                var place = new Place({
                    coordinates: filteredPlace[0].geometry.coordinates,
                    properties: filteredPlace[0].properties,
                })
                highlightPlace(place)
            } catch (error) {

            }
        },
    }
]

const router = new VueRouter({
    routes // short for `routes: routes`
})

var myVue = new Vue({
    el: "#myVue",
    data: {
        placegroups: [],
    },
    computed: {
        dataLoaded() {
            return this.placegroups.length > 0;
        }
    },
    router: router,
    mounted() {
        this.$http.get('https://gist.githubusercontent.com/aungKhantPaing/169f9d9743200ff7fef512d0bb428040/raw/74e2e5befc036602d7ac99e68daa70c5648a8a84/du-map-places')
            .then(response => {
                console.log(response.body)
            }, errorResponse => {
                console.log(errorResponse.body)
            })

        // track mouse events as soon as the components are mounted.
        // remove highlight when user click/tap other area of the map (non-icon area)
        map.on("click", e => {
            removeHighlight()
        })
        // highlight when user specifically click/tap place icon
        map.on('click', 'poi-label-places', e => {
            var place = new Place({
                properties: e.features[0].properties,
                coordinates: e.features[0].geometry.coordinates,
            })
            highlightPlace(place)
        })
    }
})

// assign place data to Vue when the map finish loading
map.on('load', function () {
    myVue.placegroups = returnPlaceData() // put data to Vue
    eventBus.$emit('load-data', myVue.placegroups)
})

// Helpers
function highlightPlace(place) {
    var id = place.properties.id
    var coordinates = place.coordinates

    // pin the marker
    marker.remove() // remove default-marker from mapbox.js 
    marker.setLngLat(coordinates).addTo(map)
    map.flyTo({
        center: coordinates,
        zoom: 18
    })

    // highlight the 3d structure by filtering with equal id
    map.setFilter('building-3d-highlighted', ['in', 'id', id])

    // route to place-page with the 'place params' in it
    router.push({
        name: 'place',
        params: place,
    })

    // eventBus.$emit('show-dock', place)
}

function removeHighlight() {
    marker.remove();
    map.setFilter('building-3d-highlighted', ['in', 'id', '']) // remove highlight
    router.replace('/')
}

function getMaterialIcon(type) {
    switch (type) {
        case 'department':
            return constants.materialized.icons.departments
        case 'bus stop':
            return constants.materialized.icons.busStops
        case 'canteen':
            return constants.materialized.icons.canteens
        case 'copier':
            return constants.materialized.icons.copiers
        default:
            return constants.materialized.icons.otherPlaces
    }
}