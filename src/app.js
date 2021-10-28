import firebase from 'firebase/app';
import {getFirestore, doc} from 'firebase/firestore';

c = new AudioContext();

var counter = 0;

g = c.createGain();
g.connect(c.destination);

const a = 0.01;
const d = 0.02;
const sl = 0.2;
const st = 0.2;
const r = 0.5;

document.getElementById("AT").value = a;    // attack time
document.getElementById("DT").value = d;    // decay time
document.getElementById("SL").value = sl;   // sustain level
document.getElementById("ST").value = st;   // sustain time
document.getElementById("RT").value = r;    // release time

window.play = function play(n) {
    o = c.createOscillator();
    o.connect(g);
    o.frequency.value = 261.63 * Math.pow(2, n / 12);
    now = c.currentTime;

    o.start(now)

    aA = strip(document.getElementById("AT").value);
    aD = strip(document.getElementById("DT").value);
    aS = strip(document.getElementById("SL").value);
    aST = strip(document.getElementById("ST").value);
    aR = strip(document.getElementById("RT").value);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(1, now + aA);
    g.gain.linearRampToValueAtTime(aS, now + aA + aD);
    g.gain.setValueAtTime(aS, now + aA + aD + aST);
    g.gain.linearRampToValueAtTime(0, now + aA + aD + aST + aR);
    o.stop(now + aA + aD + aST + aR)
    incrementClicks(counter+1);
    listenToCLicks();
    //getClicks();
    
    //render();
}

function strip(number) {
    return (parseFloat(number));
}

function render() {
    document.getElementById("counter").innerHTML = counter;
}
console.log("hi")
//Firestore addition

// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyDb6EeG3IRtj_WAvIFkPJePkTRuA-WESA0",
  
    authDomain: "pianoforte-e291f.firebaseapp.com",
  
    projectId: "pianoforte-e291f",
  
    storageBucket: "pianoforte-e291f.appspot.com",
  
    messagingSenderId: "220448670910",
  
    appId: "1:220448670910:web:4ad8bd31af458cd4690aef"
  
  };
  

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}else {
   firebase.app(); // if already initialized, use that one
}
const db = firebase.firestore();

const clicksDoc = doc(db,'clicks/clicks')

function incrementClicks(myclick_num) {
    const clicksData = {
        click_num : myclick_num
    }
    setDoc(clicksDoc, clicksData, {merge: true})
        .then(() => {
            console.log('value written to database');
        })
        .catch((error) => {
            console.log("I got an error! ${error}");
        })
}

function listenToCLicks() {
    onSnapshot(clicksDoc, docSnapshot => {
        if(docSnapshot.exists()) {
            const docData = docSnapshot.data();
            console.log("new data downloaded is", docData);
            counter = docData.click_num
            render()
        }
    });
}

///
/*
const bookRef = firebase.firestore().collection("books").doc("another book");

bookRef
  .update({
    year: 1869,
  })
  .then(() => {
    console.log("Document updated"); // Document updated
  })
  .catch((error) => {
    console.error("Error updating doc", error);
  });	

*/
//var clicksRef = db.collection("clicks").doc("clicks");

/*
function incrementClicks() {
    firebase.firestore().collection("clicks").doc("clicks").update({
        click_num: firebase.firestore.FieldValue.increment(1)

    }).then(() => {
        console.log("Document updated"); // Document updated
    }).catch((error) => {
        console.error("Error updating doc", error);
    });

}*/


/* 
    firebase.firestore().collection("clicks").doc("clicks").get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log("Document clicks:", doc.data().click_num);
            counter = doc.data().click_num;
            //return doc.data().click_num;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
*/
/*
class Clicks {
    constructor (click_num) {
        this.click_num = click_num    
    }
    toString() {
        return this.click_num;
    }
}
var clicksConverter = {
    toFirestore: function(clicks) {
        return {
            clicks: this.clicks
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Clicks(data.click_num);
    }
};
*/
/*
const clicksRef = firebase.firestore().collection('clicks');



clicksRef
  .get()
  .then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("All data in 'clicks' collection", data);
    console.log("All data in 'clicks' collection", data.doc("clicks").data("click_num")); 
    // [ { id: 'glMeZvPpTN1Ah31sKcnj', title: 'The Great Gatsby' } ]
    //counter = data.doc("clicks").
  });
*/


//https://www.freecodecamp.org/news/the-firestore-tutorial-for-2020-learn-by-example/
