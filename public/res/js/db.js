var eventBus = new Vue()

var vTable = Vue.component('v-table', {
  template: '#v-table',
  data() {
    return {
      placeGroups: []
    }
  },
  mounted() {
    eventBus.$on('load-data', e => {
      this.placeGroups = myVue.placeGroups
    })
  }
})

var vPlaceGroup = Vue.component('v-placegroup', {
  template: '#v-placegroup',
  props: {
    placeGroup: {
      type: Object,
      required: true,
    }
  },
})

var vPlace = Vue.component('v-place', {
  template: '#v-place',
  props: {
    place: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      totalImage: 0
    }
  },
  methods: {
    print(place) {
      console.log(place)
    },
  },
  computed: {
    highlight() {
      if (this.place.properties.type != 'bus stop' && this.totalImage == 0) {
        return true
      }
    }
  },
  async mounted() {
    var res = await placesRef.child(this.place.properties.id).listAll()
    this.totalImage = await res.items.length
    console.log(`${this.place.properties.name_en} loaded`)
  }
})

var vDashboard = Vue.component('v-dashboard', {
  template: '#v-dashboard',
  props: {
    analyseobj: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      aObj: analyseObj
    }
  },
  methods: {
    print(place) {
      console.log(place)
    },
    getTotal(counter) {
      var total = 0
      counter.forEach(number => {
        total += number.total
      });
      return total
    }
  },
  mounted() {
    var ctx = document.getElementById('myChart').getContext('2d')
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'doughnut',

      // The data for our dataset
      data: {
        labels: ['departments', 'bus stops', 'canteens', 'copiers', 'other'],
        datasets: [{
          label: 'My First dataset',
          data: [
            analyseObj.counter[0].total,
            analyseObj.counter[1].total,
            analyseObj.counter[2].total,
            analyseObj.counter[3].total,
            analyseObj.counter[4].total,
          ],
          backgroundColor: [
            'rgb(3,126,243)',
            'rgb(10, 142, 160)',
            'rgb(248, 90, 64)',
            'rgb(255, 200, 69)',
            'rgb(82, 86, 94)',
          ],
          borderColor: 'rgb(243, 244, 247)',
        }]
      },

      // Configuration options go here
      options: {}
    })
  }
})

var myVue = new Vue({
  el: "#myVue",
  data: {
    placeGroups: [],
    analyseObjs: [],
    places: [],
    ready: false,
  },
  mounted() {
    var tabElement = document.querySelector('.tabs');
    var tabInstance = M.Tabs.init(tabElement);
    tabInstance.select('dashboard')
  }
})

map.on('load', function () {
  analyseData()
  myVue.analyseObjs.push(analyseObj)
  console.log(myVue.placeGroups)
  // returnPlaceAndStorageData().then(placeGroups => {
  //   myVue.placeGroups = placeGroups
  //   eventBus.$emit('load-data')
  // })
  myVue.placeGroups = returnPlaceData()
  eventBus.$emit('load-data')
})