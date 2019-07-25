Vue.component('placegroup', {
    props: {
        placelist: {
            type: Object,
            required: true
        }
    },
    methods: {
    },
    computed: {
        placelistID() {
            return this.placelist.properties.id
        },
        isDepartments() {
            return this.placelistID == constants.id.departments.fc
        },
        isBusstops() {
            return this.placelistID == constants.id.busStops.fc
        },
        isOtherplaces() {
            return this.placelistID == constants.id.otherPlaces.fc
        },
        getMaterialIcon() {
            // ternary operator
            return  this.isDepartments  ? constants.materialized.icons.departments
                :   this.isBusstops     ? constants.materialized.icons.busStops
                :   constants.materialized.icons.otherPlaces;
        }
    }
})

var myVue = new Vue({
    el: "#myVue",
    data: {
        departments: departments_geoJson,
        busStops: busStops_geoJson,
        otherPlaces: otherPlaces_geoJson
    },
    computed: {
        placelistGroup(){
            return [this.departments, this.busStops, this.otherPlaces]
        }
    }
})