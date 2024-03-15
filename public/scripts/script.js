// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dRef, get, child } from "firebase/database";
import {
  collection,
  getFirestore,
  getDocs,
  onSnapshot
} from "firebase/firestore"

import Swal from 'sweetalert2';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa72OQ7m9BHVCYd2hjhNrQqVBuMF6ZnNs",
  authDomain: "emu-test-a96bc.firebaseapp.com",
  projectId: "emu-test-a96bc",
  storageBucket: "emu-test-a96bc.appspot.com",
  messagingSenderId: "800845578321",
  appId: "1:800845578321:web:e3348c6397569924577870",
  measurementId: "G-3DHKHSJCPG"
//  USE YOUR CONFIG
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
console.log(db);
const dbRef = dRef(db);

const rakeBtns = document.querySelectorAll(".rakeBtn");
rakeBtns.forEach(function(rakeBtn) {
  rakeBtn.addEventListener("click", async function() {
    const rakeId = rakeBtn.dataset.rakeId;
    const temperature = await fetchTemperatureData(rakeId);
    // Update the modal content with the fetched temperature data
     const modalBody = document.querySelector(".modal-body");
     modalBody.innerHTML = `${temperature}`;
     console.log(`${temperature}`);
    // Dummy condition to change Rake 1 button to yellow (denotes warning) when temperature goes above 87 F
    const arr=temperature.split(' ');
    const temp_val=arr[1];
    const actual_val=parseFloat(temp_val);
     if(actual_val>87){
      document.querySelector(`[data-rake-id='${rakeId}']`).style.background = 'yellow';
     }
     else{
      document.querySelector(`[data-rake-id='${rakeId}']`).style.background = '#F0F0F0';
     }
  });
});

async function fetchTemperatureData(rakeId) {
  // Function to fetch temperature data for the specified rake ID
  console.log(rakeId)
  try {
    const snapshot = await get(child(dbRef, `rakes/${rakeId}/Temperature`));
    if (snapshot.exists()) {
      const temp = snapshot.val();
      const temp1=`Temperature: ${temp} F`;
      return temp1;
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error;
  }
}
const dbFirebase = getFirestore();
const rakeRef = collection(dbFirebase,'vcbSensors')
const smokeRef = collection(dbFirebase,'smokeSensors')
getDocs(rakeRef).then((snapshot)=>{
  let rakes = []
  snapshot.docs.forEach((doc)=>{
      rakes.push({... doc.data(), id:doc.id})
  })
  console.log(rakes)
}).catch((e)=>{
  console.log(e.message)
})

onSnapshot(rakeRef, (snapshot) => {
  // console.log(snapshot)
  snapshot.docChanges().forEach((change) => {
    if (change.type === "modified") {
 
      var status = change.doc.data().status
      var arr = status.split('')
      // console.log(arr)
      var vcb = ["1","2","3","4"]
      for(let i=0;i<vcb.length;i++){
        if(arr.length>2){
          if(arr.includes(vcb[i])) {
          document.querySelector(`tr[data-set-id="${change.doc.id}"] td[data-vcb-id="${vcb[i]}"]`).style.background="red";
          } else {
            document.querySelector(`tr[data-set-id="${change.doc.id}"] td[data-vcb-id="${vcb[i]}"]`).style.background="#11eb11";
          }
        }
        else{
          if(arr.includes(vcb[i])) {
            document.querySelector(`tr[data-set-id="${change.doc.id}"] td[data-vcb-id="${vcb[i]}"]`).style.background="#fcba03";
            } else {
              document.querySelector(`tr[data-set-id="${change.doc.id}"] td[data-vcb-id="${vcb[i]}"]`).style.background="#11eb11";
            }
        }
      }
      // document.querySelector(`tr[data-set-id="${change.doc.id}"] td[data-vcb-id="${change.doc.data().status}"]`).style.background="red";

    }
  });
});

onSnapshot(smokeRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    // console.log(change.type === 'modified')
    // console.log(change.doc.data().smokeDetected)
    // console.log(change.type === 'modified' && change.doc.data().smokeDetected)
    if (change.type === 'modified' && change.doc.data().smokeDetected) {
      Swal.fire({
        icon: 'warning',
        title: 'Smoke Detected!',
        text: `Smoke has been detected in the rake ${change.doc.id} `,
      });
    }
  });
});

