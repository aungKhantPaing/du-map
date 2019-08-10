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

Vue.component('placegroup', {
    props: {
        placegroup: {
            type: Object,
            required: true
        }
    },
    methods: {
        showPlaceInfo(place) {
            highlightPlace(place.id, place.coordinates)
            eventBus.$emit('show-dock', place)
        }
    },
    computed: {
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
    }
})

Vue.component('dock', {
    data() {
        return {
            id: '',
            title: 'Place Title',
            type: 'Place Type',
            coordinates: [],
            visible: false,
        }
    },
    methods: {
        show() {
            this.visible = true
        },
        hide() {
            this.visible = false
        },
    },
    mounted() {
        eventBus.$on('show-dock', place => {
            this.title = place.name
            this.type = place.type
            this.show()
        })

        eventBus.$on('hide-dock', e => {
            this.hide()
        })
    }
})

var myVue = new Vue({
    el: "#myVue",
    data: {
        placegroups: '',
        sideNav: '',
    },
    mounted() {
        map.on("click", e => {
            marker.remove();
            map.setFilter('building-3d-highlighted', ['in', 'id', '']) // remove highlight
            eventBus.$emit('hide-dock') // remove dock
        })

        map.on('click', 'poi-label-places', e => {
            var pointer_id = e.features[0].properties.id
            var pointer_coordinates = e.features[0].geometry.coordinates

            highlightPlace(pointer_id, pointer_coordinates)

            eventBus.$emit('show-dock', {
                name: e.features[0].properties.name_en, // passed place object
                type: e.features[0].properties.type,
            })
        })
    }
})

map.on('load', function () {
    var sourceFeatures = map.querySourceFeatures('composite', { // retrieving from map 
        sourceLayer: 'DU_Places' // required if sourceLayer is a vector_tileset
    })
    console.log('DU_Places --v')
    console.log(sourceFeatures)

    myVue.placegroups = returnPlaceData(sourceFeatures) // put data to Vue

    // Search Bar
    new Autocomplete(document.getElementById('autocomplete'), {
        search: input => {
            if (input.length < 1) {
                return []
            }
            return returnPlaceData(sourceFeatures)[0].places.filter(place => {
                return place.name.toLowerCase()
                .startsWith(input.toLowerCase())
            })
        },
        getResultValue: result => result.name
    })
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
            case 'busstop':
                busStops.places.push(place)
                break
            default:
                otherPlaces.places.push(place)
        }
    })
    return [departments, busStops, otherPlaces]
}