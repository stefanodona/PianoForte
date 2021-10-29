import firebase from 'firebase/app';
import 'firebase/firestore';

const c = new window.AudioContext();

var counter = 0;
var unison = 0;     // variable that give the number of unison notes to set the master gain

var master = c.createGain();
master.gain.value = 1;
master.connect(c.destination);

const a = 0.01;
const d = 0.02;
const sl = 0.2;
const st = 0.5;
const r = 0.8;

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

window.playC = function playC() {
    play(0);
    play(3);
    play(5);
    play(7);
    play(10);
}

window.playG = function playG() {
    play(2);
    play(5);
    play(9);
    play(10);
    play(12);
}

function strip(number) {
    return (parseFloat(number));
}

function render() {
    document.getElementById("counter").innerHTML = counter;
    
}
console.log("hi")

window.snare = function snare() {
    var bs = c.createBufferSource();
    var b = c.createBuffer(1, 4096, c.sampleRate);
    var data = b.getChannelData(0);
    for (var i = 0; i < 4096; i++) data[i] = Math.random();
    var g = c.createGain();
    g.gain.setValueAtTime(1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, c.currentTime + 0.3);
  
    var f = c.createBiquadFilter();
    f.type = "highpass";
    f.frequency.setValueAtTime(70, c.currentTime);
    f.frequency.linearRampToValueAtTime(500, c.currentTime + 0.3);
  
    bs.buffer = b;
    bs.loop = true;
    bs.connect(g);
    g.connect(f);
    f.connect(c.destination);
    bs.start();
    bs.stop(c.currentTime + 0.2);
  }

window.kick = function kick() {
    var now = c.currentTime;
    var o = c.createOscillator();
    o.frequency.setValueAtTime(100, now);
    o.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
    var o2 = c.createOscillator();
    o2.type = "triangle";
    o2.frequency.setValueAtTime(100, now);
    o2.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
    var g = c.createGain();
    g.gain.setValueAtTime(1, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    o.connect(g);
    o2.connect(g);
    g.connect(c.destination);
    o.start();
    o2.start();
    o.stop(now + 0.5);
    o2.stop(now + 0.5);
}

window.hh = function hh() {
    var bs = c.createBufferSource();
    var b = c.createBuffer(1, 4096, c.sampleRate);
    var data = b.getChannelData(0);
    for (var i = 0; i < 4096; i++) data[i] = Math.random();
    var g = c.createGain();
    g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, c.currentTime + 0.3);
  
    var f = c.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 7000;
    //f.frequency.linearRampToValueAtTime(1000, c.currentTime + 0.3);
  
    bs.buffer = b;
    bs.loop = true;
    bs.connect(g);
    g.connect(f);
    f.connect(c.destination);
    bs.start();
    bs.stop(c.currentTime + 0.05);
  }

var t = 0;
const bpm = 90;
const interval = 15000/bpm;
const n = 2;
let timer;

function WhenKick(){
    return (t%8 == 0 || t%8 == 3);
}
  
function WhenSnare(){
    return t%8 == 4;
}

function WhenHH() {
    return (t%2 == 0 || t%4 == 3);
}

window.rhythm = function rhythm() {
    if (WhenKick()) kick();
    if (WhenSnare()) snare();
    if (WhenHH()) hh();
    if (t%16==0) playC();
    if (t%16==8) playG();
    t++;
    timer = setTimeout(rhythm, interval);
}

window.stop = function stop() {
    clearTimeout(timer);
    t = 0;
}



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
