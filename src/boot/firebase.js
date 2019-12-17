// import something here
import firebase from 'firebase'
import 'firebase/firestore'

var Config = {
  apiKey: 'YourAPI',
  authDomain: 'YourAPI',
  databaseURL: 'YourAPI',
  projectId: 'YourAPI',
  storageBucket: 'YourAPI',
  messagingSenderId: 'YourAPI',
  appId: 'YourAPI'
}
firebase.initializeApp(Config)
firebase
  .firestore()
  .enablePersistence()
  .then(function () {})
  .catch(function (err) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  })

export const db = firebase.firestore()
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
export default firebase
