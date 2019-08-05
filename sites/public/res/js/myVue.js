var eventBus = new Vue()

Vue.component('placegroup', {
    props: {
        placelist: {
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
        placelistID() {
            return this.placelist.id
        },
        isDepartments() {
            return this.placelistID == 'pl-department'
        },
        isBusstops() {
            return this.placelistID == 'pl-busstop'
        },
        isOtherplaces() {
            return this.placelistID == 'pl-other'
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
        placeData: '',
        sideNav: '',
    },
    methods: {

    },
    computed: {
        placeListGroup() {
            return this.placeData
        }
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

    myVue.placeData = returnPlaceData(sourceFeatures) // put data to Vue
})

function returnPlaceData(sourceFeatures) {
    var departments = {
            id: 'pl-department',
            name: 'Departments',
            places: []
        },
        busStops = {
            id: 'pl-busstop',
            name: 'Bus Stops',
            places: []
        },
        otherPlaces = {
            id: 'pl-other',
            name: 'Other Places',
            places: []
        }

    sourceFeatures.forEach(element => {
        var place = {
            id: element.properties.id,
            coordinates: element.geometry.coordinates,
            name: element.properties.name_en,
            type: element.properties.type, // to display in sidebar
        }

        if (element.properties.type == 'department') {
            departments.places.push(place)
        } else if (element.properties.type == 'busstop') {
            busStops.places.push(place)
        } else {
            otherPlaces.places.push(place)
        }
    });
    return [departments, busStops, otherPlaces]
}

// Materialized Sidebar and Collapsibles 
document.addEventListener('DOMContentLoaded', function () {
    var sideNavElem = document.querySelector('.sidenav');
    M.Sidenav.init(sideNavElem);

    var collapsibleElem = document.querySelector('.collapsible');
    var collapsibleInstance = M.Collapsible.init(collapsibleElem, function onOpenStart() {
        // added custom code for dropdown animation
    });

    var tabs = document.querySelectorAll('.tabs');
    var tabInstance = M.Tabs.init(tabs, {});
});