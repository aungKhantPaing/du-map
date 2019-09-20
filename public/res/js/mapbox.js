mapboxgl.accessToken =
    "pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNrMHNmZTRmNjAxeGszcXFqajU5c2lyMnMifQ.DrEI2NBSQRpBUGVc-zFxdw";
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/akp101/cjxkkxwpc01x11cnur0aepitf/draft",
    center: [96.212739, 16.911199],
    zoom: 14.8,
    maxBounds: [
        [96.20043008891338, 16.899012663005408], // Southwest coordinates
        [96.22252355799174, 16.9239222243597], // Northeast coordinates
    ],
    bearing: -27.5 // rotation
});
map.touchZoomRotate.enable();
map.touchZoomRotate.enableRotation();

// Add zoom, rotation and location controls to the map.
var zoomControl = new mapboxgl.NavigationControl({
    visualizePitch: true
});
var locationControl = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    fitBoundsOptions: {
        // offset: [0,-5.7], // for desktop
        offset: [0, -3.5], // for mobiles
        zoom: 15
    }
});

map.addControl(zoomControl).addControl(locationControl)

var marker = new mapboxgl.Marker({
    color: "#F85A40"
}).setLngLat([0, 0]).addTo(map);


// Events
function locate() {
    locationControl.trigger();
}

map.on("mouseenter", 'poi-label-places', function () {
    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.getCanvas().style.cursor = "pointer";
});

map.on("mouseleave", 'poi-label-places', function () {
    // Change it back to a pointer when it leaves.
    map.getCanvas().style.cursor = "";
});

function playCamera() {
    rotateCamera(0)
}

function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 100) % 360, {
        duration: 0
    });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
}

// Global Variables
var sourceFeatures = []
var analyseObj = {
    counter: [ // arrays of numbers of places according to place type
        {
            type: 'department',
            total: 0,
        },
        {
            type: 'bus stop',
            total: 0,
        },
        {
            type: 'canteen',
            total: 0,
        },
        {
            type: 'copier',
            total: 0,
        },
        {
            type: 'other',
            total: 0,
        },
    ],
    total_idDuplicatedItems: [],
    total_duplicatedItems: [],
}

// function for initialization ( don't use it during runtime )
// init sourceFeature[] with array of place datas (sorted by place.properties.name_en) & return it
function loadSourceFeature() {
    sourceFeatures = map.querySourceFeatures('composite', {
        sourceLayer: 'DU_Places_New' // required if sourceLayer is a vector_tileset
    })

    sourceFeatures.forEach(targetPlace => {
        var duplicatedItems = []
        sourceFeatures.forEach(place => {
            if ((JSON.stringify(targetPlace.properties) === JSON.stringify(place.properties)) && (targetPlace != place)) {
                duplicatedItems.push(place) // get the duplicates
                analyseObj.total_duplicatedItems.push(place) // recording duplicates
            }
        })
        // remove the duplicatedItem(s) of targetPlace
        duplicatedItems.forEach(item => {
            var itemIndex = sourceFeatures.indexOf(item)
            sourceFeatures.splice(itemIndex, 1)
        });
    })

    sourceFeatures.sort(compare)

    function compare(a, b) {
        var aString = '' + a.properties.name_en
        var bString = '' + b.properties.name_en
        if (aString < bString) {
            return -1;
        }
        if (aString > bString) {
            return 1;
        }
        return 0;
    }

    return sourceFeatures
}

