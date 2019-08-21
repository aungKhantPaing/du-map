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
        getMaterialIcon() {
            // ternary operator
            return this.isDepartment ? constants.materialized.icons.departments :
                this.isBusstop ? constants.materialized.icons.busStops :
                this.isCanteen ? constants.materialized.icons.canteens :
                this.isCopier ? constants.materialized.icons.copiers :
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

var vWelcome = Vue.component('v-welcome', {
    template: '#v-welcome'
})

Vue.component('v-sidebar', {
    template: '#v-sidebar',
    data() {
        return {
            placegroups: [],
            inputString: '',
            results: [],
            resultGroupHeight: '0vh',
        }
    },
    methods: {
        showPlaceInfo(result) {
            // clearing search results and previous highlight
            $('#searchInput').val('')
            this.results = []
            this.resultGroupHeight = '0vh'
            removeHighlight()

            highlightPlace(result.item)
        },
        getMaterialIcon(type) {
            return getMaterialIcon(type)
        },
        indexOf(result) {
            return this.results.indexOf(result)
        }
    },
    mounted() {
        var fuse

        eventBus.$on('load-data', e => {
            this.placegroups = myVue.placegroups

            var list = []
            this.placegroups.forEach(placegroup => {
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
            this.results = fuse.search(input) // get the current value of the input field.
        })

        // Material JS config for Sidebar and Collapses
        var sideNavElem = document.querySelector('.sidenav');
        M.Sidenav.init(sideNavElem);
        var collapsibleElem = document.querySelectorAll('.collapsible');
        var collapsibleInstance = M.Collapsible.init(collapsibleElem, function onOpenStart() {
            // added custom code (at line 2180 )for dropdown animation
        });
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
            required: true,
        },
        coordinates: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            imgSrcs: [],
            height: '24vh',
            position: 'fixed',
            expanded: false,
        }
    },
    methods: {
        // get image srcs from firebase storage and push to `imgSrcs[]` array
        toggle() {
            if (this.expanded) {
                this.shrink()
            } else {
                this.expand()
            }
        },
        expand() {
            this.expanded = true


        },
        shrink() {
            this.height = '24vh'
            this.position = 'fixed'
            this.expanded = false
        },
        initMaterialbox() {
            var materialboxElems = document.querySelectorAll('.materialboxed')
            M.Materialbox.init(materialboxElems)
        },
        retrieveSrcs() {
            console.log(`old imgSrcs: ${this.imgSrcs.length}`)
            console.log('retrieving srcs...')

            var placegroupRef

            switch (this.properties.type) {
                case 'department':
                case 'bus stop':
                case 'canteen':
                    placegroupRef = placesRef
                    break
                default:
                    placegroupRef = otherplacesRef
            }

            try {
                var srcArray = []
                placegroupRef.child(this.properties.id).listAll().then(res => {
                    res.items.forEach(itemRef => {
                        itemRef.getDownloadURL().then(url => {
                            srcArray.push(url)
                            console.log(url)
                        })
                    })
                })
                this.imgSrcs = srcArray
            } catch (e) {
                if (!(e instanceof TypeError)) {
                    throw e
                }
            }
            console.log('retieved srcs!')
            console.log(this.imgSrcs)
        },
        goBack() {
            this.shrink()
        },
        getMaterialIcon(type) {
            return getMaterialIcon(type)
        },
    },
    created() {
        console.log(`component created!`)
        this.retrieveSrcs()
    },
    mounted() {
        console.log(`component mounted!`)
        var collapsibleElems = document.querySelectorAll('.collapsible')
        M.Collapsible.init(collapsibleElems)
    },
    watch: {
        '$route'(to, from) {
            // react to route changes...
            this.retrieveSrcs()
        }
    }
})

const routes = [{
        path: '/welcome',
        component: vWelcome
    },
    {
        path: '/place',
        name: 'place',
        component: vPlacePage,
        props: true,
    },
]

const router = new VueRouter({
    routes: routes // short for `routes: routes`
})

var myVue = new Vue({
    el: "#myVue",
    data: {
        placegroups: [],
        dataLoaded: false
    },
    router: router,
    mounted() {
        map.on("click", e => {
            removeHighlight()
        })

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
    myVue.dataLoaded = true
    eventBus.$emit('load-data', myVue.placegroups)
})

// Bioler Plates
function highlightPlace(place) {
    var id = place.properties.id
    var coordinates = place.coordinates

    // pin the marker
    marker.remove() // marker from mapbox.js
    marker.setLngLat(coordinates).addTo(map)
    map.flyTo({
        center: coordinates,
        zoom: 18
    })

    map.setFilter('building-3d-highlighted', ['in', 'id', id]) // highlight the 3d structure with same id

    
    router.push({ // route to place-page with the 'place params' in it
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