const constants = {
    id: {
        departments: {
            fc: 'fc-departments',
            cs: 'd-cs',
            myanmar: 'd-myanmar',
            geology: 'd-geology',
            physics: 'd-physics',
            zoology: 'd-zoology',
            english: 'd-english',
            botany: 'd-botany',
            maths: 'd-math'
        },
        busStops: {
            fc: 'fc-busstops'
        },
        otherPlaces: {
            fc: 'fc-otherplaces',
            clanic: 'oth-clanic',
            library: 'oth-library',
            mailbox: 'oth-mailbox'
        }
    },
    materialized: {
        icons: {
            departments: 'account_balance',
            otherPlaces: 'business',
            busStops: 'directions_bus'
        },
        class: {
            waves: {
                teal: 'waves-teal',
                green: 'waves-green',
                orange: 'waves-orange'
            }
        }
    },
    mapLayers: {
        mapBox: {
            link: `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=`
            +`pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw`, //Access Token
            id: 'mapbox.light'
        },
        openStreet: {
            link: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            sign: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    }
}