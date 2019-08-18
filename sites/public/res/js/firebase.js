try {
  var storage = firebase.storage()
  var storageRef = storage.ref()

  var placesRef = storageRef.child('departments')
  var otherplacesRef = storageRef.child('otherplaces')
} catch (error) {
  if (!(error instanceof ReferenceError)) {
    throw error
  }
}