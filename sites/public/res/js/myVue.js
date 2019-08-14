var eventBus = new Vue()


class Place {
    constructor({
        properties,
        coordinates
    }) {
        this.properties = properties
        this.coordinates = coordinates
    }
}

class PlaceGroup {
    constructor(id, name) {
        this.id = id
        this.name = name
        this.places = []
    }
}

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
            highlightPlace(place.properties.id, place.coordinates)
            eventBus.$emit('show-dock', place)
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
        getMaterialIcon() {
            // ternary operator
            return this.isDepartment ? constants.materialized.icons.departments :
                this.isBusstop ? constants.materialized.icons.busStops :
                this.isCanteen ? constants.materialized.icons.canteens :
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

var vSidebar = Vue.component('v-sidebar', {
    template: '#v-sidebar',
    data() {
        return {
            placegroups: []
        }
    },
    mounted() {
        try {
            this.placegroups = myVue.placegroups
        } catch (e) {
            eventBus.$on('load-data', e => {
                this.placegroups = myVue.placegroups

                // new Autocomplete(document.getElementById('autocomplete'), {
                //     search: input => {
                //         if (input.length < 1) {
                //             return []
                //         }
                //         return this.placegroups[0].places.filter(place => {
                //             return place.properties.name_en.toLowerCase()
                //                 .startsWith(input.toLowerCase())
                //         })
                //     },
                //     getResultValue: result => result.properties.name_en
                // })
            })
        }

        // Material JS config for Sidebar and Collapses
        var sideNavElem = document.querySelector('.sidenav');
        M.Sidenav.init(sideNavElem);
        var collapsibleElem = document.querySelector('.collapsible');
        var collapsibleInstance = M.Collapsible.init(collapsibleElem, function onOpenStart() {
            // added custom code (at line 2180 )for dropdown animation
        });
    }
})

var vPlacePage = Vue.component('v-place-page', {
    template: '#v-place-page',
    props: {
        properties: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            imgSrcs: []
        }
    },
    methods: {
        // get image srcs from firebase storage and push to `imgSrcs[]` array
        retrieveSrcs(placegroupRef) {
            placegroupRef.child(this.properties.id).listAll().then(res => {
                res.items.forEach(itemRef => {
                    itemRef.getDownloadURL().then(url => {
                        this.imgSrcs.push(url)
                    })
                })
            })
        }
    },
    mounted() {
        switch (this.properties.type) {
            case 'department':
                this.retrieveSrcs(departmentsRef)
                break
            case 'bus stop':
                this.retrieveSrcs(busstopsRef)
                break
            case 'canteen':
                this.retrieveSrcs(canteensRef)
                break
            default:
                this.retrieveSrcs(otherplacesRef)
        }
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
    mounted() {
        var fuse

        eventBus.$on('load-data', e => {
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
            };
            var list = myVue.placegroups[0].places
            fuse = new Fuse(list, options); // "list" is the item array
        })

        $('#searchInput').on('input', function() {
            eventBus.$emit('dataInput', $(this).val())
        });

        eventBus.$on('dataInput', input => {
            this.results = fuse.search(input)
            console.log(this.results)  // get the current value of the input field.
        })
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
    routes // short for `routes: routes`
})

var myVue = new Vue({
    el: "#myVue",
    data: {
        placegroups: []
    },
    router: router,
    mounted() {
        map.on("click", e => {
            marker.remove();
            map.setFilter('building-3d-highlighted', ['in', 'id', '']) // remove highlight
            eventBus.$emit('hide-dock') // remove dock
        })

        map.on('click', 'poi-label-places', e => {
            var place_id = e.features[0].properties.id
            var place_coordinates = e.features[0].geometry.coordinates
            var place = new Place({
                properties: e.features[0].properties,
                coordinates: e.features[0].geometry.coordinates,
            })

            highlightPlace(place_id, place_coordinates)

            eventBus.$emit('show-dock', place)
        })
    }
})


map.on('load', function () {
    var sourceFeatures = map.querySourceFeatures('composite', {
        sourceLayer: 'DU_Places' // required if sourceLayer is a vector_tileset
    })
    console.log('DU_Places --v')
    console.log(sourceFeatures)
    myVue.placegroups = returnPlaceData(sourceFeatures) // put data to Vue
    eventBus.$emit('load-data', myVue.placegroups)
})

function returnPlaceData(sourceFeatures) {

    var departments = new PlaceGroup('pl-department', 'Departments'),
        busStops = new PlaceGroup('pl-busstop', 'Bus Stops'),
        canteens = new PlaceGroup('pl-canteen', 'Canteens'),
        otherPlaces = new PlaceGroup('pl-other', 'Other Places'),
        place

    sourceFeatures.forEach(feature => {
        place = new Place({
            properties: feature.properties,
            coordinates: feature.geometry.coordinates,
        })

        switch (place.properties.type) {
            case 'department':
                departments.places.push(place)
                break
            case 'bus stop':
                busStops.places.push(place)
                break
            case 'canteen':
                canteens.places.push(place)
                break
            default:
                otherPlaces.places.push(place)
        }
    })
    return [departments, busStops, canteens, otherPlaces]
}