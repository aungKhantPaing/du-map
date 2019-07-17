Vue.component('place-group', {
    props: {
        placelist: {
            type: Object,
            required: true
        }
    }
})

var myVue = new Vue({
    el: "#myVue",
    data: {
        departments: departments_geoJson,
        busStops: busStops_geoJson,
        otherPlaces: otherPlaces_geoJson
    }
})