Vue.component('placegroup', {
    props: {
        placelist: {
            type: Object,
            required: true
        }
    },
    methods: {
        get_materialIconName(placelistID) {
            switch (placelistID) {
                case departments_geoJson.properties.id:
                    return 'account_balance';
                case otherPlaces_geoJson.properties.id:
                    return 'business';
                case busStops_geoJson.properties.id:
                    return 'directions_bus';
                default: 
                    return 'business';
            }
        }
    },
    computed: {
        placelistID() {
            return this.placelist.properties.id
        },
        wavescolor() {
            return {
                'waves-green': this.isDepartments,
                'waves-teal': this.isBusstops,
                'waves-orange': this.isOtherplaces
            }
        },
        isDepartments() {
            return this.placelistID == departments_geoJson.properties.id
        },
        isBusstops() {
            return this.placelistID == busStops_geoJson.properties.id
        },
        isOtherplaces(){
            return this.placelistID == otherPlaces_geoJson.properties.id
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