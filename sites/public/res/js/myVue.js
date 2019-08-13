var eventBus = new Vue()


class Place {
    constructor(id, name, coordinates, type) {
        this.id = id
        this.name = name
        this.coordinates = coordinates
        this.type = type
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
            highlightPlace(place.id, place.coordinates)
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
        isDepartments() {
            return this.placegroupID == 'pl-department'
        },
        isBusstops() {
            return this.placegroupID == 'pl-busstop'
        },
        isOtherplaces() {
            return this.placegroupID == 'pl-other'
        },
        getMaterialIcon() {
            // ternary operator
            return this.isDepartments ? constants.materialized.icons.departments :
                this.isBusstops ? constants.materialized.icons.busStops :
                constants.materialized.icons.otherPlaces;
        }
    },
})

Vue.component('v-dock', {
    template: '#v-dock',
    data() {
        return {
            place: new Place('', 'title', 'type', []),
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
            router.push({name: 'place', params: this.place})
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
            })
        }

        // Material JS config for Sidebar and Collapses
        var sideNavElem = document.querySelector('.sidenav');
        M.Sidenav.init(sideNavElem);
        var collapsibleElem = document.querySelector('.collapsible');
        var collapsibleInstance = M.Collapsible.init(collapsibleElem, function onOpenStart() {
            // added custom code (at line 2180 )for dropdown animation
        });
        var tabs = document.querySelectorAll('.tabs');
        var tabInstance = M.Tabs.init(tabs, {});

        // Search Bar
        // new Autocomplete(document.getElementById('autocomplete'), {
        //     search: input => {
        //         if (input.length < 1) {
        //             return []
        //         }
        //         return returnPlaceData(sourceFeatures)[0].places.filter(place => {
        //             return place.name.toLowerCase()
        //                 .startsWith(input.toLowerCase())
        //         })
        //     },
        //     getResultValue: result => result.name
        // })
    }
})

var vPlacePage = Vue.component('v-place-page', {
    template: '#v-place-page',
})

const routes = [
    {
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
            var place_name = e.features[0].properties.name_en
            var place_type = e.features[0].properties.type

            highlightPlace(place_id, place_coordinates)

            eventBus.$emit('show-dock', {
                name: place_name, // passed place object
                type: place_type,
            })
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
        otherPlaces = new PlaceGroup('pl-other', 'Other Places'),
        place

    sourceFeatures.forEach(feature => {
        place = new Place(
            feature.properties.id,
            feature.properties.name_en,
            feature.geometry.coordinates,
            feature.properties.type
        )

        switch (place.type) {
            case 'department':
                departments.places.push(place)
                break
            case 'bus stop':
                busStops.places.push(place)
                break
            default:
                otherPlaces.places.push(place)
        }
    })
    return [departments, busStops, otherPlaces]
}