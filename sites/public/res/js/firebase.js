var storage = firebase.storage()
var storageRef = storage.ref()

var departmentsRef = storageRef.child('departments')
var canteensRef = storageRef.child('canteens')
var busstopsRef = storageRef.child('busstops')
var otherplacesRef = storageRef.child('otherplaces')