import firebase from 'firebase';
import 'firebase/storage';



var firebaseConfig = {
  apiKey: "AIzaSyB8baZtQy2TUafBPPXlCbYrfvW06H5X5wo",
  authDomain: "naseem-ae1a0.firebaseapp.com",
  databaseURL: "https://naseem-ae1a0.firebaseio.com",
  projectId: "naseem-ae1a0",
  storageBucket: "naseem-ae1a0.appspot.com",
  messagingSenderId: "224160441920",
  appId: "1:224160441920:web:f9c64e2d30539d1fef61a5"
  };

  const fire = firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  // const messaging = firebase.messaging();
  export {fire, storage as default} ;

  // test database
  // apiKey: "AIzaSyDq5BcIeFIasg8OGErxYKBD3K1SyKGQC2k",
  // authDomain: "testdb-6dc84.firebaseapp.com",
  // databaseURL: "https://testdb-6dc84-default-rtdb.firebaseio.com",
  // projectId: "testdb-6dc84",
  // storageBucket: "testdb-6dc84.appspot.com",
  // messagingSenderId: "674613274164",
  // appId: "1:674613274164:web:990bce05612a9a4507cc61",
  // measurementId: "G-K9826DV6VL"


  //naseem

  // apiKey: "AIzaSyB8baZtQy2TUafBPPXlCbYrfvW06H5X5wo",
  // authDomain: "naseem-ae1a0.firebaseapp.com",
  // databaseURL: "https://naseem-ae1a0.firebaseio.com",
  // projectId: "naseem-ae1a0",
  // storageBucket: "naseem-ae1a0.appspot.com",
  // messagingSenderId: "224160441920",
  // appId: "1:224160441920:web:f9c64e2d30539d1fef61a5"