// function for initialization ( don't use it during runtime )
// init analyseObj
function analyseData() {
    var places = sourceFeatures

    places.forEach(targetPlace => {
        switch (targetPlace.properties.type) {
            case 'department':
                analyseObj.counter[0].total++
                break
            case 'bus stop':
                analyseObj.counter[1].total++
                break
            case 'canteen':
                analyseObj.counter[2].total++
                break
            case 'copier':
                analyseObj.counter[3].total++
                break
            default:
                analyseObj.counter[4].total++
        }

        var targetID = targetPlace.properties.id
        var duplicatedItems = []
        var idDuplicatedItems = []

        places.some(function (place) {
            // equal properties, but not the item itself
            if ((JSON.stringify(targetPlace.properties) === JSON.stringify(place.properties)) && (targetPlace != place)) {
                duplicatedItems.push(place)
            }
        });
        places.forEach(place => {
            // equal ID, but not the item itself
            if (targetID == place.properties.id && (JSON.stringify(targetPlace.properties) != JSON.stringify(place.properties))) {
                idDuplicatedItems.push(place)
            }
        });

        if (duplicatedItems.length > 0) {
            analyseObj.total_duplicatedItems.push(targetPlace)
            // console.log(`${targetID}, ${targetPlace.properties.name_en} (index: ${targetIndex})`)
        }
        if (idDuplicatedItems.length > 0) {
            analyseObj.total_idDuplicatedItems.push(targetPlace)
            // console.log(`${targetID}, ${targetPlace.properties.name_en} (index: ${targetIndex})`)
        }
    })
    // console.log('Duplicated Items:')
    // analyseObj.total_duplicatedItems.forEach(item => {
    //     console.log(item.properties.name_en)
    // });

    console.log('ID Duplicated Items:')
    analyseObj.total_idDuplicatedItems.forEach(item => {
        console.log(item.properties.name_en)
    });
}

async function returnPlaceAndStorageData() {
    var placeGroups = [
        departments = new PlaceGroup('pl-department', 'Departments'),
        busStops = new PlaceGroup('pl-busstop', 'Bus Stops'),
        canteens = new PlaceGroup('pl-canteen', 'Canteens'),
        copiers = new PlaceGroup('pl-copier', 'Copiers'),
        otherPlaces = new PlaceGroup('pl-other', 'Other Places'),
    ]

    var place

    // foreach doesn't work with async
    for (const feature of sourceFeatures) {
        place = new Place({
            properties: feature.properties,
            coordinates: feature.geometry.coordinates,
        })
        place.totalImage = 0

        var res = await placesRef.child(place.properties.id).listAll()
        place.totalImage = await res.items.length
        await console.log(place)

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
            case 'copier':
                copiers.places.push(place)
                break
            default:
                otherPlaces.places.push(place)
        }
    }

    console.log('Done!')
    console.log(placeGroups)
    return placeGroups
}

// group the place datas in the respective placeGroup & return a array of those placeGroups
function returnPlaceData() {

    var placeGroups = [
        departments = new PlaceGroup('pl-department', 'Departments'),
        busStops = new PlaceGroup('pl-busstop', 'Bus Stops'),
        canteens = new PlaceGroup('pl-canteen', 'Canteens'),
        activities = new PlaceGroup('pl-activity', 'Sports and Activities'),
        copiers = new PlaceGroup('pl-copier', 'Copiers'),
        hostels = new PlaceGroup('pl-hostel', 'Hostels'),
        otherPlaces = new PlaceGroup('pl-other', 'Other Places'),
    ]

    var place

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
            case 'stadium':
                activities.places.push(place)
                break
            case 'library':
                activities.places.push(place)
                break
            case 'rc':
                activities.places.push(place)
                break
            case 'copier':
                copiers.places.push(place)
                break
            case 'hostel':
                hostels.places.push(place)
                break
            default:
                otherPlaces.places.push(place)
        }
    })

    return placeGroups
}

function analyseSourceFeatures() {
    var counter
    sourceFeatures.forEach(targetFeature => {
        counter++
        var targetID = targetFeature.properties.id
        var targetIndex = sourceFeatures.indexOf(targetFeature)
        var matchedItems = []

        sourceFeatures.forEach(feature => {
            if (targetID == feature.properties.id) {
                matchedItems.push(feature)
            }
        });

        if (matchedItems.length > 1) {
            console.log(`${targetID}, ${targetFeature.properties.name_en} (index: ${targetIndex})`)
            console.log(targetFeature)
        }
    })
}

map.on('load', e => {
    console.log('map loaded!')
    loadSourceFeature()
})

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