import firebase from 'firebase/app';
import 'firebase/firestore';

const c = new AudioContext();

var counter = 0;
var unison = 0;     // variable that give the number of unison notes to set the master gain

var master = c.createGain();
master.gain.value = 1;
master.connect(c.destination);

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
    unison +=1
    var now = c.currentTime;
    var g = c.createGain();
    var o = c.createOscillator();

    g.connect(master);
    o.connect(g);

    o.frequency.value = 261.63 * Math.pow(2, n / 12);
    master.gain.setValueAtTime(1/unison, now);
    o.start(now)

    var aA = strip(document.getElementById("AT").value);
    var aD = strip(document.getElementById("DT").value);
    var aS = strip(document.getElementById("SL").value);
    var aST = strip(document.getElementById("ST").value);
    var aR = strip(document.getElementById("RT").value);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(1, now + aA);
    g.gain.linearRampToValueAtTime(aS, now + aA + aD);
    g.gain.setValueAtTime(aS, now + aA + aD + aST);
    g.gain.linearRampToValueAtTime(0, now + aA + aD + aST + aR);
    o.stop(now + aA + aD + aST + aR)
    incrementClicks();
    //listenToCLicks();
    //getClicks();
    //counter += 1;

    setTimeout(function () {unison -= 1}, (aA + aD + aST + aR)*1000)
    render();
}


window.resetCounter = function resetCounter() {
    firebase.firestore().collection("clicks").doc("clicks").update({
        click_num: 0

    }).then(() => {
        console.log("Document updated"); // Document updated
    }).catch((error) => {
        console.error("Error updating doc", error);
    });
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
//const db = firebase.firestore();
const db = firebase.firestore();


var clicksRef = db.collection("clicks").doc("clicks");


function incrementClicks() {
    firebase.firestore().collection("clicks").doc("clicks").update({
        click_num: firebase.firestore.FieldValue.increment(1)

    }).then(() => {
        console.log("Document updated"); // Document updated
    }).catch((error) => {
        console.error("Error updating doc", error);
    });

}

firebase
.firestore()
.collection("clicks")
.doc('clicks')
.onSnapshot((snapshot) => {
    console.log("All data in 'books' collection", snapshot.data());
    counter = snapshot.data().click_num;
    render()
});



//https://www.freecodecamp.org/news/the-firestore-tutorial-for-2020-learn-by-example/
