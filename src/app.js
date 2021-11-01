import firebase from 'firebase/app';
import 'firebase/firestore';
import './sounds.js'
import 'regenerator-runtime/runtime'

const c = new window.AudioContext();

var counter = 0;
var unison = 0;     // variable that give the number of unison notes to set the master gain
var detuneMod = false;

var master = c.createGain();
master.gain.value = 1;
master.connect(c.destination);

const a = 0.01;
const d = 0.02;
const sl = 0.2;
const st = 0.7;
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
    o.type = "sine";
    var f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(1000, now);  


    // detune modulation
    if (detuneMod==true) {
        o.type = "triangle"
        var osc = c.createOscillator();
        var oscGain = c.createGain();
        oscGain.gain.value = 25;
        osc.connect(oscGain);
        oscGain.connect(o.detune);
        osc.frequency.value = 1.5;
        osc.type = "triangle"
        osc.start(); 
    }
      
    
    o.connect(f).connect(g).connect(master)//.connect(reverb);

    if(revOn) {
        createReverb().then(reverb => {
            var revGain = c.createGain();
            revGain.gain.value = 0.4;
            o.connect(reverb);
            reverb.connect(revGain).connect(master);
        })
    }

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

window.playD = function playD() {
    play(0);
    play(2);
    play(5);
    play(9);
}

function strip(number) {
    return (parseFloat(number));
}

function render() {
    document.getElementById("counter").innerHTML = counter;
}
console.log("hi")

var t = 0;
const bpm = 90;
const interval = 15000/bpm;
const n = 2;
let timer;


function WhenHH() {
    return (t%2 == 0 || t%4 == 3);
}

var isPlaying = false;
var tunz = document.getElementById('tunz');
tunz.onclick = function () {
    if (!isPlaying) rhythm(); 
    isPlaying = true; 
    tunz.classList.add("active")
}


window.rhythm = function rhythm() {
    if (WhenKick()) kick();
    if (WhenSnare()) snare();
    if (WhenHH()) hh();
    if (t%32==0) playC();
    if (t%32==8) playG();
    if (t%32==16) playD();
    if (t%32==24) playC();
    t++;
    timer = setTimeout(rhythm, interval);    
}

window.stop = function stop() {
    clearTimeout(timer);
    t = 0;
    isPlaying = false;
    tunz.classList.remove("active")
}   

var flavour = document.getElementById("flavour");
flavour.onclick = function() {toggleMod();  };

window.toggleMod = function toggleMod() {
    if (detuneMod) {
        detuneMod = false;
        document.querySelector('#flavour').classList.remove("active");
    }
    else {
        detuneMod = true;
        document.querySelector('#flavour').classList.add("active");
    }
}

var revButton = document.getElementById("rev");
revButton.onclick = function() {toggleRevMod();  };
var revOn = false;
window.toggleRevMod = function toggleRevMod() {
    if (revOn) {
        revOn = false;
        document.querySelector('#rev').classList.remove("active");
    }
    else {
        revOn = true;
        document.querySelector('#rev').classList.add("active");
    }
}

/* ------    S E Q U E N C E R   ------ */
var kick_seq = document.getElementById("kick-sequencer");
var snr_seq = document.getElementById("snare-sequencer");
var len = kick_seq.children.length;
let kick_arr = new Array(len).fill(0);
let snr_arr = new Array(len).fill(0);

var kick_boxes = document.querySelectorAll(".kick");
var snr_boxes = document.querySelectorAll(".snr");
kick_boxes.forEach(setOnKick)
snr_boxes.forEach(setOnSnr)

var seqButton = document.getElementById("seq-on");
var seq_on = false
seqButton.onclick = () => {
    seq_on = !seq_on
    seqButton.classList.toggle("active");
}

// funziona ma non mi piace il concetto
function WhenKick () {
    if (seq_on) {
        for (let i in kick_arr) {
            if (kick_arr.at(i) == 1) {
            if (t % len == i) return true;
            }
        }
    }
    else {
        return (t%8 == 0 || t%8 == 3);
    }
    
}

function WhenSnare () {
    if (seq_on) {
        for (let i in snr_arr) {
            if (snr_arr.at(i) == 1) {
            if (t % len == i) return true;
            }
        }
    }
    else {
        return t%8 == 4;
    }
}


function setOnKick(item) {
    item.onclick = (e) => {
      let a = Array.from(kick_seq.children);
      
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        kick_arr[a.indexOf(e.target)] = 0;
      }
      else {
        e.target.classList.add("active");
        kick_arr[a.indexOf(e.target)] = 1;
      }
      console.log(kick_arr);
    };  
}

function setOnSnr(item) {
    item.onclick = (e) => {
      let b = Array.from(snr_seq.children);
      
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        snr_arr[b.indexOf(e.target)] = 0;
      }
      else {
        e.target.classList.add("active");
        snr_arr[b.indexOf(e.target)] = 1;
      }
      console.log(snr_arr);
    };  
}

/* ------    S E Q U E N C E R   ------ */



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


async function createReverb() {
    let convolver = c.createConvolver();

    // load impulse response from file
    let audioUrl = require("../IRs/Large Long Echo Hall.wav");
    let response     = await fetch(audioUrl);
    console.log(response);
    let arraybuffer  = await response.arrayBuffer();
    console.log(arraybuffer);
    convolver.buffer = await c.decodeAudioData(arraybuffer);

    return convolver;
}